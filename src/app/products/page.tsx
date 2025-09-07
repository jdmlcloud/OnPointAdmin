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
import { useProducts } from "@/hooks/use-products"
import { 
  Plus, 
  Search, 
  Filter,
  Package,
  DollarSign,
  BarChart3,
  Edit,
  Trash2,
  Eye,
  Upload,
  Download,
  Share
} from "lucide-react"

interface Product {
  id: string
  name: string
  description?: string
  category: string
  providerName?: string
  price: number
  currency?: string
  stock?: number
  images?: string[]
  status: string
  createdAt: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
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

  // Usar hook de productos para datos reales de DynamoDB
  const { products, isLoading, error, refreshProducts } = useProducts()

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.providerName && product.providerName.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  // Recargar datos cuando se regrese de crear un producto
  useEffect(() => {
    refreshProducts()
  }, [])

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error al cargar productos: {error}</p>
            <Button onClick={refreshProducts}>Reintentar</Button>
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
            <h1 className="text-3xl font-bold">Gestión de Productos</h1>
            <p className="text-muted-foreground">
              CRUD de productos, variantes y precios escalonados
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => router.push('/products/import')}>
              <Upload className="h-4 w-4 mr-2" />
              Importar CSV
            </Button>
            <Button onClick={() => router.push('/products/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
        </div>
        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Buscar productos..."
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
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{products.length}</p>
                  <p className="text-sm text-muted-foreground">Total Productos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    ${products.reduce((sum, p) => sum + (p.price || 0), 0).toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground">Valor Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {products.reduce((sum, p) => sum + (p.stock || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Stock Total</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Package className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {products.filter(p => (p.stock || 0) < 10).length}
                  </p>
                  <p className="text-sm text-muted-foreground">Stock Bajo</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{product.name}</CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{product.category}</Badge>
                        <Badge variant={product.status === "active" ? "default" : "secondary"}>
                          {product.status === "active" ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4">
                  {product.description || "Sin descripción"}
                </CardDescription>
                
                <div className="space-y-2 mb-4">
                  {product.providerName && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Proveedor:</span>
                      <span className="font-medium">{product.providerName}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Precio:</span>
                    <span className="font-medium">${product.price} {product.currency || 'USD'}</span>
                  </div>
                  {product.stock !== undefined && (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Stock:</span>
                      <span className={`font-medium ${product.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                        {product.stock} unidades
                      </span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <AnimatedButton 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleView(product)}
                    animation="pulse"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="outline" 
                    size="sm" 
                    className="flex-1"
                    onClick={() => handleEdit(product)}
                    animation="pulse"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </AnimatedButton>
                  <AnimatedButton 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDelete(product)}
                    animation="pulse"
                  >
                    <Trash2 className="h-4 w-4" />
                  </AnimatedButton>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No hay productos</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm ? "No se encontraron productos con ese criterio de búsqueda." : "Comienza agregando tu primer producto."}
            </p>
            <Button onClick={() => router.push('/products/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>
        )}
      </div>

      {/* Modales */}
      <ActionModal
        isOpen={modals.view.isOpen}
        onClose={() => closeModal('view')}
        title="Detalles del Producto"
        description="Información completa del producto"
        type="view"
      >
        {modals.view.data && (
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">{modals.view.data.name}</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{modals.view.data.category}</Badge>
                  <Badge variant={modals.view.data.isActive ? "default" : "secondary"}>
                    {modals.view.data.isActive ? "Activo" : "Inactivo"}
                  </Badge>
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
                  <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
                  <p className="text-sm">{modals.view.data.providerName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Precio</label>
                  <p className="text-sm font-semibold">${modals.view.data.price} {modals.view.data.currency}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Stock</label>
                  <p className={`text-sm font-semibold ${modals.view.data.stock < 10 ? 'text-red-500' : 'text-green-500'}`}>
                    {modals.view.data.stock} unidades
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Fecha de Creación</label>
                  <p className="text-sm">{new Date(modals.view.data.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              
              {modals.view.data.images && modals.view.data.images.length > 0 && (
                <div>
                  <label className="text-sm font-medium text-muted-foreground">Imágenes</label>
                  <div className="flex gap-2 mt-2">
                    {modals.view.data.images.map((image: string, index: number) => (
                      <img 
                        key={index}
                        src={image} 
                        alt={`${modals.view.data.name} ${index + 1}`}
                        className="w-16 h-16 rounded-lg object-cover border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </ActionModal>

      <ActionModal
        isOpen={modals.edit.isOpen}
        onClose={() => closeModal('edit')}
        title="Editar Producto"
        description="Modifica la información del producto"
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
                <label className="text-sm font-medium">Categoría</label>
                <Input 
                  defaultValue={modals.edit.data.category}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <textarea 
                defaultValue={modals.edit.data.description}
                className="w-full mt-1 p-2 border rounded-md resize-none h-20"
                placeholder="Descripción del producto..."
              />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-sm font-medium">Precio</label>
                <Input 
                  type="number"
                  defaultValue={modals.edit.data.price}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Stock</label>
                <Input 
                  type="number"
                  defaultValue={modals.edit.data.stock}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-sm font-medium">Moneda</label>
                <Input 
                  defaultValue={modals.edit.data.currency}
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
        title="Eliminar Producto"
        description="¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer."
        type="delete"
        onConfirm={() => handleDeleteConfirm(modals.delete.data)}
        loadingKey="delete-item"
        destructive
      >
        {modals.delete.data && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
              <Package className="h-8 w-8 text-red-600" />
              <div>
                <h4 className="font-medium text-red-900 dark:text-red-100">
                  {modals.delete.data.name}
                </h4>
                <p className="text-sm text-red-700 dark:text-red-300">
                  {modals.delete.data.category} - ${modals.delete.data.price} {modals.delete.data.currency}
                </p>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground">
              <p>Al eliminar este producto:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Se eliminará de todas las cotizaciones pendientes</li>
                <li>Se cancelarán las propuestas que lo incluyan</li>
                <li>Esta acción no se puede deshacer</li>
              </ul>
            </div>
          </div>
        )}
      </ActionModal>
    </MainLayout>
  )
}
