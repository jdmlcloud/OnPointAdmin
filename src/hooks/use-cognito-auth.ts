"use client"

import { useState, useEffect, useCallback } from 'react'
import { CognitoAuthService, CognitoUser, LoginCredentials } from '@/lib/aws/cognito-auth'
import { useRouter } from 'next/navigation'

interface UseCognitoAuthReturn {
  user: CognitoUser | null
  loading: boolean
  error: string | null
  signIn: (credentials: LoginCredentials) => Promise<boolean>
  signOut: () => Promise<void>
  isAuthenticated: boolean
  refreshUser: () => Promise<void>
}

export function useCognitoAuth(): UseCognitoAuthReturn {
  const [user, setUser] = useState<CognitoUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  // Verificar autenticación al cargar
  const checkAuth = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      
      const currentUser = await CognitoAuthService.getCurrentUser()
      setUser(currentUser)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error de autenticación')
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  // Iniciar sesión
  const signIn = useCallback(async (credentials: LoginCredentials): Promise<boolean> => {
    try {
      setLoading(true)
      setError(null)
      
      const cognitoUser = await CognitoAuthService.signIn(credentials)
      setUser(cognitoUser)
      
      // Redirigir al dashboard
      router.push('/dashboard')
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al iniciar sesión')
      setUser(null)
      return false
    } finally {
      setLoading(false)
    }
  }, [router])

  // Cerrar sesión
  const signOut = useCallback(async (): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      await CognitoAuthService.signOut()
      setUser(null)
      
      // Redirigir al login
      router.push('/auth/signin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cerrar sesión')
    } finally {
      setLoading(false)
    }
  }, [router])

  // Refrescar usuario
  const refreshUser = useCallback(async (): Promise<void> => {
    await checkAuth()
  }, [checkAuth])

  // Verificar autenticación al montar el componente
  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
    isAuthenticated: !!user,
    refreshUser
  }
}
