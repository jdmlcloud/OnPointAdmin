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
  FileBarChart, 
  Download, 
  Plus,
  Search,
  Filter,
  Calendar,
  Eye,
  Share,
  RefreshCw,
  Clock,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  Users,
  DollarSign,
  FileText,
  BarChart3,
  PieChart,
  LineChart,
  Target,
  Activity
} from "lucide-react"

interface Report {
  id: string
  name: string
  description: string
  type: 'sales' | 'performance' | 'financial' | 'custom'
  status: 'generating' | 'ready' | 'scheduled' | 'failed'
  createdAt: string
  lastGenerated?: string
  nextScheduled?: string
  format: 'pdf' | 'excel' | 'csv'
  size: string
  downloadCount: number
  isScheduled: boolean
  scheduleFrequency?: 'daily' | 'weekly' | 'monthly'
}

interface ReportTemplate {
  id: string
  name: string
  description: string
  category: string
  icon: string
  isPopular: boolean
  estimatedTime: string
}

export default function ReportsPage() {
  const { isLoading, simulateAction } = useMicrointeractions()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedType, setSelectedType] = useState("all")
  
  const [reports, setReports] = useState<Report[]>([
    {
      id: "1",
      name: "Reporte de Ventas - Enero 2024",
      description: "Análisis completo de ventas del mes de enero",
      type: 'sales',
      status: 'ready',
      createdAt: "2024-01-31T23:59:00Z",
      lastGenerated: "2024-01-31T23:59:00Z",
      format: 'pdf',
      size: "2.4 MB",
      downloadCount: 15,
      isScheduled: false
    },
    {
      id: "2",
      name: "Performance de Equipo - Q1 2024",
      description: "Métricas de rendimiento del equipo de ventas",
      type: 'performance',
      status: 'generating',
      createdAt: "2024-01-15T10:30:00Z",
      format: 'excel',
      size: "1.8 MB",
      downloadCount: 8,
      isScheduled: true,
      scheduleFrequency: 'weekly',
      nextScheduled: "2024-02-05T09:00:00Z"
    },
    {
      id: "3",
      name: "Análisis Financiero - Diciembre 2023",
      description: "Reporte financiero mensual con análisis de costos",
      type: 'financial',
      status: 'ready',
      createdAt: "2023-12-31T23:59:00Z",
      lastGenerated: "2023-12-31T23:59:00Z",
      format: 'pdf',
      size: "3.2 MB",
      downloadCount: 23,
      isScheduled: true,
      scheduleFrequency: 'monthly',
      nextScheduled: "2024-01-31T23:59:00Z"
    },
    {
      id: "4",
      name: "Reporte Personalizado - Clientes VIP",
      description: "Análisis específico de clientes de alto valor",
      type: 'custom',
      status: 'failed',
      createdAt: "2024-01-20T14:15:00Z",
      format: 'csv',
      size: "0.8 MB",
      downloadCount: 3,
      isScheduled: false
    }
  ])

  const [templates] = useState<ReportTemplate[]>([
    {
      id: "1",
      name: "Reporte de Ventas",
      description: "Análisis completo de ventas con gráficos y tendencias",
      category: "Ventas",
      icon: "📊",
      isPopular: true,
      estimatedTime: "2-3 min"
    },
    {
      id: "2",
      name: "Performance de Equipo",
      description: "Métricas de rendimiento y productividad del equipo",
      category: "Recursos Humanos",
      icon: "👥",
      isPopular: true,
      estimatedTime: "1-2 min"
    },
    {
      id: "3",
      name: "Análisis Financiero",
      description: "Reporte financiero con análisis de costos e ingresos",
      category: "Finanzas",
      icon: "💰",
      isPopular: false,
      estimatedTime: "3-4 min"
    },
    {
      id: "4",
      name: "Reporte de Clientes",
      description: "Análisis de clientes, retención y satisfacción",
      category: "CRM",
      icon: "👤",
      isPopular: false,
      estimatedTime: "2-3 min"
    },
    {
      id: "5",
      name: "Reporte de Marketing",
      description: "Métricas de campañas y canales de marketing",
      category: "Marketing",
      icon: "📈",
      isPopular: false,
      estimatedTime: "1-2 min"
    },
    {
      id: "6",
      name: "Reporte Personalizado",
      description: "Crea tu propio reporte con métricas específicas",
      category: "Personalizado",
      icon: "⚙️",
      isPopular: false,
      estimatedTime: "5-10 min"
    }
  ])

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === "all" || report.type === selectedType
    return matchesSearch && matchesType
  })

  const getStatusColor = (status: Report['status']) => {
    switch (status) {
      case 'generating':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'scheduled':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: Report['status']) => {
    switch (status) {
      case 'generating':
        return 'Generando'
      case 'ready':
        return 'Listo'
      case 'scheduled':
        return 'Programado'
      case 'failed':
        return 'Fallido'
      default:
        return 'Desconocido'
    }
  }

  const getStatusIcon = (status: Report['status']) => {
    switch (status) {
      case 'generating':
        return <RefreshCw className="h-4 w-4 animate-spin" />
      case 'ready':
        return <CheckCircle className="h-4 w-4" />
      case 'scheduled':
        return <Clock className="h-4 w-4" />
      case 'failed':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <FileBarChart className="h-4 w-4" />
    }
  }

  const getTypeIcon = (type: Report['type']) => {
    switch (type) {
      case 'sales':
        return <TrendingUp className="h-4 w-4" />
      case 'performance':
        return <Users className="h-4 w-4" />
      case 'financial':
        return <DollarSign className="h-4 w-4" />
      case 'custom':
        return <FileText className="h-4 w-4" />
      default:
        return <FileBarChart className="h-4 w-4" />
    }
  }

  const handleGenerateReport = async (templateId: string) => {
    await simulateAction(
      'generate-report',
      async () => {
        // Simular generación de reporte
        await new Promise(resolve => setTimeout(resolve, 3000))
      },
      {
        successMessage: "Reporte generado exitosamente",
        notification: {
          type: 'success',
          title: 'Reporte Generado',
          message: 'El reporte se ha generado y está listo para descargar'
        }
      }
    )
  }

  const handleDownloadReport = async (reportId: string) => {
    await simulateAction(
      'download-report',
      async () => {
        // Simular descarga
        await new Promise(resolve => setTimeout(resolve, 1000))
      },
      {
        successMessage: "Descarga iniciada",
        notification: {
          type: 'info',
          title: 'Descarga Iniciada',
          message: 'El archivo se está descargando'
        }
      }
    )
  }

  const handleScheduleReport = async (reportId: string) => {
    await simulateAction(
      'schedule-report',
      async () => {
        // Simular programación
        await new Promise(resolve => setTimeout(resolve, 1500))
      },
      {
        successMessage: "Reporte programado exitosamente",
        notification: {
          type: 'success',
          title: 'Reporte Programado',
          message: 'El reporte se generará automáticamente según la frecuencia configurada'
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
            <h1 className="text-3xl font-bold">Reportes</h1>
            <p className="text-muted-foreground">
              Genera y gestiona reportes automáticos de tu negocio
            </p>
          </div>
          <AnimatedButton 
            loading={isLoading('create-report')}
            loadingText="Creando..."
            animation="pulse"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Reporte
          </AnimatedButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FileBarChart className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{reports.length}</p>
                  <p className="text-sm text-muted-foreground">Reportes Totales</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {reports.filter(r => r.status === 'ready').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Listos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {reports.filter(r => r.isScheduled).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Programados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Download className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {reports.reduce((sum, r) => sum + r.downloadCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Descargas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar reportes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant={selectedType === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("all")}
            >
              Todos
            </Button>
            <Button
              variant={selectedType === "sales" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("sales")}
            >
              Ventas
            </Button>
            <Button
              variant={selectedType === "performance" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("performance")}
            >
              Performance
            </Button>
            <Button
              variant={selectedType === "financial" ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedType("financial")}
            >
              Financiero
            </Button>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Templates Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Plantillas de Reportes</h2>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Nueva Plantilla
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="text-2xl">{template.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium">{template.name}</h3>
                        {template.isPopular && (
                          <Badge variant="secondary" className="text-xs">Popular</Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {template.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {template.estimatedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-3">
                    <AnimatedButton 
                      size="sm"
                      className="w-full"
                      loading={isLoading('generate-report')}
                      loadingText="Generando..."
                      onClick={() => handleGenerateReport(template.id)}
                      animation="pulse"
                    >
                      <FileBarChart className="h-4 w-4 mr-2" />
                      Generar Reporte
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Reports List */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Reportes Generados</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Programar
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredReports.map((report) => (
              <Card key={report.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        {getTypeIcon(report.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{report.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {report.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Creado: {new Date(report.createdAt).toLocaleDateString()}</span>
                          {report.lastGenerated && (
                            <span>Generado: {new Date(report.lastGenerated).toLocaleDateString()}</span>
                          )}
                          <span>Tamaño: {report.size}</span>
                          <span>Descargas: {report.downloadCount}</span>
                          {report.isScheduled && report.nextScheduled && (
                            <span>Próximo: {new Date(report.nextScheduled).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(report.status)}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(report.status)}
                          {getStatusText(report.status)}
                        </div>
                      </Badge>
                      
                      <div className="flex gap-2">
                        <AnimatedButton 
                          variant="outline" 
                          size="sm"
                          animation="pulse"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </AnimatedButton>
                        {report.status === 'ready' && (
                          <AnimatedButton 
                            size="sm"
                            loading={isLoading('download-report')}
                            loadingText="Descargando..."
                            onClick={() => handleDownloadReport(report.id)}
                            animation="pulse"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
                          </AnimatedButton>
                        )}
                        {!report.isScheduled && (
                          <AnimatedButton 
                            variant="outline" 
                            size="sm"
                            loading={isLoading('schedule-report')}
                            loadingText="Programando..."
                            onClick={() => handleScheduleReport(report.id)}
                            animation="pulse"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Programar
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
        </div>
      </div>
    </MainLayout>
  )
}
