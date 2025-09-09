"use client"

import { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth/auth-context'

export function useAuthRoles() {
  const { user } = useAuthContext()
  const [currentRole, setCurrentRole] = useState<string>('ejecutivo')
  const [isDevelopmentMode, setIsDevelopmentMode] = useState(false)

  useEffect(() => {
    // Determinar el rol actual basado en el usuario autenticado
    if (user?.role) {
      if (typeof user.role === 'string') {
        setCurrentRole(user.role)
      } else if (user.role.name) {
        setCurrentRole(user.role.name)
      }
    }
    
    // Activar modo desarrollo solo en localhost
    setIsDevelopmentMode(window.location.hostname === 'localhost')
  }, [user])

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Administrador'
      case 'ADMIN':
        return 'Administrador'
      case 'EXECUTIVE':
        return 'Ejecutivo'
      case 'admin':
        return 'Administrador'
      case 'ejecutivo':
        return 'Ejecutivo'
      case 'cliente':
        return 'Cliente'
      default:
        return role
    }
  }

  const getRoleDescription = (role: string) => {
    switch (role) {
      case 'admin':
        return 'Acceso completo al sistema'
      case 'ejecutivo':
        return 'Gestión de proveedores y productos'
      case 'cliente':
        return 'Solo visualización'
      default:
        return 'Rol del sistema'
    }
  }

  const switchRole = (newRole: string) => {
    setCurrentRole(newRole)
  }

  const availableRoles = ['admin', 'ejecutivo', 'cliente']

  const hasPermission = (resource: string, action: string) => {
    // Lógica de permisos basada en el rol actual
    if (currentRole === 'admin') {
      return true // Admin tiene todos los permisos
    }
    
    if (currentRole === 'ejecutivo') {
      return ['providers', 'products', 'quotations'].includes(resource)
    }
    
    if (currentRole === 'cliente') {
      return action === 'read'
    }
    
    return false
  }

  const permissions = {
    canManageProviders: hasPermission('providers', 'manage'),
    canManageProducts: hasPermission('products', 'manage'),
    canManageQuotations: hasPermission('quotations', 'manage'),
    canManageWhatsApp: hasPermission('whatsapp', 'manage'),
    canViewAnalytics: hasPermission('analytics', 'read'),
    canManageSettings: hasPermission('settings', 'manage'),
    canManageUsers: hasPermission('users', 'manage')
  }

  return {
    currentRole,
    isDevelopmentMode,
    switchRole,
    getRoleDisplayName,
    getRoleDescription,
    availableRoles,
    permissions,
    hasPermission
  }
}
