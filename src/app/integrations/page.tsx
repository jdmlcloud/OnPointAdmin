"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { 
  Settings, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  RefreshCw,
  ExternalLink,
  Key,
  Webhook,
  Database,
  Mail,
  MessageSquare,
  FileText,
  BarChart3
} from "lucide-react"

export default function IntegrationsPage() {
  const { simulateAction } = useMicrointeractions()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Datos de ejemplo para integraciones
  const integrations = [
    {
      id: 1,
      name: "WhatsApp Business API",
      type: "messaging",
      status: "active",
      description: "Integración con WhatsApp para envío de mensajes",
      lastSync: "2024-01-15 10:30:00",
      icon: MessageSquare,
      color: "text-green-500"
    },
    {
      id: 2,
      name: "OpenAI GPT-4",
      type: "ai",
      status: "active",
      description: "Servicio de IA para generación de contenido",
      lastSync: "2024-01-15 10:25:00",
      icon: BarChart3,
      color: "text-blue-500"
    },
    {
      id: 3,
      name: "Resend Email",
      type: "email",
      status: "inactive",
      description: "Servicio de envío de emails transaccionales",
      lastSync: "2024-01-14 15:45:00",
      icon: Mail,
      color: "text-purple-500"
    },
    {
      id: 4,
      name: "AWS S3",
      type: "storage",
      status: "active",
      description: "Almacenamiento de archivos y documentos",
      lastSync: "2024-01-15 09:15:00",
      icon: Database,
      color: "text-orange-500"
    }
  ]

  const webhooks = [
    {
      id: 1,
      name: "WhatsApp Message Received",
      url: "https://api.onpoint.com/webhooks/whatsapp",
      status: "active",
      events: ["message.received", "message.sent"],
      lastTriggered: "2024-01-15 10:30:00"
    },
    {
      id: 2,
      name: "Proposal Status Changed",
      url: "https://api.onpoint.com/webhooks/proposals",
      status: "inactive",
      events: ["proposal.created", "proposal.updated"],
      lastTriggered: "2024-01-14 16:20:00"
    }
  ]

  const handleTestIntegration = (id: number) => {
    // Simulación de microinteracción exitosa
  }

  const handleToggleStatus = (id: number) => {
    // Simulación de microinteracción exitosa
  }

  const handleViewDetails = (id: number) => {
    // Simulación de microinteracción exitosa
  }

  const handleEditIntegration = (id: number) => {
    // Simulación de microinteracción exitosa
  }

  const handleDeleteIntegration = (id: number) => {
    // Simulación de microinteracción exitosa
  }

  const filteredIntegrations = integrations.filter(integration => {
    const matchesSearch = integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         integration.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || integration.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Integraciones</h1>
            <p className="text-muted-foreground">
              Gestiona todas las integraciones y APIs del sistema
            </p>
          </div>
          <AnimatedButton
            onClick={() => {/* Simulación de microinteracción exitosa */}}
            className="bg-primary hover:bg-primary/90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Integración
          </AnimatedButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Settings className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{integrations.length}</p>
                  <p className="text-sm text-muted-foreground">Total Integraciones</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{integrations.filter(i => i.status === 'active').length}</p>
                  <p className="text-sm text-muted-foreground">Activas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{integrations.filter(i => i.status === 'inactive').length}</p>
                  <p className="text-sm text-muted-foreground">Inactivas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Webhook className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{webhooks.length}</p>
                  <p className="text-sm text-muted-foreground">Webhooks</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="integrations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="integrations">Integraciones</TabsTrigger>
            <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
            <TabsTrigger value="api-keys">API Keys</TabsTrigger>
          </TabsList>

          {/* Integraciones Tab */}
          <TabsContent value="integrations" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar integraciones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border rounded-md"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activas</option>
                <option value="inactive">Inactivas</option>
              </select>
            </div>

            {/* Integrations Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIntegrations.map((integration) => {
                const Icon = integration.icon
                return (
                  <Card key={integration.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-6 w-6 ${integration.color}`} />
                          <div>
                            <CardTitle className="text-lg">{integration.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {integration.description}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge variant={integration.status === 'active' ? 'default' : 'secondary'}>
                          {integration.status === 'active' ? 'Activa' : 'Inactiva'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="text-sm text-muted-foreground">
                        <p>Última sincronización: {integration.lastSync}</p>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Switch
                            checked={integration.status === 'active'}
                            onCheckedChange={() => handleToggleStatus(integration.id)}
                          />
                          <span className="text-sm">Activar/Desactivar</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(integration.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditIntegration(integration.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleTestIntegration(integration.id)}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Webhooks Tab */}
          <TabsContent value="webhooks" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Webhooks Configurados</h3>
              <AnimatedButton
                onClick={() => {/* Simulación de microinteracción exitosa */}}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Webhook
              </AnimatedButton>
            </div>

            <div className="space-y-4">
              {webhooks.map((webhook) => (
                <Card key={webhook.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <h4 className="font-semibold">{webhook.name}</h4>
                          <Badge variant={webhook.status === 'active' ? 'default' : 'secondary'}>
                            {webhook.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{webhook.url}</p>
                        <div className="flex items-center gap-4 text-sm">
                          <span>Eventos: {webhook.events.join(', ')}</span>
                          <span>Último trigger: {webhook.lastTriggered}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* API Keys Tab */}
          <TabsContent value="api-keys" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">API Keys</h3>
              <AnimatedButton
                onClick={() => {/* Simulación de microinteracción exitosa */}}
                className="bg-primary hover:bg-primary/90"
              >
                <Key className="h-4 w-4 mr-2" />
                Generar API Key
              </AnimatedButton>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    OpenAI API Key
                  </CardTitle>
                  <CardDescription>
                    Clave para acceder a los servicios de OpenAI
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      value="sk-...***"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                      Regenerar
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                      Ver en OpenAI
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="h-5 w-5" />
                    WhatsApp Business API
                  </CardTitle>
                  <CardDescription>
                    Token de acceso para WhatsApp Business API
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Input
                      type="password"
                      value="EAAG...***"
                      readOnly
                      className="font-mono"
                    />
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="h-4 w-4" />
                      Regenerar
                    </Button>
                    <Button variant="outline" size="sm">
                      <ExternalLink className="h-4 w-4" />
                      Ver en Meta
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
