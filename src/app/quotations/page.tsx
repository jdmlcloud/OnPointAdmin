"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  TrendingUp, 
  Plus, 
  Search, 
  Filter,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Users,
  Calendar,
  Eye,
  Edit,
  Send,
  Download,
  Star,
  Target,
  Activity,
  BarChart3,
  Save,
  RefreshCw
} from "lucide-react"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ActionModal } from "@/components/ui/action-modal"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { useCardActions } from "@/hooks/use-card-actions"

interface Quotation {
  id: string
  clientName: string
  clientEmail: string
  status: 'draft' | 'sent' | 'accepted' | 'rejected' | 'expired'
  totalAmount: number
  currency: string
  validUntil: string
  createdAt: string
  priority: 'high' | 'medium' | 'low'
  score: number
  aiAnalysis?: {
    winProbability: number
    riskLevel: 'low' | 'medium' | 'high'
    suggestedDiscount: number
    clientProfile: string
    urgency: string
    decisionMaker: string
  }
  tags: string[]
  items: {
    productName: string
    quantity: number
    unitPrice: number
    totalPrice: number
  }[]
}

export default function QuotationsPage() {
  const { isLoading, createQuotation, approveQuotation } = useMicrointeractions()
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
  const [quotations, setQuotations] = useState<Quotation[]>([
    {
      id: "Q-2024-001",
      clientName: "Empresa ABC S.A.",
      clientEmail: "compras@empresaabc.com",
      status: "sent",
      totalAmount: 2550.00,
      currency: "USD",
      validUntil: "2024-02-15T23:59:59Z",
      createdAt: "2024-01-15T10:00:00Z",
      priority: "high",
      score: 85,
      tags: ["hot_lead", "corporate_client", "confirmed_budget"],
      aiAnalysis: {
        winProbability: 85,
        riskLevel: "low",
        suggestedDiscount: 5,
        clientProfile: "Empresa establecida con historial de compras",
        urgency: "Alta - Necesita productos para evento corporativo",
        decisionMaker: "María González - Gerente de Compras"
      },
      items: [
        {
          productName: "Taza Personalizada",
          quantity: 100,
          unitPrice: 25.50,
          totalPrice: 2550.00
        }
      ]
    },
    {
      id: "Q-2024-002",
      clientName: "Startup XYZ",
      clientEmail: "admin@startupxyz.com",
      status: "draft",
      totalAmount: 1200.00,
      currency: "USD",
      validUntil: "2024-02-20T23:59:59Z",
      createdAt: "2024-01-16T14:30:00Z",
      priority: "medium",
      score: 72,
      tags: ["startup", "budget_pending", "eco_friendly"],
      aiAnalysis: {
        winProbability: 72,
        riskLevel: "medium",
        suggestedDiscount: 10,
        clientProfile: "Startup en crecimiento con presupuesto limitado",
        urgency: "Media - Proyecto de marketing sostenible",
        decisionMaker: "Carlos Rodríguez - Fundador"
      },
      items: [
        {
          productName: "Camiseta Algodón",
          quantity: 50,
          unitPrice: 12.00,
          totalPrice: 600.00
        },
        {
          productName: "Taza Personalizada",
          quantity: 30,
          unitPrice: 20.00,
          totalPrice: 600.00
        }
      ]
    },
    {
      id: "Q-2024-003",
      clientName: "Digital Agency Pro",
      clientEmail: "ana@digitalagency.com",
      status: "accepted",
      totalAmount: 2000.00,
      currency: "USD",
      validUntil: "2024-02-10T23:59:59Z",
      createdAt: "2024-01-13T09:15:00Z",
      priority: "low",
      score: 95,
      tags: ["recurring_client", "standard_order", "immediate_payment"],
      aiAnalysis: {
        winProbability: 95,
        riskLevel: "low",
        suggestedDiscount: 0,
        clientProfile: "Cliente recurrente con excelente historial",
        urgency: "Baja - Pedido estándar",
        decisionMaker: "Ana Martínez - Directora Creativa"
      },
      items: [
        {
          productName: "Tarjetas de Presentación",
          quantity: 1000,
          unitPrice: 0.5,
          totalPrice: 500.00
        },
        {
          productName: "Flyers Promocionales",
          quantity: 5000,
          unitPrice: 0.3,
          totalPrice: 1500.00
        }
      ]
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState<string>("all")

  const filteredQuotations = quotations.filter(quotation => {
    const matchesSearch = quotation.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         quotation.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === "all" || quotation.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Edit className="h-4 w-4 text-gray-500" />
      case 'sent':
        return <Send className="h-4 w-4 text-blue-500" />
      case 'accepted':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'expired':
        return <AlertCircle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Borrador'
      case 'sent':
        return 'Enviada'
      case 'accepted':
        return 'Aceptada'
      case 'rejected':
        return 'Rechazada'
      case 'expired':
        return 'Expirada'
      default:
        return 'Desconocido'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800'
      case 'sent':
        return 'bg-blue-100 text-blue-800'
      case 'accepted':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'expired':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
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
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const stats = {
    total: quotations.length,
    draft: quotations.filter(q => q.status === 'draft').length,
    sent: quotations.filter(q => q.status === 'sent').length,
    accepted: quotations.filter(q => q.status === 'accepted').length,
    totalValue: quotations.reduce((sum, q) => sum + q.totalAmount, 0),
    avgScore: Math.round(quotations.reduce((sum, q) => sum + q.score, 0) / quotations.length),
    highPriority: quotations.filter(q => q.priority === 'high').length,
    winRate: Math.round((quotations.filter(q => q.status === 'accepted').length / quotations.length) * 100)
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Cotizaciones Inteligentes</h1>
            <p className="text-muted-foreground">
              Sistema de recomendación y cotizador automático
            </p>
          </div>
          <AnimatedButton 
            loading={isLoading('create-quotation')}
            loadingText="Creando..."
            onClick={createQuotation}
            animation="pulse"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Cotización
          </AnimatedButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cotizaciones Totales</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <p className="text-xs text-muted-foreground">
                +12% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${stats.totalValue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                +8% desde el mes pasado
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tasa de Éxito</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.winRate}%</div>
              <p className="text-xs text-muted-foreground">
                +5% desde el mes pasado
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
                +3 puntos desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="quotations" className="space-y-6">
          <TabsList>
            <TabsTrigger value="quotations">Cotizaciones</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="scoring">Scoring IA</TabsTrigger>
            <TabsTrigger value="settings">Configuración</TabsTrigger>
          </TabsList>

          {/* Quotations Tab */}
          <TabsContent value="quotations" className="space-y-6">
            {/* Search and Filters */}
            <div className="flex gap-4 items-center">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Buscar cotizaciones..."
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
                <option value="sent">Enviada</option>
                <option value="accepted">Aceptada</option>
                <option value="rejected">Rechazada</option>
                <option value="expired">Expirada</option>
              </select>
              <Button variant="outline">
                <Filter className="h-4 w-4 mr-2" />
                Más Filtros
              </Button>
            </div>

            {/* Quotations List */}
            <div className="space-y-4">
              {filteredQuotations.map((quotation) => (
                <Card key={quotation.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-full bg-primary/10">
                          <TrendingUp className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{quotation.id}</h3>
                            <Badge className={getPriorityColor(quotation.priority)}>
                              {quotation.priority}
                            </Badge>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4" />
                              <span className={`font-semibold ${getScoreColor(quotation.score)}`}>
                                {quotation.score}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {quotation.clientName} • {quotation.clientEmail}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(quotation.status)}
                        <Badge className={getStatusColor(quotation.status)}>
                          {getStatusText(quotation.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Valor Total</p>
                        <p className="font-semibold">${quotation.totalAmount.toLocaleString()} {quotation.currency}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Productos</p>
                        <p className="font-semibold">{quotation.items.length} item(s)</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Válida hasta</p>
                        <p className="font-semibold">
                          {new Date(quotation.validUntil).toLocaleDateString('es-ES')}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium mb-2">Productos incluidos:</h4>
                      <div className="space-y-1">
                        {quotation.items.map((item, index) => (
                          <div key={index} className="flex justify-between text-sm">
                            <span>{item.productName} x{item.quantity}</span>
                            <span>${item.totalPrice.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {quotation.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {quotation.aiAnalysis && (
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg mb-4">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                          <span className="text-sm font-medium">Análisis de IA</span>
                          <Badge variant="outline" className="text-xs">
                            {quotation.aiAnalysis.winProbability}% probabilidad de éxito
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="font-medium">Perfil del Cliente:</span>
                            <p className="text-muted-foreground">{quotation.aiAnalysis.clientProfile}</p>
                          </div>
                          <div>
                            <span className="font-medium">Urgencia:</span>
                            <p className="text-muted-foreground">{quotation.aiAnalysis.urgency}</p>
                          </div>
                          <div>
                            <span className="font-medium">Tomador de Decisiones:</span>
                            <p className="text-muted-foreground">{quotation.aiAnalysis.decisionMaker}</p>
                          </div>
                          <div>
                            <span className="font-medium">Nivel de Riesgo:</span>
                            <Badge variant={quotation.aiAnalysis.riskLevel === "low" ? "default" : "destructive"}>
                              {quotation.aiAnalysis.riskLevel}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="mt-3 p-3 bg-white dark:bg-gray-800 rounded border">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Descuento Sugerido:</span>
                            <span className="font-semibold">{quotation.aiAnalysis.suggestedDiscount}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex gap-2">
                      <AnimatedButton 
                        variant="outline" 
                        size="sm" 
                        animation="pulse"
                        onClick={() => handleView(quotation)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </AnimatedButton>
                      {quotation.status === 'draft' && (
                        <AnimatedButton 
                          variant="outline" 
                          size="sm" 
                          animation="pulse"
                          onClick={() => handleEdit(quotation)}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          Editar
                        </AnimatedButton>
                      )}
                      {quotation.status === 'draft' && (
                        <AnimatedButton 
                          size="sm"
                          loading={isLoading(`send-quotation-${quotation.id}`)}
                          loadingText="Enviando..."
                          animation="pulse"
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar
                        </AnimatedButton>
                      )}
                      {quotation.status === 'sent' && (
                        <AnimatedButton 
                          size="sm"
                          loading={isLoading(`approve-quotation-${quotation.id}`)}
                          loadingText="Aprobando..."
                          onClick={() => approveQuotation(quotation.id)}
                          animation="bounce"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Aprobar
                        </AnimatedButton>
                      )}
                      <AnimatedButton 
                        variant="outline" 
                        size="sm" 
                        animation="pulse"
                        onClick={() => handleDownload(quotation)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        PDF
                      </AnimatedButton>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredQuotations.length === 0 && (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay cotizaciones</h3>
                <p className="text-muted-foreground">
                  {searchTerm ? "No se encontraron cotizaciones con ese criterio de búsqueda." : "Las cotizaciones aparecerán aquí."}
                </p>
              </div>
            )}
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Conversión por Estado</CardTitle>
                  <CardDescription>
                    Distribución de cotizaciones por estado
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Enviadas</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                        </div>
                        <span className="text-sm font-medium">40%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Aceptadas</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-green-500 h-2 rounded-full" style={{ width: '25%' }}></div>
                        </div>
                        <span className="text-sm font-medium">25%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Rechazadas</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-red-500 h-2 rounded-full" style={{ width: '20%' }}></div>
                        </div>
                        <span className="text-sm font-medium">20%</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Expiradas</span>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-muted rounded-full h-2">
                          <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                        </div>
                        <span className="text-sm font-medium">15%</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Valor por Mes</CardTitle>
                  <CardDescription>
                    Evolución del valor de cotizaciones
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <TrendingUp className="h-12 w-12 mx-auto mb-2" />
                      <p>Gráfico de valor mensual</p>
                      <p className="text-sm">(Integrar con Chart.js)</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Scoring IA Tab */}
          <TabsContent value="scoring" className="space-y-4">
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Sistema de Scoring Inteligente
                  </CardTitle>
                  <CardDescription>
                    Análisis automático de factores que influyen en la probabilidad de éxito
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-3">Factores de Scoring</h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Historial del Cliente</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                              </div>
                              <span className="text-sm font-medium">85%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Urgencia del Pedido</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                              </div>
                              <span className="text-sm font-medium">70%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Presupuesto Confirmado</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                              </div>
                              <span className="text-sm font-medium">90%</span>
                            </div>
                          </div>
                          
                          <div className="flex justify-between items-center">
                            <span className="text-sm">Tamaño del Pedido</span>
                            <div className="flex items-center gap-2">
                              <div className="w-20 bg-muted rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                              </div>
                              <span className="text-sm font-medium">75%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h4 className="font-semibold mb-3">Recomendaciones IA</h4>
                        <div className="space-y-3">
                          <div className="p-3 bg-green-50 dark:bg-green-950/50 border border-green-200 dark:border-green-800 rounded-lg">
                            <h5 className="font-medium text-green-900 dark:text-green-100 mb-1">✅ Acción Recomendada</h5>
                            <p className="text-sm text-green-700 dark:text-green-300">Contactar inmediatamente - Cliente de alto valor</p>
                          </div>
                          
                          <div className="p-3 bg-yellow-50 dark:bg-yellow-950/50 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <h5 className="font-medium text-yellow-900 dark:text-yellow-100 mb-1">⚠️ Seguimiento</h5>
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">Programar llamada de seguimiento en 24 horas</p>
                          </div>
                          
                          <div className="p-3 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800 rounded-lg">
                            <h5 className="font-medium text-blue-900 dark:text-blue-100 mb-1">💡 Oportunidad</h5>
                            <p className="text-sm text-blue-700 dark:text-blue-300">Ofrecer descuento del 5% para cerrar rápido</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-semibold mb-3">Insights de IA</h4>
                      <div className="grid gap-4 md:grid-cols-3">
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-green-600">23</div>
                          <div className="text-sm text-muted-foreground">Leads Calientes</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">$45K</div>
                          <div className="text-sm text-muted-foreground">Valor en Pipeline</div>
                        </div>
                        <div className="text-center p-3 bg-muted rounded-lg">
                          <div className="text-2xl font-bold text-purple-600">78%</div>
                          <div className="text-sm text-muted-foreground">Precisión del Modelo</div>
                        </div>
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
                <CardTitle>Configuración del Cotizador</CardTitle>
                <CardDescription>
                  Ajusta los parámetros del sistema de cotización inteligente
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Algoritmo de Scoring</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">Precio (30%)</label>
                        <input type="range" min="0" max="100" defaultValue="30" className="w-full" />
                      </div>
                      <div>
                        <label className="text-sm">Calidad (25%)</label>
                        <input type="range" min="0" max="100" defaultValue="25" className="w-full" />
                      </div>
                      <div>
                        <label className="text-sm">Stock (20%)</label>
                        <input type="range" min="0" max="100" defaultValue="20" className="w-full" />
                      </div>
                      <div>
                        <label className="text-sm">Tiempo de entrega (15%)</label>
                        <input type="range" min="0" max="100" defaultValue="15" className="w-full" />
                      </div>
                      <div>
                        <label className="text-sm">Relación comercial (10%)</label>
                        <input type="range" min="0" max="100" defaultValue="10" className="w-full" />
                      </div>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h4 className="font-medium">Configuración de Precios</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="text-sm">Margen por defecto (%)</label>
                        <input type="number" defaultValue="25" className="w-full px-3 py-2 border rounded-md" />
                      </div>
                      <div>
                        <label className="text-sm">Descuento por volumen (%)</label>
                        <input type="number" defaultValue="5" className="w-full px-3 py-2 border rounded-md" />
                      </div>
                      <div>
                        <label className="text-sm">Días de validez</label>
                        <input type="number" defaultValue="30" className="w-full px-3 py-2 border rounded-md" />
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
