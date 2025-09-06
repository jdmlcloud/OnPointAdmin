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
  Palette, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Download,
  Share,
  Settings,
  Save,
  Undo,
  Redo,
  Copy,
  Trash2,
  Move,
  Type,
  Image as ImageIcon,
  Shapes,
  Layers,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Zap,
  Wand2,
  Monitor,
  Smartphone,
  Tablet,
  Grid,
  Maximize,
  Minimize,
  RotateCcw,
  Lock,
  Unlock
} from "lucide-react"

interface DesignElement {
  id: string
  type: 'text' | 'image' | 'shape' | 'logo' | 'background'
  content: string
  x: number
  y: number
  width: number
  height: number
  rotation: number
  opacity: number
  locked: boolean
  layer: number
}

interface DesignProject {
  id: string
  name: string
  description: string
  thumbnail: string
  elements: DesignElement[]
  collaborators: Array<{
    id: string
    name: string
    email: string
    role: 'owner' | 'editor' | 'viewer'
    avatar: string
  }>
  lastModified: string
  version: number
  isPublic: boolean
  viewCount: number
  downloadCount: number
}

export default function EditorPage() {
  const { isLoading, simulateAction } = useMicrointeractions()
  const [projects, setProjects] = useState<DesignProject[]>([
    {
      id: "1",
      name: "Propuesta TechCorp - Q1 2024",
      description: "Diseño de propuesta comercial con branding corporativo",
      thumbnail: "/api/placeholder/300/200",
      elements: [
        {
          id: "1",
          type: 'text',
          content: 'Propuesta Comercial',
          x: 100,
          y: 50,
          width: 200,
          height: 40,
          rotation: 0,
          opacity: 1,
          locked: false,
          layer: 1
        },
        {
          id: "2",
          type: 'logo',
          content: 'TechCorp Logo',
          x: 50,
          y: 50,
          width: 80,
          height: 80,
          rotation: 0,
          opacity: 1,
          locked: true,
          layer: 2
        }
      ],
      collaborators: [
        {
          id: "1",
          name: "María González",
          email: "maria@onpoint.com",
          role: 'owner',
          avatar: "/api/placeholder/32/32"
        },
        {
          id: "2",
          name: "Carlos Rodríguez",
          email: "carlos@onpoint.com",
          role: 'editor',
          avatar: "/api/placeholder/32/32"
        }
      ],
      lastModified: "2024-01-20T14:30:00Z",
      version: 3,
      isPublic: false,
      viewCount: 45,
      downloadCount: 12
    },
    {
      id: "2",
      name: "Presentación Ejecutiva - Enero",
      description: "Slide deck para presentación a la junta directiva",
      thumbnail: "/api/placeholder/300/200",
      elements: [
        {
          id: "1",
          type: 'text',
          content: 'Resultados Q1 2024',
          x: 150,
          y: 100,
          width: 250,
          height: 50,
          rotation: 0,
          opacity: 1,
          locked: false,
          layer: 1
        }
      ],
      collaborators: [
        {
          id: "1",
          name: "María González",
          email: "maria@onpoint.com",
          role: 'owner',
          avatar: "/api/placeholder/32/32"
        }
      ],
      lastModified: "2024-01-19T10:15:00Z",
      version: 1,
      isPublic: true,
      viewCount: 23,
      downloadCount: 8
    }
  ])

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedView, setSelectedView] = useState<'grid' | 'list'>('grid')
  const [selectedProject, setSelectedProject] = useState<string | null>(null)

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleCreateProject = async () => {
    await simulateAction(
      'create-project',
      async () => {
        // Simular creación de proyecto
        await new Promise(resolve => setTimeout(resolve, 1500))
      },
      {
        successMessage: "Proyecto creado exitosamente",
        notification: {
          type: 'success',
          title: 'Proyecto Creado',
          message: 'El nuevo proyecto de diseño está listo para editar'
        }
      }
    )
  }

  const handleOpenEditor = async (projectId: string) => {
    await simulateAction(
      'open-editor',
      async () => {
        // Simular apertura del editor
        await new Promise(resolve => setTimeout(resolve, 1000))
        setSelectedProject(projectId)
      },
      {
        successMessage: "Editor abierto",
        notification: {
          type: 'info',
          title: 'Editor Abierto',
          message: 'El editor visual está cargando el proyecto'
        }
      }
    )
  }

  const handleExportProject = async (projectId: string, format: 'pdf' | 'png' | 'jpg') => {
    await simulateAction(
      'export-project',
      async () => {
        // Simular exportación
        await new Promise(resolve => setTimeout(resolve, 2000))
      },
      {
        successMessage: `Proyecto exportado como ${format.toUpperCase()}`,
        notification: {
          type: 'success',
          title: 'Exportación Completada',
          message: `El archivo ${format.toUpperCase()} se está descargando`
        }
      }
    )
  }

  const handleShareProject = async (projectId: string) => {
    await simulateAction(
      'share-project',
      async () => {
        // Simular compartir
        await new Promise(resolve => setTimeout(resolve, 800))
      },
      {
        successMessage: "Enlace de compartir generado",
        notification: {
          type: 'success',
          title: 'Enlace Generado',
          message: 'El enlace de compartir ha sido copiado al portapapeles'
        }
      }
    )
  }

  if (selectedProject) {
    const project = projects.find(p => p.id === selectedProject)
    if (!project) return null

    return (
      <MainLayout>
        <div className="h-screen flex flex-col">
          {/* Editor Header */}
          <div className="border-b bg-background p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedProject(null)}
                >
                  ← Volver
                </Button>
                <div>
                  <h1 className="text-lg font-semibold">{project.name}</h1>
                  <p className="text-sm text-muted-foreground">
                    Versión {project.version} • Última modificación: {new Date(project.lastModified).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Undo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Redo className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </Button>
                <Button size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Exportar
                </Button>
              </div>
            </div>
          </div>

          <div className="flex-1 flex">
            {/* Toolbar */}
            <div className="w-16 border-r bg-muted/30 flex flex-col items-center py-4 space-y-2">
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <Type className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <ImageIcon className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <Shapes className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <Palette className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="w-10 h-10 p-0">
                <Layers className="h-4 w-4" />
              </Button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 flex flex-col">
              {/* Canvas Toolbar */}
              <div className="border-b p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Monitor className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Tablet className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Smartphone className="h-4 w-4" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Maximize className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Canvas */}
              <div className="flex-1 bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-8">
                <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg w-full max-w-4xl aspect-[4/3] relative overflow-hidden">
                  {/* Canvas Content */}
                  <div className="absolute inset-0 p-8">
                    {project.elements.map((element) => (
                      <div
                        key={element.id}
                        className="absolute border-2 border-dashed border-transparent hover:border-blue-500 cursor-move"
                        style={{
                          left: element.x,
                          top: element.y,
                          width: element.width,
                          height: element.height,
                          transform: `rotate(${element.rotation}deg)`,
                          opacity: element.opacity
                        }}
                      >
                        {element.type === 'text' && (
                          <div className="w-full h-full flex items-center justify-center bg-blue-50 dark:bg-blue-950/20 rounded">
                            <span className="text-sm font-medium">{element.content}</span>
                          </div>
                        )}
                        {element.type === 'logo' && (
                          <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded">
                            <span className="text-xs">Logo</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  {/* Canvas Overlay */}
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary">
                      {project.elements.length} elementos
                    </Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            <div className="w-80 border-l bg-background p-4">
              <h3 className="font-semibold mb-4">Propiedades</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Posición X</label>
                  <Input type="number" defaultValue="100" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Posición Y</label>
                  <Input type="number" defaultValue="50" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Ancho</label>
                  <Input type="number" defaultValue="200" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Alto</label>
                  <Input type="number" defaultValue="40" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Rotación</label>
                  <Input type="number" defaultValue="0" className="mt-1" />
                </div>
                <div>
                  <label className="text-sm font-medium">Opacidad</label>
                  <Input type="range" min="0" max="1" step="0.1" defaultValue="1" className="mt-1" />
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <h4 className="font-medium mb-3">Colaboradores</h4>
                <div className="space-y-2">
                  {project.collaborators.map((collaborator) => (
                    <div key={collaborator.id} className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {collaborator.name.charAt(0)}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{collaborator.name}</p>
                        <p className="text-xs text-muted-foreground capitalize">
                          {collaborator.role}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {collaborator.role === 'owner' ? 'Propietario' : 
                         collaborator.role === 'editor' ? 'Editor' : 'Visualizador'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Editor Visual Avanzado</h1>
            <p className="text-muted-foreground">
              Crea diseños profesionales con colaboración en tiempo real
            </p>
          </div>
          <AnimatedButton 
            loading={isLoading('create-project')}
            loadingText="Creando..."
            onClick={handleCreateProject}
            animation="pulse"
          >
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proyecto
          </AnimatedButton>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Palette className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{projects.length}</p>
                  <p className="text-sm text-muted-foreground">Proyectos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {projects.reduce((sum, p) => sum + p.collaborators.length, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Colaboradores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Eye className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {projects.reduce((sum, p) => sum + p.viewCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Visualizaciones</p>
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
                    {projects.reduce((sum, p) => sum + p.downloadCount, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Descargas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Controls */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar proyectos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button 
              variant={selectedView === 'grid' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedView('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button 
              variant={selectedView === 'list' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setSelectedView('list')}
            >
              <Layers className="h-4 w-4" />
            </Button>
          </div>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <Palette className="h-12 w-12 text-muted-foreground" />
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{project.name}</CardTitle>
                    <CardDescription className="mt-1">
                      {project.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-1">
                    {project.isPublic && (
                      <Badge variant="secondary" className="text-xs">Público</Badge>
                    )}
                    <Badge variant="outline" className="text-xs">v{project.version}</Badge>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Elementos:</span>
                    <span className="font-medium">{project.elements.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Colaboradores:</span>
                    <span className="font-medium">{project.collaborators.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Última modificación:</span>
                    <span className="font-medium">
                      {new Date(project.lastModified).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4">
                  <AnimatedButton 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleOpenEditor(project.id)}
                    animation="pulse"
                  >
                    <Palette className="h-4 w-4 mr-2" />
                    Editar
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleShareProject(project.id)}
                    animation="pulse"
                  >
                    <Share className="h-4 w-4" />
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </MainLayout>
  )
}
