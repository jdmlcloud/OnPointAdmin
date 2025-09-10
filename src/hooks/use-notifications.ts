import { useState, useEffect } from 'react'
import { apiRequest, API_CONFIG } from '@/config/api'

export interface Notification {
  id: string
  type: 'urgent' | 'message' | 'task' | 'proposal' | 'client' | 'success' | 'error' | 'warning' | 'info'
  title: string
  description: string
  message: string
  timestamp: string
  status: 'new' | 'pending' | 'completed' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  read: boolean
  clientId?: string
  proposalId?: string
  taskId?: string
  messageId?: string
  action?: {
    label: string
    onClick: () => void
  }
}

export interface NotificationStats {
  urgent: number
  messages: number
  tasks: number
  proposals: number
  clients: number
}

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [stats, setStats] = useState<NotificationStats>({
    urgent: 0,
    messages: 0,
    tasks: 0,
    proposals: 0,
    clients: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [unreadCount, setUnreadCount] = useState(0)
  const [lastFetchedAt, setLastFetchedAt] = useState<number>(0)

  const fetchNotifications = async () => {
    try {
      const now = Date.now()
      if (now - lastFetchedAt < 4000 && notifications.length > 0) return
      setLoading(true)
      setError(null)
      
      // Intentar obtener datos reales de AWS
      try {
        const data = await apiRequest<{notifications: Notification[]}>(API_CONFIG.ENDPOINTS.NOTIFICATIONS)
        setNotifications(data.notifications)
        
        // Calcular estadísticas
        const newStats: NotificationStats = {
          urgent: data.notifications.filter(n => n.priority === 'urgent').length,
          messages: data.notifications.filter(n => n.type === 'message').length,
          tasks: data.notifications.filter(n => n.type === 'task').length,
          proposals: data.notifications.filter(n => n.type === 'proposal').length,
          clients: data.notifications.filter(n => n.type === 'client').length
        }
        
        setStats(newStats)
        setLastFetchedAt(Date.now())
        return
      } catch (apiError) {
        console.warn('⚠️ Error al conectar con AWS, usando datos mock:', apiError)
      }
      
      // Fallback a datos mock si falla la API
      const mockNotifications: Notification[] = [
        {
          id: '1',
          type: 'proposal',
          title: 'Propuesta ABC',
          description: 'Vence en 2 horas',
          message: 'Vence en 2 horas',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'pending',
          priority: 'urgent',
          read: false,
          proposalId: 'prop-123'
        },
        {
          id: '2',
          type: 'proposal',
          title: 'Cotización HBO',
          description: 'Vence mañana',
          message: 'Vence mañana',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
          status: 'pending',
          priority: 'high',
          read: false,
          proposalId: 'prop-456'
        },
        {
          id: '3',
          type: 'message',
          title: 'WhatsApp +52 55 1234',
          description: 'Mensaje sin responder',
          message: 'Mensaje sin responder',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
          status: 'new',
          priority: 'medium',
          read: false,
          messageId: 'msg-789'
        },
        {
          id: '4',
          type: 'message',
          title: 'Email Netflix',
          description: 'Solicitud de información',
          message: 'Solicitud de información',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'pending',
          priority: 'medium',
          read: false,
          messageId: 'msg-101'
        },
        {
          id: '5',
          type: 'client',
          title: 'Nuevo cliente registrado',
          description: 'Netflix se registró esta semana',
          message: 'Netflix se registró esta semana',
          timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
          status: 'new',
          priority: 'low',
          read: false,
          clientId: 'client-123'
        }
      ]

      setNotifications(mockNotifications)
      
      // Calcular estadísticas
      const newStats: NotificationStats = {
        urgent: mockNotifications.filter(n => n.priority === 'urgent').length,
        messages: mockNotifications.filter(n => n.type === 'message').length,
        tasks: mockNotifications.filter(n => n.type === 'task').length,
        proposals: mockNotifications.filter(n => n.type === 'proposal').length,
        clients: mockNotifications.filter(n => n.type === 'client').length
      }
      
      setStats(newStats)
      
    } catch (err) {
      console.error('Error fetching notifications:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      // TODO: Implementar API call para marcar como leído
      setNotifications(prev => 
        prev.map(n => 
          n.id === notificationId 
            ? { ...n, status: 'completed' as const }
            : n
        )
      )
    } catch (err) {
      console.error('Error marking notification as read:', err)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      // TODO: Implementar API call para eliminar notificación
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    } catch (err) {
      console.error('Error deleting notification:', err)
    }
  }

  const markAllAsRead = async () => {
    try {
      // TODO: Implementar API call para marcar todas como leídas
      setNotifications(prev => prev.map(n => ({ ...n, status: 'completed' as const })))
      setUnreadCount(0)
    } catch (err) {
      console.error('Error marking all notifications as read:', err)
    }
  }

  const addNotification = async (notification: Omit<Notification, 'id' | 'timestamp'>) => {
    try {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      }
      setNotifications(prev => [newNotification, ...prev])
    } catch (err) {
      console.error('Error adding notification:', err)
    }
  }

  const removeNotification = async (notificationId: string) => {
    try {
      setNotifications(prev => prev.filter(n => n.id !== notificationId))
    } catch (err) {
      console.error('Error removing notification:', err)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return {
    notifications,
    stats,
    loading,
    error,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    addNotification,
    deleteNotification,
    removeNotification
  }
}