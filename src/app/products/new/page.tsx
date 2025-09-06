"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  Trash2,
  Package,
  DollarSign,
  BarChart3,
  Image as ImageIcon
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

const productSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  category: z.string().min(1, "La categoría es requerida"),
  subcategory: z.string().optional(),
  providerId: z.string().min(1, "El proveedor es requerido"),
  variants: z.array(z.object({
    name: z.string().min(1, "Nombre de variante requerido"),
    type: z.enum(["color", "size", "material", "finish"]),
    value: z.string().min(1, "Valor requerido"),
    additionalCost: z.number().optional(),
  })).optional(),
  pricing: z.array(z.object({
    minQuantity: z.number().min(1, "Cantidad mínima requerida"),
    maxQuantity: z.number().optional(),
    price: z.number().min(0, "Precio debe ser mayor a 0"),
    currency: z.string().default("USD"),
    discount: z.number().optional(),
  })).min(1, "Al menos un precio es requerido"),
  stock: z.object({
    available: z.number().min(0, "Stock debe ser mayor o igual a 0"),
    reserved: z.number().min(0, "Stock reservado debe ser mayor o igual a 0"),
    minimum: z.number().min(0, "Stock mínimo debe ser mayor o igual a 0"),
  }),
  specifications: z.record(z.any()).optional(),
  isActive: z.boolean(),
})

type ProductFormData = z.infer<typeof productSchema>

export default function NewProductPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [images, setImages] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      subcategory: "",
      providerId: "",
      variants: [],
      pricing: [
        {
          minQuantity: 1,
          maxQuantity: 10,
          price: 0,
          currency: "USD",
          discount: 0,
        }
      ],
      stock: {
        available: 0,
        reserved: 0,
        minimum: 0,
      },
      specifications: {},
      isActive: true,
    },
  })

  const variants = watch("variants") || []
  const pricing = watch("pricing") || []

  const addVariant = () => {
    const newVariants = [...variants, {
      name: "",
      type: "color" as const,
      value: "",
      additionalCost: 0,
    }]
    setValue("variants", newVariants)
  }

  const removeVariant = (index: number) => {
    const newVariants = variants.filter((_, i) => i !== index)
    setValue("variants", newVariants)
  }

  const addPricingTier = () => {
    const newPricing = [...pricing, {
      minQuantity: pricing.length > 0 ? (pricing[pricing.length - 1].maxQuantity || 0) + 1 : 1,
      maxQuantity: undefined,
      price: 0,
      currency: "USD",
      discount: 0,
    }]
    setValue("pricing", newPricing)
  }

  const removePricingTier = (index: number) => {
    if (pricing.length > 1) {
      const newPricing = pricing.filter((_, i) => i !== index)
      setValue("pricing", newPricing)
    }
  }

  const onSubmit = async (data: ProductFormData) => {
    setIsLoading(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Producto creado",
        description: "El producto se ha creado exitosamente.",
      })
      
      router.push("/products")
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al crear el producto.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
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
              Agrega un nuevo producto al catálogo
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="basic" className="space-y-6">
            <TabsList>
              <TabsTrigger value="basic">Información Básica</TabsTrigger>
              <TabsTrigger value="variants">Variantes</TabsTrigger>
              <TabsTrigger value="pricing">Precios</TabsTrigger>
              <TabsTrigger value="stock">Stock</TabsTrigger>
            </TabsList>

            {/* Información Básica */}
            <TabsContent value="basic" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Información del Producto
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Producto *</Label>
                        <Input
                          id="name"
                          {...register("name")}
                          placeholder="Ej: Taza Personalizada"
                        />
                        {errors.name && (
                          <p className="text-sm text-destructive">{errors.name.message}</p>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Descripción</Label>
                        <Textarea
                          id="description"
                          {...register("description")}
                          placeholder="Descripción detallada del producto..."
                          rows={4}
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Categoría *</Label>
                          <Select
                            value={watch("category")}
                            onValueChange={(value) => setValue("category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="promocionales">Promocionales</SelectItem>
                              <SelectItem value="textiles">Textiles</SelectItem>
                              <SelectItem value="tecnologia">Tecnología</SelectItem>
                              <SelectItem value="hogar">Hogar</SelectItem>
                              <SelectItem value="oficina">Oficina</SelectItem>
                            </SelectContent>
                          </Select>
                          {errors.category && (
                            <p className="text-sm text-destructive">{errors.category.message}</p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="subcategory">Subcategoría</Label>
                          <Input
                            id="subcategory"
                            {...register("subcategory")}
                            placeholder="Ej: Tazas, Camisetas"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="providerId">Proveedor *</Label>
                        <Select
                          value={watch("providerId")}
                          onValueChange={(value) => setValue("providerId", value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona un proveedor" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Proveedor Ejemplo S.A.</SelectItem>
                            <SelectItem value="2">Textiles del Norte</SelectItem>
                            <SelectItem value="3">Promocionales Plus</SelectItem>
                          </SelectContent>
                        </Select>
                        {errors.providerId && (
                          <p className="text-sm text-destructive">{errors.providerId.message}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                  {/* Imágenes */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <ImageIcon className="h-5 w-5" />
                        Imágenes
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mb-2">
                          Arrastra y suelta las imágenes aquí
                        </p>
                        <Button variant="outline" size="sm">
                          Seleccionar Archivos
                        </Button>
                      </div>
                      {images.length > 0 && (
                        <div className="text-sm text-muted-foreground">
                          {images.length} archivo(s) seleccionado(s)
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Estado */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Estado</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="isActive"
                          checked={watch("isActive")}
                          onCheckedChange={(checked) => setValue("isActive", !!checked)}
                        />
                        <Label htmlFor="isActive">Producto Activo</Label>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Variantes */}
            <TabsContent value="variants" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Variantes del Producto</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addVariant}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Variante
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Define las diferentes opciones disponibles (colores, tamaños, etc.)
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {variants.map((variant, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Variante {index + 1}</h4>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label>Nombre</Label>
                          <Input
                            {...register(`variants.${index}.name`)}
                            placeholder="Ej: Color, Tamaño"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Tipo</Label>
                          <Select
                            value={watch(`variants.${index}.type`)}
                            onValueChange={(value) => setValue(`variants.${index}.type`, value as any)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="color">Color</SelectItem>
                              <SelectItem value="size">Tamaño</SelectItem>
                              <SelectItem value="material">Material</SelectItem>
                              <SelectItem value="finish">Acabado</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Valor</Label>
                          <Input
                            {...register(`variants.${index}.value`)}
                            placeholder="Ej: Rojo, Grande"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Costo Adicional</Label>
                        <Input
                          type="number"
                          step="0.01"
                          {...register(`variants.${index}.additionalCost`, { valueAsNumber: true })}
                          placeholder="0.00"
                        />
                      </div>
                    </div>
                  ))}
                  {variants.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                      <Package className="h-12 w-12 mx-auto mb-4" />
                      <p>No hay variantes definidas</p>
                      <p className="text-sm">Agrega variantes para ofrecer opciones al cliente</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Precios */}
            <TabsContent value="pricing" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Precios por Volumen</span>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addPricingTier}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Nivel
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Define precios escalonados según la cantidad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {pricing.map((tier, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium">Nivel de Precio {index + 1}</h4>
                        {pricing.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removePricingTier(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="space-y-2">
                          <Label>Cantidad Mínima *</Label>
                          <Input
                            type="number"
                            {...register(`pricing.${index}.minQuantity`, { valueAsNumber: true })}
                            placeholder="1"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Cantidad Máxima</Label>
                          <Input
                            type="number"
                            {...register(`pricing.${index}.maxQuantity`, { valueAsNumber: true })}
                            placeholder="Sin límite"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Precio *</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`pricing.${index}.price`, { valueAsNumber: true })}
                            placeholder="0.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Descuento (%)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            {...register(`pricing.${index}.discount`, { valueAsNumber: true })}
                            placeholder="0"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Stock */}
            <TabsContent value="stock" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5" />
                    Control de Stock
                  </CardTitle>
                  <CardDescription>
                    Configura los niveles de inventario
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="available">Stock Disponible *</Label>
                      <Input
                        id="available"
                        type="number"
                        {...register("stock.available", { valueAsNumber: true })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="reserved">Stock Reservado</Label>
                      <Input
                        id="reserved"
                        type="number"
                        {...register("stock.reserved", { valueAsNumber: true })}
                        placeholder="0"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="minimum">Stock Mínimo</Label>
                      <Input
                        id="minimum"
                        type="number"
                        {...register("stock.minimum", { valueAsNumber: true })}
                        placeholder="0"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Acciones */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Producto
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
