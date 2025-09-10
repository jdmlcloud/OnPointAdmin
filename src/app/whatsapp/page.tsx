"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useNotifications } from "@/hooks/use-notifications"
import { 
  Plus, 
  Search, 
  Filter,
  MessageSquare,
  Phone,
  Clock,
  CheckCircle,
  AlertCircle,
  Calendar,
  User,
  Send,
  Reply,
  Archive,
  Trash2,
  Eye,
  PhoneCall
} from "lucide-react"
import { WhatsAppPageSkeleton } from "@/components/ui/page-skeletons"

interface WhatsAppMessage {
  id: string
  phoneNumber: string
  contactName: string
  message: string
  status: 'sent' | 'delivered' | 'read' | 'failed'
  direction: 'inbound' | 'outbound'
  timestamp: string
  isRead: boolean
  isArchived: boolean
  tags?: string[]
}

export default function WhatsAppPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [selectedMessage, setSelectedMessage] = useState<WhatsAppMessage | null>(null)
  const [replyText, setReplyText] = useState("")
  const { notifications, loading } = useNotifications()
  const [splashLoading, setSplashLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setSplashLoading(false), 350)
    return () => clearTimeout(t)
  }, [])

  // Datos mock de mensajes de WhatsApp (después se conectarán con AWS)
  const [messages, setMessages] = useState<WhatsAppMessage[]>([
    {
      id: '1',
      phoneNumber: '+52 55 1234 5678',
      contactName: 'Juan Pérez',
      message: 'Hola, me interesa saber más sobre sus servicios',
      status: 'read',
      direction: 'inbound',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      isRead: false,
      isArchived: false,
      tags: ['interesado', 'servicios']
    },
    {
      id: '2',
      phoneNumber: '+52 55 9876 5432',
      contactName: 'María García',
      message: '¿Podrían enviarme una cotización?',
      status: 'delivered',
      direction: 'inbound',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      isRead: false,
      isArchived: false,
      tags: ['cotización']
    },
    {
      id: '3',
      phoneNumber: '+52 55 1111 2222',
      contactName: 'Carlos López',
      message: 'Gracias por la información, me pondré en contacto pronto',
      status: 'read',
      direction: 'inbound',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      isArchived: false,
      tags: ['agradecimiento']
    },
    {
      id: '4',
      phoneNumber: '+52 55 3333 4444',
      contactName: 'Ana Martínez',
      message: 'Hemos enviado la propuesta como solicitó',
      status: 'delivered',
      direction: 'outbound',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      isRead: true,
      isArchived: false,
      tags: ['propuesta']
    }
  ])

  const filteredMessages = messages.filter(message => {
    const searchLower = searchTerm.toLowerCase()
    
    // Aplicar filtros activos
    for (const filter of activeFilters) {
      switch (filter) {
        case 'status:unread':
          if (message.isRead) return false
          break
        case 'status:read':
          if (!message.isRead) return false
          break
        case 'direction:inbound':
          if (message.direction !== 'inbound') return false
          break
        case 'direction:outbound':
          if (message.direction !== 'outbound') return false
          break
        case 'status:archived':
          if (!message.isArchived) return false
          break
      }
    }
    
    return (
      message.contactName.toLowerCase().includes(searchLower) ||
      message.phoneNumber.includes(searchLower) ||
      message.message.toLowerCase().includes(searchLower)
    )
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'read': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'delivered': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'sent': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'failed': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'sent': return 'Enviado'
      case 'delivered': return 'Entregado'
      case 'read': return 'Leído'
      case 'failed': return 'Fallido'
      default: return status
    }
  }

  const handleReply = async (messageId: string) => {
    if (!replyText.trim()) return
    
    const newMessage: WhatsAppMessage = {
      id: `reply-${Date.now()}`,
      phoneNumber: selectedMessage?.phoneNumber || '',
      contactName: selectedMessage?.contactName || '',
      message: replyText,
      status: 'sent',
      direction: 'outbound',
      timestamp: new Date().toISOString(),
      isRead: true,
      isArchived: false
    }
    
    setMessages(prev => [newMessage, ...prev])
    setReplyText("")
    setSelectedMessage(null)
  }

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
  }

  const handleArchive = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isArchived: !msg.isArchived } : msg
    ))
  }

  if (loading || splashLoading) {
    return (
      <MainLayout>
        <WhatsAppPageSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">WhatsApp</h1>
            <p className="text-muted-foreground">Gestiona tus mensajes de WhatsApp</p>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            Nuevo Mensaje
          </Button>
        </div>

        {/* Filtros */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar mensajes..."
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
              { key: 'status:unread', label: 'No Leídos' },
              { key: 'status:read', label: 'Leídos' },
              { key: 'direction:inbound', label: 'Recibidos' },
              { key: 'direction:outbound', label: 'Enviados' },
              { key: 'status:archived', label: 'Archivados' }
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
                <MessageSquare className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredMessages.length}</p>
                  <p className="text-sm text-muted-foreground">Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredMessages.filter(m => !m.isRead).length}</p>
                  <p className="text-sm text-muted-foreground">No Leídos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredMessages.filter(m => m.direction === 'inbound').length}</p>
                  <p className="text-sm text-muted-foreground">Recibidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-2">
                <Send className="h-5 w-5 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{filteredMessages.filter(m => m.direction === 'outbound').length}</p>
                  <p className="text-sm text-muted-foreground">Enviados</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Lista de mensajes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`hover:shadow-lg transition-shadow cursor-pointer ${
                !message.isRead ? 'ring-2 ring-blue-200 dark:ring-blue-800' : ''
              }`}
              onClick={() => setSelectedMessage(message)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {message.direction === 'inbound' ? (
                        <MessageSquare className="h-4 w-4 text-green-500" />
                      ) : (
                        <Send className="h-4 w-4 text-blue-500" />
                      )}
                      {message.contactName}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {message.phoneNumber}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1 ml-2">
                    {!message.isRead && (
                      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                        Nuevo
                      </Badge>
                    )}
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {/* Mensaje */}
                  <p className="text-sm line-clamp-3">{message.message}</p>

                  {/* Estado */}
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(message.status)}>
                      {getStatusLabel(message.status)}
                    </Badge>
                    {message.tags && message.tags.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        {message.tags[0]}
                      </Badge>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>
                      {new Date(message.timestamp).toLocaleString('es-ES', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>

                  {/* Botones de acción */}
                  <div className="flex gap-2">
                    {!message.isRead && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleMarkAsRead(message.id)
                        }}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Marcar Leído
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleArchive(message.id)
                      }}
                    >
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedMessage(message)
                      }}
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mensaje si no hay mensajes */}
        {filteredMessages.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No hay mensajes</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || activeFilters.length > 0
                  ? 'No se encontraron mensajes con los filtros aplicados'
                  : 'No tienes mensajes de WhatsApp'
                }
              </p>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Mensaje
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Modal de respuesta */}
        {selectedMessage && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full max-w-md mx-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Responder a {selectedMessage.contactName}
                </CardTitle>
                <CardDescription>
                  {selectedMessage.phoneNumber}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm">{selectedMessage.message}</p>
                </div>
                <Textarea
                  placeholder="Escribe tu respuesta..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  rows={4}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => handleReply(selectedMessage.id)}
                    disabled={!replyText.trim()}
                    className="flex-1"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Enviar
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => {
                      setSelectedMessage(null)
                      setReplyText("")
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}