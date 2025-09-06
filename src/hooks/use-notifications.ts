"use client"

import { useState, useCallback } from 'react'

export interface Notification {
  id: string
  type: 'info' | 'success' | 'warning' | 'error'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'success',
      title: 'Nueva Cotización Creada',
      message: 'La cotización Q-2024-004 ha sido creada exitosamente',
      timestamp: new Date(Date.now() - 5 * 60 * 1000), // 5 minutos atrás
      read: false,
      action: {
        label: 'Ver Cotización',
        onClick: () => console.log('Ver cotización')
      }
    },
    {
      id: '2',
      type: 'info',
      title: 'Mensaje de WhatsApp Recibido',
      message: 'Nuevo mensaje de María González - TechCorp Solutions',
      timestamp: new Date(Date.now() - 15 * 60 * 1000), // 15 minutos atrás
      read: false,
      action: {
        label: 'Responder',
        onClick: () => console.log('Responder mensaje')
      }
    },
    {
      id: '3',
      type: 'warning',
      title: 'Cotización Próxima a Vencer',
      message: 'La cotización Q-2024-002 vence en 2 días',
      timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutos atrás
      read: true,
      action: {
        label: 'Renovar',
        onClick: () => console.log('Renovar cotización')
      }
    },
    {
      id: '4',
      type: 'success',
      title: 'Propuesta Aprobada',
      message: 'La propuesta P-2024-003 ha sido aprobada por el cliente',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 horas atrás
      read: true
    }
  ])

  const unreadCount = notifications.filter(n => !n.read).length

  const addNotification = useCallback((notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false
    }
    setNotifications(prev => [newNotification, ...prev])
  }, [])

  const markAsRead = useCallback((id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }, [])

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  }
}
