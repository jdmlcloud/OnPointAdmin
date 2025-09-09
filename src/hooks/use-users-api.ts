"use client"

import { useState, useCallback } from 'react'
import { User } from '@/types/users'
import { apiRequest } from '@/config/api'

export function useUsersApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = useCallback(async (): Promise<User[]> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest<{success: boolean, users: User[], count: number}>('/users')
      console.log('🔍 Respuesta de API usuarios:', response)
      return response.users || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar usuarios'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createUser = useCallback(async (userData: Partial<User>): Promise<User> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest<{success: boolean, user: User, message: string}>('/users', {
        method: 'POST',
        body: JSON.stringify(userData)
      })
      return response.user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear usuario'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUser = useCallback(async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest<{success: boolean, user: User, message: string}>(`/users/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData)
      })
      return response.user
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar usuario'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteUser = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      await apiRequest(`/users/${id}`, {
        method: 'DELETE'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar usuario'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    fetchUsers,
    createUser,
    updateUser,
    deleteUser
  }
}
