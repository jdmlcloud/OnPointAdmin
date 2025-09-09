// Tipos para el sistema de notificaciones

export interface Notification {
  id: string
  type: NotificationType
  message: string
  messageId?: string
  read: boolean
  createdAt: string
  updatedAt: string
  timestamp: string
  userId: string
  priority: NotificationPriority
  category?: string
  actionUrl?: string
  action?: {
    label: string
    onClick: () => void
  }
  metadata?: Record<string, any>
}

export type NotificationType = 
  | "message" 
  | "urgent" 
  | "task" 
  | "proposal" 
  | "client" 
  | "success" 
  | "error" 
  | "warning" 
  | "info"

export type NotificationPriority = "low" | "medium" | "high" | "urgent"

export interface NotificationResponse {
  notifications: Notification[]
  unreadCount: number
  totalCount: number
  hasMore: boolean
}

export interface CreateNotificationRequest {
  type: NotificationType
  message: string
  userId: string
  priority?: NotificationPriority
  category?: string
  actionUrl?: string
  metadata?: Record<string, any>
}

export interface UpdateNotificationRequest {
  id: string
  read?: boolean
  message?: string
  priority?: NotificationPriority
}

export interface NotificationFilters {
  type?: NotificationType
  priority?: NotificationPriority
  read?: boolean
  userId?: string
  category?: string
  startDate?: string
  endDate?: string
}
