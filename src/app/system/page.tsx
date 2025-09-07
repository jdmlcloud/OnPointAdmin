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
  BarChart3,
  Server,
  HardDrive,
  Cpu,
  MemoryStick,
  Network,
  Shield,
  AlertTriangle,
  Activity,
  Clock,
  Users,
  Globe,
  Download
} from "lucide-react"

export default function SystemPage() {
  const { simulateAction } = useMicrointeractions()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  // Datos de ejemplo para servicios del sistema
  const services = [
    {
      id: 1,
      name: "API Gateway",
      type: "gateway",
      status: "running",
      description: "Puerta de enlace principal para todas las APIs",
      uptime: "99.9%",
      lastRestart: "2024-01-10 02:00:00",
      icon: Network,
      color: "text-blue-500"
    },
    {
      id: 2,
      name: "DynamoDB",
      type: "database",
      status: "running",
      description: "Base de datos principal del sistema",
      uptime: "99.8%",
      lastRestart: "2024-01-08 01:30:00",
      icon: Database,
      color: "text-green-500"
    },
    {
      id: 3,
      name: "S3 Storage",
      type: "storage",
      status: "running",
      description: "Almacenamiento de archivos y documentos",
      uptime: "99.9%",
      lastRestart: "2024-01-05 03:15:00",
      icon: HardDrive,
      color: "text-orange-500"
    },
    {
      id: 4,
      name: "Lambda Functions",
      type: "compute",
      status: "running",
      description: "Funciones serverless para procesamiento",
      uptime: "99.7%",
      lastRestart: "2024-01-12 04:20:00",
      icon: Cpu,
      color: "text-purple-500"
    },
    {
      id: 5,
      name: "SQS Queue",
      type: "messaging",
      status: "warning",
      description: "Cola de mensajes para procesamiento asíncrono",
      uptime: "98.5%",
      lastRestart: "2024-01-14 05:45:00",
      icon: MessageSquare,
      color: "text-yellow-500"
    },
    {
      id: 6,
      name: "CloudWatch",
      type: "monitoring",
      status: "running",
      description: "Monitoreo y logging del sistema",
      uptime: "99.9%",
      lastRestart: "2024-01-09 01:00:00",
      icon: Activity,
      color: "text-cyan-500"
    }
  ]

  const logs = [
    {
      id: 1,
      timestamp: "2024-01-15 10:30:15",
      level: "INFO",
      service: "API Gateway",
      message: "Request processed successfully",
      details: "GET /api/proposals - 200ms"
    },
    {
      id: 2,
      timestamp: "2024-01-15 10:29:45",
      level: "WARN",
      service: "SQS Queue",
      message: "Queue depth exceeded threshold",
      details: "Queue size: 1500 messages"
    },
    {
      id: 3,
      timestamp: "2024-01-15 10:28:30",
      level: "ERROR",
      service: "Lambda Functions",
      message: "Function timeout exceeded",
      details: "Function: generatePDF - Timeout: 30s"
    },
    {
      id: 4,
      timestamp: "2024-01-15 10:27:12",
      level: "INFO",
      service: "DynamoDB",
      message: "Query executed successfully",
      details: "Table: users - Query time: 45ms"
    }
  ]

  const handleRestartService = (id: number) => {
    // Simulación de microinteracción exitosa
  }

  const handleViewLogs = (id: number) => {
    // Simulación de microinteracción exitosa
  }

  const handleViewDetails = (id: number) => {
    // Simulación de microinteracción exitosa
  }

  const handleEditService = (id: number) => {
    // Simulación de microinteracción exitosa
  }

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || service.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-500'
      case 'warning': return 'text-yellow-500'
      case 'error': return 'text-red-500'
      default: return 'text-gray-500'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'running': return <Badge variant="default" className="bg-green-500">Ejecutándose</Badge>
      case 'warning': return <Badge variant="secondary" className="bg-yellow-500">Advertencia</Badge>
      case 'error': return <Badge variant="destructive">Error</Badge>
      default: return <Badge variant="secondary">Desconocido</Badge>
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Sistema</h1>
            <p className="text-muted-foreground">
              Monitoreo y administración del sistema
            </p>
          </div>
          <div className="flex items-center gap-2">
            <AnimatedButton
              onClick={() => {/* Simulación de microinteracción exitosa */}}
              variant="outline"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </AnimatedButton>
            <AnimatedButton
              onClick={() => {/* Simulación de microinteracción exitosa */}}
              className="bg-primary hover:bg-primary/90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Servicio
            </AnimatedButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Server className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{services.length}</p>
                  <p className="text-sm text-muted-foreground">Total Servicios</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{services.filter(s => s.status === 'running').length}</p>
                  <p className="text-sm text-muted-foreground">Ejecutándose</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">{services.filter(s => s.status === 'warning').length}</p>
                  <p className="text-sm text-muted-foreground">Advertencias</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <XCircle className="h-8 w-8 text-red-500" />
                <div>
                  <p className="text-2xl font-bold">{services.filter(s => s.status === 'error').length}</p>
                  <p className="text-sm text-muted-foreground">Errores</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="services" className="space-y-6">
          <TabsList>
            <TabsTrigger value="services">Servicios</TabsTrigger>
            <TabsTrigger value="logs">Logs del Sistema</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
          </TabsList>

          {/* Servicios Tab */}
          <TabsContent value="services" className="space-y-6">
            {/* Filters */}
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar servicios..."
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
                <option value="running">Ejecutándose</option>
                <option value="warning">Advertencias</option>
                <option value="error">Errores</option>
              </select>
            </div>

            {/* Services Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service) => {
                const Icon = service.icon
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Icon className={`h-6 w-6 ${service.color}`} />
                          <div>
                            <CardTitle className="text-lg">{service.name}</CardTitle>
                            <CardDescription className="text-sm">
                              {service.description}
                            </CardDescription>
                          </div>
                        </div>
                        {getStatusBadge(service.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Uptime:</span>
                          <span className="font-medium">{service.uptime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Último reinicio:</span>
                          <span className="font-medium">{service.lastRestart}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${getStatusColor(service.status)}`} />
                          <span className="text-sm capitalize">{service.status}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(service.id)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewLogs(service.id)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRestartService(service.id)}
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

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold">Logs del Sistema</h3>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar Logs
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              {logs.map((log) => (
                <Card key={log.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <Badge 
                          variant={log.level === 'ERROR' ? 'destructive' : log.level === 'WARN' ? 'secondary' : 'default'}
                          className={log.level === 'ERROR' ? 'bg-red-500' : log.level === 'WARN' ? 'bg-yellow-500' : 'bg-green-500'}
                        >
                          {log.level}
                        </Badge>
                        <span className="text-sm font-mono text-muted-foreground">{log.timestamp}</span>
                        <span className="text-sm font-medium">{log.service}</span>
                        <span className="text-sm">{log.message}</span>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="mt-2 text-sm text-muted-foreground">
                      {log.details}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="h-5 w-5" />
                    Uso de CPU
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>API Gateway</span>
                      <span className="font-medium">45%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>Lambda Functions</span>
                      <span className="font-medium">78%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{width: '78%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MemoryStick className="h-5 w-5" />
                    Uso de Memoria
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>DynamoDB</span>
                      <span className="font-medium">62%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{width: '62%'}}></div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>S3 Storage</span>
                      <span className="font-medium">34%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-orange-500 h-2 rounded-full" style={{width: '34%'}}></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="h-5 w-5" />
                    Seguridad del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>Firewall</span>
                    <Badge variant="default" className="bg-green-500">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>SSL/TLS</span>
                    <Badge variant="default" className="bg-green-500">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Autenticación</span>
                    <Badge variant="default" className="bg-green-500">Activo</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Encriptación</span>
                    <Badge variant="default" className="bg-green-500">Activo</Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Accesos Recientes
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span>Admin - 192.168.1.100</span>
                    <span className="text-muted-foreground">Hace 2 min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Ejecutivo - 192.168.1.105</span>
                    <span className="text-muted-foreground">Hace 5 min</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Admin - 192.168.1.100</span>
                    <span className="text-muted-foreground">Hace 10 min</span>
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
