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
import { ProductListSkeleton } from "@/components/ui/product-skeleton"
import { AssetCard } from "@/components/ui/asset-card"
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
  Share,
  Star,
  ShoppingCart,
  Tag,
  Calendar,
  TrendingUp,
  Building2
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
  // Campos específicos para merch
  sku?: string
  colors?: Array<{
    name: string
    hex: string
    stock: number
  }>
  materials?: string[]
  dimensions?: {
    width: number
    height: number
    depth?: number
  }
  weight?: number
  capacity?: string
  printingArea?: {
    width: number
    height: number
  }
  printingMethods?: string[]
  packaging?: {
    quantity: number
    dimensions: {
      width: number
      height: number
      depth?: number
    }
    weight: number
  }
  decorationOptions?: string[]
  minOrderQuantity?: number
  leadTime?: string
}

export default function ProductsPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilters, setActiveFilters] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)
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

  // Usar hook de productos para datos reales de DynamoDB
  const { products, isLoading, error, refreshProducts, createProduct, updateProduct, deleteProduct } = useProducts()

  const filteredProducts = products.filter(product => {
    const searchLower = searchTerm.toLowerCase()
    
    // Aplicar filtros activos
    for (const filter of activeFilters) {
      switch (filter) {
        case 'status:active':
          if (product.status !== 'active') return false
          break
        case 'status:inactive':
          if (product.status !== 'inactive') return false
          break
        case 'stock:low':
          if ((product.stock || 0) > 10) return false
          break
        case 'stock:out':
          if ((product.stock || 0) > 0) return false
          break
        case 'price:high':
          if (product.price < 100) return false
          break
        case 'price:low':
          if (product.price >= 100) return false
          break
        default:
          // Filtro por categoría específica
          if (filter.startsWith('category:')) {
            const categoryFilter = filter.replace('category:', '')
            if (!product.category.toLowerCase().includes(categoryFilter.toLowerCase())) return false
          }
      }
    }
    
    // Filtro de búsqueda
    return (
      product.name.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower) ||
      (product.description && product.description.toLowerCase().includes(searchLower)) ||
      (product.providerName && product.providerName.toLowerCase().includes(searchLower))
    )
  })

  // Función personalizada para guardar cambios
  const handleSaveProduct = async (productData: any) => {
    try {
      // Recopilar datos del formulario
      const formData = {
        name: (document.getElementById('edit-name') as HTMLInputElement)?.value || productData.name,
        description: (document.getElementById('edit-description') as HTMLTextAreaElement)?.value || productData.description,
        category: (document.getElementById('edit-category') as HTMLInputElement)?.value || productData.category,
        price: Number((document.getElementById('edit-price') as HTMLInputElement)?.value || productData.price),
        currency: (document.getElementById('edit-currency') as HTMLSelectElement)?.value || productData.currency || 'USD',
        stock: Number((document.getElementById('edit-stock') as HTMLInputElement)?.value || productData.stock || 0),
        providerName: (document.getElementById('edit-provider') as HTMLInputElement)?.value || productData.providerName,
        status: (document.getElementById('edit-status') as HTMLSelectElement)?.value || productData.status,
        images: productData.images || [],
        // Campos específicos para merch
        sku: (document.getElementById('edit-sku') as HTMLInputElement)?.value || productData.sku || '',
        capacity: (document.getElementById('edit-capacity') as HTMLInputElement)?.value || productData.capacity || '',
        // Mantener campos existentes
        colors: productData.colors || [],
        materials: productData.materials || [],
        dimensions: productData.dimensions,
        weight: productData.weight,
        printingArea: productData.printingArea,
        printingMethods: productData.printingMethods || [],
        packaging: productData.packaging,
        decorationOptions: productData.decorationOptions || [],
        minOrderQuantity: productData.minOrderQuantity,
        leadTime: productData.leadTime
      }

      const success = await updateProduct(productData.id, formData)
      if (success) {
        closeModal('edit')
        await refreshProducts()
        return true
      }
      return false
    } catch (error) {
      console.error('Error saving product:', error)
      return false
    }
  }

  // Función personalizada para eliminar
  const handleDeleteProduct = async (productData: any) => {
    try {
      const success = await deleteProduct(productData.id)
      if (success) {
        closeModal('delete')
        await refreshProducts()
        return true
      }
      return false
    } catch (error) {
      console.error('Error deleting product:', error)
      return false
    }
  }

  // Función para formatear precio
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: currency
    }).format(price)
  }

  // Función para obtener el color del badge de estado
  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'discontinued': return 'destructive'
      default: return 'outline'
    }
  }

  // Función para obtener el texto del estado
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'inactive': return 'Inactivo'
      case 'discontinued': return 'Descontinuado'
      default: return status
    }
  }

  // Obtener categorías únicas para filtros
  const categories = [...new Set(products.map(p => p.category))]

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Gestión de Productos</h1>
              <p className="text-muted-foreground">
                Administra tu catálogo de productos
              </p>
            </div>
            <Button onClick={() => router.push('/products/new')}>
              <Plus className="h-4 w-4 mr-2" />
              Nuevo Producto
            </Button>
          </div>
          <ProductListSkeleton />
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-xl font-semibold mb-2">Error al cargar productos</h2>
            <p className="text-muted-foreground mb-4">{error}</p>
            <Button onClick={refreshProducts}>
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
            <h1 className="text-3xl font-bold">Gestión de Productos</h1>
            <p className="text-muted-foreground">
              Administra tu catálogo de productos ({filteredProducts.length} productos)
            </p>
          </div>
          <Button onClick={() => router.push('/products/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Producto
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar productos por nombre, categoría o proveedor..."
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
                { key: 'stock:low', label: 'Stock bajo', icon: '⚠️' },
                { key: 'stock:out', label: 'Sin stock', icon: '🚫' },
                { key: 'price:high', label: 'Precio alto', icon: '💰' },
                { key: 'price:low', label: 'Precio bajo', icon: '💵' }
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

            {/* Filtros por Categoría */}
            {categories.length > 0 && (
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
                    {filter === 'stock:low' && '⚠️ Stock bajo'}
                    {filter === 'stock:out' && '🚫 Sin stock'}
                    {filter === 'price:high' && '💰 Precio alto'}
                    {filter === 'price:low' && '💵 Precio bajo'}
                    {filter.startsWith('category:') && `🏷️ ${filter.replace('category:', '')}`}
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

        {/* Products Grid */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <AssetCard
              key={product.id}
              id={product.id}
              name={product.name}
              description={product.description}
              thumbnailUrl={product.images?.[0]}
              fallbackText="Sin imagen"
              type="product"
              productData={{
                category: product.category,
                price: product.price,
                status: product.status,
                tags: product.tags
              }}
              onView={() => handleView(product)}
              onEdit={() => handleEdit(product)}
              onDelete={() => handleDelete(product)}
              className="h-full"
              maxWidth="max-w-none"
            />
          ))}
          </div>
        </div>
      </div>

      {/* Modales */}
      <ActionModal
        isOpen={modals.view.isOpen}
        onClose={() => closeModal('view')}
        title="Detalles del Producto"
        size="lg"
      >
        {modals.view.data && (
          <div className="space-y-6">
            {/* Imagen del producto */}
            <div className="flex justify-center">
              {modals.view.data.images && modals.view.data.images.length > 0 ? (
                <img 
                  src={modals.view.data.images[0]} 
                  alt={modals.view.data.name}
                  className="w-48 h-48 object-cover rounded-lg"
                />
              ) : (
                <div className="w-48 h-48 bg-muted rounded-lg flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground" />
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
                <label className="text-sm font-medium text-muted-foreground">SKU</label>
                <p className="text-lg font-mono">{modals.view.data.sku || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Categoría</label>
                <p className="text-lg">{modals.view.data.category}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Precio</label>
                <p className="text-lg font-semibold text-green-600">{formatPrice(modals.view.data.price, modals.view.data.currency)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Stock Total</label>
                <p className="text-lg">{modals.view.data.stock || 0} unidades</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Estado</label>
                <Badge variant={getStatusBadgeVariant(modals.view.data.status)}>
                  {getStatusText(modals.view.data.status)}
                </Badge>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Proveedor</label>
                <p className="text-lg">{modals.view.data.providerName || 'No especificado'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Capacidad</label>
                <p className="text-lg">{modals.view.data.capacity || 'No especificado'}</p>
              </div>
            </div>

            {/* Colores disponibles */}
            {modals.view.data.colors && modals.view.data.colors.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Colores Disponibles</label>
                <div className="grid grid-cols-4 gap-2 mt-2">
                  {modals.view.data.colors.map((color: any, index: number) => (
                    <div key={index} className="flex items-center gap-2 p-2 border rounded">
                      <div
                        className="w-6 h-6 rounded-full border border-gray-300"
                        style={{ backgroundColor: color.hex }}
                      />
                      <div>
                        <p className="text-sm font-medium">{color.name}</p>
                        <p className="text-xs text-muted-foreground">Stock: {color.stock}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Información técnica */}
            {(modals.view.data.dimensions || modals.view.data.weight || modals.view.data.materials) && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Especificaciones Técnicas</label>
                <div className="grid grid-cols-3 gap-4 mt-2">
                  {modals.view.data.dimensions && (
                    <div>
                      <p className="text-sm font-medium">Dimensiones</p>
                      <p className="text-sm text-muted-foreground">
                        {modals.view.data.dimensions.width} x {modals.view.data.dimensions.height}
                        {modals.view.data.dimensions.depth && ` x ${modals.view.data.dimensions.depth}`} cm
                      </p>
                    </div>
                  )}
                  {modals.view.data.weight && (
                    <div>
                      <p className="text-sm font-medium">Peso</p>
                      <p className="text-sm text-muted-foreground">{modals.view.data.weight} g</p>
                    </div>
                  )}
                  {modals.view.data.materials && modals.view.data.materials.length > 0 && (
                    <div>
                      <p className="text-sm font-medium">Materiales</p>
                      <p className="text-sm text-muted-foreground">{modals.view.data.materials.join(', ')}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Área de impresión */}
            {modals.view.data.printingArea && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Área de Impresión</label>
                <p className="text-lg">{modals.view.data.printingArea.width} x {modals.view.data.printingArea.height} cm</p>
              </div>
            )}

            {/* Métodos de impresión */}
            {modals.view.data.printingMethods && modals.view.data.printingMethods.length > 0 && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Métodos de Impresión</label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {modals.view.data.printingMethods.map((method: string, index: number) => (
                    <Badge key={index} variant="outline">{method}</Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Información de empaque */}
            {modals.view.data.packaging && (
              <div>
                <label className="text-sm font-medium text-muted-foreground">Información de Empaque</label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <p className="text-sm font-medium">Cantidad por empaque</p>
                    <p className="text-sm text-muted-foreground">{modals.view.data.packaging.quantity} unidades</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Dimensiones del empaque</p>
                    <p className="text-sm text-muted-foreground">
                      {modals.view.data.packaging.dimensions.width} x {modals.view.data.packaging.dimensions.height}
                      {modals.view.data.packaging.dimensions.depth && ` x ${modals.view.data.packaging.dimensions.depth}`} cm
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Peso del empaque</p>
                    <p className="text-sm text-muted-foreground">{modals.view.data.packaging.weight} kg</p>
                  </div>
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
                <label className="text-sm font-medium text-muted-foreground">Actualizado</label>
                <p className="text-sm">{new Date(modals.view.data.updatedAt || modals.view.data.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
        )}
      </ActionModal>

      <ActionModal
        isOpen={modals.edit.isOpen}
        onClose={() => closeModal('edit')}
        title="Editar Producto"
        size="lg"
        onSave={() => handleSaveProduct(modals.edit.data)}
      >
        {modals.edit.data && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit-name" className="block text-sm font-medium mb-2">Nombre *</label>
                <Input
                  id="edit-name"
                  defaultValue={modals.edit.data.name}
                  placeholder="Nombre del producto"
                />
              </div>
              <div>
                <label htmlFor="edit-sku" className="block text-sm font-medium mb-2">SKU</label>
                <Input
                  id="edit-sku"
                  defaultValue={modals.edit.data.sku || ''}
                  placeholder="Código del producto"
                />
              </div>
              <div>
                <label htmlFor="edit-category" className="block text-sm font-medium mb-2">Categoría *</label>
                <Input
                  id="edit-category"
                  defaultValue={modals.edit.data.category}
                  placeholder="Categoría del producto"
                />
              </div>
              <div>
                <label htmlFor="edit-capacity" className="block text-sm font-medium mb-2">Capacidad</label>
                <Input
                  id="edit-capacity"
                  defaultValue={modals.edit.data.capacity || ''}
                  placeholder="Ej: 660ml, 500ml"
                />
              </div>
              <div>
                <label htmlFor="edit-price" className="block text-sm font-medium mb-2">Precio *</label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  defaultValue={modals.edit.data.price}
                  placeholder="0.00"
                />
              </div>
              <div>
                <label htmlFor="edit-currency" className="block text-sm font-medium mb-2">Moneda</label>
                <select
                  id="edit-currency"
                  defaultValue={modals.edit.data.currency || 'USD'}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="USD">USD</option>
                  <option value="MXN">MXN</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div>
                <label htmlFor="edit-stock" className="block text-sm font-medium mb-2">Stock Total</label>
                <Input
                  id="edit-stock"
                  type="number"
                  defaultValue={modals.edit.data.stock || 0}
                  placeholder="0"
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
                  <option value="discontinued">Descontinuado</option>
                </select>
              </div>
            </div>
            
            <div>
              <label htmlFor="edit-description" className="block text-sm font-medium mb-2">Descripción</label>
              <textarea
                id="edit-description"
                defaultValue={modals.edit.data.description || ''}
                placeholder="Descripción del producto"
                className="w-full px-3 py-2 border border-input bg-background rounded-md min-h-[100px]"
              />
            </div>

            <div>
              <label htmlFor="edit-provider" className="block text-sm font-medium mb-2">Proveedor</label>
              <Input
                id="edit-provider"
                defaultValue={modals.edit.data.providerName || ''}
                placeholder="Nombre del proveedor"
              />
            </div>
          </div>
        )}
      </ActionModal>

      <ActionModal
        isOpen={modals.delete.isOpen}
        onClose={() => closeModal('delete')}
        title="Eliminar Producto"
        onSave={() => handleDeleteProduct(modals.delete.data)}
        saveText="Eliminar"
        saveVariant="destructive"
      >
        {modals.delete.data && (
          <div className="space-y-4">
            <p>¿Estás seguro de que quieres eliminar el producto <strong>{modals.delete.data.name}</strong>?</p>
            <p className="text-sm text-muted-foreground">Esta acción no se puede deshacer.</p>
          </div>
        )}
      </ActionModal>
    </MainLayout>
  )
}