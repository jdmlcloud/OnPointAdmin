"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useProducts } from "@/hooks/use-products"
import { ArrowLeft, Package, Save, X } from "lucide-react"

export default function NewProductPage() {
  const router = useRouter()
  const { createProduct } = useProducts()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    currency: 'USD',
    stock: '',
    providerName: '',
    status: 'active',
    // Campos específicos para merch
    sku: '',
    capacity: '',
    materials: '',
    dimensions: {
      width: '',
      height: '',
      depth: ''
    },
    weight: '',
    printingArea: {
      width: '',
      height: ''
    },
    printingMethods: '',
    packaging: {
      quantity: '',
      dimensions: {
        width: '',
        height: '',
        depth: ''
      },
      weight: ''
    },
    decorationOptions: '',
    minOrderQuantity: '',
    leadTime: ''
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // Manejar campos anidados
    if (name.includes('.')) {
      const [parent, child] = name.split('.')
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any>),
          [child]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    if (!formData.name || !formData.category || !formData.price) {
      alert('Por favor completa todos los campos requeridos')
      return
    }

    setIsLoading(true)
    
    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        category: formData.category,
        price: Number(formData.price),
        currency: formData.currency,
        stock: Number(formData.stock) || 0,
        providerName: formData.providerName,
        status: formData.status,
        images: [],
        // Campos específicos para merch
        sku: formData.sku,
        capacity: formData.capacity,
        materials: formData.materials ? formData.materials.split(',').map(m => m.trim()) : [],
        dimensions: formData.dimensions.width ? {
          width: Number(formData.dimensions.width),
          height: Number(formData.dimensions.height),
          depth: formData.dimensions.depth ? Number(formData.dimensions.depth) : undefined
        } : undefined,
        weight: formData.weight ? Number(formData.weight) : undefined,
        printingArea: formData.printingArea.width ? {
          width: Number(formData.printingArea.width),
          height: Number(formData.printingArea.height)
        } : undefined,
        printingMethods: formData.printingMethods ? formData.printingMethods.split(',').map(m => m.trim()) : [],
        packaging: formData.packaging.quantity ? {
          quantity: Number(formData.packaging.quantity),
          dimensions: {
            width: Number(formData.packaging.dimensions.width),
            height: Number(formData.packaging.dimensions.height),
            depth: formData.packaging.dimensions.depth ? Number(formData.packaging.dimensions.depth) : undefined
          },
          weight: Number(formData.packaging.weight)
        } : undefined,
        decorationOptions: formData.decorationOptions ? formData.decorationOptions.split(',').map(o => o.trim()) : [],
        minOrderQuantity: formData.minOrderQuantity ? Number(formData.minOrderQuantity) : undefined,
        leadTime: formData.leadTime
      }

      const success = await createProduct(productData)
      
      if (success) {
        router.push('/products')
      } else {
        alert('Error al crear el producto')
      }
    } catch (error) {
      console.error('Error creating product:', error)
      alert('Error al crear el producto')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Nuevo Producto</h1>
            <p className="text-muted-foreground">
              Agrega un nuevo producto merch a tu inventario
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Información del Producto
            </CardTitle>
            <CardDescription>
              Completa la información del producto merch
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Termo BAAL"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Categoría *</Label>
                  <Input
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="Ej: Bebidas, Electrónica"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="price">Precio *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="0.00"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="currency">Moneda</Label>
                  <select
                    id="currency"
                    name="currency"
                    value={formData.currency}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-input bg-background rounded-md"
                  >
                    <option value="USD">USD</option>
                    <option value="MXN">MXN</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="stock">Stock Inicial</Label>
                  <Input
                    id="stock"
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleInputChange}
                    placeholder="0"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="providerName">Proveedor</Label>
                  <Input
                    id="providerName"
                    name="providerName"
                    value={formData.providerName}
                    onChange={handleInputChange}
                    placeholder="Nombre del proveedor"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="sku">SKU</Label>
                  <Input
                    id="sku"
                    name="sku"
                    value={formData.sku}
                    onChange={handleInputChange}
                    placeholder="Código del producto"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacidad</Label>
                  <Input
                    id="capacity"
                    name="capacity"
                    value={formData.capacity}
                    onChange={handleInputChange}
                    placeholder="Ej: 660ml, 500ml"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="materials">Materiales</Label>
                  <Input
                    id="materials"
                    name="materials"
                    value={formData.materials}
                    onChange={handleInputChange}
                    placeholder="Acero inoxidable, Silicón (separados por comas)"
                  />
                </div>
              </div>

              {/* Descripción */}
              <div className="space-y-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe las características y beneficios del producto..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Estado */}
              <div className="space-y-2">
                <Label htmlFor="status">Estado</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-input bg-background rounded-md"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                  <option value="discontinued">Descontinuado</option>
                </select>
              </div>

              {/* Especificaciones Técnicas */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Especificaciones Técnicas</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dimensions.width">Ancho (cm)</Label>
                    <Input
                      id="dimensions.width"
                      name="dimensions.width"
                      type="number"
                      step="0.1"
                      value={formData.dimensions.width}
                      onChange={handleInputChange}
                      placeholder="9.3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions.height">Alto (cm)</Label>
                    <Input
                      id="dimensions.height"
                      name="dimensions.height"
                      type="number"
                      step="0.1"
                      value={formData.dimensions.height}
                      onChange={handleInputChange}
                      placeholder="20.5"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dimensions.depth">Profundidad (cm)</Label>
                    <Input
                      id="dimensions.depth"
                      name="dimensions.depth"
                      type="number"
                      step="0.1"
                      value={formData.dimensions.depth}
                      onChange={handleInputChange}
                      placeholder="Opcional"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="weight">Peso (g)</Label>
                    <Input
                      id="weight"
                      name="weight"
                      type="number"
                      value={formData.weight}
                      onChange={handleInputChange}
                      placeholder="500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="printingArea.width">Área Impresión - Ancho (cm)</Label>
                    <Input
                      id="printingArea.width"
                      name="printingArea.width"
                      type="number"
                      step="0.1"
                      value={formData.printingArea.width}
                      onChange={handleInputChange}
                      placeholder="8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="printingArea.height">Área Impresión - Alto (cm)</Label>
                    <Input
                      id="printingArea.height"
                      name="printingArea.height"
                      type="number"
                      step="0.1"
                      value={formData.printingArea.height}
                      onChange={handleInputChange}
                      placeholder="7"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="printingMethods">Métodos de Impresión</Label>
                  <Input
                    id="printingMethods"
                    name="printingMethods"
                    value={formData.printingMethods}
                    onChange={handleInputChange}
                    placeholder="Grabado Láser, Serigrafía, Tampografía (separados por comas)"
                  />
                </div>
              </div>

              {/* Información de Empaque */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Información de Empaque</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="packaging.quantity">Cantidad por Empaque</Label>
                    <Input
                      id="packaging.quantity"
                      name="packaging.quantity"
                      type="number"
                      value={formData.packaging.quantity}
                      onChange={handleInputChange}
                      placeholder="25"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packaging.dimensions.width">Ancho Empaque (cm)</Label>
                    <Input
                      id="packaging.dimensions.width"
                      name="packaging.dimensions.width"
                      type="number"
                      step="0.1"
                      value={formData.packaging.dimensions.width}
                      onChange={handleInputChange}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packaging.dimensions.height">Alto Empaque (cm)</Label>
                    <Input
                      id="packaging.dimensions.height"
                      name="packaging.dimensions.height"
                      type="number"
                      step="0.1"
                      value={formData.packaging.dimensions.height}
                      onChange={handleInputChange}
                      placeholder="50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="packaging.weight">Peso Empaque (kg)</Label>
                    <Input
                      id="packaging.weight"
                      name="packaging.weight"
                      type="number"
                      step="0.1"
                      value={formData.packaging.weight}
                      onChange={handleInputChange}
                      placeholder="21.0"
                    />
                  </div>
                </div>
              </div>

              {/* Información Adicional */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">Información Adicional</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="decorationOptions">Opciones de Decoración</Label>
                    <Input
                      id="decorationOptions"
                      name="decorationOptions"
                      value={formData.decorationOptions}
                      onChange={handleInputChange}
                      placeholder="Ninguno, Logo, Texto (separados por comas)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="minOrderQuantity">Cantidad Mínima de Pedido</Label>
                    <Input
                      id="minOrderQuantity"
                      name="minOrderQuantity"
                      type="number"
                      value={formData.minOrderQuantity}
                      onChange={handleInputChange}
                      placeholder="100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="leadTime">Tiempo de Entrega</Label>
                    <Input
                      id="leadTime"
                      name="leadTime"
                      value={formData.leadTime}
                      onChange={handleInputChange}
                      placeholder="15-20 días hábiles"
                    />
                  </div>
                </div>
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      Creando...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Producto
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}