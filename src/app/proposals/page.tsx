"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Download,
  Share,
  Palette,
  Image as ImageIcon,
  Settings,
  CheckCircle,
  Clock,
  AlertCircle,
  Save,
  RefreshCw,
  Star,
  Target,
  Activity,
  BarChart3,
  TrendingUp,
  Users,
  Calendar,
  Zap,
  Wand2,
  Layers,
  Camera,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ActionModal } from "@/components/ui/action-modal"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { useCardActions } from "@/hooks/use-card-actions"

interface Proposal {
  id: string
  title: string
  description?: string
  quotationId: string
  status: 'draft' | 'generated' | 'sent' | 'viewed' | 'approved'
  template: string
  pdfUrl?: string
  createdAt: string
  updatedAt: string
  priority: 'high' | 'medium' | 'low'
  score: number
  aiAnalysis?: {
    designQuality: number
    visualAppeal: number
    brandConsistency: number
    mockupAccuracy: number
    suggestedImprovements: string[]
  }
  tags: string[]
  mockups: {
    id: string
    productId: string
    clientLogo?: string
    previewUrl?: string
    is3D: boolean
    views: number
  }[]
  analytics: {
    views: number
    timeSpent: number
    interactions: number
    conversionRate: number
  }
}

export default function ProposalsPage() {
  const { isLoading, createProposal, generateMockup, simulateAction } = useMicrointeractions()
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
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "P-2024-001",
      title: "Propuesta Tazas Personalizadas - Empresa ABC",
      description: "Propuesta completa con mockups 3D para 100 tazas personalizadas",
      quotationId: "Q-2024-001",
      status: "sent",
      template: "corporate",
      pdfUrl: "/proposals/P-2024-001.pdf",
      createdAt: "2024-01-15T10:00:00Z",
      updatedAt: "2024-01-15T10:30:00Z",
      priority: "high",
      score: 92,
      tags: ["3d_mockups", "corporate_branding", "high_quality"],
      aiAnalysis: {
        designQuality: 95,
        visualAppeal: 88,
        brandConsistency: 92,
        mockupAccuracy: 96,
        suggestedImprovements: [
          "Considerar agregar variaciones de color",
          "Incluir mockup en contexto de oficina"
        ]
      },
      analytics: {
        views: 15,
        timeSpent: 4.5,
        interactions: 8,
        conversionRate: 85
      },
      mockups: [
        {
          id: "M-001",
          productId: "PROD-001",
          clientLogo: "/logos/empresa-abc.png",
          previewUrl: "/mockups/m-001-preview.jpg",
          is3D: true,
          views: 12
        },
        {
          id: "M-002",
          productId: "PROD-001",
          clientLogo: "/logos/empresa-abc.png",
          previewUrl: "/mockups/m-002-preview.jpg",
          is3D: true,
          views: 8
        }
      ]
    },
    {
      id: "P-2024-002",
      title: "Propuesta Textiles - Startup XYZ",
      description: "Propuesta para camisetas y tazas con branding personalizado",
      quotationId: "Q-2024-002",
      status: "draft",
      template: "modern",
      createdAt: "2024-01-16T14:30:00Z",
      updatedAt: "2024-01-16T14:30:00Z",
      priority: "medium",
      score: 78,
      tags: ["startup_branding", "eco_friendly", "modern_design"],
      aiAnalysis: {
        designQuality: 82,
        visualAppeal: 85,
        brandConsistency: 75,
        mockupAccuracy: 80,
        suggestedImprovements: [
          "Mejorar contraste de colores",
          "Agregar más variaciones de productos"
        ]
      },
      analytics: {
        views: 3,
        timeSpent: 1.2,
        interactions: 2,
        conversionRate: 0
      },
      mockups: [
        {
          id: "M-003",
          productId: "PROD-002",
          clientLogo: "/logos/startup-xyz.png",
          previewUrl: "/mockups/m-003-preview.jpg",
          is3D: false,
          views: 2
        }
      ]
    },
    {
      id: "P-2024-003",
      title: "Propuesta Material Gráfico - Digital Agency",
      description: "Propuesta para tarjetas y flyers con diseño minimalista",
      quotationId: "Q-2024-003",
      status: "approved",
      template: "minimalist",
      pdfUrl: "/proposals/P-2024-003.pdf",
      createdAt: "2024-01-13T09:15:00Z",
      updatedAt: "2024-01-13T11:45:00Z",
      priority: "low",
      score: 96,
      tags: ["minimalist", "print_ready", "approved"],
      aiAnalysis: {
        designQuality: 98,
        visualAppeal: 94,
        brandConsistency: 97,
        mockupAccuracy: 95,
        suggestedImprovements: []
      },
      analytics: {
        views: 8,
        timeSpent: 3.2,
        interactions: 5,
        conversionRate: 100
      },
      mockups: [
        {
          id: "M-004",
          productId: "PROD-003",
          clientLogo: "/logos/digital-agency.png",
          previewUrl: "/mockups/m-004-preview.jpg",
          is3D: false,
          views: 6
        }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredProposals = proposals.filter(proposal => {
    const matchesSearch = proposal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         proposal.quotationId.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || proposal.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4 text-gray-500" />
      case 'generated':
        return <CheckCircle className="h-4 w-4 text-blue-500" />
      case 'sent':
        return <Share className="h-4 w-4 text-green-500" />
      case 'viewed':
        return <Eye className="h-4 w-4 text-purple-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Borrador'
      case 'generated':
        return 'Generada'
      case 'sent':
        return 'Enviada'
      case 'viewed':
        return 'Vista'
      default:
        return 'Desconocido'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'generated':
        return 'bg-blue-100 text-blue-800'
      case 'sent':
        return 'bg-green-100 text-green-800'
      case 'viewed':
        return 'bg-purple-100 text-purple-800'
      case 'approved':
        return 'bg-emerald-100 text-emerald-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const handleUseTemplate = async (templateId: string) => {
    await simulateAction(
      'use-template',
      async () => {
        // Simular uso de template
        await new Promise(resolve => setTimeout(resolve, 1500))
      },
      {
        successMessage: "Template aplicado exitosamente",
        notification: {
          type: 'success',
          title: 'Template Aplicado',
          message: 'El template se ha aplicado a tu propuesta'
        }
      }
    )
  }

  const handlePreviewTemplate = async (templateId: string) => {
    await simulateAction(
      'preview-template',
      async () => {
        // Simular preview
        await new Promise(resolve => setTimeout(resolve, 800))
      },
      {
        successMessage: "Preview generado",
        notification: {
          type: 'info',
          title: 'Preview Generado',
          message: 'El preview del template se está mostrando'
        }
      }
    )
  }

  const handleGenerateMockup3D = async (mockupId: string) => {
    await simulateAction(
      'generate-3d-mockup',
      async () => {
        // Simular generación de mockup 3D
        await new Promise(resolve => setTimeout(resolve, 3000))
      },
      {
        successMessage: "Mockup 3D generado exitosamente",
        notification: {
          type: 'success',
          title: 'Mockup 3D Generado',
          message: 'El mockup 3D está listo para visualizar'
        }
      }
    )
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const stats = {
    total: proposals.length,
    draft: proposals.filter(p => p.status === 'draft').length,
    generated: proposals.filter(p => p.status === 'generated').length,
    sent: proposals.filter(p => p.status === 'sent').length,
    viewed: proposals.filter(p => p.status === 'viewed').length,
    approved: proposals.filter(p => p.status === 'approved').length,
    avgScore: Math.round(proposals.reduce((sum, p) => sum + p.score, 0) / proposals.length),
    totalViews: proposals.reduce((sum, p) => sum + p.analytics.views, 0),
    avgConversionRate: Math.round(proposals.reduce((sum, p) => sum + p.analytics.conversionRate, 0) / proposals.length)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Diseño de Propuestas</h1>
            <p className="text-muted-foreground">
              Generación de mockups y diseño visual profesional
            </p>
          </div>
          <AnimatedButton 
            loading={isLoading('create-proposal')}
            loadingText="Generando..."
            onClick={createProposal}
            animation="pulse"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Propuesta
          </AnimatedButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Propuestas Totales</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                +8% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Score Promedio</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgScore}</div>
              <p className="text-xs text-muted-foreground">
                +5 puntos desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de Vistas</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews}</div>
              <p className="text-xs text-muted-foreground">
                +15% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.avgConversionRate}%</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="proposals" className="space-y-6">
          <TabsList>
            <TabsTrigger value="proposals">Propuestas</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="mockups">Mockups</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Proposals Tab */}
          <TabsContent value="proposals" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar propuestas..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">Todos los estados</option>
                <option value="draft">Borrador</option>
                <option value="generated">Generada</option>
                <option value="sent">Enviada</option>
                <option value="viewed">Vista</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Más Filtros
              </Button>
            </div>

            {/* Proposals List */}
            <div className="space-y-4">
              {filteredProposals.map((proposal) => (
                <Card key={proposal.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{proposal.title}</h3>
                            <Badge className={getPriorityColor(proposal.priority)}>
                              {proposal.priority}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              <span className={`font-semibold ${getScoreColor(proposal.score)}`}>
                                {proposal.score}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {proposal.description}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Cotización: {proposal.quotationId} • Template: {proposal.template}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(proposal.status)}
                        <Badge className={getStatusColor(proposal.status)}>
                          {getStatusText(proposal.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Mockups</p>
                        <p className="font-semibold">{proposal.mockups.length} mockup(s)</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Creada</p>
                        <p className="font-semibold">
                          {new Date(proposal.createdAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Actualizada</p>
                        <p className="font-semibold">
                          {new Date(proposal.updatedAt).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {proposal.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {proposal.mockups.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Mockups incluidos:</h4>
                        <div className="flex gap-2">
                          {proposal.mockups.map((mockup) => (
                            <div key={mockup.id} className="p-2 border rounded-lg">
                              <div className="w-16 h-16 bg-muted rounded flex items-center justify-center relative">
                                <ImageIcon className="h-6 w-6 text-muted-foreground" />
                                {mockup.is3D && (
                                  <div className="absolute top-1 right-1">
                                    <Badge variant="outline" className="text-xs">3D</Badge>
                                  </div>
                                )}
                              </div>
                              <p className="text-xs text-center mt-1">Mockup {mockup.id}</p>
                              <p className="text-xs text-center text-muted-foreground">{mockup.views} vistas</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {proposal.aiAnalysis && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium">Análisis de Diseño IA</span>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-3">
                          <div>
                            <span className="font-medium">Calidad de Diseño:</span>
                            <p className="text-muted-foreground">{proposal.aiAnalysis.designQuality}%</p>
                          </div>
                          <div>
                            <span className="font-medium">Atractivo Visual:</span>
                            <p className="text-muted-foreground">{proposal.aiAnalysis.visualAppeal}%</p>
                          </div>
                          <div>
                            <span className="font-medium">Consistencia de Marca:</span>
                            <p className="text-muted-foreground">{proposal.aiAnalysis.brandConsistency}%</p>
                          </div>
                          <div>
                            <span className="font-medium">Precisión de Mockup:</span>
                            <p className="text-muted-foreground">{proposal.aiAnalysis.mockupAccuracy}%</p>
                          </div>
                        </div>
                        
                        {proposal.aiAnalysis.suggestedImprovements.length > 0 && (
                          <div className="p-3 bg-white dark:bg-gray-800 rounded border">
                            <h5 className="font-medium mb-2">Mejoras Sugeridas:</h5>
                            <ul className="text-sm text-muted-foreground space-y-1">
                              {proposal.aiAnalysis.suggestedImprovements.map((improvement, index) => (
                                <li key={index}>• {improvement}</li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Vistas:</span>
                        <p className="font-semibold">{proposal.analytics.views}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Tiempo Promedio:</span>
                        <p className="font-semibold">{proposal.analytics.timeSpent} min</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Interacciones:</span>
                        <p className="font-semibold">{proposal.analytics.interactions}</p>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Conversión:</span>
                        <p className="font-semibold">{proposal.analytics.conversionRate}%</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <AnimatedButton variant="outline" size="sm" animation="pulse">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </AnimatedButton>
                      {proposal.status === 'draft' && (
                        <AnimatedButton variant="outline" size="sm" animation="pulse">
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </AnimatedButton>
                      )}
                      {proposal.status === 'draft' && proposal.mockups.length === 0 && (
                        <AnimatedButton 
                          size="sm"
                          loading={isLoading(`generate-mockup-${proposal.id}`)}
                          loadingText="Generando..."
                          onClick={() => generateMockup(proposal.id)}
                          animation="bounce"
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          Generar Mockup
                        </AnimatedButton>
                      )}
                      {proposal.pdfUrl && (
                        <AnimatedButton variant="outline" size="sm" animation="pulse">
                          <Download className="h-4 w-4 mr-2" />
                          PDF
                        </AnimatedButton>
                      )}
                      <AnimatedButton variant="outline" size="sm" animation="pulse">
                        <Share className="h-4 w-4 mr-2" />
                        Compartir
                      </AnimatedButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredProposals.length === 0 && (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay propuestas</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No se encontraron propuestas con ese criterio de búsqueda." : "Las propuestas aparecerán aquí."}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg mb-4 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Template Corporativo</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Diseño profesional para empresas grandes
                  </p>
                  <div className="flex gap-2">
                    <AnimatedButton 
                      size="sm" 
                      className="flex-1"
                      loading={isLoading('use-template')}
                      loadingText="Aplicando..."
                      onClick={() => handleUseTemplate('template')}
                      animation="pulse"
                    >
                      Usar Template
                    </AnimatedButton>
                    <AnimatedButton 
                      variant="outline" 
                      size="sm"
                      loading={isLoading('preview-template')}
                      loadingText="Cargando..."
                      onClick={() => handlePreviewTemplate('template')}
                      animation="pulse"
                    >
                      <Eye className="h-4 w-4" />
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-500 to-green-600 rounded-lg mb-4 flex items-center justify-center">
                    <Palette className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Template Moderno</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Diseño contemporáneo para startups
                  </p>
                  <div className="flex gap-2">
                    <AnimatedButton 
                      size="sm" 
                      className="flex-1"
                      loading={isLoading('use-template')}
                      loadingText="Aplicando..."
                      onClick={() => handleUseTemplate('template')}
                      animation="pulse"
                    >
                      Usar Template
                    </AnimatedButton>
                    <AnimatedButton 
                      variant="outline" 
                      size="sm"
                      loading={isLoading('preview-template')}
                      loadingText="Cargando..."
                      onClick={() => handlePreviewTemplate('template')}
                      animation="pulse"
                    >
                      <Eye className="h-4 w-4" />
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg mb-4 flex items-center justify-center">
                    <ImageIcon className="h-12 w-12 text-white" />
                  </div>
                  <h3 className="font-semibold mb-2">Template Minimalista</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Diseño limpio y elegante
                  </p>
                  <div className="flex gap-2">
                    <AnimatedButton 
                      size="sm" 
                      className="flex-1"
                      loading={isLoading('use-template')}
                      loadingText="Aplicando..."
                      onClick={() => handleUseTemplate('template')}
                      animation="pulse"
                    >
                      Usar Template
                    </AnimatedButton>
                    <AnimatedButton 
                      variant="outline" 
                      size="sm"
                      loading={isLoading('preview-template')}
                      loadingText="Cargando..."
                      onClick={() => handlePreviewTemplate('template')}
                      animation="pulse"
                    >
                      <Eye className="h-4 w-4" />
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Mockups Tab */}
          <TabsContent value="mockups" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Biblioteca de Mockups</CardTitle>
                <CardDescription>
                  Gestión de mockups 3D y aplicaciones de logos
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Editor de Mockups</h3>
                  <p className="text-muted-foreground mb-4">
                    El editor visual avanzado estará disponible en la versión V7
                  </p>
                  <AnimatedButton 
                    loading={isLoading('generate-3d-mockup')}
                    loadingText="Generando..."
                    onClick={() => handleGenerateMockup3D('new')}
                    animation="pulse"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Crear Mockup
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Rendimiento de Propuestas</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Aprobadas</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(stats.approved / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stats.approved}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enviadas</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full" 
                            style={{ width: `${(stats.sent / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stats.sent}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Vistas</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-purple-500 h-2 rounded-full" 
                            style={{ width: `${(stats.viewed / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stats.viewed}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Borradores</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div 
                            className="bg-gray-500 h-2 rounded-full" 
                            style={{ width: `${(stats.draft / stats.total) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{stats.draft}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Métricas de Engagement</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Tasa de Conversión Promedio</span>
                      <span className="font-semibold">{stats.avgConversionRate}%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total de Vistas</span>
                      <span className="font-semibold">{stats.totalViews}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Score Promedio</span>
                      <span className="font-semibold">{stats.avgScore}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Propuestas Totales</span>
                      <span className="font-semibold">{stats.total}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Análisis de Templates
                </CardTitle>
                <CardDescription>
                  Rendimiento por tipo de template utilizado
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">Corporate</div>
                    <div className="text-sm text-muted-foreground">Template más usado</div>
                    <div className="text-xs text-muted-foreground mt-1">45% de aprobación</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-green-600">Modern</div>
                    <div className="text-sm text-muted-foreground">Para startups</div>
                    <div className="text-xs text-muted-foreground mt-1">38% de aprobación</div>
                  </div>
                  <div className="text-center p-4 bg-muted rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">Minimalist</div>
                    <div className="text-sm text-muted-foreground">Diseño limpio</div>
                    <div className="text-xs text-muted-foreground mt-1">52% de aprobación</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configuración de Diseño</CardTitle>
                <CardDescription>
                  Ajusta los parámetros del generador de propuestas
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Configuración de PDF</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">Calidad de imagen</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option value="high">Alta (300 DPI)</option>
                          <option value="medium">Media (150 DPI)</option>
                          <option value="low">Baja (72 DPI)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-sm">Formato de página</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option value="a4">A4</option>
                          <option value="letter">Letter</option>
                          <option value="legal">Legal</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Branding por Defecto</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">Color primario</label>
                        <input type="color" defaultValue="#10B981" className="w-full h-10 border rounded-md" />
                      </div>
                      <div>
                        <label className="text-sm">Color secundario</label>
                        <input type="color" defaultValue="#000000" className="w-full h-10 border rounded-md" />
                      </div>
                      <div>
                        <label className="text-sm">Fuente</label>
                        <select className="w-full px-3 py-2 border rounded-md">
                          <option value="inter">Inter</option>
                          <option value="roboto">Roboto</option>
                          <option value="opensans">Open Sans</option>
                        </select>
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
    </MainLayout>
  )
}
