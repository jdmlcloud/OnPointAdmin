"use client"

import { useState, useCallback } from 'react'
import { UserRole } from '@/types/users'
import { apiRequest } from '@/config/api'

export function useRolesApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchRoles = useCallback(async (): Promise<UserRole[]> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest<{success: boolean, roles: UserRole[], count: number}>('/roles')
      console.log('🔍 Respuesta de API roles:', response)
      console.log('📊 Roles extraídos:', response.roles?.length || 0)
      return response.roles || []
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar roles'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createRole = useCallback(async (roleData: Partial<UserRole>): Promise<UserRole> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest<{success: boolean, role: UserRole, message: string}>('/roles', {
        method: 'POST',
        body: JSON.stringify(roleData)
      })
      return response.role
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear rol'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updateRole = useCallback(async (id: string, roleData: Partial<UserRole>): Promise<UserRole> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest<{success: boolean, role: UserRole, message: string}>(`/roles/${id}`, {
        method: 'PUT',
        body: JSON.stringify(roleData)
      })
      return response.role
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar rol'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deleteRole = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      await apiRequest(`/roles/${id}`, {
        method: 'DELETE'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar rol'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    fetchRoles,
    createRole,
    updateRole,
    deleteRole
  }
}
