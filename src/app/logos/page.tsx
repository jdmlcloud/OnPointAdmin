"use client"

import { useState, useEffect, useMemo } from "react"
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
import { ClientModal } from "@/components/ui/client-modal"
import { 
  Plus, 
  Search, 
  Filter,
  Image,
  Download,
  Edit,
  Trash2,
  Eye,
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

  // Usar hook de logos para datos reales de DynamoDB
  const { logos, isLoading, error, refreshLogos, createLogo, updateLogo, deleteLogo } = useLogos()

  // Estado para el item seleccionado
  const [selectedItem, setSelectedItem] = useState<Logo | null>(null)

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
  } = useCardActions(refreshLogos)
  
  // Arquitectura limpia: solo useLogos
  
  // Estado para modal de cliente
  const [isClientModalOpen, setIsClientModalOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)
  const [deletingClient, setDeletingClient] = useState<{ clientId: string; clientName: string; logos: Logo[] } | null>(null)
  const [includeLogoForm, setIncludeLogoForm] = useState(false)
  
  
  // Estado para archivo de logo en edición
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoDeleted, setLogoDeleted] = useState(false)

  // Crear un mapa de clientes agrupando logos por cliente (arquitectura limpia)
  const logosByClient = useMemo(() => {
    console.log('🔍 CALCULANDO logosByClient con logos:', logos)
    const clientMap = new Map<string, { clientId: string; clientName: string; logos: Logo[] }>()
    
    // Agrupar logos por cliente (usando brand como identificador del cliente)
    logos.forEach(logo => {
      const clientName = logo.brand || logo.clientName || 'Sin Cliente'
      const clientId = logo.clientId || `client-${clientName.toLowerCase().replace(/\s+/g, '-')}`
      
      if (!clientMap.has(clientName)) {
        clientMap.set(clientName, {
          clientId: clientId,
          clientName: clientName,
          logos: []
        })
      }
      
      clientMap.get(clientName)!.logos.push(logo)
    })
    
    console.log('✅ logosByClient final:', Object.fromEntries(clientMap))
    return Object.fromEntries(clientMap)
  }, [logos])

  // Funciones para manejar la navegación entre vistas
  const handleClientClick = (client: { clientId: string; clientName: string; logos: Logo[] }) => {
    setSelectedClient({
      id: client.clientId,
      name: client.clientName,
      description: `Cliente con ${client.logos.length} logos`,
      industry: 'Entertainment',
      contactEmail: `${client.clientName?.toLowerCase() || 'cliente'}@example.com`,
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

  // Funciones para manejar acciones de logos
  const handleViewLogo = (logo: Logo) => {
    setSelectedItem(logo)
    handleView(logo)
  }

  const handleEditLogo = (logo: Logo) => {
    setSelectedItem(logo)
    handleEdit(logo)
  }

  const handleDeleteLogo = (logo: Logo) => {
    setSelectedItem(logo)
    handleDelete(logo)
  }

  // Funciones para gestión de clientes
  const handleCreateClient = () => {
    setEditingClient(null)
    setIncludeLogoForm(false)
    setIsClientModalOpen(true)
  }

  const handleCreateClientWithLogo = () => {
    setEditingClient(null)
    setIncludeLogoForm(true)
    setIsClientModalOpen(true)
  }

  const handleEditClient = (client: Client) => {
    setEditingClient(client)
    setIsClientModalOpen(true)
  }

  const handleSaveClient = async (clientData: Omit<Client, 'id' | 'createdAt' | 'logos'>) => {
    // En arquitectura limpia, solo creamos logos (no clientes separados)
    console.log('⚠️ handleSaveClient: No implementado en arquitectura limpia')
    setIsClientModalOpen(false)
    setEditingClient(null)
  }

  const handleCloseClientModal = () => {
    setIsClientModalOpen(false)
    setEditingClient(null)
  }

  const handleDeleteClient = (client: { clientId: string; clientName: string; logos: Logo[] }) => {
    setDeletingClient(client)
  }

  const handleAddLogoToClient = (client: { clientId: string; clientName: string; logos: Logo[] }) => {
    // Crear un cliente temporal para el modal
    const tempClient: Client = {
      id: client.clientId,
      name: client.clientName,
      industry: '',
      logos: client.logos,
      createdAt: new Date().toISOString()
    }
    setEditingClient(tempClient)
    setIncludeLogoForm(true)
    setIsClientModalOpen(true)
  }

  const handleSaveClientWithLogo = async (clientData: Omit<Client, 'id' | 'createdAt' | 'logos'>) => {
    // En arquitectura limpia, solo creamos logos (no clientes separados)
    console.log('⚠️ handleSaveClientWithLogo: No implementado en arquitectura limpia')
    setIsClientModalOpen(false)
    setEditingClient(null)
  }

  const handleConfirmDeleteClient = async () => {
    if (!deletingClient) return
    
    try {
      // En arquitectura limpia, eliminamos todos los logos del cliente
      const clientLogos = logos.filter(logo => logo.brand === deletingClient.clientName)
      
      for (const logo of clientLogos) {
        await deleteLogo(logo.id)
      }
      
      setDeletingClient(null)
      console.log(`✅ Cliente ${deletingClient.clientName} eliminado (${clientLogos.length} logos eliminados)`)
    } catch (error) {
      console.error('Error deleting client:', error)
      alert('Error al eliminar el cliente')
    }
  }

  // Funciones para manejar archivos de logo
  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setLogoFile(file)
      setLogoDeleted(false)
      
      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleLogoDelete = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setLogoDeleted(true)
    
    // Limpiar el input file
    const fileInput = document.getElementById('logo-input') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const handleLogoReset = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setLogoDeleted(false)
    // Limpiar el input file
    const fileInput = document.getElementById('logo-input') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  // Limpiar el estado del logo cuando se abra el modal de editar
  useEffect(() => {
    if (modals.edit.isOpen) {
      handleLogoReset()
    }
  }, [modals.edit.isOpen])

  // Actualizar selectedClient cuando cambien los logos
  useEffect(() => {
    if (selectedClient) {
      // Filtrar logos del cliente seleccionado
      const clientLogos = logos.filter(logo => logo.brand === selectedClient.name)
      
      // Actualizar selectedClient con los logos actualizados
      setSelectedClient(prev => prev ? {
        ...prev,
        logos: clientLogos,
        primaryLogoId: clientLogos.find(logo => logo.isPrimary)?.id || undefined
      } : null)
    }
  }, [logos, selectedClient?.name])

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
        case 'primary:yes':
          if (!logo.isPrimary) return false
          break
        case 'primary:no':
          if (logo.isPrimary) return false
          break
        case 'recent:used':
          if (!logo.lastUsed) return false
          break
        case 'recent:unused':
          if (logo.lastUsed) return false
          break
        default:
          if (filter.startsWith('client:')) {
            const clientName = filter.replace('client:', '')
            if (!logo.brand || !logo.brand.toLowerCase().includes(clientName.toLowerCase())) return false
          } else if (filter.startsWith('category:')) {
            const category = filter.replace('category:', '')
            if (!logo.category.toLowerCase().includes(category.toLowerCase())) return false
          } else if (filter.startsWith('tag:')) {
            const tag = filter.replace('tag:', '')
            if (!logo.tags || !logo.tags.some(t => t.toLowerCase().includes(tag.toLowerCase()))) return false
          }
          break
      }
    }
    
    // Aplicar búsqueda
    return (
      logo.name.toLowerCase().includes(searchLower) ||
      (logo.brand && logo.brand.toLowerCase().includes(searchLower)) ||
      logo.category.toLowerCase().includes(searchLower) ||
      (logo.description && logo.description.toLowerCase().includes(searchLower)) ||
      (logo.tags && logo.tags.some((tag: string) => 
        tag.toLowerCase().includes(searchLower)
      ))
    )
  })

  // Agrupar logos filtrados por cliente usando el campo brand
  const filteredLogosByClient = filteredLogos.reduce((acc, logo) => {
    const clientKey = logo.brand || 'Sin Marca'
    if (!acc[clientKey]) {
      acc[clientKey] = {
        clientId: clientKey.toLowerCase().replace(/\s+/g, '-'),
        clientName: clientKey,
        logos: []
      }
    }
    acc[clientKey].logos.push(logo)
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

  // Obtener todas las etiquetas únicas para filtros
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    logos.forEach(logo => {
      if (logo.tags) {
        logo.tags.forEach(tag => tags.add(tag))
      }
    })
    return Array.from(tags).sort()
  }, [logos])

  // Obtener todos los clientes únicos para filtros usando el campo brand
  const allClients = useMemo(() => {
    const clients = new Set<string>()
    logos.forEach(logo => {
      if (logo.brand) {
        clients.add(logo.brand)
      }
    })
    return Array.from(clients).sort()
  }, [logos])

  // Obtener todas las categorías únicas para filtros
  const allCategories = useMemo(() => {
    const categories = new Set<string>()
    logos.forEach(logo => {
      categories.add(logo.category)
    })
    return Array.from(categories).sort()
  }, [logos])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Gestión de Logos</h1>
            <p className="text-muted-foreground">Cargando logos...</p>
          </div>
          <LogoListSkeleton />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-2">Error al cargar logos</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshLogos}>Reintentar</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="flex-1 flex flex-col p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Logos</h1>
            <p className="text-muted-foreground">
              {viewMode === 'clients' 
                ? `Centraliza y administra logos por cliente (${Object.keys(logosByClient).length} clientes)`
                : `Centraliza y administra todos los logos oficiales (${filteredLogos.length} logos)`
              }
            </p>
            {/* Debug: Mostrar información de logos */}
            <div className="text-xs text-gray-500 mt-2">
              <div>🔍 DEBUG ARQUITECTURA:</div>
              <div>• Total logos: {logos.length}</div>
              <div>• Clientes agrupados: {Object.keys(logosByClient).length}</div>
              <div>• View mode: {viewMode}</div>
              <div>• Fuente: Solo logos (arquitectura limpia)</div>
            </div>
          </div>
          {viewMode === 'clients' && (
            <div className="flex gap-2">
              <Button onClick={handleCreateClient} variant="outline">
                <Building2 className="h-4 w-4 mr-2" />
                Nuevo Cliente
              </Button>
              <Button onClick={handleCreateClientWithLogo} variant="default">
                <Plus className="h-4 w-4 mr-2" />
                Cliente + Logo
              </Button>
            </div>
          )}
        </div>

        {/* Miniresumen de Logos */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {/* Total de Logos */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Logos</p>
                <p className="text-2xl font-bold">{logos.length}</p>
                <p className="text-xs text-green-600">{filteredLogos.length} visibles</p>
              </div>
              <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                <Image className="h-5 w-5 text-blue-500" />
              </div>
            </div>
          </div>

          {/* Clientes con Logos */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                <p className="text-2xl font-bold">{Object.keys(logosByClient).length}</p>
                <p className="text-xs text-green-600">con logos</p>
              </div>
              <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                <Building2 className="h-5 w-5 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Formatos Únicos */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Formatos</p>
                <p className="text-2xl font-bold">
                  {new Set(logos.map(logo => logo.fileType)).size}
                </p>
                <p className="text-xs text-green-600">únicos</p>
              </div>
              <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
            </div>
          </div>

          {/* Logos Principales */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Principales</p>
                <p className="text-2xl font-bold">
                  {logos.filter(logo => logo.isPrimary).length}
                </p>
                <p className="text-xs text-yellow-600">destacados</p>
              </div>
              <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                <Star className="h-5 w-5 text-yellow-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4 mb-6">
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
          {/* Pestañas de Vista */}
          <div className="flex space-x-1 bg-muted p-1 rounded-lg">
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'clients'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => {
                setViewMode('clients')
                // No limpiar selectedClient aquí para mantener la selección del cliente
              }}
            >
              <Building2 className="h-4 w-4" />
              Clientes
            </button>
            <button
              className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'logos'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => {
                setViewMode('logos')
                setSelectedClient(null) // Limpiar cliente seleccionado
              }}
            >
              <Image className="h-4 w-4" />
              Todos los Logos
            </button>
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
                { key: 'status:active', label: '✅ Activos' },
                { key: 'status:inactive', label: '❌ Inactivos' },
                { key: 'type:vector', label: '📐 Vectoriales' },
                { key: 'type:raster', label: '🖼️ Raster' },
                { key: 'transparent:yes', label: '🔍 Con transparencia' },
                { key: 'transparent:no', label: '⬜ Sin transparencia' },
                { key: 'primary:yes', label: '⭐ Logos principales' },
                { key: 'primary:no', label: '🔹 Logos secundarios' },
                { key: 'recent:used', label: '🕒 Recientemente usados' },
                { key: 'recent:unused', label: '📅 No usados' }
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
                  {filter.label}
                </button>
              ))}
            </div>

            {/* Filtros por Cliente */}
            {allClients.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Clientes</h4>
                <div className="flex flex-wrap gap-2">
                  {allClients.map((client) => (
                    <button
                      key={`client:${client}`}
                      onClick={() => {
                        const filterKey = `client:${client}`
                        if (activeFilters.includes(filterKey)) {
                          setActiveFilters(activeFilters.filter(f => f !== filterKey))
                        } else {
                          setActiveFilters([...activeFilters, filterKey])
                        }
                      }}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        activeFilters.includes(`client:${client}`)
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-background border border-border hover:bg-muted'
                      }`}
                    >
                      🏢 {client}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filtros por Categoría */}
            {allCategories.length > 0 && (
              <div className="mb-3">
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Categorías</h4>
                <div className="flex flex-wrap gap-2">
                  {allCategories.map((category) => (
                    <button
                      key={`category:${category}`}
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
            {allTags.length > 0 && (
              <div>
                <h4 className="text-xs font-medium text-muted-foreground mb-2">Etiquetas</h4>
                <div className="flex flex-wrap gap-2">
                  {allTags.slice(0, 10).map((tag) => (
                    <button
                      key={`tag:${tag}`}
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
                  {allTags.length > 10 && (
                    <span className="text-xs text-muted-foreground px-2 py-1">
                      +{allTags.length - 10} más...
                    </span>
                  )}
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

        {/* Contenido Principal */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          {viewMode === 'clients' ? (
            // Vista de Cards de Clientes
            Object.keys(logosByClient).length === 0 ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <Building2 className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                  <h2 className="text-xl font-semibold mb-2">No se encontraron clientes</h2>
                  <p className="text-muted-foreground mb-4">
                    {searchTerm || activeFilters.length > 0 
                      ? 'No hay clientes que coincidan con los filtros aplicados'
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
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {Object.values(logosByClient).map((client) => (
                  <Card 
                    key={client.clientId} 
                    className="hover:shadow-lg transition-shadow cursor-pointer h-48 w-full"
                    onClick={() => handleClientClick(client)}
                  >
                    <CardContent className="p-4 h-full flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Building2 className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-sm font-semibold truncate">{client.clientName}</h3>
                            <p className="text-xs text-muted-foreground">Cliente</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {client.logos.length}
                        </Badge>
                      </div>
                      
                      {/* Contenido principal */}
                      <div className="space-y-3 flex-1">
                        {/* Información de logos y formatos */}
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Image className="h-3 w-3" />
                          <span>{client.logos.length} logos</span>
                          {client.logos.length > 0 && (
                            <>
                              <span>•</span>
                              <span>
                                {new Set(client.logos.map(logo => logo.fileType)).size} formatos
                              </span>
                            </>
                          )}
                        </div>
                        
                        {/* Etiquetas de formatos agrupados */}
                        {client.logos.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(
                              client.logos.reduce((acc, logo) => {
                                const type = logo.fileType || 'UNKNOWN'
                                acc[type] = (acc[type] || 0) + 1
                                return acc
                              }, {} as Record<string, number>)
                            ).map(([format, count]) => (
                              <Badge key={format} variant="secondary" className="text-xs px-2 py-1">
                                {format} {count > 1 ? `(${count})` : ''}
                              </Badge>
                            ))}
                          </div>
                        )}
                        
                        {/* Indicador de logo principal */}
                        {client.logos.some(logo => logo.isPrimary) && (
                          <div className="flex items-center gap-1 text-xs text-yellow-600">
                            <Star className="h-3 w-3" />
                            <span>Logo principal</span>
                          </div>
                        )}
                      </div>
                      
                      {/* Botones de acción */}
                      <div className="flex gap-2 pt-3 border-t border-border/50">
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleClientClick(client)
                          }}
                          className="h-8 px-3 text-sm flex-1"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ver
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleAddLogoToClient(client)
                          }}
                          className="h-8 px-3 text-sm"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClient(client)
                          }}
                          className="h-8 px-3 text-sm text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )
          ) : (
            // Vista de Logos (modo original)
            selectedClient ? (
              // Vista de logos de un cliente específico
              <div className="space-y-6">
                {/* Header del Cliente Seleccionado */}
                <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleBackToClients}
                    className="mr-2"
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Volver a Clientes
                  </Button>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Building2 className="h-5 w-5 text-primary" />
                    </div>
                  <div className="flex-1">
                    <h2 className="text-xl font-semibold">{selectedClient.name}</h2>
                    <p className="text-sm text-muted-foreground">
                      {selectedClient.logos.length} logos disponibles
                    </p>
                  </div>
                  <Button 
                    onClick={() => router.push(`/logos/new?client=${selectedClient.id}&clientName=${encodeURIComponent(selectedClient.name)}`)}
                    size="sm"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Logo
                  </Button>
                  </div>
                </div>
                
                {/* Grid de Logos del Cliente */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {selectedClient.logos.map((logo) => (
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
                            onClick={() => handleViewLogo(logo)}
                            animation="pulse"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Ver
                          </AnimatedButton>
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            className="flex-1"
                            onClick={() => handleEditLogo(logo)}
                            animation="pulse"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </AnimatedButton>
                          <AnimatedButton
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteLogo(logo)}
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
            ) : (
              // Vista original de logos agrupados por cliente
              Object.keys(logosByClient).length === 0 ? (
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
                  {Object.values(logosByClient).map((client) => (
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
                                  onClick={() => handleViewLogo(logo)}
                                  animation="pulse"
                                >
                                  <Eye className="h-4 w-4 mr-2" />
                                  Ver
                                </AnimatedButton>
                                <AnimatedButton
                                  variant="outline"
                                  size="sm"
                                  className="flex-1"
                                  onClick={() => handleEditLogo(logo)}
                                  animation="pulse"
                                >
                                  <Edit className="h-4 w-4 mr-2" />
                                  Editar
                                </AnimatedButton>
                                <AnimatedButton
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteLogo(logo)}
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
              )
            )
          )}
        </div>

        {/* Modales */}
        <ActionModal
          isOpen={modals.view.isOpen}
          onClose={() => closeModal('view')}
          title="Detalles del Logo"
          size="lg"
        >
          {selectedItem && (
            <div className="space-y-6">
              {/* Imagen del logo */}
              <div className="flex justify-center">
                {selectedItem.thumbnailUrl ? (
                  <img 
                    src={selectedItem.thumbnailUrl} 
                    alt={selectedItem.name}
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
                  <p className="text-lg font-semibold">{selectedItem.name}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                  <p className="text-lg">{selectedItem.category}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tipo de Archivo</label>
                  <p className="text-lg font-mono">{selectedItem.fileType.toUpperCase()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Tamaño</label>
                  <p className="text-lg">{formatFileSize(selectedItem.fileSize)}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Estado</label>
                  <Badge variant={getStatusBadgeVariant(selectedItem.status)}>
                    {getStatusText(selectedItem.status)}
                  </Badge>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Cliente</label>
                  <p className="text-lg">{selectedItem.clientName}</p>
                </div>
              </div>

              {/* Especificaciones técnicas */}
              {(selectedItem.dimensions || selectedItem.dpi || selectedItem.isVector) && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Especificaciones Técnicas</label>
                  <div className="grid grid-cols-3 gap-4 mt-2">
                    {selectedItem.dimensions && (
                      <div>
                        <p className="text-sm font-medium">Dimensiones</p>
                        <p className="text-sm text-muted-foreground">
                          {selectedItem.dimensions.width} x {selectedItem.dimensions.height}px
                        </p>
                      </div>
                    )}
                    {selectedItem.dpi && (
                      <div>
                        <p className="text-sm font-medium">DPI</p>
                        <p className="text-sm text-muted-foreground">{selectedItem.dpi}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium">Tipo</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedItem.isVector ? 'Vectorial' : 'Raster'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Etiquetas */}
              {selectedItem.tags && selectedItem.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Etiquetas</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedItem.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Descripción */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                <p className="text-lg">{selectedItem.description || 'Sin descripción'}</p>
              </div>

              {/* Fechas */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Creado</label>
                  <p className="text-sm">{new Date(selectedItem.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última actualización</label>
                  <p className="text-sm">{new Date(selectedItem.updatedAt || selectedItem.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}
        </ActionModal>

        <ActionModal
          isOpen={modals.edit.isOpen}
          onClose={() => closeModal('edit')}
          title="Editar Logo"
          type="edit"
          onConfirm={() => handleSave(selectedItem)}
          confirmText="Guardar"
        >
          {selectedItem && (
            <div className="space-y-6">
              {/* Logo Section */}
              <div>
                <label className="text-sm font-medium">Archivo del Logo</label>
                <div className="mt-2 flex items-center gap-4">
                  <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                    {logoPreview ? (
                      <img 
                        src={logoPreview} 
                        alt="Preview"
                        className="w-full h-full object-contain"
                      />
                    ) : selectedItem.thumbnailUrl ? (
                      <img 
                        src={selectedItem.thumbnailUrl} 
                        alt={selectedItem.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <Image className="w-8 h-8 text-muted-foreground" />
                    )}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*,.svg,.pdf"
                      className="hidden"
                      id="logo-input"
                      onChange={handleLogoUpload}
                    />
                    <label
                      htmlFor="logo-input"
                      className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 cursor-pointer"
                    >
                      {selectedItem.thumbnailUrl || logoPreview ? 'Cambiar' : 'Subir'}
                    </label>
                    {(selectedItem.thumbnailUrl || logoPreview) && (
                      <button
                        type="button"
                        onClick={handleLogoDelete}
                        className="px-3 py-1 text-xs bg-destructive text-destructive-foreground rounded hover:bg-destructive/90"
                      >
                        Borrar
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="edit-name" className="block text-sm font-medium mb-2">Nombre *</label>
                  <Input
                    id="edit-name"
                    defaultValue={selectedItem.name}
                    placeholder="Nombre del logo"
                  />
                </div>
                <div>
                  <label htmlFor="edit-category" className="block text-sm font-medium mb-2">Categoría *</label>
                  <Input
                    id="edit-category"
                    defaultValue={selectedItem.category}
                    placeholder="Categoría del logo"
                  />
                </div>
                <div>
                  <label htmlFor="edit-brand" className="block text-sm font-medium mb-2">Marca</label>
                  <Input
                    id="edit-brand"
                    defaultValue={selectedItem.brand || ''}
                    placeholder="Nombre de la marca"
                  />
                </div>
                <div>
                  <label htmlFor="edit-version" className="block text-sm font-medium mb-2">Versión</label>
                  <Input
                    id="edit-version"
                    defaultValue={selectedItem.version || ''}
                    placeholder="v1.0"
                  />
                </div>
                <div>
                  <label htmlFor="edit-variant" className="block text-sm font-medium mb-2">Variante</label>
                  <Input
                    id="edit-variant"
                    defaultValue={selectedItem.variant || ''}
                    placeholder="Oficial, Horizontal, etc."
                  />
                </div>
                <div>
                  <label htmlFor="edit-status" className="block text-sm font-medium mb-2">Estado</label>
                  <select
                    id="edit-status"
                    defaultValue={selectedItem.status}
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
                  defaultValue={selectedItem.description || ''}
                  placeholder="Descripción del logo"
                  className="w-full px-3 py-2 border border-input bg-background rounded-md min-h-[100px]"
                />
              </div>

              <div>
                <label htmlFor="edit-tags" className="block text-sm font-medium mb-2">Etiquetas</label>
                <Input
                  id="edit-tags"
                  defaultValue={selectedItem.tags ? selectedItem.tags.join(', ') : ''}
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
          type="delete"
          onConfirm={() => handleDeleteConfirm(selectedItem)}
          confirmText="Eliminar"
          destructive={true}
        >
          {selectedItem && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {selectedItem.thumbnailUrl ? (
                    <img 
                      src={selectedItem.thumbnailUrl} 
                      alt={selectedItem.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Image className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p className="font-medium">¿Estás seguro de que quieres eliminar este logo?</p>
                  <p className="text-sm text-muted-foreground">{selectedItem.name}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer y eliminará el archivo del almacenamiento.</p>
            </div>
          )}
        </ActionModal>

        {/* Modal de Cliente */}
        <ClientModal
          isOpen={isClientModalOpen}
          onClose={handleCloseClientModal}
          onSave={includeLogoForm ? handleSaveClientWithLogo : handleSaveClient}
          client={editingClient}
          title={editingClient ? 'Editar Cliente' : (includeLogoForm ? 'Nuevo Cliente + Logo' : 'Nuevo Cliente')}
          includeLogoForm={includeLogoForm}
        />

        {/* Modal de Eliminar Cliente */}
        <ActionModal
          isOpen={!!deletingClient}
          onClose={() => setDeletingClient(null)}
          title="Eliminar Cliente"
          description="¿Estás seguro de que quieres eliminar este cliente? Esta acción no se puede deshacer."
          type="delete"
          onConfirm={handleConfirmDeleteClient}
          confirmText="Eliminar Cliente"
          destructive={true}
        >
          {deletingClient && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <Building2 className="h-8 w-8 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    {deletingClient.clientName}
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {deletingClient.logos.length} logo{deletingClient.logos.length !== 1 ? 's' : ''} asociado{deletingClient.logos.length !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Al eliminar este cliente:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Se eliminarán todos los {deletingClient.logos.length} logos asociados</li>
                  <li>Se perderá toda la información del cliente</li>
                  <li>Esta acción no se puede deshacer</li>
                </ul>
              </div>
            </div>
          )}
        </ActionModal>

      </div>
    </MainLayout>
  )
}
