'use client'

import { User, Role, Permission } from '@/types/users'

// Jerarquía de roles (menor número = mayor privilegio)
export const ROLE_HIERARCHY: Record<string, number> = {
  'SUPER_ADMIN': 1,
  'ADMIN': 2,
  'EXECUTIVE': 3,
  'GUEST': 4
}

// Permisos por defecto para cada rol
export const DEFAULT_ROLE_PERMISSIONS: Record<string, string[]> = {
  'SUPER_ADMIN': [
    'users:read', 'users:write', 'users:manage',
    'roles:read', 'roles:manage',
    'permissions:read', 'permissions:manage',
    'providers:read', 'providers:write', 'providers:manage',
    'products:read', 'products:write', 'products:manage',
    'reports:view',
    'settings:manage'
  ],
  'ADMIN': [
    'users:read', 'users:write', 'users:manage',
    'providers:read', 'providers:write', 'providers:manage',
    'products:read', 'products:write', 'products:manage',
    'reports:view'
  ],
  'EXECUTIVE': [
    'providers:read', 'products:read', 'reports:view'
  ],
  'GUEST': [
    'reports:view'
  ]
}

/**
 * Verifica si un usuario tiene un permiso específico
 */
export const hasPermission = (user: User | null, resource: string, action: string): boolean => {
  if (!user) return false

  // Debug: Verificar el tipo de rol
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 hasPermission - User:', user)
    console.log('🔍 hasPermission - User Role:', user.role)
    console.log('🔍 hasPermission - Role Type:', typeof user.role)
  }

  // Obtener el nombre del rol (puede ser string o objeto)
  let roleName: string
  if (typeof user.role === 'string') {
    roleName = user.role
  } else if (user.role && typeof user.role === 'object' && 'name' in user.role) {
    roleName = (user.role as any).name
  } else {
    roleName = 'GUEST' // Rol por defecto
  }

  // Super Admin tiene todos los permisos
  if (roleName === 'SUPER_ADMIN') return true

  // Verificar permisos por defecto del rol
  const rolePermissions = DEFAULT_ROLE_PERMISSIONS[roleName as keyof typeof DEFAULT_ROLE_PERMISSIONS] || []
  const permissionString = `${resource}:${action}`
  
  return rolePermissions.includes(permissionString)
}

/**
 * Verifica si un usuario tiene un rol específico o superior
 */
export const hasRole = (user: User | null, requiredRole: string): boolean => {
  if (!user) return false

  const userLevel = ROLE_HIERARCHY[user.role as keyof typeof ROLE_HIERARCHY] || 999
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 999

  return userLevel <= requiredLevel
}

/**
 * Verifica si un usuario puede gestionar otro usuario
 */
export const canManageUser = (currentUser: User | null, targetUser: User | null): boolean => {
  if (!currentUser || !targetUser) return false

  // No se puede gestionar a sí mismo
  if (currentUser.id === targetUser.id) return false

  const currentLevel = ROLE_HIERARCHY[currentUser.role as keyof typeof ROLE_HIERARCHY] || 999
  const targetLevel = ROLE_HIERARCHY[targetUser.role as keyof typeof ROLE_HIERARCHY] || 999

  // Solo se puede gestionar usuarios de nivel inferior
  return currentLevel < targetLevel
}

/**
 * Verifica si un usuario puede asignar un rol específico
 */
export const canAssignRole = (currentUser: User | null, targetRole: string): boolean => {
  if (!currentUser) return false

  const currentLevel = ROLE_HIERARCHY[currentUser.role as keyof typeof ROLE_HIERARCHY] || 999
  const targetLevel = ROLE_HIERARCHY[targetRole] || 999

  // Solo se puede asignar roles de nivel inferior
  return currentLevel < targetLevel
}

/**
 * Obtiene todos los roles que un usuario puede asignar
 */
export const getAssignableRoles = (currentUser: User | null): string[] => {
  if (!currentUser) return []

  const currentLevel = ROLE_HIERARCHY[currentUser.role as keyof typeof ROLE_HIERARCHY] || 999
  
  return Object.entries(ROLE_HIERARCHY)
    .filter(([_, level]) => level > currentLevel)
    .map(([role, _]) => role)
}

/**
 * Obtiene todos los permisos disponibles para un rol
 */
export const getAvailablePermissions = (role: string): string[] => {
  return DEFAULT_ROLE_PERMISSIONS[role] || []
}

/**
 * Verifica si un permiso es válido
 */
export const isValidPermission = (permission: string): boolean => {
  const [resource, action] = permission.split(':')
  return !!(resource && action)
}

/**
 * Obtiene la descripción de un permiso
 */
export const getPermissionDescription = (permission: string): string => {
  const [resource, action] = permission.split(':')
  
  const resourceNames: Record<string, string> = {
    'users': 'Usuarios',
    'roles': 'Roles',
    'permissions': 'Permisos',
    'providers': 'Proveedores',
    'products': 'Productos',
    'reports': 'Reportes',
    'settings': 'Configuración'
  }
  
  const actionNames: Record<string, string> = {
    'read': 'Ver',
    'write': 'Editar',
    'manage': 'Gestionar',
    'view': 'Ver'
  }
  
  const resourceName = resourceNames[resource] || resource
  const actionName = actionNames[action] || action
  
  return `${actionName} ${resourceName}`
}

/**
 * Obtiene la categoría de un permiso
 */
export const getPermissionCategory = (permission: string): string => {
  const [resource] = permission.split(':')
  
  const resourceToCategory: Record<string, string> = {
    'users': 'Usuarios',
    'roles': 'Roles',
    'permissions': 'Permisos',
    'providers': 'Proveedores',
    'products': 'Productos',
    'reports': 'Reportes',
    'settings': 'Configuración'
  }
  
  return resourceToCategory[resource] || 'Otros'
}

/**
 * Verifica si un usuario puede acceder a una ruta específica
 */
export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return false

  const routePermissions: Record<string, string[]> = {
    '/users': ['users:read'],
    '/roles': ['roles:read'],
    '/permissions': ['permissions:read'],
    '/providers': ['providers:read'],
    '/products': ['products:read'],
    '/reports': ['reports:view'],
    '/settings': ['settings:manage']
  }

  const requiredPermissions = routePermissions[route] || []
  
  return requiredPermissions.some(permission => {
    const [resource, action] = permission.split(':')
    return hasPermission(user, resource, action)
  })
}
