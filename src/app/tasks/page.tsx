"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useProductivity } from "@/hooks/use-productivity"
import { 
  Plus, 
  Search, 
  Filter,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar,
  User,
  Target,
  Edit,
  Trash2,
  Eye
} from "lucide-react"
import { TasksPageSkeleton } from "@/components/ui/page-skeletons"

interface Task {
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

export default function TasksPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const { recentTasks, loading, completeTask, createTask } = useProductivity()

  const filteredTasks = recentTasks.filter(task => {
    const searchLower = searchTerm.toLowerCase()
    
    // Aplicar filtros activos
    for (const filter of activeFilters) {
      switch (filter) {
        case 'status:pending':
          if (task.status !== 'pending') return false
          break
        case 'status:in_progress':
          if (task.status !== 'in_progress') return false
          break
        case 'status:completed':
          if (task.status !== 'completed') return false
          break
        case 'priority:urgent':
          if (task.priority !== 'urgent') return false
          break
        case 'priority:high':
          if (task.priority !== 'high') return false
          break
      }
    }
    
    return (
      task.title.toLowerCase().includes(searchLower) ||
      task.description.toLowerCase().includes(searchLower) ||
      task.assignedTo.toLowerCase().includes(searchLower)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'in_progress': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'cancelled': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'high': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const handleCompleteTask = async (taskId: string) => {
    await completeTask(taskId)
  }

  const handleCreateTask = async () => {
    const newTask = {
      title: 'Nueva Tarea',
      description: 'Descripción de la nueva tarea',
      status: 'pending' as const,
      priority: 'medium' as const,
      assignedTo: 'user-123',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
    }
    
    await createTask(newTask)
  }

  if (loading) {
    return (
      <MainLayout>
        <TasksPageSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Tareas Pendientes</h1>
            <p className="text-muted-foreground">Gestiona y organiza tus tareas</p>
          </div>
          <Button onClick={handleCreateTask} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Tarea
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="h-4 w-4" />
            Filtros
          </Button>
        </div>

        {/* Filtros activos */}
        {showFilters && (
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'status:pending', label: 'Pendientes' },
              { key: 'status:in_progress', label: 'En Progreso' },
              { key: 'status:completed', label: 'Completadas' },
              { key: 'priority:urgent', label: 'Urgentes' },
              { key: 'priority:high', label: 'Alta Prioridad' }
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={activeFilters.includes(filter.key) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  if (activeFilters.includes(filter.key)) {
                    setActiveFilters(prev => prev.filter(f => f !== filter.key))
                  } else {
                    setActiveFilters(prev => [...prev, filter.key])
                  }
                }}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        )}

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredTasks.filter(t => t.status === 'pending').length}</p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredTasks.filter(t => t.status === 'in_progress').length}</p>
                  <p className="text-sm text-muted-foreground">En Progreso</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredTasks.filter(t => t.status === 'completed').length}</p>
                  <p className="text-sm text-muted-foreground">Completadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredTasks.filter(t => t.priority === 'urgent').length}</p>
                  <p className="text-sm text-muted-foreground">Urgentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de tareas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <Card key={task.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {task.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 ml-2">
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Estado y Prioridad */}
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(task.status)}>
                      {task.status === 'pending' && 'Pendiente'}
                      {task.status === 'in_progress' && 'En Progreso'}
                      {task.status === 'completed' && 'Completada'}
                      {task.status === 'cancelled' && 'Cancelada'}
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority === 'urgent' && 'Urgente'}
                      {task.priority === 'high' && 'Alta'}
                      {task.priority === 'medium' && 'Media'}
                      {task.priority === 'low' && 'Baja'}
                    </Badge>
                  </div>

                  {/* Asignado a */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{task.assignedTo}</span>
                  </div>

                  {/* Fecha de vencimiento */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(task.dueDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Botón de completar */}
                  {task.status !== 'completed' && (
                    <Button
                      onClick={() => handleCompleteTask(task.id)}
                      className="w-full"
                      size="sm"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Completar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensaje si no hay tareas */}
        {filteredTasks.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Target className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay tareas</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || activeFilters.length > 0
                  ? 'No se encontraron tareas con los filtros aplicados'
                  : 'Crea tu primera tarea para comenzar'
                }
              </p>
              <Button onClick={handleCreateTask}>
                <Plus className="h-4 w-4 mr-2" />
                Crear Tarea
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}
