"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ActionModal } from "@/components/ui/action-modal"
import { useCardActions } from "@/hooks/use-card-actions"
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
  Share
} from "lucide-react"

interface Provider {
  id: string
  name: string
  description?: string
  logo?: string
  website?: string
  email: string
  phone?: string
  rating: number
  isActive: boolean
  createdAt: string
}

export default function ProvidersPage() {
  const router = useRouter()
  const [providers, setProviders] = useState<Provider[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)
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

  // Simular carga de datos
  useState(() => {
    setTimeout(() => {
      setProviders([
        {
          id: "1",
          name: "Proveedor Ejemplo S.A.",
          description: "Especialistas en productos promocionales",
          email: "contacto@proveedor.com",
          phone: "+52 55 1234 5678",
          website: "https://proveedor.com",
          rating: 4.5,
          isActive: true,
          createdAt: "2024-01-15T10:00:00Z"
        }
      ])
      setIsLoading(false)
    }, 1000)
  })

  const filteredProviders = providers.filter(provider =>
    provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    provider.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
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
              placeholder="Buscar proveedores..."
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

        {/* Providers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProviders.map((provider) => (
            <Card key={provider.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    {provider.logo ? (
                      <img 
                        src={provider.logo} 
                        alt={provider.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
                        <Building2 className="h-6 w-6 text-muted-foreground" />
                      </div>
                    )}
                    <div>
                      <CardTitle className="text-lg">{provider.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant={provider.isActive ? "default" : "secondary"}>
                          {provider.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm">{provider.rating}/5</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {provider.description || "Sin descripción"}
                </CardDescription>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{provider.email}</span>
                  </div>
                  {provider.phone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{provider.phone}</span>
                    </div>
                  )}
                  {provider.website && (
                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={provider.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        {provider.website}
                      </a>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
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
              {modals.view.data.logo && (
                <img 
                  src={modals.view.data.logo} 
                  alt={modals.view.data.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h3 className="text-lg font-semibold">{modals.view.data.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant={modals.view.data.isActive ? "default" : "secondary"}>
                    {modals.view.data.isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm">{modals.view.data.rating}/5</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
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
                    <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                    <p className="text-sm">{modals.view.data.phone}</p>
                  </div>
                )}
              </div>
              
              {modals.view.data.website && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Sitio Web</label>
                  <a 
                    href={modals.view.data.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:underline text-sm"
                  >
                    {modals.view.data.website}
                  </a>
                </div>
              )}
              
              <div>
                <label className="text-sm font-medium text-muted-foreground">Fecha de Registro</label>
                <p className="text-sm">{new Date(modals.view.data.createdAt).toLocaleDateString()}</p>
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
        onConfirm={() => handleSave(modals.edit.data)}
        loadingKey="save-item"
      >
        {modals.edit.data && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Nombre</label>
                <Input 
                  defaultValue={modals.edit.data.name}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Email</label>
                <Input 
                  type="email"
                  defaultValue={modals.edit.data.email}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <textarea 
                defaultValue={modals.edit.data.description}
                className="w-full mt-1 p-2 border rounded-md resize-none h-20"
                placeholder="Descripción del proveedor..."
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium">Teléfono</label>
                <Input 
                  defaultValue={modals.edit.data.phone}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Sitio Web</label>
                <Input 
                  defaultValue={modals.edit.data.website}
                  className="mt-1"
                />
              </div>
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
        onConfirm={() => handleDeleteConfirm(modals.delete.data)}
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
