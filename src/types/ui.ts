// Tipos para componentes de UI

import { LucideIcon } from 'lucide-react'

export type RoleIcons = {
  [key: string]: LucideIcon
  admin: LucideIcon
  ejecutivo: LucideIcon
  cliente: LucideIcon
  SUPER_ADMIN: LucideIcon
  ADMIN: LucideIcon
  EXECUTIVE: LucideIcon
}

export interface NotificationDropdownProps {
  notifications: Notification[]
  unreadCount: number
  onMarkAsRead: (id: string) => void
  onMarkAllAsRead: () => void
}

export interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (id: string) => void
  onView: (user: User) => void
}

export interface PermissionCardProps {
  permission: Permission
  onEdit: (permission: Permission) => void
  onDelete: (id: string) => void
}

export interface RoleCardProps {
  role: Role
  onEdit: (role: Role) => void
  onDelete: (id: string) => void
}

// Re-exportar tipos necesarios
export type { Notification, NotificationType } from './notifications'
export type { User, UserRole, Permission, Role, UserRoleType } from './users'

// Importar tipos necesarios
import type { User } from './users'
import type { Permission } from './permissions'
import type { Role } from './users'
