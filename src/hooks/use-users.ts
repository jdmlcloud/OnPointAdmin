"use client"

import { useState, useEffect } from 'react'
import { User } from '@/lib/db/models'

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
      
      const response = await fetch('/api/users')
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`)
      }
      
      const data = await response.json()
      setUsers(data.users || [])
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
      
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }
      
      const newUser = await response.json()
      setUsers(prev => [...prev, newUser])
      return newUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear usuario')
      console.error('Error creating user:', err)
      return null
    }
  }

  const updateUser = async (id: string, userData: Partial<User>): Promise<User | null> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }
      
      const updatedUser = await response.json()
      setUsers(prev => prev.map(user => user.id === id ? updatedUser : user))
      return updatedUser
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar usuario')
      console.error('Error updating user:', err)
      return null
    }
  }

  const deleteUser = async (id: string): Promise<boolean> => {
    try {
      setError(null)
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `Error ${response.status}`)
      }
      
      setUsers(prev => prev.filter(user => user.id !== id))
      return true
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
