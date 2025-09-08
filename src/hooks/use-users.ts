"use client"

import { useState, useEffect } from 'react'
import { User } from '@/lib/db/models'
import { apiRequest, API_CONFIG } from '@/config/api'

interface UseUsersReturn {
  users: User[]
  loading: boolean
  error: string | null
  createUser: (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) => Promise<User | null>
  updateUser: (id: string, userData: Partial<User>) => Promise<User | null>
  deleteUser: (id: string) => Promise<boolean>
  refreshUsers: () => Promise<void>
}

export function useUsers(): UseUsersReturn {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        users: User[]
        pagination: any
        message: string
      }>(API_CONFIG.ENDPOINTS.USERS)
      
      if (data.success) {
        setUsers(data.users || [])
      } else {
        throw new Error('Error al obtener usuarios desde la API')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching users:', err)
    } finally {
      setLoading(false)
    }
  }

  const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User | null> => {
    try {
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        user: User
        message: string
      }>(API_CONFIG.ENDPOINTS.USERS, {
        method: 'POST',
        body: JSON.stringify(userData),
      })
      
      if (data.success) {
        setUsers(prev => [...prev, data.user])
        return data.user
      } else {
        throw new Error('Error al crear usuario')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario')
      console.error('Error creating user:', err)
      return null
    }
  }

  const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
    try {
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        user: User
        message: string
      }>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      })
      
      if (data.success) {
        setUsers(prev => prev.map(user => user.id === id ? data.user : user))
        return data.user
      } else {
        throw new Error('Error al actualizar usuario')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario')
      console.error('Error updating user:', err)
      return null
    }
  }

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const data = await apiRequest<{
        success: boolean
        message: string
      }>(`${API_CONFIG.ENDPOINTS.USERS}/${id}`, {
        method: 'DELETE',
      })
      
      if (data.success) {
        setUsers(prev => prev.filter(user => user.id !== id))
        return true
      } else {
        throw new Error('Error al eliminar usuario')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar usuario')
      console.error('Error deleting user:', err)
      return false
    }
  }

  const refreshUsers = async () => {
    await fetchUsers()
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    error,
    createUser,
    updateUser,
    deleteUser,
    refreshUsers
  }
}
