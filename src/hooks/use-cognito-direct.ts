'use client'

import { useState, useEffect } from 'react'
import { CognitoDirectService, CognitoUser, LoginCredentials } from '@/lib/aws/cognito-direct'

export const useCognitoDirect = () => {
  const [user, setUser] = useState<CognitoUser | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Verificar autenticación al cargar
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true)
        const currentUser = await CognitoDirectService.getCurrentUser()
        setUser(currentUser)
      } catch (err) {
        console.error('Error al verificar autenticación:', err)
        setUser(null)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const signIn = async (credentials: LoginCredentials) => {
    try {
      setLoading(true)
      setError(null)
      
      const user = await CognitoDirectService.signIn(credentials)
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
      await CognitoDirectService.signOut()
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
    signIn,
    signOut,
    clearError,
    isAuthenticated: !!user
  }
}
