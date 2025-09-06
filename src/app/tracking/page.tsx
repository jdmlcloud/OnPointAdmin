"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { 
  Send, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Download,
  Share,
  Settings,
  BarChart3,
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Mail,
  MessageSquare,
  Globe,
  Smartphone,
  RefreshCw,
  Zap,
  Target,
  Activity
} from "lucide-react"

interface Delivery {
  id: string
  title: string
  recipient: string
  recipientEmail: string
  channel: 'email' | 'whatsapp' | 'web' | 'sms'
  status: 'pending' | 'sent' | 'delivered' | 'opened' | 'clicked' | 'failed'
  sentAt?: string
  deliveredAt?: string
  openedAt?: string
  clickedAt?: string
  failedAt?: string
  retryCount: number
  documentId: string
  documentTitle: string
}

interface Analytics {
  totalSent: number
  totalDelivered: number
  totalOpened: number
  totalClicked: number
  deliveryRate: number
  openRate: number
  clickRate: number
  averageOpenTime: string
  topChannels: Array<{
    channel: string
    count: number
    rate: number
  }>
}

export default function TrackingPage() {
  const { isLoading, simulateAction } = useMicrointeractions()
  const [deliveries, setDeliveries] = useState<Delivery[]>([
    {
      id: "1",
      title: "Propuesta TechCorp Solutions - Q1 2024",
      recipient: "María González",
      recipientEmail: "maria@techcorp.com",
      channel: 'email',
      status: 'opened',
      sentAt: "2024-01-20T10:30:00Z",
      deliveredAt: "2024-01-20T10:31:00Z",
      openedAt: "2024-01-20T14:22:00Z",
      retryCount: 0,
      documentId: "1",
      documentTitle: "Propuesta TechCorp Solutions - Q1 2024"
    },
    {
      id: "2",
      title: "Cotización Técnica - Proyecto Alpha",
      recipient: "Carlos Rodríguez",
      recipientEmail: "carlos@empresa.com",
      channel: 'whatsapp',
      status: 'delivered',
      sentAt: "2024-01-19T16:45:00Z",
      deliveredAt: "2024-01-19T16:46:00Z",
      retryCount: 0,
      documentId: "2",
      documentTitle: "Cotización Técnica - Proyecto Alpha"
    },
    {
      id: "3",
      title: "Reporte Ejecutivo - Enero 2024",
      recipient: "Ana Martínez",
      recipientEmail: "ana@corporacion.com",
      channel: 'email',
      status: 'clicked',
      sentAt: "2024-01-18T09:15:00Z",
      deliveredAt: "2024-01-18T09:16:00Z",
      openedAt: "2024-01-18T11:30:00Z",
      clickedAt: "2024-01-18T11:35:00Z",
      retryCount: 0,
      documentId: "3",
      documentTitle: "Reporte Ejecutivo - Enero 2024"
    },
    {
      id: "4",
      title: "Propuesta Comercial - Servicios Digitales",
      recipient: "Luis Fernández",
      recipientEmail: "luis@startup.com",
      channel: 'sms',
      status: 'failed',
      sentAt: "2024-01-17T14:20:00Z",
      failedAt: "2024-01-17T14:21:00Z",
      retryCount: 2,
      documentId: "4",
      documentTitle: "Propuesta Comercial - Servicios Digitales"
    }
  ])

  const [analytics] = useState<Analytics>({
    totalSent: 156,
    totalDelivered: 148,
    totalOpened: 89,
    totalClicked: 34,
    deliveryRate: 94.9,
    openRate: 60.1,
    clickRate: 38.2,
    averageOpenTime: "2h 15m",
    topChannels: [
      { channel: 'email', count: 89, rate: 57.1 },
      { channel: 'whatsapp', count: 45, rate: 28.8 },
      { channel: 'web', count: 15, rate: 9.6 },
      { channel: 'sms', count: 7, rate: 4.5 }
    ]
  })

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedChannel, setSelectedChannel] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")

  const filteredDeliveries = deliveries.filter(delivery => {
    const matchesSearch = delivery.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.recipient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         delivery.recipientEmail.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesChannel = selectedChannel === "all" || delivery.channel === selectedChannel
    const matchesStatus = selectedStatus === "all" || delivery.status === selectedStatus
    return matchesSearch && matchesChannel && matchesStatus
  })

  const getStatusColor = (status: Delivery['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'delivered':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'opened':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'clicked':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Delivery['status']) => {
    switch (status) {
      case 'pending':
        return 'Pendiente'
      case 'sent':
        return 'Enviado'
      case 'delivered':
        return 'Entregado'
      case 'opened':
        return 'Abierto'
      case 'clicked':
        return 'Clickeado'
      case 'failed':
        return 'Fallido'
      default:
        return 'Desconocido'
    }
  }

  const getStatusIcon = (status: Delivery['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'sent':
        return <Send className="h-4 w-4" />
      case 'delivered':
        return <CheckCircle className="h-4 w-4" />
      case 'opened':
        return <Eye className="h-4 w-4" />
      case 'clicked':
        return <Target className="h-4 w-4" />
      case 'failed':
        return <XCircle className="h-4 w-4" />
      default:
        return <AlertCircle className="h-4 w-4" />
    }
  }

  const getChannelIcon = (channel: Delivery['channel']) => {
    switch (channel) {
      case 'email':
        return <Mail className="h-4 w-4" />
      case 'whatsapp':
        return <MessageSquare className="h-4 w-4" />
      case 'web':
        return <Globe className="h-4 w-4" />
      case 'sms':
        return <Smartphone className="h-4 w-4" />
      default:
        return <Send className="h-4 w-4" />
    }
  }

  const handleRetryDelivery = async (deliveryId: string) => {
    await simulateAction(
      'retry-delivery',
      async () => {
        // Simular reintento de envío
        await new Promise(resolve => setTimeout(resolve, 1500))
      },
      {
        successMessage: "Reintento de envío iniciado",
        notification: {
          type: 'info',
          title: 'Reintento Iniciado',
          message: 'El documento se está reenviando al destinatario'
        }
      }
    )
  }

  const handleSendNew = async () => {
    await simulateAction(
      'send-new',
      async () => {
        // Simular envío nuevo
        await new Promise(resolve => setTimeout(resolve, 2000))
      },
      {
        successMessage: "Envío programado exitosamente",
        notification: {
          type: 'success',
          title: 'Envío Programado',
          message: 'El documento se enviará en los próximos minutos'
        }
      }
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Envío y Seguimiento</h1>
            <p className="text-muted-foreground">
              Gestiona envíos multicanal y analiza el rendimiento
            </p>
          </div>
          <AnimatedButton 
            loading={isLoading('send-new')}
            loadingText="Enviando..."
            onClick={handleSendNew}
            animation="pulse"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Envío
          </AnimatedButton>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Send className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics.totalSent}</p>
                  <p className="text-sm text-muted-foreground">Total Enviados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics.deliveryRate}%</p>
                  <p className="text-sm text-muted-foreground">Tasa de Entrega</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics.openRate}%</p>
                  <p className="text-sm text-muted-foreground">Tasa de Apertura</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{analytics.clickRate}%</p>
                  <p className="text-sm text-muted-foreground">Tasa de Clics</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Channel Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Rendimiento por Canal</CardTitle>
            <CardDescription>
              Distribución de envíos y tasas de éxito por canal
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {analytics.topChannels.map((channel, index) => (
                <div key={channel.channel} className="p-4 border rounded-lg">
                  <div className="flex items-center gap-3 mb-2">
                    {getChannelIcon(channel.channel as Delivery['channel'])}
                    <span className="font-medium capitalize">{channel.channel}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>Envíos:</span>
                      <span className="font-medium">{channel.count}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Porcentaje:</span>
                      <span className="font-medium">{channel.rate}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar envíos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
          <Button variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Actualizar
          </Button>
        </div>

        {/* Deliveries List */}
        <div className="space-y-4">
          {filteredDeliveries.map((delivery) => (
            <Card key={delivery.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      {getChannelIcon(delivery.channel)}
                    </div>
                    <div>
                      <h3 className="font-semibold">{delivery.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        Para: {delivery.recipient} ({delivery.recipientEmail})
                      </p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span>Enviado: {delivery.sentAt ? new Date(delivery.sentAt).toLocaleString() : 'Pendiente'}</span>
                        {delivery.deliveredAt && (
                          <span>Entregado: {new Date(delivery.deliveredAt).toLocaleString()}</span>
                        )}
                        {delivery.openedAt && (
                          <span>Abierto: {new Date(delivery.openedAt).toLocaleString()}</span>
                        )}
                        {delivery.retryCount > 0 && (
                          <span>Reintentos: {delivery.retryCount}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(delivery.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(delivery.status)}
                        {getStatusText(delivery.status)}
                      </div>
                    </Badge>
                    
                    <div className="flex gap-2">
                      <AnimatedButton 
                        variant="outline" 
                        size="sm"
                        animation="pulse"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </AnimatedButton>
                      {delivery.status === 'failed' && (
                        <AnimatedButton 
                          size="sm"
                          loading={isLoading('retry-delivery')}
                          loadingText="Reintentando..."
                          onClick={() => handleRetryDelivery(delivery.id)}
                          animation="pulse"
                        >
                          <RefreshCw className="h-4 w-4 mr-2" />
                          Reintentar
                        </AnimatedButton>
                      )}
                      <AnimatedButton 
                        variant="outline" 
                        size="sm"
                        animation="pulse"
                      >
                        <Share className="h-4 w-4 mr-2" />
                        Compartir
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Performance Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights de Rendimiento</CardTitle>
            <CardDescription>
              Análisis automático del rendimiento de envíos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">Mejor Canal</h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Email tiene la mayor tasa de apertura (65.2%)
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Mejor Horario</h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Envíos entre 10:00-11:00 AM tienen 23% más aperturas
                </p>
              </div>
              
              <div className="p-4 bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-purple-600" />
                  <h4 className="font-medium text-purple-900 dark:text-purple-100">Tendencia</h4>
                </div>
                <p className="text-sm text-purple-700 dark:text-purple-300">
                  Tasa de apertura aumentó 12% en la última semana
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
