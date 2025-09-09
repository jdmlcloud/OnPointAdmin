"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ActionModal } from "@/components/ui/action-modal"
import { useCardActions } from "@/hooks/use-card-actions"
import { useLogos } from "@/hooks/use-logos"
import { LogoListSkeleton } from "@/components/ui/logo-skeleton"
import { 
  Plus, 
  Search, 
  Filter,
  Image,
  Download,
  Upload,
  Edit,
  Trash2,
  Eye,
  Share,
  Tag,
  Calendar,
  FileText,
  Palette,
  Layers,
  Building2,
  ArrowLeft,
  Star
} from "lucide-react"

interface Logo {
  id: string
  name: string
  description?: string
  category: string
  fileType: string
  fileSize: number
  fileUrl: string
  thumbnailUrl?: string
  tags?: string[]
  status: string
  createdAt: string
  updatedAt?: string
  // Campos específicos para logos de clientes
  clientId: string
  clientName: string
  variant?: string // e.g., "Oficial", "Horizontal", "Vertical", "Monocromo"
  isPrimary: boolean // Si es el logo principal del cliente
  brand?: string
  version?: string
  colorVariants?: Array<{
    name: string
    hex: string
    fileUrl: string
  }>
  usageRights?: string[]
  dimensions?: {
    width: number
    height: number
  }
  dpi?: number
  format?: string
  isVector?: boolean
  isTransparent?: boolean
  lastUsed?: string
  downloadCount?: number
}

interface Client {
  id: string
  name: string
  description?: string
  industry?: string
  contactEmail?: string
  logos: Logo[]
  primaryLogoId?: string
  createdAt: string
  updatedAt?: string
}

export default function LogosPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'clients' | 'logos'>('clients')
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)
  const {
    modals,
    setModals,
    handleView,
    handleEdit,
    handleDelete,
    handleSave,
    handleDeleteConfirm,
    handleDownload,
    handleShare,
    closeModal
  } = useCardActions()

  // Usar hook de logos para datos reales de DynamoDB
  const { logos, isLoading, error, refreshLogos, createLogo, updateLogo, deleteLogo } = useLogos()

  // Agrupar logos por cliente
  const logosByClient = logos.reduce((acc, logo) => {
    if (!acc[logo.clientId]) {
      acc[logo.clientId] = {
        clientId: logo.clientId,
        clientName: logo.clientName,
        logos: []
      }
    }
    acc[logo.clientId].logos.push(logo)
    return acc
  }, {} as Record<string, { clientId: string; clientName: string; logos: Logo[] }>)

  // Funciones para manejar la navegación entre vistas
  const handleClientClick = (client: { clientId: string; clientName: string; logos: Logo[] }) => {
    setSelectedClient({
      id: client.clientId,
      name: client.clientName,
      description: `Cliente con ${client.logos.length} logos`,
      industry: 'Entertainment',
      contactEmail: `${client.clientName.toLowerCase()}@example.com`,
      logos: client.logos,
      primaryLogoId: client.logos.find(logo => logo.isPrimary)?.id,
      createdAt: client.logos[0]?.createdAt || new Date().toISOString(),
      updatedAt: client.logos[0]?.updatedAt || new Date().toISOString()
    })
    setViewMode('logos')
  }

  const handleBackToClients = () => {
    setSelectedClient(null)
    setViewMode('clients')
  }

  const filteredLogos = logos.filter(logo => {
    const searchLower = searchTerm.toLowerCase()
    
    // Aplicar filtros activos
    for (const filter of activeFilters) {
      switch (filter) {
        case 'status:active':
          if (logo.status !== 'active') return false
          break
        case 'status:inactive':
          if (logo.status !== 'inactive') return false
          break
        case 'type:vector':
          if (!logo.isVector) return false
          break
        case 'type:raster':
          if (logo.isVector) return false
          break
        case 'transparent:yes':
          if (!logo.isTransparent) return false
          break
        case 'transparent:no':
          if (logo.isTransparent) return false
          break
        case 'recent:used':
          if (!logo.lastUsed) return false
          break
        case 'recent:unused':
          if (logo.lastUsed) return false
          break
        case 'primary:yes':
          if (!logo.isPrimary) return false
          break
        case 'primary:no':
          if (logo.isPrimary) return false
          break
        default:
          // Filtro por categoría específica
          if (filter.startsWith('category:')) {
            const categoryFilter = filter.replace('category:', '')
            if (!logo.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false
          }
          // Filtro por etiqueta específica
          if (filter.startsWith('tag:')) {
            const tagFilter = filter.replace('tag:', '')
            if (!logo.tags || !logo.tags.some((tag: string) => 
              tag.toLowerCase().includes(tagFilter.toLowerCase())
            )) return false
          }
          // Filtro por cliente específico
          if (filter.startsWith('client:')) {
            const clientFilter = filter.replace('client:', '')
            if (!logo.clientName.toLowerCase().includes(clientFilter.toLowerCase())) return false
          }
      }
    }
    
    // Filtro de búsqueda
    return (
      logo.name.toLowerCase().includes(searchLower) ||
      logo.clientName.toLowerCase().includes(searchLower) ||
      logo.category.toLowerCase().includes(searchLower) ||
      (logo.description && logo.description.toLowerCase().includes(searchLower)) ||
      (logo.brand && logo.brand.toLowerCase().includes(searchLower)) ||
      (logo.tags && logo.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchLower)
      ))
    )
  })

  // Agrupar logos filtrados por cliente
  const filteredLogosByClient = filteredLogos.reduce((acc, logo) => {
    if (!acc[logo.clientId]) {
      acc[logo.clientId] = {
        clientId: logo.clientId,
        clientName: logo.clientName,
        logos: []
      }
    }
    acc[logo.clientId].logos.push(logo)
    return acc
  }, {} as Record<string, { clientId: string; clientName: string; logos: Logo[] }>)

  // Función para formatear tamaño de archivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Función para obtener el color del badge de estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'archived': return 'destructive'
      default: return 'outline'
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'inactive': return 'Inactivo'
      case 'archived': return 'Archivado'
      default: return status
    }
  }

  // Obtener categorías únicas para filtros
  const categories = [...new Set(logos.map(l => l.category))]
  const tags = [...new Set(logos.flatMap(l => l.tags || []))]

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Gestión de Logos</h1>
              <p className="text-muted-foreground">
                Centraliza y administra todos los logos oficiales
              </p>
            </div>
            <Button onClick={() => router.push('/logos/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Logo
            </Button>
          </div>
          <LogoListSkeleton />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error al cargar logos</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshLogos}>
              Intentar de nuevo
            </Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Logos</h1>
            <p className="text-muted-foreground">
              Centraliza y administra todos los logos oficiales ({filteredLogos.length} logos)
            </p>
          </div>
          <Button onClick={() => router.push('/logos/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Logo
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder={viewMode === 'clients' 
                ? "Buscar clientes por nombre..." 
                : "Buscar logos por nombre, categoría, marca o etiquetas..."
              }
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Botón de cambio de vista */}
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'clients' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('clients')}
            >
              <Building2 className="h-4 w-4 mr-2" />
              Clientes
            </Button>
            <Button
              variant={viewMode === 'logos' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('logos')}
            >
              <Image className="h-4 w-4 mr-2" />
              Logos
            </Button>
          </div>
          
          <Button 
            variant="outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filtros {activeFilters.length > 0 && `(${activeFilters.length})`}
          </Button>
        </div>

        {/* Filtros Activos */}
        {showFilters && (
          <div className="mb-6 p-4 bg-muted/50 rounded-lg border">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">Filtros Disponibles</h3>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setActiveFilters([])}
                className="text-xs"
              >
                Limpiar todos
              </Button>
            </div>
            
            {/* Filtros Predefinidos */}
            <div className="flex flex-wrap gap-2 mb-3">
              {[
                { key: 'status:active', label: 'Activos', icon: '✅' },
                { key: 'status:inactive', label: 'Inactivos', icon: '❌' },
                { key: 'type:vector', label: 'Vectoriales', icon: '📐' },
                { key: 'type:raster', label: 'Raster', icon: '🖼️' },
                { key: 'transparent:yes', label: 'Con transparencia', icon: '🔍' },
                { key: 'transparent:no', label: 'Sin transparencia', icon: '⬜' },
                { key: 'primary:yes', label: 'Logos principales', icon: '⭐' },
                { key: 'primary:no', label: 'Logos secundarios', icon: '🔹' },
                { key: 'recent:used', label: 'Recientemente usados', icon: '🕒' },
                { key: 'recent:unused', label: 'No usados', icon: '📅' }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    if (activeFilters.includes(filter.key)) {
                      setActiveFilters(activeFilters.filter(f => f !== filter.key))
                    } else {
                      setActiveFilters([...activeFilters, filter.key])
                    }
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    activeFilters.includes(filter.key)
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-background border border-border hover:bg-muted'
                  }`}
                >
                  {filter.icon} {filter.label}
                </button>
              ))}
            </div>

            {/* Filtros por Cliente */}
            {Object.keys(logosByClient).length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Clientes</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.values(logosByClient).map((client) => (
                    <button
                      key={client.clientId}
                      onClick={() => {
                        const filterKey = `client:${client.clientName}`
                        if (activeFilters.includes(filterKey)) {
                          setActiveFilters(activeFilters.filter(f => f !== filterKey))
                        } else {
                          setActiveFilters([...activeFilters, filterKey])
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeFilters.includes(`client:${client.clientName}`)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border border-border hover:bg-muted'
                      }`}
                    >
                      🏢 {client.clientName} ({client.logos.length})
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filtros por Categoría */}
            {categories.length > 0 && (
              <div className="mb-3">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Categorías</h4>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        const filterKey = `category:${category}`
                        if (activeFilters.includes(filterKey)) {
                          setActiveFilters(activeFilters.filter(f => f !== filterKey))
                        } else {
                          setActiveFilters([...activeFilters, filterKey])
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeFilters.includes(`category:${category}`)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border border-border hover:bg-muted'
                      }`}
                    >
                      🏷️ {category}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filtros por Etiquetas */}
            {tags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Etiquetas</h4>
                <div className="flex flex-wrap gap-2">
                  {tags.slice(0, 10).map((tag) => (
                    <button
                      key={tag}
                      onClick={() => {
                        const filterKey = `tag:${tag}`
                        if (activeFilters.includes(filterKey)) {
                          setActiveFilters(activeFilters.filter(f => f !== filterKey))
                        } else {
                          setActiveFilters([...activeFilters, filterKey])
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeFilters.includes(`tag:${tag}`)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border border-border hover:bg-muted'
                      }`}
                    >
                      🏷️ {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Filtros Activos Seleccionados */}
        {activeFilters.length > 0 && (
          <div className="mb-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Filtros activos:</span>
              {activeFilters.map((filter) => (
                <div
                  key={filter}
                  className="flex items-center gap-1 px-3 py-1 bg-primary text-primary-foreground rounded-full text-xs font-medium"
                >
                  <span>
                    {filter === 'status:active' && '✅ Activos'}
                    {filter === 'status:inactive' && '❌ Inactivos'}
                    {filter === 'type:vector' && '📐 Vectoriales'}
                    {filter === 'type:raster' && '🖼️ Raster'}
                    {filter === 'transparent:yes' && '🔍 Con transparencia'}
                    {filter === 'transparent:no' && '⬜ Sin transparencia'}
                    {filter === 'primary:yes' && '⭐ Logos principales'}
                    {filter === 'primary:no' && '🔹 Logos secundarios'}
                    {filter === 'recent:used' && '🕒 Recientemente usados'}
                    {filter === 'recent:unused' && '📅 No usados'}
                    {filter.startsWith('client:') && `🏢 ${filter.replace('client:', '')}`}
                    {filter.startsWith('category:') && `🏷️ ${filter.replace('category:', '')}`}
                    {filter.startsWith('tag:') && `🏷️ ${filter.replace('tag:', '')}`}
                  </span>
                  <button
                    onClick={() => setActiveFilters(activeFilters.filter(f => f !== filter))}
                    className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Logos Grid - Agrupados por Cliente */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          {Object.keys(filteredLogosByClient).length === 0 ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <Image className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                <h2 className="text-xl font-semibold mb-2">No se encontraron logos</h2>
                <p className="text-muted-foreground mb-4">
                  {searchTerm || activeFilters.length > 0 
                    ? 'No hay logos que coincidan con los filtros aplicados'
                    : 'Aún no hay logos registrados'
                  }
                </p>
                <Button onClick={() => router.push('/logos/new')}>
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar primer logo
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {Object.values(filteredLogosByClient).map((client) => (
                <div key={client.clientId} className="space-y-4">
                  {/* Header del Cliente */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{client.clientName}</h3>
                      <Badge variant="outline" className="text-sm">
                        {client.logos.length} logo{client.logos.length !== 1 ? 's' : ''}
                      </Badge>
                      {client.logos.some(logo => logo.isPrimary) && (
                        <Badge variant="default" className="text-sm">
                          ⭐ Tiene logo principal
                        </Badge>
                      )}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => router.push(`/logos/new?client=${client.clientId}`)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar logo
                    </Button>
                  </div>

                  {/* Grid de Logos del Cliente */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {client.logos.map((logo) => (
            <Card key={logo.id} className="hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden">
              {/* Imagen centrada en la parte superior */}
              <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                {logo.thumbnailUrl ? (
                  <img 
                    src={logo.thumbnailUrl} 
                    alt={logo.name}
                    className="w-full h-full object-contain p-4"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Image className="h-16 w-16 mb-2" />
                    <span className="text-sm font-medium">Sin vista previa</span>
                  </div>
                )}
                
                {/* Badge de estado superpuesto */}
                <div className="absolute top-3 right-3">
                  <Badge variant={getStatusBadgeVariant(logo.status)} className="text-xs">
                    {getStatusText(logo.status)}
                  </Badge>
                </div>

                {/* Badge de tipo de archivo */}
                <div className="absolute top-3 left-3">
                  <Badge variant="outline" className="text-xs">
                    {logo.fileType.toUpperCase()}
                  </Badge>
                </div>

                {/* Badge de vector si es vectorial */}
                {logo.isVector && (
                  <div className="absolute bottom-3 left-3">
                    <Badge variant="secondary" className="text-xs">
                      <Layers className="h-3 w-3 mr-1" />
                      Vector
                    </Badge>
                  </div>
                )}
              </div>

              {/* Contenido de la card */}
              <CardContent className="flex-1 flex flex-col p-4">
                {/* Nombre y variante */}
                <div className="mb-3">
                  <CardTitle className="text-lg mb-1 line-clamp-1">{logo.name}</CardTitle>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline" className="text-xs">
                      {logo.category}
                    </Badge>
                    {logo.variant && (
                      <Badge variant="secondary" className="text-xs">
                        {logo.variant}
                      </Badge>
                    )}
                    {logo.isPrimary && (
                      <Badge variant="default" className="text-xs">
                        ⭐ Principal
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <CardDescription className="mb-4 line-clamp-2 text-sm">
                  {logo.description || "Sin descripción"}
                </CardDescription>
                
                {/* Información del archivo */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{formatFileSize(logo.fileSize)}</span>
                  </div>
                  
                  {logo.brand && (
                    <div className="flex items-center gap-2 text-sm">
                      <Palette className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{logo.brand}</span>
                    </div>
                  )}
                  
                  {logo.dimensions && (
                    <div className="flex items-center gap-2 text-sm">
                      <Layers className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{logo.dimensions.width} x {logo.dimensions.height}px</span>
                    </div>
                  )}
                  
                  {logo.downloadCount && logo.downloadCount > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Download className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{logo.downloadCount} descargas</span>
                    </div>
                  )}
                </div>

                {/* Etiquetas */}
                {logo.tags && logo.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {logo.tags.slice(0, 3).map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {logo.tags.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{logo.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                )}

                {/* Botones fijos en la parte inferior */}
                <div className="flex gap-2 mt-auto">
                  <AnimatedButton 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleView(logo)}
                    animation="pulse"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(logo)}
                    animation="pulse"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(logo)}
                    animation="pulse"
                  >
                    <Trash2 className="h-4 w-4" />
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modales */}
      <ActionModal
        isOpen={modals.view.isOpen}
        onClose={() => closeModal('view')}
        title="Detalles del Logo"
        size="lg"
      >
        {modals.view.data && (
          <div className="space-y-6">
            {/* Imagen del logo */}
            <div className="flex justify-center">
              {modals.view.data.thumbnailUrl ? (
                <img 
                  src={modals.view.data.thumbnailUrl} 
                  alt={modals.view.data.name}
                  className="max-w-md max-h-64 object-contain"
                />
              ) : (
                <div className="w-64 h-64 bg-muted rounded-lg flex items-center justify-center">
                  <Image className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Información básica */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Nombre</label>
                <p className="text-lg font-semibold">{modals.view.data.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                <p className="text-lg">{modals.view.data.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tipo de Archivo</label>
                <p className="text-lg font-mono">{modals.view.data.fileType.toUpperCase()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Tamaño</label>
                <p className="text-lg">{formatFileSize(modals.view.data.fileSize)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <Badge variant={getStatusBadgeVariant(modals.view.data.status)}>
                  {getStatusText(modals.view.data.status)}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Marca</label>
                <p className="text-lg">{modals.view.data.brand || 'No especificado'}</p>
              </div>
            </div>

            {/* Especificaciones técnicas */}
            {(modals.view.data.dimensions || modals.view.data.dpi || modals.view.data.isVector) && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Especificaciones Técnicas</label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {modals.view.data.dimensions && (
                    <div>
                      <p className="text-sm font-medium">Dimensiones</p>
                      <p className="text-sm text-muted-foreground">
                        {modals.view.data.dimensions.width} x {modals.view.data.dimensions.height}px
                      </p>
                    </div>
                  )}
                  {modals.view.data.dpi && (
                    <div>
                      <p className="text-sm font-medium">DPI</p>
                      <p className="text-sm text-muted-foreground">{modals.view.data.dpi}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium">Tipo</p>
                    <p className="text-sm text-muted-foreground">
                      {modals.view.data.isVector ? 'Vectorial' : 'Raster'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Etiquetas */}
            {modals.view.data.tags && modals.view.data.tags.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Etiquetas</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {modals.view.data.tags.map((tag: string, index: number) => (
                    <Badge key={index} variant="outline">{tag}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Descripción */}
            <div>
              <label className="text-sm font-medium text-muted-foreground">Descripción</label>
              <p className="text-lg">{modals.view.data.description || 'Sin descripción'}</p>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Creado</label>
                <p className="text-sm">{new Date(modals.view.data.createdAt).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Última actualización</label>
                <p className="text-sm">{new Date(modals.view.data.updatedAt || modals.view.data.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </ActionModal>

      <ActionModal
        isOpen={modals.edit.isOpen}
        onClose={() => closeModal('edit')}
        title="Editar Logo"
        size="lg"
        onSave={() => handleSaveLogo(modals.edit.data)}
      >
        {modals.edit.data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium mb-2">Nombre *</label>
                <Input
                  id="edit-name"
                  defaultValue={modals.edit.data.name}
                  placeholder="Nombre del logo"
                />
              </div>
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium mb-2">Categoría *</label>
                <Input
                  id="edit-category"
                  defaultValue={modals.edit.data.category}
                  placeholder="Categoría del logo"
                />
              </div>
              <div>
                <label htmlFor="edit-brand" className="block text-sm font-medium mb-2">Marca</label>
                <Input
                  id="edit-brand"
                  defaultValue={modals.edit.data.brand || ''}
                  placeholder="Nombre de la marca"
                />
              </div>
              <div>
                <label htmlFor="edit-version" className="block text-sm font-medium mb-2">Versión</label>
                <Input
                  id="edit-version"
                  defaultValue={modals.edit.data.version || ''}
                  placeholder="v1.0"
                />
              </div>
              <div>
                <label htmlFor="edit-status" className="block text-sm font-medium mb-2">Estado</label>
                <select
                  id="edit-status"
                  defaultValue={modals.edit.data.status}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="archived">Archivado</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                id="edit-description"
                defaultValue={modals.edit.data.description || ''}
                placeholder="Descripción del logo"
                className="w-full px-3 py-2 border border-input bg-background rounded-md min-h-[100px]"
              />
            </div>

            <div>
              <label htmlFor="edit-tags" className="block text-sm font-medium mb-2">Etiquetas</label>
              <Input
                id="edit-tags"
                defaultValue={modals.edit.data.tags ? modals.edit.data.tags.join(', ') : ''}
                placeholder="Etiquetas separadas por comas"
              />
            </div>
          </div>
        )}
      </ActionModal>

      <ActionModal
        isOpen={modals.delete.isOpen}
        onClose={() => closeModal('delete')}
        title="Eliminar Logo"
        onSave={() => handleDeleteLogo(modals.delete.data)}
        saveText="Eliminar"
        saveVariant="destructive"
      >
        {modals.delete.data && (
          <div className="space-y-4">
            <p>¿Estás seguro de que quieres eliminar el logo <strong>{modals.delete.data.name}</strong>?</p>
            <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer y eliminará el archivo del almacenamiento.</p>
          </div>
        )}
      </ActionModal>
    </MainLayout>
  )
}
