"use client"

import { useState, useEffect } from 'react'
import { UserRole } from '@/types/users'
import { useRolesApi } from './use-roles-api'

export function useRoles() {
  const [roles, setRoles] = useState<UserRole[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { fetchRoles } = useRolesApi()

  const loadRoles = async () => {
    try {
      setLoading(true)
      setError(null)
      const rolesData = await fetchRoles()
      setRoles(rolesData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar roles')
      console.error('Error loading roles:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadRoles()
  }, [])

  // Calcular estadísticas
  const systemRoles = roles.filter(role => role.level === 1)
  const customRoles = roles.filter(role => role.level > 1)

  return {
    roles,
    systemRoles,
    customRoles,
    loading,
    error,
    refetch: loadRoles
  }
}