"use client"

import { useState, useCallback } from 'react'

export type UserRole = 'admin' | 'ejecutivo' | 'cliente'

export interface RolePermissions {
  canViewDashboard: boolean
  canManageProviders: boolean
  canManageProducts: boolean
  canManageQuotations: boolean
  canManageProposals: boolean
  canManageWhatsApp: boolean
  canManageSettings: boolean
  canManageUsers: boolean
  canViewAnalytics: boolean
  canManageSystem: boolean
  canGeneratePDFs: boolean
  canManageTemplates: boolean
  canViewReports: boolean
  canManageIntegrations: boolean
}

const rolePermissions: Record<UserRole, RolePermissions> = {
  admin: {
    canViewDashboard: true,
    canManageProviders: true,
    canManageProducts: true,
    canManageQuotations: true,
    canManageProposals: true,
    canManageWhatsApp: true,
    canManageSettings: true,
    canManageUsers: true,
    canViewAnalytics: true,
    canManageSystem: true,
    canGeneratePDFs: true,
    canManageTemplates: true,
    canViewReports: true,
    canManageIntegrations: true,
  },
  ejecutivo: {
    canViewDashboard: true,
    canManageProviders: true,
    canManageProducts: true,
    canManageQuotations: true,
    canManageProposals: true,
    canManageWhatsApp: true,
    canManageSettings: false,
    canManageUsers: false,
    canViewAnalytics: true,
    canManageSystem: false,
    canGeneratePDFs: true,
    canManageTemplates: false,
    canViewReports: true,
    canManageIntegrations: false,
  },
  cliente: {
    canViewDashboard: false,
    canManageProviders: false,
    canManageProducts: false,
    canManageQuotations: false,
    canManageProposals: true,
    canManageWhatsApp: false,
    canManageSettings: false,
    canManageUsers: false,
    canViewAnalytics: false,
    canManageSystem: false,
    canGeneratePDFs: false,
    canManageTemplates: false,
    canViewReports: false,
    canManageIntegrations: false,
  }
}

export function useRoles() {
  const [currentRole, setCurrentRole] = useState<UserRole>('ejecutivo')
  const [isDevelopmentMode] = useState(process.env.NODE_ENV === 'development')

  const permissions = rolePermissions[currentRole]

  const switchRole = useCallback((role: UserRole) => {
    if (isDevelopmentMode) {
      setCurrentRole(role)
    }
  }, [isDevelopmentMode])

  const hasPermission = useCallback((permission: keyof RolePermissions) => {
    return permissions[permission]
  }, [permissions])

  const canAccess = useCallback((path: string) => {
    switch (path) {
      case '/dashboard':
        return permissions.canViewDashboard
      case '/providers':
      case '/providers/new':
        return permissions.canManageProviders
      case '/products':
      case '/products/new':
        return permissions.canManageProducts
      case '/quotations':
        return permissions.canManageQuotations
      case '/proposals':
        return permissions.canManageProposals
      case '/whatsapp':
        return permissions.canManageWhatsApp
      case '/settings':
        return permissions.canManageSettings
      case '/analytics':
        return permissions.canViewAnalytics
      case '/reports':
        return permissions.canViewReports
      case '/users':
        return permissions.canManageUsers
      case '/system':
        return permissions.canManageSystem
      case '/templates':
        return permissions.canManageTemplates
      case '/integrations':
        return permissions.canManageIntegrations
      default:
        return true
    }
  }, [permissions])

  const getRoleDisplayName = useCallback((role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'ejecutivo':
        return 'Ejecutivo'
      case 'cliente':
        return 'Cliente'
      default:
        return 'Usuario'
    }
  }, [])

  const getRoleDescription = useCallback((role: UserRole) => {
    switch (role) {
      case 'admin':
        return 'Acceso completo al sistema, gestión de usuarios y configuración'
      case 'ejecutivo':
        return 'Gestión de ventas, cotizaciones y propuestas'
      case 'cliente':
        return 'Visualización de propuestas y seguimiento'
      default:
        return 'Usuario básico'
    }
  }, [])

  return {
    currentRole,
    permissions,
    isDevelopmentMode,
    switchRole,
    hasPermission,
    canAccess,
    getRoleDisplayName,
    getRoleDescription,
    availableRoles: ['admin', 'ejecutivo', 'cliente'] as UserRole[]
  }
}
