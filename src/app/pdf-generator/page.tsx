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
  FileText, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Download,
  Share,
  Settings,
  Palette,
  Type,
  Image as ImageIcon,
  Layout,
  Save,
  RefreshCw,
  FileBarChart,
  Zap,
  Wand2,
  Monitor,
  Smartphone,
  Tablet
} from "lucide-react"

interface PDFTemplate {
  id: string
  name: string
  description: string
  category: string
  thumbnail: string
  isActive: boolean
  createdAt: string
  usageCount: number
  lastUsed?: string
}

interface PDFDocument {
  id: string
  title: string
  templateId: string
  templateName: string
  status: 'draft' | 'generating' | 'ready' | 'sent'
  createdAt: string
  lastModified: string
  downloadUrl?: string
  shareUrl?: string
  viewCount: number
  downloadCount: number
}

export default function PDFGeneratorPage() {
  const { isLoading, simulateAction } = useMicrointeractions()
  const [templates, setTemplates] = useState<PDFTemplate[]>([
    {
      id: "1",
      name: "Propuesta Comercial Estándar",
      description: "Plantilla profesional para propuestas comerciales con branding personalizable",
      category: "Comercial",
      thumbnail: "/api/placeholder/300/200",
      isActive: true,
      createdAt: "2024-01-15",
      usageCount: 45,
      lastUsed: "2024-01-20"
    },
    {
      id: "2", 
      name: "Cotización Técnica",
      description: "Plantilla detallada para cotizaciones técnicas con especificaciones",
      category: "Técnico",
      thumbnail: "/api/placeholder/300/200",
      isActive: true,
      createdAt: "2024-01-10",
      usageCount: 32,
      lastUsed: "2024-01-19"
    },
    {
      id: "3",
      name: "Presentación Ejecutiva",
      description: "Plantilla moderna para presentaciones ejecutivas y reportes",
      category: "Ejecutivo",
      thumbnail: "/api/placeholder/300/200",
      isActive: true,
      createdAt: "2024-01-05",
      usageCount: 28,
      lastUsed: "2024-01-18"
    }
  ])

  const [documents, setDocuments] = useState<PDFDocument[]>([
    {
      id: "1",
      title: "Propuesta TechCorp Solutions - Q1 2024",
      templateId: "1",
      templateName: "Propuesta Comercial Estándar",
      status: 'ready',
      createdAt: "2024-01-20",
      lastModified: "2024-01-20",
      downloadUrl: "#",
      shareUrl: "#",
      viewCount: 12,
      downloadCount: 3
    },
    {
      id: "2",
      title: "Cotización Técnica - Proyecto Alpha",
      templateId: "2", 
      templateName: "Cotización Técnica",
      status: 'generating',
      createdAt: "2024-01-19",
      lastModified: "2024-01-19",
      viewCount: 5,
      downloadCount: 0
    },
    {
      id: "3",
      title: "Reporte Ejecutivo - Enero 2024",
      templateId: "3",
      templateName: "Presentación Ejecutiva", 
      status: 'draft',
      createdAt: "2024-01-18",
      lastModified: "2024-01-18",
      viewCount: 2,
      downloadCount: 0
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.templateName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: PDFDocument['status']) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'generating':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      case 'ready':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'sent':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: PDFDocument['status']) => {
    switch (status) {
      case 'draft':
        return 'Borrador'
      case 'generating':
        return 'Generando'
      case 'ready':
        return 'Listo'
      case 'sent':
        return 'Enviado'
      default:
        return 'Desconocido'
    }
  }

  const handleGeneratePDF = async (templateId: string) => {
    await simulateAction(
      'generate-pdf',
      async () => {
        // Simular generación de PDF
        await new Promise(resolve => setTimeout(resolve, 2000))
      },
      {
        successMessage: "PDF generado exitosamente",
        notification: {
          type: 'success',
          title: 'PDF Generado',
          message: 'El documento PDF ha sido creado y está listo para descargar'
        }
      }
    )
  }

  const handleDownloadPDF = async (documentId: string) => {
    await simulateAction(
      'download-pdf',
      async () => {
        // Simular descarga
        await new Promise(resolve => setTimeout(resolve, 1000))
      },
      {
        successMessage: "Descarga iniciada",
        notification: {
          type: 'info',
          title: 'Descarga Iniciada',
          message: 'El archivo PDF se está descargando'
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
            <h1 className="text-3xl font-bold">Generador de PDFs</h1>
            <p className="text-muted-foreground">
              Crea documentos profesionales con plantillas responsive
            </p>
          </div>
          <AnimatedButton 
            loading={isLoading('create-template')}
            loadingText="Creando..."
            animation="pulse"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nueva Plantilla
          </AnimatedButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{templates.length}</p>
                  <p className="text-sm text-muted-foreground">Plantillas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FileBarChart className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">{documents.length}</p>
                  <p className="text-sm text-muted-foreground">Documentos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Download className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {documents.reduce((sum, doc) => sum + doc.downloadCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Descargas</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {documents.reduce((sum, doc) => sum + doc.viewCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Visualizaciones</p>
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
              placeholder="Buscar plantillas y documentos..."
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

        {/* Templates Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Plantillas Disponibles</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Layout className="h-4 w-4 mr-2" />
                Vista
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configurar
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((template) => (
              <Card key={template.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{template.name}</CardTitle>
                      <CardDescription className="mt-1">
                        {template.description}
                      </CardDescription>
                    </div>
                    <Badge variant="outline">{template.category}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Usos:</span>
                      <span className="font-medium">{template.usageCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Último uso:</span>
                      <span className="font-medium">
                        {template.lastUsed ? new Date(template.lastUsed).toLocaleDateString() : 'Nunca'}
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <AnimatedButton 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      animation="pulse"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Vista Previa
                    </AnimatedButton>
                    <AnimatedButton 
                      size="sm"
                      className="flex-1"
                      loading={isLoading('generate-pdf')}
                      loadingText="Generando..."
                      onClick={() => handleGeneratePDF(template.id)}
                      animation="pulse"
                    >
                      <Wand2 className="h-4 w-4 mr-2" />
                      Usar
                    </AnimatedButton>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Documents Section */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Documentos Recientes</h2>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <RefreshCw className="h-4 w-4 mr-2" />
                Actualizar
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4 mr-2" />
                Compartir
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {filteredDocuments.map((document) => (
              <Card key={document.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{document.title}</h3>
                        <p className="text-sm text-muted-foreground">
                          Plantilla: {document.templateName}
                        </p>
                        <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                          <span>Creado: {new Date(document.createdAt).toLocaleDateString()}</span>
                          <span>Modificado: {new Date(document.lastModified).toLocaleDateString()}</span>
                          <span>Vistas: {document.viewCount}</span>
                          <span>Descargas: {document.downloadCount}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusColor(document.status)}>
                        {getStatusText(document.status)}
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
                        {document.status === 'ready' && (
                          <AnimatedButton 
                            size="sm"
                            loading={isLoading('download-pdf')}
                            loadingText="Descargando..."
                            onClick={() => handleDownloadPDF(document.id)}
                            animation="pulse"
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Descargar
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
