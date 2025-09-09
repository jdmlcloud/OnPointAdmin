"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useLogos } from "@/hooks/use-logos"
import { ArrowLeft, Image, Save, X, Upload, FileText } from "lucide-react"

export default function NewLogoPage() {
  const router = useRouter()
  const { createLogo } = useLogos()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    clientId: '',
    clientName: '',
    variant: '',
    brand: '',
    version: '',
    tags: '',
    status: 'active',
    isPrimary: false
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      
      // Crear preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPreviewUrl(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validar campos requeridos
    if (!formData.name || !formData.category || !formData.clientName || !selectedFile) {
      alert('Por favor completa todos los campos requeridos y selecciona un archivo')
      return
    }

    setIsLoading(true)
    
    try {
      const success = await createLogo({
        name: formData.name,
        description: formData.description,
        category: formData.category,
        clientId: formData.clientId || `client-${Date.now()}`,
        clientName: formData.clientName,
        variant: formData.variant,
        brand: formData.brand,
        version: formData.version,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()) : [],
        status: formData.status,
        isPrimary: formData.isPrimary
      }, selectedFile)
      
      if (success) {
        router.push('/logos')
      } else {
        alert('Error al crear el logo')
      }
    } catch (error) {
      console.error('Error creating logo:', error)
      alert('Error al crear el logo')
    } finally {
      setIsLoading(false)
    }
  }

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
            <h1 className="text-3xl font-bold">Nuevo Logo</h1>
            <p className="text-muted-foreground">
              Sube y organiza un nuevo logo oficial
            </p>
          </div>
        </div>

        {/* Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Image className="h-5 w-5" />
              Información del Logo
            </CardTitle>
            <CardDescription>
              Sube el archivo del logo y completa la información
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Subida de archivo */}
              <div className="space-y-4">
                <Label htmlFor="file">Archivo del Logo *</Label>
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                  {previewUrl ? (
                    <div className="space-y-4">
                      <div className="flex justify-center">
                        <img 
                          src={previewUrl} 
                          alt="Preview" 
                          className="max-h-32 max-w-32 object-contain"
                        />
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium">{selectedFile?.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : ''}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={removeFile}
                        >
                          <X className="h-4 w-4 mr-2" />
                          Remover archivo
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                      <div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4 mr-2" />
                          Seleccionar archivo
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">
                          PNG, JPG, SVG, AI, PDF, EPS (máx. 50MB)
                        </p>
                      </div>
                    </div>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    id="file"
                    accept=".png,.jpg,.jpeg,.svg,.ai,.pdf,.eps"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Información del Cliente */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="clientName">Nombre del Cliente *</Label>
                    <Input
                      id="clientName"
                      name="clientName"
                      value={formData.clientName}
                      onChange={handleInputChange}
                      placeholder="Ej: HBO, Netflix, Disney"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="variant">Variante del Logo</Label>
                    <Input
                      id="variant"
                      name="variant"
                      value={formData.variant}
                      onChange={handleInputChange}
                      placeholder="Ej: Oficial, Horizontal, Vertical, Monocromo"
                    />
                  </div>
                </div>
              </div>

              {/* Información básica */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Información del Logo</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nombre del Logo *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Ej: Logo Principal HBO"
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
                      placeholder="Ej: Principal, Variantes, Iconos"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="brand">Marca</Label>
                    <Input
                      id="brand"
                      name="brand"
                      value={formData.brand}
                      onChange={handleInputChange}
                      placeholder="Nombre de la marca"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="version">Versión</Label>
                    <Input
                      id="version"
                      name="version"
                      value={formData.version}
                      onChange={handleInputChange}
                      placeholder="v1.0"
                    />
                  </div>
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
                  placeholder="Describe el logo y su uso..."
                  className="min-h-[120px]"
                />
              </div>

              {/* Etiquetas */}
              <div className="space-y-2">
                <Label htmlFor="tags">Etiquetas</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  placeholder="oficial, principal, horizontal, vertical (separadas por comas)"
                />
              </div>

              {/* Configuración adicional */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Configuración</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <option value="archived">Archivado</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="isPrimary"
                        name="isPrimary"
                        checked={formData.isPrimary}
                        onChange={handleInputChange}
                        className="rounded border-gray-300"
                      />
                      <Label htmlFor="isPrimary" className="text-sm font-medium">
                        Logo principal del cliente
                      </Label>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Marca este logo como el principal para este cliente
                    </p>
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
                      Subiendo...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Crear Logo
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
