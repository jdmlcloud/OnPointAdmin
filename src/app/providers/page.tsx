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
import { useProviders } from "@/hooks/use-providers"
import { useTags } from "@/hooks/use-tags"
import { TagSelector } from "@/components/ui/tag-selector"
import { TagBadge } from "@/components/ui/tag-badge"
import { ProviderListSkeleton } from "@/components/ui/provider-skeleton"
import { Provider } from "@/lib/db/repositories/dynamodb-provider-repository"
import { 
  Plus, 
  Search, 
  Filter,
  Building2,
  Star,
  Phone,
  Mail,
  Globe,
  Edit,
  Trash2,
  Eye,
  Download,
  MapPin,
  Calendar,
  Share
} from "lucide-react"


export default function ProvidersPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)
  const [logoDeleted, setLogoDeleted] = useState<boolean>(false)
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

  // Usar hook de proveedores para datos reales de DynamoDB
  const { providers, loading: isLoading, error, refreshProviders, updateProvider, deleteProvider } = useProviders()
  
  // Usar hook de etiquetas
  const { tags: availableTags, refreshTags } = useTags()

  const filteredProviders = providers.filter(provider => {
    const searchLower = searchTerm.toLowerCase()
    
    // Aplicar filtros activos
    for (const filter of activeFilters) {
      switch (filter) {
        case 'status:active':
          if (provider.status !== 'active') return false
          break
        case 'status:inactive':
          if (provider.status !== 'inactive') return false
          break
        case 'has:tags':
          if (!provider.tags || provider.tags.length === 0) return false
          break
        case 'no:tags':
          if (provider.tags && provider.tags.length > 0) return false
          break
        default:
          // Filtro por etiqueta específica
          if (filter.startsWith('tag:')) {
            const tagFilter = filter.replace('tag:', '')
            if (!provider.tags || !provider.tags.some((tag: string) => 
              tag.toLowerCase().includes(tagFilter.toLowerCase()) ||
              tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(tagFilter.toLowerCase())
            )) return false
          }
      }
    }
    
    // Filtro por etiquetas usando # en búsqueda
    if (searchTerm.includes('#')) {
      const tagSearch = searchTerm.split('#')[1]?.toLowerCase().trim()
      if (tagSearch && provider.tags) {
        const tagMatches = provider.tags.some((tag: string) => 
          tag.toLowerCase().includes(tagSearch) ||
          tag.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(tagSearch)
        )
        return tagMatches
      }
    }
    
    // Búsqueda general
    const matchesSearch = provider.name.toLowerCase().includes(searchLower) ||
                         provider.email.toLowerCase().includes(searchLower) ||
                         (provider.company && provider.company.toLowerCase().includes(searchLower)) ||
                         (provider.description && provider.description.toLowerCase().includes(searchLower)) ||
                         (provider.phone && provider.phone.includes(searchTerm)) ||
                         (provider.website && provider.website.toLowerCase().includes(searchLower))
    
    return matchesSearch
  })

  // Recargar datos cuando se regrese de crear un proveedor
  useEffect(() => {
    refreshProviders()
  }, [])

  // Limpiar el estado del logo cuando se abra el modal de editar
  useEffect(() => {
    if (modals.edit.isOpen) {
      handleLogoReset()
    }
  }, [modals.edit.isOpen])

  // Función para comprimir imagen
  const compressImage = (file: File, maxWidth: number = 400, quality: number = 0.8): Promise<string> => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      const img = new Image()
      
      img.onload = () => {
        // Calcular nuevas dimensiones manteniendo proporción
        let { width, height } = img
        if (width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        }
        
        canvas.width = width
        canvas.height = height
        
        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height)
        
        // Convertir a base64 con compresión
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality)
        resolve(compressedDataUrl)
      }
      
      img.src = URL.createObjectURL(file)
    })
  }

  // Funciones para manejar el logo
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamaño del archivo (máximo 5MB antes de compresión)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.')
        return
      }
      
      setLogoFile(file)
      setLogoDeleted(false) // Resetear el estado de eliminado
      
      try {
        // Comprimir la imagen
        const compressedImage = await compressImage(file, 400, 0.7)
        setLogoPreview(compressedImage)
      } catch (error) {
        console.error('Error comprimiendo imagen:', error)
        // Fallback a imagen original si falla la compresión
        const reader = new FileReader()
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleLogoUpdate = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamaño del archivo (máximo 5MB antes de compresión)
      if (file.size > 5 * 1024 * 1024) {
        alert('El archivo es demasiado grande. Máximo 5MB permitido.')
        return
      }
      
      setLogoFile(file)
      setLogoDeleted(false) // Resetear el estado de eliminado
      
      try {
        // Comprimir la imagen
        const compressedImage = await compressImage(file, 400, 0.7)
        setLogoPreview(compressedImage)
      } catch (error) {
        console.error('Error comprimiendo imagen:', error)
        // Fallback a imagen original si falla la compresión
        const reader = new FileReader()
        reader.onload = (e) => {
          setLogoPreview(e.target?.result as string)
        }
        reader.readAsDataURL(file)
      }
    }
  }

  const handleLogoDelete = () => {
    setLogoFile(null)
    setLogoPreview(null)
    setLogoDeleted(true)
    
    // Actualizar el estado del modal para reflejar que el logo fue eliminado
    if (modals.edit.data) {
      setModals(prev => ({
        ...prev,
        edit: {
          ...prev.edit,
          data: {
            ...prev.edit.data,
            logo: null
          }
        }
      }))
    }
    
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

  // Función personalizada para guardar cambios
  const handleSaveProvider = async (providerData: any) => {
    try {
      // Recopilar datos del formulario
      const formData = {
        name: (document.getElementById('edit-name') as HTMLInputElement)?.value || providerData.name,
        email: (document.getElementById('edit-email') as HTMLInputElement)?.value || providerData.email,
        phone: (document.getElementById('edit-phone') as HTMLInputElement)?.value || providerData.phone,
        company: (document.getElementById('edit-company') as HTMLInputElement)?.value || providerData.company,
        description: (document.getElementById('edit-description') as HTMLTextAreaElement)?.value || providerData.description,
        website: (document.getElementById('edit-website') as HTMLInputElement)?.value || providerData.website,
        notes: (document.getElementById('edit-notes') as HTMLTextAreaElement)?.value || providerData.notes,
        // Mantener datos existentes
        address: providerData.address,
        contacts: providerData.contacts,
        tags: providerData.tags || [],
        status: providerData.status,
        logo: logoDeleted ? null : (logoPreview || providerData.logo)
      }

      // Recopilar contactos editados
      if (providerData.contacts && providerData.contacts.length > 0) {
        const updatedContacts = providerData.contacts.map((contact: any, index: number) => ({
          name: (document.getElementById(`edit-contact-name-${index}`) as HTMLInputElement)?.value || contact.name,
          position: (document.getElementById(`edit-contact-position-${index}`) as HTMLInputElement)?.value || contact.position,
          email: (document.getElementById(`edit-contact-email-${index}`) as HTMLInputElement)?.value || contact.email,
          phone: (document.getElementById(`edit-contact-phone-${index}`) as HTMLInputElement)?.value || contact.phone,
          isPrimary: (document.getElementById(`edit-contact-primary-${index}`) as HTMLInputElement)?.checked || contact.isPrimary
        }))
        formData.contacts = updatedContacts
      }

      // Recopilar etiquetas editadas
      const tags = providerData.tags || []
      formData.tags = tags

      const success = await updateProvider(providerData.id, formData)
      if (success) {
        closeModal('edit')
        await refreshProviders()
        await refreshTags() // Refrescar etiquetas disponibles
        // Limpiar el estado del logo después de guardar
        handleLogoReset()
        return true
      }
      return false
    } catch (error) {
      console.error('Error saving provider:', error)
      
      // Mostrar mensaje de error específico
      if (error instanceof Error) {
        if (error.message.includes('Item size has exceeded')) {
          alert('El logo es demasiado grande. Por favor, selecciona una imagen más pequeña.')
        } else {
          alert(`Error al guardar: ${error.message}`)
        }
      } else {
        alert('Error inesperado al guardar el proveedor.')
      }
      
      return false
    }
  }

  // Función personalizada para eliminar proveedor
  const handleDeleteProvider = async (providerData: any) => {
    try {
      const success = await deleteProvider(providerData.id)
      if (success) {
        closeModal('delete')
        await refreshProviders()
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting provider:', error)
      return false
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="h-full flex flex-col space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-48 bg-muted animate-pulse rounded mb-2"></div>
              <div className="h-4 w-64 bg-muted animate-pulse rounded"></div>
            </div>
            <div className="h-10 w-32 bg-muted animate-pulse rounded"></div>
          </div>
          
          {/* Search skeleton */}
          <div className="flex items-center gap-4">
            <div className="h-10 w-80 bg-muted animate-pulse rounded"></div>
            <div className="h-10 w-24 bg-muted animate-pulse rounded"></div>
          </div>
          
          {/* Providers skeleton */}
          <div className="flex-1 overflow-auto scrollbar-hide">
            <ProviderListSkeleton count={6} />
          </div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error al cargar proveedores: {error}</p>
            <Button onClick={refreshProviders}>Reintentar</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Proveedores</h1>
            <p className="text-muted-foreground">
              Gestiona tu base de datos de proveedores
            </p>
          </div>
          <Button onClick={() => router.push('/providers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar proveedores... (usa #etiqueta para filtrar por etiquetas)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
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
                { key: 'has:tags', label: 'Con etiquetas', icon: '🏷️' },
                { key: 'no:tags', label: 'Sin etiquetas', icon: '📝' }
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

            {/* Filtros por Etiquetas */}
            {availableTags && availableTags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {availableTags.map((tag) => (
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
                    {filter === 'has:tags' && '🏷️ Con etiquetas'}
                    {filter === 'no:tags' && '📝 Sin etiquetas'}
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

        {/* Providers Grid */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden">
              {/* Imagen centrada en la parte superior */}
              <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
                {provider.logo ? (
                  <img 
                    src={provider.logo} 
                    alt={provider.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center text-muted-foreground">
                    <Building2 className="h-16 w-16 mb-2" />
                    <span className="text-sm font-medium">Sin logo</span>
                  </div>
                )}
                
                {/* Badge de estado superpuesto */}
                <div className="absolute top-3 right-3">
                  <Badge variant={provider.status === "active" ? "default" : "secondary"} className="text-xs">
                    {provider.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                </div>
              </div>

              {/* Contenido de la card */}
              <CardContent className="flex-1 flex flex-col p-4">
                {/* Nombre y empresa */}
                <div className="mb-3">
                  <CardTitle className="text-lg mb-1 line-clamp-1">{provider.name}</CardTitle>
                  {provider.company && (
                    <Badge variant="outline" className="text-xs">
                      {provider.company}
                    </Badge>
                  )}
                </div>

                {/* Descripción */}
                <CardDescription className="mb-4 line-clamp-2 text-sm">
                  {provider.description || "Sin descripción"}
                </CardDescription>
                
                {/* Información de contacto */}
                <div className="space-y-2 mb-4 flex-1">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                    <span className="truncate">{provider.email}</span>
                  </div>
                  {provider.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <span className="truncate">{provider.phone}</span>
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a 
                        href={provider.website.startsWith('http') ? provider.website : `https://${provider.website}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline truncate"
                      >
                        {provider.website}
                      </a>
                    </div>
                  )}
                </div>

                {/* Etiquetas */}
                {provider.tags && provider.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {provider.tags.map((tag: string, index: number) => (
                      <TagBadge key={index} tag={tag} />
                    ))}
                  </div>
                )}

                {/* Botones fijos en la parte inferior */}
                <div className="flex gap-2 mt-auto">
                  <AnimatedButton 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleView(provider)}
                    animation="pulse"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(provider)}
                    animation="pulse"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(provider)}
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
      </div>

      {/* Modales */}
      <ActionModal
        isOpen={modals.view.isOpen}
        onClose={() => closeModal('view')}
        title="Detalles del Proveedor"
        description="Información completa del proveedor"
        type="view"
      >
        {modals.view.data && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                {modals.view.data.logo ? (
                  <img 
                    src={modals.view.data.logo} 
                    alt={modals.view.data.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Building2 className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{modals.view.data.name}</h3>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge variant={modals.view.data.status === "active" ? "default" : "secondary"}>
                    {modals.view.data.status === "active" ? "Activo" : "Inactivo"}
                  </Badge>
                  {modals.view.data.company && (
                    <Badge variant="outline" className="text-xs">
                      {modals.view.data.company}
                    </Badge>
                  )}
                </div>
                {/* Etiquetas */}
                {modals.view.data.tags && modals.view.data.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {modals.view.data.tags.map((tag: string, index: number) => (
                      <TagBadge key={index} tag={tag} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-4">
              {/* Información Básica */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Descripción</label>
                <p className="text-sm">{modals.view.data.description || "Sin descripción"}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <p className="text-sm">{modals.view.data.email}</p>
                </div>
                {modals.view.data.phone && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Teléfono Principal</label>
                    <p className="text-sm">{modals.view.data.phone}</p>
                  </div>
                )}
              </div>
              
              {modals.view.data.website && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sitio Web</label>
                  <div className="mt-1">
                    <a 
                      href={modals.view.data.website.startsWith('http') ? modals.view.data.website : `https://${modals.view.data.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm flex items-center gap-1"
                    >
                      <Globe className="w-3 h-3" />
                      {modals.view.data.website}
                    </a>
                  </div>
                </div>
              )}

              {/* Dirección */}
              {modals.view.data.address && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Dirección</label>
                  {typeof modals.view.data.address === 'string' ? (
                    <p className="text-sm">{modals.view.data.address}</p>
                  ) : (
                    <div className="text-sm">
                      <p>{modals.view.data.address.street}</p>
                      <p>{modals.view.data.address.city}, {modals.view.data.address.state} {modals.view.data.address.zipCode}</p>
                      <p>{modals.view.data.address.country}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Contactos Múltiples */}
              {modals.view.data.contacts && modals.view.data.contacts.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Contactos</label>
                  <div className="space-y-2 mt-2">
                    {modals.view.data.contacts.map((contact: any, index: number) => (
                      <div key={index} className="p-3 border rounded-lg bg-muted/50">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-sm">{contact.name}</p>
                            <p className="text-xs text-muted-foreground">{contact.position}</p>
                          </div>
                          {contact.isPrimary && (
                            <Badge variant="default" className="text-xs">Principal</Badge>
                          )}
                        </div>
                        <div className="mt-2 space-y-1">
                          <p className="text-xs text-muted-foreground">📧 {contact.email}</p>
                          {contact.phone && (
                            <p className="text-xs text-muted-foreground">📞 {contact.phone}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Etiquetas */}
              {modals.view.data.tags && modals.view.data.tags.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Etiquetas</label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {modals.view.data.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Notas */}
              {modals.view.data.notes && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Notas</label>
                  <p className="text-sm">{modals.view.data.notes}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                  <p className="text-sm">{new Date(modals.view.data.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Última Actualización</label>
                  <p className="text-sm">{new Date(modals.view.data.updatedAt || modals.view.data.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </ActionModal>

      <ActionModal
        isOpen={modals.edit.isOpen}
        onClose={() => closeModal('edit')}
        title="Editar Proveedor"
        description="Modifica la información del proveedor"
        type="edit"
        onConfirm={async () => {
          await handleSaveProvider(modals.edit.data)
        }}
        loadingKey="save-item"
      >
        {modals.edit.data && (
          <div className="space-y-4">
            {/* Logo Section */}
            <div>
              <label className="text-sm font-medium">Logo del Proveedor</label>
              <div className="mt-2 flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : modals.edit.data.logo ? (
                    <img 
                      src={modals.edit.data.logo} 
                      alt={modals.edit.data.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Building2 className="w-8 h-8 text-muted-foreground" />
                  )}
                </div>
                <div className="flex gap-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    id="logo-input"
                    onChange={handleLogoUpload}
                  />
                  <label
                    htmlFor="logo-input"
                    className="px-3 py-1 text-xs bg-primary text-primary-foreground rounded hover:bg-primary/90 cursor-pointer"
                  >
                    {modals.edit.data.logo || logoPreview ? 'Cambiar' : 'Subir'}
                  </label>
                  {(modals.edit.data.logo || logoPreview) && (
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
                <label className="text-sm font-medium">Nombre</label>
                <Input 
                  id="edit-name"
                  defaultValue={modals.edit.data.name}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  id="edit-email"
                  type="email"
                  defaultValue={modals.edit.data.email}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Teléfono Principal</label>
                <Input 
                  id="edit-phone"
                  defaultValue={modals.edit.data.phone || ''}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Empresa</label>
                <Input 
                  id="edit-company"
                  defaultValue={modals.edit.data.company || ''}
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Descripción</label>
              <textarea 
                id="edit-description"
                defaultValue={modals.edit.data.description || ''}
                className="w-full mt-1 p-2 border rounded-md resize-none h-20 text-foreground bg-background"
                placeholder="Descripción del proveedor..."
              />
            </div>
            
            <div>
              <label className="text-sm font-medium">Sitio Web</label>
              <Input 
                id="edit-website"
                defaultValue={modals.edit.data.website || ''}
                className="mt-1"
                placeholder="www.ejemplo.com"
              />
            </div>

            {/* Dirección */}
            {modals.edit.data.address && (
              <div>
                <label className="text-sm font-medium">Dirección</label>
                {typeof modals.edit.data.address === 'string' ? (
                  <Input 
                    id="edit-address"
                    defaultValue={modals.edit.data.address}
                    className="mt-1"
                  />
                ) : (
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <Input 
                      id="edit-address-street"
                      defaultValue={modals.edit.data.address.street || ''}
                      placeholder="Calle y número"
                    />
                    <Input 
                      id="edit-address-city"
                      defaultValue={modals.edit.data.address.city || ''}
                      placeholder="Ciudad"
                    />
                    <Input 
                      id="edit-address-state"
                      defaultValue={modals.edit.data.address.state || ''}
                      placeholder="Estado"
                    />
                    <Input 
                      id="edit-address-zip"
                      defaultValue={modals.edit.data.address.zipCode || ''}
                      placeholder="Código Postal"
                    />
                    <Input 
                      id="edit-address-country"
                      defaultValue={modals.edit.data.address.country || ''}
                      placeholder="País"
                      className="col-span-2"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Contactos Múltiples */}
            {modals.edit.data.contacts && modals.edit.data.contacts.length > 0 && (
              <div>
                <div className="flex items-center justify-between">
                  <label className="text-sm font-medium">Contactos</label>
                  <button
                    type="button"
                    onClick={() => {
                      // Agregar nuevo contacto
                      const newContact = {
                        name: "",
                        position: "",
                        email: "",
                        phone: "+52",
                        isPrimary: false
                      }
                      // Crear una nueva referencia para forzar re-render
                      const updatedData = {
                        ...modals.edit.data,
                        contacts: [...modals.edit.data.contacts, newContact]
                      }
                      // Actualizar el estado del modal
                      setModals(prev => ({
                        ...prev,
                        edit: {
                          ...prev.edit,
                          data: updatedData
                        }
                      }))
                    }}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Agregar Contacto
                  </button>
                </div>
                <div className="space-y-2 mt-2">
                  {modals.edit.data.contacts.map((contact: any, index: number) => (
                    <div key={index} className="p-3 border rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <input 
                            type="checkbox" 
                            id={`edit-contact-primary-${index}`}
                            defaultChecked={contact.isPrimary}
                            className="rounded"
                          />
                          <label htmlFor={`edit-contact-primary-${index}`} className="text-xs">
                            Contacto principal
                          </label>
                        </div>
                        {modals.edit.data.contacts.length > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              // Eliminar contacto
                              const updatedData = {
                                ...modals.edit.data,
                                contacts: modals.edit.data.contacts.filter((_: any, i: number) => i !== index)
                              }
                              // Actualizar el estado del modal
                              setModals(prev => ({
                                ...prev,
                                edit: {
                                  ...prev.edit,
                                  data: updatedData
                                }
                              }))
                            }}
                            className="text-red-600 hover:text-red-800 text-sm"
                          >
                            × Eliminar
                          </button>
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <Input 
                          id={`edit-contact-name-${index}`}
                          defaultValue={contact.name || ''}
                          placeholder="Nombre del contacto"
                        />
                        <Input 
                          id={`edit-contact-position-${index}`}
                          defaultValue={contact.position || ''}
                          placeholder="Cargo"
                        />
                        <Input 
                          id={`edit-contact-email-${index}`}
                          type="email"
                          defaultValue={contact.email || ''}
                          placeholder="Email"
                        />
                        <Input 
                          id={`edit-contact-phone-${index}`}
                          defaultValue={contact.phone || '+52'}
                          placeholder="Teléfono"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Etiquetas */}
            <div>
              <label className="text-sm font-medium">Etiquetas</label>
              <div className="mt-2">
                <TagSelector
                  selectedTags={modals.edit.data.tags || []}
                  onTagsChange={(newTags) => {
                    // Actualizar el estado local del modal
                    const updatedData = {
                      ...modals.edit.data,
                      tags: newTags
                    }
                    setModals(prev => ({
                      ...prev,
                      edit: {
                        ...prev.edit,
                        data: updatedData
                      }
                    }))
                  }}
                  availableTags={availableTags}
                  placeholder="Buscar o crear etiqueta..."
                />
                <div className="text-xs text-muted-foreground mt-2">
                  Usa #etiqueta en la búsqueda para filtrar por etiquetas
                </div>
              </div>
            </div>


            {/* Notas */}
            <div>
              <label className="text-sm font-medium">Notas</label>
              <textarea 
                id="edit-notes"
                defaultValue={modals.edit.data.notes || ''}
                className="w-full mt-1 p-2 border rounded-md resize-none h-16 text-foreground bg-background"
                placeholder="Notas adicionales..."
              />
            </div>
          </div>
        )}
      </ActionModal>

      <ActionModal
        isOpen={modals.delete.isOpen}
        onClose={() => closeModal('delete')}
        title="Eliminar Proveedor"
        description="¿Estás seguro de que quieres eliminar este proveedor? Esta acción no se puede deshacer."
        type="delete"
        onConfirm={async () => {
          await handleDeleteProvider(modals.delete.data)
        }}
        loadingKey="delete-item"
        destructive
      >
        {modals.delete.data && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <Building2 className="h-8 w-8 text-red-600" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">
                  {modals.delete.data.name}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {modals.delete.data.email}
                </p>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Al eliminar este proveedor:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Se eliminarán todos los productos asociados</li>
                <li>Se cancelarán las cotizaciones pendientes</li>
                <li>Esta acción no se puede deshacer</li>
              </ul>
            </div>
          </div>
        )}
      </ActionModal>
    </MainLayout>
  )
}
