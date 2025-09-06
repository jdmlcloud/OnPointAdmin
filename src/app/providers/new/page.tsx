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

const providerSchema = z.object({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().optional(),
  email: z.string().email("Email inválido"),
  phone: z.string().optional(),
  website: z.string().url("URL inválida").optional().or(z.literal("")),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional(),
  }),
  contacts: z.array(z.object({
    name: z.string().min(1, "Nombre del contacto requerido"),
    position: z.string().min(1, "Posición requerida"),
    email: z.string().email("Email inválido"),
    phone: z.string().optional(),
    isPrimary: z.boolean(),
  })).min(1, "Al menos un contacto es requerido"),
  isActive: z.boolean(),
})

type ProviderFormData = z.infer<typeof providerSchema>

export default function NewProviderPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [logoFile, setLogoFile] = useState<File | null>(null)

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
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast({
        title: "Proveedor creado",
        description: "El proveedor se ha creado exitosamente.",
      })
      
      router.push("/providers")
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al crear el proveedor.",
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
            <h1 className="text-3xl font-bold">Nuevo Proveedor</h1>
            <p className="text-muted-foreground">
              Agrega un nuevo proveedor al sistema
            </p>
          </div>
        </div>

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
                      <Label htmlFor="name">Nombre *</Label>
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
                      <Label htmlFor="email">Email *</Label>
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
                      <Label htmlFor="phone">Teléfono</Label>
                      <Input
                        id="phone"
                        {...register("phone")}
                        placeholder="+52 55 1234 5678"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">Sitio Web</Label>
                      <Input
                        id="website"
                        {...register("website")}
                        placeholder="https://proveedor.com"
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
                    <Label htmlFor="street">Calle</Label>
                    <Input
                      id="street"
                      {...register("address.street")}
                      placeholder="Calle y número"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="city">Ciudad</Label>
                      <Input
                        id="city"
                        {...register("address.city")}
                        placeholder="Ciudad"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="state">Estado</Label>
                      <Input
                        id="state"
                        {...register("address.state")}
                        placeholder="Estado"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="zipCode">Código Postal</Label>
                      <Input
                        id="zipCode"
                        {...register("address.zipCode")}
                        placeholder="12345"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="country">País</Label>
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
                          <Label>Nombre *</Label>
                          <Input
                            {...register(`contacts.${index}.name`)}
                            placeholder="Nombre del contacto"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Posición *</Label>
                          <Input
                            {...register(`contacts.${index}.position`)}
                            placeholder="Gerente de Ventas"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Email *</Label>
                          <Input
                            type="email"
                            {...register(`contacts.${index}.email`)}
                            placeholder="contacto@proveedor.com"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Teléfono</Label>
                          <Input
                            {...register(`contacts.${index}.phone`)}
                            placeholder="+52 55 1234 5678"
                          />
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
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arrastra y suelta el logo aquí
                    </p>
                    <Button variant="outline" size="sm">
                      Seleccionar Archivo
                    </Button>
                  </div>
                  {logoFile && (
                    <div className="text-sm text-muted-foreground">
                      Archivo seleccionado: {logoFile.name}
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
                    <Label htmlFor="isActive">Proveedor Activo</Label>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Los proveedores inactivos no aparecerán en las cotizaciones automáticas.
                  </div>
                </CardContent>
              </Card>

              {/* Acciones */}
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <Button
                      type="submit"
                      className="w-full"
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
                          Guardar Proveedor
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => router.back()}
                    >
                      Cancelar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </div>
    </MainLayout>
  )
}
