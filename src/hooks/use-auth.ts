"use client"

import { useState, useEffect } from 'react'
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import { configureAmplify } from '@/lib/aws/amplify'
import { logger } from '@/lib/logger'

// Configurar Amplify al importar
configureAmplify()

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'ejecutivo'
}

interface UseAuthReturn {
  user: AuthUser | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
  refreshUser: () => Promise<void>
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastActivity, setLastActivity] = useState<number>(Date.now())

  const checkAuthStatus = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Verificar si hay una sesión activa primero
      const session = await fetchAuthSession()
      
      if (session && session.tokens) {
        // Solo si hay sesión, obtener el usuario
        const currentUser = await getCurrentUser()
        
        if (currentUser) {
          // Mapear atributos de Cognito a nuestro formato
          const email = currentUser.signInDetails?.loginId || currentUser.username || ''
          const role = email.includes('admin') ? 'admin' : 'ejecutivo'
          
          const authUser: AuthUser = {
            id: currentUser.userId,
            email: email,
            name: email.split('@')[0] || 'Usuario',
            role: role
          }
          
          setUser(authUser)
          logger.log('✅ Usuario autenticado:', authUser)
        } else {
          setUser(null)
          logger.log('❌ No se pudo obtener información del usuario')
        }
      } else {
        setUser(null)
        logger.log('❌ No hay sesión activa')
      }
    } catch (err) {
      // Si es error de usuario no autenticado, es normal
      if (err instanceof Error && err.message.includes('User needs to be authenticated')) {
        logger.log('ℹ️ Usuario no autenticado (normal en primera carga)')
        setUser(null)
        setError(null) // No mostrar error para usuarios no autenticados
      } else {
        logger.error('❌ Error verificando autenticación:', err)
        setUser(null)
        setError(err instanceof Error ? err.message : 'Error de autenticación')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      logger.log('🔐 Intentando login con:', email)
      
      const result = await signIn({
        username: email,
        password: password
      })
      
      if (result.isSignedIn) {
        logger.log('✅ Login exitoso')
        await checkAuthStatus()
        return true
      } else {
        logger.log('❌ Login fallido')
        setError('Credenciales inválidas')
        return false
      }
    } catch (err) {
      logger.error('❌ Error en login:', err)
      setError(err instanceof Error ? err.message : 'Error de autenticación')
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      await signOut()
      setUser(null)
      logger.log('✅ Logout exitoso')
      
      // Forzar redirección al login
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin'
      }
    } catch (err) {
      logger.error('❌ Error en logout:', err)
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión')
      
      // Aún así, limpiar el estado y redirigir
      setUser(null)
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/signin'
      }
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async (): Promise<void> => {
    await checkAuthStatus()
  }

  // Función para actualizar la última actividad
  const updateActivity = () => {
    setLastActivity(Date.now())
  }

  // Efecto para manejar el timeout de sesión
  useEffect(() => {
    if (!user) return

    const SESSION_TIMEOUT = 60 * 60 * 1000 // 1 hora en milisegundos
    const checkTimeout = () => {
      const now = Date.now()
      if (now - lastActivity > SESSION_TIMEOUT) {
        logger.log('⏰ Sesión expirada por inactividad')
        handleSignOut()
      }
    }

    // Verificar timeout cada minuto
    const interval = setInterval(checkTimeout, 60000)

    // Eventos para detectar actividad del usuario
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart', 'click']
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true)
    })

    return () => {
      clearInterval(interval)
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true)
      })
    }
  }, [user, lastActivity])

  useEffect(() => {
    checkAuthStatus()
  }, [])

  return {
    user,
    loading,
    error,
    signIn: handleSignIn,
    signOut: handleSignOut,
    refreshUser
  }
}
