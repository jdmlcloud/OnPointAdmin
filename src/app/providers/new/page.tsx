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
import { 
  ArrowLeft, 
  Save, 
  Upload, 
  Plus, 
  Trash2,
  Building2,
  Mail,
  Phone,
  Globe,
  MapPin
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useTags } from "@/hooks/use-tags"
import { TagSelector } from "@/components/ui/tag-selector"

const providerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phone: z.string().min(1, "El teléfono es requerido"),
  website: z.string().optional().or(z.literal("")),
  address: z.object({
    street: z.string().min(1, "La calle es requerida"),
    city: z.string().min(1, "La ciudad es requerida"),
    state: z.string().min(1, "El estado es requerido"),
    zipCode: z.string().min(1, "El código postal es requerido"),
    country: z.string().min(1, "El país es requerido"),
  }),
  contacts: z.array(z.object({
    name: z.string().min(1, "Nombre del contacto requerido"),
    position: z.string().min(1, "Posición requerida"),
    email: z.string().email("Email inválido"),
    phone: z.string().min(1, "El teléfono es requerido"),
    isPrimary: z.boolean(),
  })).min(1, "Al menos un contacto es requerido"),
  company: z.string().min(1, "La empresa es requerida"),
  logo: z.string().optional(),
  notes: z.string().optional(),
  tags: z.array(z.string()).optional(),
  isActive: z.boolean(),
})

type ProviderFormData = z.infer<typeof providerSchema>

export default function NewProviderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [logoPreview, setLogoPreview] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProviderFormData>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: "",
      description: "",
      email: "",
      phone: "",
      website: "",
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "México",
      },
      contacts: [
        {
          name: "",
          position: "",
          email: "",
          phone: "",
          isPrimary: true,
        }
      ],
      isActive: true,
    },
  })

  const contacts = watch("contacts")
  const [tags, setTags] = useState<string[]>([])
  const [logoUrl, setLogoUrl] = useState("")
  const { tags: availableTags } = useTags()

  // Función para comprimir imagen (reutilizada de providers/page.tsx)
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

  // Función para manejar la subida del logo
  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validar tamaño del archivo (máximo 5MB antes de compresión)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Error",
          description: "El archivo es demasiado grande. Máximo 5MB permitido.",
          variant: "destructive"
        })
        return
      }
      
      setLogoFile(file)
      
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

  // Función para eliminar el logo
  const handleLogoDelete = () => {
    setLogoFile(null)
    setLogoPreview(null)
    // Limpiar el input file
    const fileInput = document.getElementById('logo-input') as HTMLInputElement
    if (fileInput) {
      fileInput.value = ''
    }
  }

  const addContact = () => {
    const newContacts = [...contacts, {
      name: "",
      position: "",
      email: "",
      phone: "",
      isPrimary: false,
    }]
    setValue("contacts", newContacts)
  }

  const handleTagsChange = (newTags: string[]) => {
    setTags(newTags)
  }

  const removeContact = (index: number) => {
    if (contacts.length > 1) {
      const newContacts = contacts.filter((_, i) => i !== index)
      setValue("contacts", newContacts)
    }
  }

  const setPrimaryContact = (index: number) => {
    const newContacts = contacts.map((contact, i) => ({
      ...contact,
      isPrimary: i === index,
    }))
    setValue("contacts", newContacts)
  }

  const onSubmit = async (data: ProviderFormData) => {
    setIsLoading(true)
    try {
      // Preparar datos para la API
      const providerData = {
        name: data.name,
        email: data.email,
        company: data.name, // Usar el nombre como compañía por ahora
        phone: data.phone || '',
        description: data.description,
        website: data.website,
        address: data.address,
        contacts: data.contacts,
        tags: tags,
        status: data.isActive ? 'active' : 'inactive',
        logo: logoPreview || null,
        notes: ''
      }

      const response = await fetch('/api/providers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(providerData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || 'Error al crear proveedor')
      }
      
      toast({
        title: "Proveedor creado",
        description: result.message || "El proveedor se ha creado exitosamente.",
      })
      
      router.push("/providers")
    } catch (error) {
      console.error('Error creando proveedor:', error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Hubo un error al crear el proveedor.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <MainLayout>
      <div className="h-full flex flex-col">
        {/* Header - Fijo */}
        <div className="flex-shrink-0 mb-6">
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
              <h1 className="text-3xl font-bold">Nuevo Proveedor</h1>
              <p className="text-muted-foreground">
                Agrega un nuevo proveedor al sistema
              </p>
            </div>
          </div>
        </div>

        {/* Formulario - Con scroll invisible */}
        <div className="flex-1 overflow-auto scrollbar-hide">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Información Principal */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building2 className="h-5 w-5" />
                    Información Principal
                  </CardTitle>
                  <CardDescription>
                    Datos básicos del proveedor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nombre <span className="text-red-500">*</span></Label>
                      <Input
                        id="name"
                        {...register("name")}
                        placeholder="Nombre del proveedor"
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        placeholder="contacto@proveedor.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="company">Empresa <span className="text-red-500">*</span></Label>
                    <Input
                      id="company"
                      {...register("company")}
                      placeholder="Nombre de la empresa"
                    />
                    {errors.company && (
                      <p className="text-sm text-destructive">{errors.company.message}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      {...register("description")}
                      placeholder="Descripción del proveedor..."
                      rows={3}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Teléfono <span className="text-red-500">*</span></Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="+52 55 1234 5678"
                        defaultValue="+52"
                      />
                      {errors.phone && (
                        <p className="text-sm text-destructive">{errors.phone.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        {...register("website")}
                        placeholder="www.proveedor.com"
                      />
                      {errors.website && (
                        <p className="text-sm text-destructive">{errors.website.message}</p>
                      )}
                    </div>
                  </div>

                </CardContent>
              </Card>

              {/* Dirección */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Dirección
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="street">Calle <span className="text-red-500">*</span></Label>
                    <Input
                      id="street"
                      {...register("address.street")}
                      placeholder="Calle y número"
                    />
                    {errors.address?.street && (
                      <p className="text-sm text-destructive">{errors.address.street.message}</p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad <span className="text-red-500">*</span></Label>
                      <Input
                        id="city"
                        {...register("address.city")}
                        placeholder="Ciudad"
                      />
                      {errors.address?.city && (
                        <p className="text-sm text-destructive">{errors.address.city.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado <span className="text-red-500">*</span></Label>
                      <Input
                        id="state"
                        {...register("address.state")}
                        placeholder="Estado"
                      />
                      {errors.address?.state && (
                        <p className="text-sm text-destructive">{errors.address.state.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Código Postal <span className="text-red-500">*</span></Label>
                      <Input
                        id="zipCode"
                        {...register("address.zipCode")}
                        placeholder="12345"
                      />
                      {errors.address?.zipCode && (
                        <p className="text-sm text-destructive">{errors.address.zipCode.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País <span className="text-red-500">*</span></Label>
                    <Select
                      value={watch("address.country")}
                      onValueChange={(value) => setValue("address.country", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un país" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="México">México</SelectItem>
                        <SelectItem value="Estados Unidos">Estados Unidos</SelectItem>
                        <SelectItem value="Canadá">Canadá</SelectItem>
                        <SelectItem value="España">España</SelectItem>
                        <SelectItem value="Colombia">Colombia</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              {/* Contactos */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-5 w-5" />
                      Contactos
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addContact}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Agregar Contacto
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Información de contacto del proveedor
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {contacts.map((contact, index) => (
                    <div key={index} className="p-4 border rounded-lg space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Checkbox
                            checked={contact.isPrimary}
                            onCheckedChange={() => setPrimaryContact(index)}
                          />
                          <Label>Contacto Principal</Label>
                        </div>
                        {contacts.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeContact(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Nombre <span className="text-red-500">*</span></Label>
                          <Input
                            {...register(`contacts.${index}.name`)}
                            placeholder="Nombre del contacto"
                          />
                          {errors.contacts?.[index]?.name && (
                            <p className="text-sm text-destructive">{errors.contacts[index]?.name?.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Posición <span className="text-red-500">*</span></Label>
                          <Input
                            {...register(`contacts.${index}.position`)}
                            placeholder="Gerente de Ventas"
                          />
                          {errors.contacts?.[index]?.position && (
                            <p className="text-sm text-destructive">{errors.contacts[index]?.position?.message}</p>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email <span className="text-red-500">*</span></Label>
                          <Input
                            type="email"
                            {...register(`contacts.${index}.email`)}
                            placeholder="contacto@proveedor.com"
                          />
                          {errors.contacts?.[index]?.email && (
                            <p className="text-sm text-destructive">{errors.contacts[index]?.email?.message}</p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label>Teléfono <span className="text-red-500">*</span></Label>
                          <Input
                            {...register(`contacts.${index}.phone`)}
                            placeholder="+52 55 1234 5678"
                            defaultValue="+52"
                          />
                          {errors.contacts?.[index]?.phone && (
                            <p className="text-sm text-destructive">{errors.contacts[index]?.phone?.message}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Logo Upload */}
              <Card>
                <CardHeader>
                  <CardTitle>Logo del Proveedor</CardTitle>
                  <CardDescription>
                    Sube el logo de la empresa
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Preview del logo */}
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                      {logoPreview ? (
                        <img 
                          src={logoPreview} 
                          alt="Preview"
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
                        {logoFile ? 'Cambiar' : 'Subir'}
                      </label>
                      {logoFile && (
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
                  
                  {logoFile && (
                    <div className="text-sm text-muted-foreground">
                      Archivo seleccionado: {logoFile.name}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Etiquetas */}
              <Card>
                <CardHeader>
                  <CardTitle>Etiquetas</CardTitle>
                  <CardDescription>
                    Agrega etiquetas para categorizar y filtrar proveedores
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <TagSelector
                    selectedTags={tags}
                    onTagsChange={handleTagsChange}
                    availableTags={availableTags}
                    placeholder="Buscar o crear etiqueta..."
                  />
                  <div className="text-sm text-muted-foreground">
                    Usa #etiqueta en la búsqueda para filtrar por etiquetas
                  </div>
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
                    <Label htmlFor="isActive">Proveedor Activo</Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Los proveedores inactivos no aparecerán en las cotizaciones automáticas.
                  </div>
                </CardContent>
              </Card>

            </div>
          </div>
          </form>
        </div>

        {/* Botones de Acción - Fijos */}
        <div className="flex-shrink-0 mt-6 pt-6 border-t bg-background">
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              onClick={handleSubmit(onSubmit)}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Proveedor
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
