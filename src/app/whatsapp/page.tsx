"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  MessageSquare, 
  Bot, 
  Users, 
  TrendingUp, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  Search,
  Filter,
  RefreshCw,
  Settings,
  Play,
  Pause,
  Save,
  Send
} from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ActionModal } from "@/components/ui/action-modal"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { useCardActions } from "@/hooks/use-card-actions"

interface WhatsAppMessage {
  id: string
  from: string
  to: string
  content: string
  timestamp: string
  status: 'received' | 'processed' | 'replied' | 'error'
  aiAnalysis?: {
    intent: string
    confidence: number
    extractedData: any
  }
  response?: string
}

export default function WhatsAppPage() {
  const { isLoading, processWhatsAppMessage, sendMessage } = useMicrointeractions()
  const {
    modals,
    handleView,
    handleEdit,
    handleDelete,
    handleSave,
    handleDeleteConfirm,
    handleDownload,
    handleShare,
    closeModal
  } = useCardActions()
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: "1",
      from: "+52 55 1234 5678",
      to: "+52 55 8765 4321",
      content: "Hola, necesito cotizar 100 tazas personalizadas con logo de mi empresa",
      timestamp: "2024-01-15T10:30:00Z",
      status: "replied",
      aiAnalysis: {
        intent: "quotation",
        confidence: 0.95,
        extractedData: {
          products: ["tazas"],
          quantities: [100],
          colors: [],
          urgency: "medium"
        }
      },
      response: "¡Hola! He recibido tu solicitud de cotización para 100 tazas personalizadas. Te enviaré una propuesta detallada en los próximos minutos."
    },
    {
      id: "2",
      from: "+52 55 9876 5432",
      to: "+52 55 8765 4321",
      content: "¿Tienen camisetas de algodón en talla M?",
      timestamp: "2024-01-15T11:15:00Z",
      status: "processed",
      aiAnalysis: {
        intent: "information",
        confidence: 0.88,
        extractedData: {
          products: ["camisetas"],
          quantities: [1],
          colors: [],
          urgency: "low"
        }
      }
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const filteredMessages = messages.filter(message =>
    message.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    message.from.includes(searchTerm)
  )

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'received':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'processed':
        return <Bot className="h-4 w-4 text-blue-500" />
      case 'replied':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'received':
        return 'Recibido'
      case 'processed':
        return 'Procesado'
      case 'replied':
        return 'Respondido'
      case 'error':
        return 'Error'
      default:
        return 'Desconocido'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'received':
        return 'bg-yellow-100 text-yellow-800'
      case 'processed':
        return 'bg-blue-100 text-blue-800'
      case 'replied':
        return 'bg-green-100 text-green-800'
      case 'error':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const stats = {
    total: messages.length,
    processed: messages.filter(m => m.status === 'processed' || m.status === 'replied').length,
    pending: messages.filter(m => m.status === 'received').length,
    errors: messages.filter(m => m.status === 'error').length,
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">WhatsApp + IA</h1>
            <p className="text-muted-foreground">
              Procesamiento automático de mensajes con inteligencia artificial
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Configurar
            </Button>
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <MessageSquare className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Mensajes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Bot className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.processed}</p>
                  <p className="text-sm text-muted-foreground">Procesados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{stats.errors}</p>
                  <p className="text-sm text-muted-foreground">Errores</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="messages" className="space-y-6">
          <TabsList>
            <TabsTrigger value="messages">Mensajes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Messages Tab */}
          <TabsContent value="messages" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar mensajes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
              </Button>
            </div>

            {/* Messages List */}
            <div className="space-y-4">
              {filteredMessages.map((message) => (
                <Card key={message.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <MessageSquare className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{message.from}</p>
                          <p className="text-sm text-muted-foreground">
                            {new Date(message.timestamp).toLocaleString('es-ES')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(message.status)}
                        <Badge className={getStatusColor(message.status)}>
                          {getStatusText(message.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm bg-muted p-3 rounded-lg">
                        {message.content}
                      </p>
                    </div>

                    {message.aiAnalysis && (
                      <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Análisis de IA</h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Intención:</span>
                            <p className="text-blue-700 dark:text-blue-300">{message.aiAnalysis.intent}</p>
                          </div>
                          <div>
                            <span className="font-medium">Confianza:</span>
                            <p className="text-blue-700 dark:text-blue-300">{(message.aiAnalysis.confidence * 100).toFixed(1)}%</p>
                          </div>
                          <div>
                            <span className="font-medium">Datos Extraídos:</span>
                            <p className="text-blue-700 dark:text-blue-300">
                              {message.aiAnalysis.extractedData.products?.join(', ') || 'N/A'}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {message.response && (
                      <div className="p-4 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg">
                        <h4 className="font-medium text-green-900 dark:text-green-100 mb-2">Respuesta Enviada</h4>
                        <p className="text-sm text-green-700 dark:text-green-300">{message.response}</p>
                      </div>
                    )}

                    <div className="flex gap-2 mt-4">
                      <AnimatedButton 
                        variant="outline" 
                        size="sm" 
                        animation="pulse"
                        onClick={() => handleView(message)}
                      >
                        Ver Detalles
                      </AnimatedButton>
                      {message.status === 'received' && (
                        <AnimatedButton 
                          size="sm"
                          loading={isLoading(`process-message-${message.id}`)}
                          loadingText="Procesando..."
                          onClick={() => processWhatsAppMessage(message.id)}
                          animation="bounce"
                        >
                          <Bot className="h-4 w-4 mr-2" />
                          Procesar
                        </AnimatedButton>
                      )}
                      {message.response && (
                        <AnimatedButton 
                          variant="outline" 
                          size="sm"
                          loading={isLoading(`send-response-${message.id}`)}
                          loadingText="Enviando..."
                          onClick={() => sendMessage(message.response || '')}
                          animation="pulse"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Respuesta
                        </AnimatedButton>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredMessages.length === 0 && (
              <div className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay mensajes</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No se encontraron mensajes con ese criterio de búsqueda." : "Los mensajes de WhatsApp aparecerán aquí."}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Procesamiento por Hora</CardTitle>
                  <CardDescription>
                    Mensajes procesados en las últimas 24 horas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                      <p>Gráfico de procesamiento</p>
                      <p className="text-sm">(Integrar con Chart.js)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Intenciones Detectadas</CardTitle>
                  <CardDescription>
                    Distribución de tipos de mensajes
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Cotizaciones</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                        </div>
                        <span className="text-sm font-medium">60%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Información</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Quejas</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '10%' }}></div>
                        </div>
                        <span className="text-sm font-medium">10%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Otros</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-gray-500 h-2 rounded-full" style={{ width: '5%' }}></div>
                        </div>
                        <span className="text-sm font-medium">5%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de IA</CardTitle>
                <CardDescription>
                  Ajusta el comportamiento del procesamiento automático
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Respuestas Automáticas</h4>
                    <div className="space-y-2">
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Habilitar respuestas automáticas</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">Notificar al ejecutivo</span>
                      </label>
                      <label className="flex items-center space-x-2">
                        <input type="checkbox" className="rounded" />
                        <span className="text-sm">Procesar solo en horario laboral</span>
                      </label>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Umbrales de Confianza</h4>
                    <div className="space-y-2">
                      <div>
                        <label className="text-sm">Confianza mínima para respuesta automática</label>
                        <input type="range" min="0" max="100" defaultValue="80" className="w-full" />
                        <span className="text-sm text-muted-foreground">80%</span>
                      </div>
                      <div>
                        <label className="text-sm">Confianza mínima para notificación</label>
                        <input type="range" min="0" max="100" defaultValue="60" className="w-full" />
                        <span className="text-sm text-muted-foreground">60%</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Guardar Configuración
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Restaurar Valores
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modales */}
      <ActionModal
        isOpen={modals.view.isOpen}
        onClose={() => closeModal('view')}
        title="Detalles del Mensaje"
        description="Información completa del mensaje de WhatsApp"
        type="view"
      >
        {modals.view.data && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MessageSquare className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Mensaje de WhatsApp</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">
                    {modals.view.data.status === 'received' ? 'Recibido' : 
                     modals.view.data.status === 'processed' ? 'Procesado' : 'Enviado'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(modals.view.data.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <label className="text-sm font-medium text-muted-foreground">De</label>
                <p className="text-sm">{modals.view.data.from}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Para</label>
                <p className="text-sm">{modals.view.data.to}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Contenido</label>
                <p className="text-sm bg-muted p-3 rounded-lg">{modals.view.data.content}</p>
              </div>
              
              {modals.view.data.aiAnalysis && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Análisis de IA</label>
                  <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium">Intención:</span>
                        <p className="text-blue-700 dark:text-blue-300">{modals.view.data.aiAnalysis.intent}</p>
                      </div>
                      <div>
                        <span className="font-medium">Confianza:</span>
                        <p className="text-blue-700 dark:text-blue-300">
                          {(modals.view.data.aiAnalysis.confidence * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {modals.view.data.response && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Respuesta Enviada</label>
                  <p className="text-sm bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 p-3 rounded-lg">
                    {modals.view.data.response}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </ActionModal>
    </MainLayout>
  )
}
