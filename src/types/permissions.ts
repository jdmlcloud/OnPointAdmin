// Tipos para el sistema de permisos

export interface Permission {
  id: string
  name: string
  resource: string
  action: string
  description: string
  category: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Role {
  id: string
  name: string
  level: number
  permissions: Permission[]
  description: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface CreatePermissionRequest {
  name: string
  resource: string
  action: string
  description: string
  category: string
}

export interface UpdatePermissionRequest {
  id: string
  name?: string
  resource?: string
  action?: string
  description?: string
  category?: string
}

export interface CreateRoleRequest {
  name: string
  level: number
  permissions: string[]
  description: string
}

export interface UpdateRoleRequest {
  id: string
  name?: string
  level?: number
  permissions?: string[]
  description?: string
}

export interface PermissionResponse {
  permissions: Permission[]
  totalCount: number
  hasMore: boolean
}

export interface RoleResponse {
  roles: Role[]
  totalCount: number
  hasMore: boolean
}
