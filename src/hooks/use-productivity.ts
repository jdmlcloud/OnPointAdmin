import { useState, useEffect } from 'react'
import { apiRequest, API_CONFIG } from '@/config/api'

export interface ProductivityMetrics {
  tasksCompletedToday: number
  clientsContactedThisWeek: number
  proposalsSentThisMonth: number
  tasksCompletedThisWeek: number
  clientsContactedThisMonth: number
  proposalsSentThisYear: number
  averageResponseTime: number // en minutos
  completionRate: number // porcentaje
}

export interface Task {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  assignedTo: string
  dueDate: string
  completedAt?: string
  createdAt: string
  updatedAt: string
}

export interface ClientContact {
  id: string
  clientId: string
  clientName: string
  contactType: 'email' | 'phone' | 'whatsapp' | 'meeting'
  subject: string
  status: 'sent' | 'delivered' | 'read' | 'replied'
  timestamp: string
}

export const useProductivity = () => {
  const [metrics, setMetrics] = useState<ProductivityMetrics>({
    tasksCompletedToday: 0,
    clientsContactedThisWeek: 0,
    proposalsSentThisMonth: 0,
    tasksCompletedThisWeek: 0,
    clientsContactedThisMonth: 0,
    proposalsSentThisYear: 0,
    averageResponseTime: 0,
    completionRate: 0
  })
  const [recentTasks, setRecentTasks] = useState<Task[]>([])
  const [recentContacts, setRecentContacts] = useState<ClientContact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProductivityMetrics = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Intentar obtener datos reales de AWS
      try {
        const [metricsData, tasksData, contactsData] = await Promise.all([
          apiRequest<{metrics: ProductivityMetrics}>(API_CONFIG.ENDPOINTS.PRODUCTIVITY + '/metrics'),
          apiRequest<{tasks: Task[]}>(API_CONFIG.ENDPOINTS.PRODUCTIVITY + '/tasks'),
          apiRequest<{contacts: ClientContact[]}>(API_CONFIG.ENDPOINTS.PRODUCTIVITY + '/contacts')
        ])
        
        setMetrics(metricsData.metrics)
        setRecentTasks(tasksData.tasks)
        setRecentContacts(contactsData.contacts)
        return
      } catch (apiError) {
        console.warn('⚠️ Error al conectar con AWS, usando datos mock:', apiError)
      }
      
      // Fallback a datos mock si falla la API
      const mockMetrics: ProductivityMetrics = {
        tasksCompletedToday: 5,
        clientsContactedThisWeek: 8,
        proposalsSentThisMonth: 12,
        tasksCompletedThisWeek: 23,
        clientsContactedThisMonth: 45,
        proposalsSentThisYear: 156,
        averageResponseTime: 45, // minutos
        completionRate: 87 // porcentaje
      }

      const mockTasks: Task[] = [
        {
          id: '1',
          title: 'Actualizar catálogo de productos',
          description: 'Revisar y actualizar precios del catálogo',
          status: 'completed',
          priority: 'medium',
          assignedTo: 'user-123',
          dueDate: new Date().toISOString(),
          completedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          title: 'Revisar propuesta HBO',
          description: 'Analizar propuesta para cliente HBO',
          status: 'in_progress',
          priority: 'high',
          assignedTo: 'user-123',
          dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          title: 'Contactar cliente Netflix',
          description: 'Seguimiento de propuesta enviada',
          status: 'pending',
          priority: 'medium',
          assignedTo: 'user-123',
          dueDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]

      const mockContacts: ClientContact[] = [
        {
          id: '1',
          clientId: 'client-123',
          clientName: 'Netflix',
          contactType: 'email',
          subject: 'Solicitud de información',
          status: 'delivered',
          timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          clientId: 'client-456',
          clientName: 'HBO',
          contactType: 'whatsapp',
          subject: 'Cotización pendiente',
          status: 'read',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          clientId: 'client-789',
          clientName: 'Disney',
          contactType: 'phone',
          subject: 'Llamada de seguimiento',
          status: 'replied',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        }
      ]

      setMetrics(mockMetrics)
      setRecentTasks(mockTasks)
      setRecentContacts(mockContacts)
      
    } catch (err) {
      console.error('Error fetching productivity metrics:', err)
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setLoading(false)
    }
  }

  const completeTask = async (taskId: string) => {
    try {
      // TODO: Implementar API call para completar tarea
      setRecentTasks(prev => 
        prev.map(task => 
          task.id === taskId 
            ? { 
                ...task, 
                status: 'completed' as const,
                completedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              }
            : task
        )
      )
      
      // Actualizar métricas
      setMetrics(prev => ({
        ...prev,
        tasksCompletedToday: prev.tasksCompletedToday + 1,
        tasksCompletedThisWeek: prev.tasksCompletedThisWeek + 1
      }))
    } catch (err) {
      console.error('Error completing task:', err)
    }
  }

  const createTask = async (task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // TODO: Implementar API call para crear tarea
      const newTask: Task = {
        ...task,
        id: `task-${Date.now()}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
      
      setRecentTasks(prev => [newTask, ...prev])
    } catch (err) {
      console.error('Error creating task:', err)
    }
  }

  useEffect(() => {
    fetchProductivityMetrics()
  }, [])

  return {
    metrics,
    recentTasks,
    recentContacts,
    loading,
    error,
    fetchProductivityMetrics,
    completeTask,
    createTask
  }
}
