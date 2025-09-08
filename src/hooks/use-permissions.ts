"use client"

import { useState, useEffect } from 'react'
import { Permission } from '@/types/users'
import { usePermissionsApi } from './use-permissions-api'

export function usePermissions() {
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchPermissions } = usePermissionsApi()

  const loadPermissions = async () => {
    try {
      setLoading(true)
      setError(null)
      const permissionsData = await fetchPermissions()
      setPermissions(permissionsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar permisos')
      console.error('Error loading permissions:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadPermissions()
  }, [])

  // Calcular estadísticas
  const systemPermissions = permissions.filter(permission => 
    permission.resource === 'users' && permission.action === 'read'
  )
  const customPermissions = permissions.filter(permission => 
    !(permission.resource === 'users' && permission.action === 'read')
  )

  return {
    permissions,
    systemPermissions,
    customPermissions,
    loading,
    error,
    refetch: loadPermissions
  }
}
