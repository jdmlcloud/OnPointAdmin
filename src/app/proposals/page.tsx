"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useNotifications } from "@/hooks/use-notifications"
import { 
  Plus, 
  Search, 
  Filter,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  DollarSign,
  Edit,
  Trash2,
  Eye,
  Download,
  Send
} from "lucide-react"
import { ProposalsPageSkeleton } from "@/components/ui/page-skeletons"

interface Proposal {
  id: string
  title: string
  description: string
  clientName: string
  status: 'draft' | 'sent' | 'reviewed' | 'approved' | 'rejected' | 'expired'
  priority: 'low' | 'medium' | 'high' | 'urgent'
  amount: number
  currency: string
  dueDate: string
  sentAt?: string
  reviewedAt?: string
  createdAt: string
  updatedAt: string
}

export default function ProposalsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const { notifications, loading } = useNotifications()

  // Datos mock de propuestas (después se conectarán con AWS)
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: '1',
      title: 'Propuesta ABC',
      description: 'Desarrollo de aplicación web para empresa ABC',
      clientName: 'ABC Corp',
      status: 'sent',
      priority: 'urgent',
      amount: 50000,
      currency: 'USD',
      dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), // 2 horas
      sentAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Cotización HBO',
      description: 'Servicios de consultoría para HBO',
      clientName: 'HBO',
      status: 'reviewed',
      priority: 'high',
      amount: 25000,
      currency: 'USD',
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 1 día
      sentAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Proyecto Netflix',
      description: 'Infraestructura en la nube para Netflix',
      clientName: 'Netflix',
      status: 'draft',
      priority: 'medium',
      amount: 100000,
      currency: 'USD',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 1 semana
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ])

  const filteredProposals = proposals.filter(proposal => {
    const searchLower = searchTerm.toLowerCase()
    
    // Aplicar filtros activos
    for (const filter of activeFilters) {
      switch (filter) {
        case 'status:draft':
          if (proposal.status !== 'draft') return false
          break
        case 'status:sent':
          if (proposal.status !== 'sent') return false
          break
        case 'status:reviewed':
          if (proposal.status !== 'reviewed') return false
          break
        case 'status:approved':
          if (proposal.status !== 'approved') return false
          break
        case 'status:rejected':
          if (proposal.status !== 'rejected') return false
          break
        case 'priority:urgent':
          if (proposal.priority !== 'urgent') return false
          break
        case 'priority:high':
          if (proposal.priority !== 'high') return false
          break
      }
    }
    
    return (
      proposal.title.toLowerCase().includes(searchLower) ||
      proposal.description.toLowerCase().includes(searchLower) ||
      proposal.clientName.toLowerCase().includes(searchLower)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'reviewed': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'sent': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'expired': return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300'
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

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Borrador'
      case 'sent': return 'Enviada'
      case 'reviewed': return 'Revisada'
      case 'approved': return 'Aprobada'
      case 'rejected': return 'Rechazada'
      case 'expired': return 'Expirada'
      default: return status
    }
  }

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'Urgente'
      case 'high': return 'Alta'
      case 'medium': return 'Media'
      case 'low': return 'Baja'
      default: return priority
    }
  }

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: currency
    }).format(amount)
  }

  const isExpiringSoon = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    const diffHours = (due.getTime() - now.getTime()) / (1000 * 60 * 60)
    return diffHours <= 24 && diffHours > 0
  }

  const isExpired = (dueDate: string) => {
    const now = new Date()
    const due = new Date(dueDate)
    return due.getTime() < now.getTime()
  }

  if (loading) {
    return (
      <MainLayout>
        <ProposalsPageSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Propuestas</h1>
            <p className="text-muted-foreground">Gestiona tus propuestas comerciales</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nueva Propuesta
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar propuestas..."
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
              { key: 'status:draft', label: 'Borradores' },
              { key: 'status:sent', label: 'Enviadas' },
              { key: 'status:reviewed', label: 'Revisadas' },
              { key: 'status:approved', label: 'Aprobadas' },
              { key: 'status:rejected', label: 'Rechazadas' },
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
                <FileText className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredProposals.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredProposals.filter(p => p.status === 'sent').length}</p>
                  <p className="text-sm text-muted-foreground">Enviadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredProposals.filter(p => p.status === 'approved').length}</p>
                  <p className="text-sm text-muted-foreground">Aprobadas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredProposals.filter(p => isExpiringSoon(p.dueDate)).length}</p>
                  <p className="text-sm text-muted-foreground">Por Vencer</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de propuestas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProposals.map((proposal) => (
            <Card key={proposal.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{proposal.title}</CardTitle>
                    <CardDescription className="mt-1 line-clamp-2">
                      {proposal.description}
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
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Estado y Prioridad */}
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(proposal.status)}>
                      {getStatusLabel(proposal.status)}
                    </Badge>
                    <Badge className={getPriorityColor(proposal.priority)}>
                      {getPriorityLabel(proposal.priority)}
                    </Badge>
                    {isExpiringSoon(proposal.dueDate) && (
                      <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
                        Por Vencer
                      </Badge>
                    )}
                    {isExpired(proposal.dueDate) && (
                      <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300">
                        Expirada
                      </Badge>
                    )}
                  </div>

                  {/* Cliente */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <User className="h-4 w-4" />
                    <span>{proposal.clientName}</span>
                  </div>

                  {/* Monto */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <DollarSign className="h-4 w-4" />
                    <span className="font-semibold">{formatCurrency(proposal.amount, proposal.currency)}</span>
                  </div>

                  {/* Fecha de vencimiento */}
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(proposal.dueDate).toLocaleDateString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {proposal.status === 'draft' && (
                      <Button size="sm" className="flex-1">
                        <Send className="h-4 w-4 mr-2" />
                        Enviar
                      </Button>
                    )}
                    {proposal.status === 'sent' && (
                      <Button size="sm" variant="outline" className="flex-1">
                        <Clock className="h-4 w-4 mr-2" />
                        Seguimiento
                      </Button>
                    )}
                    <Button size="sm" variant="outline">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensaje si no hay propuestas */}
        {filteredProposals.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay propuestas</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || activeFilters.length > 0
                  ? 'No se encontraron propuestas con los filtros aplicados'
                  : 'Crea tu primera propuesta para comenzar'
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Crear Propuesta
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </MainLayout>
  )
}