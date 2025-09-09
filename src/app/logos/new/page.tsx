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
    brand: '',
    version: '',
    tags: '',
    status: 'active'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
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
    if (!formData.name || !formData.category || !selectedFile) {
      alert('Por favor completa todos los campos requeridos y selecciona un archivo')
      return
    }

    setIsLoading(true)
    
    try {
      // Crear FormData para subir archivo
      const uploadData = new FormData()
      uploadData.append('file', selectedFile)
      uploadData.append('name', formData.name)
      uploadData.append('description', formData.description)
      uploadData.append('category', formData.category)
      uploadData.append('brand', formData.brand)
      uploadData.append('version', formData.version)
      uploadData.append('tags', formData.tags)
      uploadData.append('status', formData.status)

      const response = await fetch('/api/logos', {
        method: 'POST',
        body: uploadData,
      })
      
      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.message || 'Error al crear logo')
      }
      
      router.push('/logos')
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

              {/* Información básica */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre del Logo *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Ej: Logo Principal OnPoint"
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
                  <option value="archived">Archivado</option>
                </select>
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
