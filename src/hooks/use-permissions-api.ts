"use client"

import { useState, useCallback } from 'react'
import { Permission } from '@/types/users'
import { apiRequest } from '@/config/api'

export function usePermissionsApi() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPermissions = useCallback(async (): Promise<Permission[]> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest<Permission[]>('/permissions')
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar permisos'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const createPermission = useCallback(async (permissionData: Partial<Permission>): Promise<Permission> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest<Permission>('/permissions', {
        method: 'POST',
        body: JSON.stringify(permissionData)
      })
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear permiso'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePermission = useCallback(async (id: string, permissionData: Partial<Permission>): Promise<Permission> => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await apiRequest<Permission>(`/permissions/${id}`, {
        method: 'PUT',
        body: JSON.stringify(permissionData)
      })
      return response
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar permiso'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePermission = useCallback(async (id: string): Promise<void> => {
    try {
      setLoading(true)
      setError(null)
      
      await apiRequest(`/permissions/${id}`, {
        method: 'DELETE'
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar permiso'
      setError(errorMessage)
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    fetchPermissions,
    createPermission,
    updatePermission,
    deletePermission
  }
}
