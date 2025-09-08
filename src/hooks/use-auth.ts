"use client"

import { useState, useEffect } from 'react'
import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import { configureAmplify } from '@/lib/aws/amplify'

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
          console.log('✅ Usuario autenticado:', authUser)
        } else {
          setUser(null)
          console.log('❌ No se pudo obtener información del usuario')
        }
      } else {
        setUser(null)
        console.log('❌ No hay sesión activa')
      }
    } catch (err) {
      // Si es error de usuario no autenticado, es normal
      if (err instanceof Error && err.message.includes('User needs to be authenticated')) {
        console.log('ℹ️ Usuario no autenticado (normal en primera carga)')
        setUser(null)
        setError(null) // No mostrar error para usuarios no autenticados
      } else {
        console.error('❌ Error verificando autenticación:', err)
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
      
      console.log('🔐 Intentando login con:', email)
      
      const result = await signIn({
        username: email,
        password: password
      })
      
      if (result.isSignedIn) {
        console.log('✅ Login exitoso')
        await checkAuthStatus()
        return true
      } else {
        console.log('❌ Login fallido')
        setError('Credenciales inválidas')
        return false
      }
    } catch (err) {
      console.error('❌ Error en login:', err)
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
      console.log('✅ Logout exitoso')
    } catch (err) {
      console.error('❌ Error en logout:', err)
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión')
    } finally {
      setLoading(false)
    }
  }

  const refreshUser = async (): Promise<void> => {
    await checkAuthStatus()
  }

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
