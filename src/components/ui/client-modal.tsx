"use client"

import { useState, useRef } from "react"
import { ActionModal } from "./action-modal"
import { Input } from "./input"
import { Button } from "./button"
import { Label } from "./label"
import { Textarea } from "./textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"
import { useLogos } from "@/hooks/use-logos"
import { Image, Upload, X, Save } from "lucide-react"

interface Client {
  id: string
  name: string
  description?: string
  industry?: string
  contactEmail?: string
  logos: any[]
  primaryLogoId?: string
  createdAt: string
  updatedAt?: string
}

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (clientData: Omit<Client, 'id' | 'createdAt' | 'logos'>) => void
  client?: Client | null
  title: string
  includeLogoForm?: boolean
}

const INDUSTRIES = [
  'Entertainment',
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Education',
  'Manufacturing',
  'Consulting',
  'Media',
  'Other'
]

const LOGO_CATEGORIES = [
  'Principal',
  'Variante',
  'Iconos',
  'Monocromo',
  'Horizontal',
  'Vertical',
  'Aplicaciones',
  'Firma',
  'Sello',
  'Otros'
]

const LOGO_VARIANTS = [
  'Oficial',
  'Horizontal',
  'Vertical',
  'Monocromo',
  'Color',
  'Blanco',
  'Negro',
  'Transparente',
  'Fondo Blanco',
  'Fondo Negro',
  'Aplicación',
  'Sello',
  'Firma',
  'Otros'
]

export function ClientModal({ isOpen, onClose, onSave, client, title, includeLogoForm = false }: ClientModalProps) {
  const { createLogo } = useLogos()
  const [formData, setFormData] = useState({
    name: client?.name || '',
    industry: client?.industry || ''
  })

  // Estado para el formulario de logo
  const [logoFormData, setLogoFormData] = useState({
    name: '',
    description: '',
    category: '',
    variant: '',
    brand: '',
    version: '',
    tags: '',
    status: 'active',
    isPrimary: false
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isCreatingLogo, setIsCreatingLogo] = useState(false)
  
  // Estado para etiquetas
  const [availableTags, setAvailableTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('El nombre del cliente es requerido')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      
      // Si se incluye el formulario de logo y hay datos de logo, crear el logo
      if (includeLogoForm && selectedFile && logoFormData.name && logoFormData.category) {
        setIsCreatingLogo(true)
        try {
          const success = await createLogo({
            name: logoFormData.name,
            description: logoFormData.description,
            category: logoFormData.category,
            clientId: client?.id || `client-${formData.name.toLowerCase().replace(/\s+/g, '-')}`,
            clientName: formData.name,
            variant: logoFormData.variant,
            brand: formData.name, // Usar el nombre del cliente como marca
            version: logoFormData.version,
            tags: logoFormData.tags ? logoFormData.tags.split(',').map(t => t.trim()) : [],
            status: logoFormData.status,
            isPrimary: logoFormData.isPrimary,
            fileType: selectedFile?.type || 'image/png',
            fileSize: selectedFile?.size || 0
          }, selectedFile)
          
          if (success) {
            console.log('Cliente y logo creados exitosamente')
          } else {
            alert('Cliente creado pero hubo un error al crear el logo')
          }
        } catch (logoError) {
          console.error('Error creating logo:', logoError)
          alert('Cliente creado pero hubo un error al crear el logo')
        } finally {
          setIsCreatingLogo(false)
        }
      }
      
      onClose()
    } catch (error) {
      console.error('Error saving client:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleLogoChange = (field: string, value: string | boolean) => {
    setLogoFormData(prev => ({
      ...prev,
      [field]: value
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

  const removeFile = () => {
    setSelectedFile(null)
    setPreviewUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  // Función para normalizar texto (quitar tildes, convertir a minúsculas)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Quitar tildes
      .trim()
  }

  // Función para manejar etiquetas
  const handleTagInputChange = (value: string) => {
    setTagInput(value)
  }

  const addTag = (tag: string) => {
    const normalizedTag = normalizeText(tag)
    if (normalizedTag && !availableTags.some(t => normalizeText(t) === normalizedTag)) {
      setAvailableTags(prev => [...prev, tag])
      setLogoFormData(prev => ({
        ...prev,
        tags: [...availableTags, tag].join(', ')
      }))
    }
    setTagInput('')
  }

  const removeTag = (tagToRemove: string) => {
    const newTags = availableTags.filter(tag => tag !== tagToRemove)
    setAvailableTags(newTags)
    setLogoFormData(prev => ({
      ...prev,
      tags: newTags.join(', ')
    }))
  }

  const handleTagKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      if (tagInput.trim()) {
        addTag(tagInput.trim())
      }
    }
  }

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      showFooter={false}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Cliente */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Información del Cliente</h3>
          <div className="grid grid-cols-1 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Cliente *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Ej: Netflix, HBO, Disney"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="industry">Industria</Label>
              <Select value={formData.industry} onValueChange={(value) => handleChange('industry', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar industria" />
                </SelectTrigger>
                <SelectContent>
                  {INDUSTRIES.map((industry) => (
                    <SelectItem key={industry} value={industry}>
                      {industry}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Formulario de Logo (opcional) */}
        {includeLogoForm && (
          <div className="space-y-4 border-t pt-6">
            <h3 className="text-lg font-semibold">Agregar Logo (Opcional)</h3>
            
            {/* Subida de archivo */}
            <div className="space-y-4">
              <Label htmlFor="logoFile">Archivo del Logo</Label>
              <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                {previewUrl ? (
                  <div className="space-y-4">
                    <div className="flex justify-center">
                      <img 
                        src={previewUrl} 
                        alt="Preview" 
                        className="max-h-24 max-w-24 object-contain"
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
                    <Upload className="h-8 w-8 mx-auto text-muted-foreground" />
                    <div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Seleccionar archivo
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2">
                        PNG, JPG, SVG, AI, PDF, EPS (máx. 50MB)
                      </p>
                    </div>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  id="logoFile"
                  accept=".png,.jpg,.jpeg,.svg,.ai,.pdf,.eps"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>
            </div>

            {/* Información del Logo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logoName">Nombre del Logo</Label>
                <Input
                  id="logoName"
                  value={logoFormData.name}
                  onChange={(e) => handleLogoChange('name', e.target.value)}
                  placeholder="Ej: Logo Principal"
                />
              </div>
              
              <div>
                <Label htmlFor="logoCategory">Categoría</Label>
                <Select value={logoFormData.category} onValueChange={(value) => handleLogoChange('category', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOGO_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="logoVariant">Variante</Label>
                <Select value={logoFormData.variant} onValueChange={(value) => handleLogoChange('variant', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar variante" />
                  </SelectTrigger>
                  <SelectContent>
                    {LOGO_VARIANTS.map((variant) => (
                      <SelectItem key={variant} value={variant}>
                        {variant}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="logoVersion">Versión</Label>
                <Input
                  id="logoVersion"
                  value={logoFormData.version}
                  onChange={(e) => handleLogoChange('version', e.target.value)}
                  placeholder="v1.0"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="logoDescription">Descripción del Logo</Label>
              <Textarea
                id="logoDescription"
                value={logoFormData.description}
                onChange={(e) => handleLogoChange('description', e.target.value)}
                placeholder="Describe el logo y su uso..."
                rows={2}
              />
            </div>

            <div>
              <Label htmlFor="logoTags">Etiquetas</Label>
              <div className="space-y-2">
                <Input
                  id="logoTags"
                  value={tagInput}
                  onChange={(e) => handleTagInputChange(e.target.value)}
                  onKeyPress={handleTagKeyPress}
                  placeholder="Escribe una etiqueta y presiona Enter o coma"
                />
                {availableTags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {availableTags.map((tag, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-1 px-2 py-1 bg-primary text-primary-foreground rounded-full text-sm"
                      >
                        <span>{tag}</span>
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-primary-foreground/20 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPrimary"
                checked={logoFormData.isPrimary}
                onChange={(e) => handleLogoChange('isPrimary', e.target.checked)}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPrimary" className="text-sm font-medium">
                Logo principal del cliente
              </Label>
            </div>
          </div>
        )}
        
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={isLoading || isCreatingLogo}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isLoading || isCreatingLogo || !formData.name.trim()}
          >
            {isLoading ? 'Guardando...' : isCreatingLogo ? 'Creando logo...' : 'Guardar Cliente'}
          </Button>
        </div>
      </form>
    </ActionModal>
  )
}
