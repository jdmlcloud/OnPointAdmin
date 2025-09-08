// Tipos para el sistema de usuarios y roles

export interface User {
  id: string
  email: string
  password: string // Hasheada
  firstName: string
  lastName: string
  phone: string // Formato: +52XXXXXXXXXX
  role: UserRole
  department: string
  position: string
  status: UserStatus
  createdAt: string
  updatedAt: string
  lastLogin?: string
  createdBy: string // ID del usuario que lo creó
}

export interface UserRole {
  id: string
  name: string
  level: number // 1: SUPER_ADMIN, 2: ADMIN, 3: EXECUTIVE
  permissions: Permission[]
  description: string
  createdAt: string
  updatedAt: string
  createdBy: string
}

export interface Permission {
  id: string
  name: string
  resource: string // 'users', 'providers', 'products', 'roles', etc.
  action: string // 'create', 'read', 'update', 'delete', 'manage'
  description: string
}

export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending'

export type UserRoleType = 'SUPER_ADMIN' | 'ADMIN' | 'EXECUTIVE'

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse {
  success: boolean
  user?: Omit<User, 'password'>
  token?: string
  message?: string
}

export interface CreateUserRequest {
  email: string
  password: string
  firstName: string
  lastName: string
  phone: string
  role: string
  department: string
  position: string
}

export interface UpdateUserRequest {
  id: string
  firstName?: string
  lastName?: string
  phone?: string
  role?: string
  department?: string
  position?: string
  status?: UserStatus
}

export interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<LoginResponse>
  logout: () => void
  hasPermission: (resource: string, action: string) => boolean
  hasRole: (role: UserRoleType) => boolean
}

// Constantes para roles
export const ROLE_LEVELS = {
  SUPER_ADMIN: 1,
  ADMIN: 2,
  EXECUTIVE: 3
} as const

export const DEFAULT_PERMISSIONS = {
  SUPER_ADMIN: [
    { resource: 'users', action: 'manage' },
    { resource: 'roles', action: 'manage' },
    { resource: 'providers', action: 'manage' },
    { resource: 'products', action: 'manage' },
    { resource: 'permissions', action: 'manage' }
  ],
  ADMIN: [
    { resource: 'users', action: 'manage' },
    { resource: 'providers', action: 'manage' },
    { resource: 'products', action: 'manage' }
  ],
  EXECUTIVE: [
    { resource: 'providers', action: 'read' },
    { resource: 'providers', action: 'create' },
    { resource: 'providers', action: 'update' },
    { resource: 'products', action: 'read' },
    { resource: 'products', action: 'create' },
    { resource: 'products', action: 'update' }
  ]
} as const
