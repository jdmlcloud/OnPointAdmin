'use client'

import { useState, useEffect } from 'react'
import { CognitoRealService, CognitoUser, LoginCredentials } from '@/lib/aws/cognito-real'

export const useCognitoReal = () => {
  const [user, setUser] = useState<CognitoUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [initialized, setInitialized] = useState(false)

  // Verificar autenticación solo una vez al cargar
  useEffect(() => {
    if (initialized) return

    const checkAuth = async () => {
      try {
        setLoading(true)
        const currentUser = await CognitoRealService.getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error('Error al verificar autenticación real:', err)
        setUser(null)
      } finally {
        setLoading(false)
        setInitialized(true)
      }
    }

    checkAuth()
  }, [initialized])

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      setError(null)
      
      const user = await CognitoRealService.signIn(credentials)
      setUser(user)
      
      return user
    } catch (err: any) {
      const errorMessage = err.message || 'Error en el inicio de sesión'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      await CognitoRealService.signOut()
      setUser(null)
      setError(null)
    } catch (err: any) {
      const errorMessage = err.message || 'Error al cerrar sesión'
      setError(errorMessage)
      throw new Error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const clearError = () => {
    setError(null)
  }

  return {
    user,
    loading,
    error,
    initialized,
    signIn,
    signOut,
    clearError,
    isAuthenticated: !!user
  }
}
