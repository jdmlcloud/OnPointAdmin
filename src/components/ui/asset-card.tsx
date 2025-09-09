"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Eye, 
  Edit, 
  Download, 
  Trash2, 
  Image, 
  Star,
  Building2,
  Package,
  FileText
} from "lucide-react"

export interface AssetCardProps {
  // Identificación
  id: string
  name: string
  description?: string
  
  // Imagen/Thumbnail
  thumbnailUrl?: string
  fallbackText?: string
  
  // Información específica del tipo
  type: 'logo' | 'provider' | 'product' | 'client'
  
  // Datos específicos por tipo
  logoData?: {
    category?: string
    variant?: string
    fileType?: string
    isPrimary?: boolean
    tags?: string[]
  }
  
  providerData?: {
    industry?: string
    contactEmail?: string
    status?: string
  }
  
  productData?: {
    category?: string
    price?: number
    status?: string
    tags?: string[]
  }
  
  clientData?: {
    industry?: string
    contactEmail?: string
    status?: string
    logoCount?: number
  }
  
  // Acciones
  onView?: () => void
  onEdit?: () => void
  onDownload?: () => void
  onDelete?: () => void
  onClick?: () => void
  
  // Estilo
  className?: string
  showActions?: boolean
  maxWidth?: string
}

export function AssetCard({
  id,
  name,
  description,
  thumbnailUrl,
  fallbackText,
  type,
  logoData,
  providerData,
  productData,
  clientData,
  onView,
  onEdit,
  onDownload,
  onDelete,
  onClick,
  className = "",
  showActions = true,
  maxWidth = "max-w-xs"
}: AssetCardProps) {
  
  // Función para obtener el icono según el tipo
  const getTypeIcon = () => {
    switch (type) {
      case 'logo':
        return <Image className="h-16 w-16 mx-auto mb-2" />
      case 'provider':
        return <Building2 className="h-16 w-16 mx-auto mb-2" />
      case 'product':
        return <Package className="h-16 w-16 mx-auto mb-2" />
      case 'client':
        return <Building2 className="h-16 w-16 mx-auto mb-2" />
      default:
        return <FileText className="h-16 w-16 mx-auto mb-2" />
    }
  }

  // Función para renderizar información específica del tipo
  const renderTypeSpecificInfo = () => {
    switch (type) {
      case 'logo':
        return logoData && (
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Categoría:</span>
              <span>{logoData.category || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Variante:</span>
              <span>{logoData.variant || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Formato:</span>
              <span>{logoData.fileType || 'N/A'}</span>
            </div>
            {logoData.isPrimary && (
              <div className="flex items-center gap-1 text-xs text-yellow-600">
                <Star className="h-3 w-3" />
                <span>Logo Principal</span>
              </div>
            )}
          </div>
        )
      
      case 'provider':
        return providerData && (
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Industria:</span>
              <span>{providerData.industry || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Email:</span>
              <span className="truncate">{providerData.contactEmail || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Estado:</span>
              <Badge variant={providerData.status === 'active' ? 'default' : 'secondary'} className="text-xs px-1 py-0">
                {providerData.status || 'N/A'}
              </Badge>
            </div>
          </div>
        )
      
      case 'product':
        return productData && (
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Categoría:</span>
              <span>{productData.category || 'N/A'}</span>
            </div>
            {productData.price && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <span className="font-medium">Precio:</span>
                <span>${productData.price}</span>
              </div>
            )}
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Estado:</span>
              <Badge variant={productData.status === 'active' ? 'default' : 'secondary'} className="text-xs px-1 py-0">
                {productData.status || 'N/A'}
              </Badge>
            </div>
          </div>
        )
      
      case 'client':
        return clientData && (
          <div className="space-y-1 mb-2">
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Industria:</span>
              <span>{clientData.industry || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Logos:</span>
              <span>{clientData.logoCount || 0} disponibles</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <span className="font-medium">Estado:</span>
              <Badge variant={clientData.status === 'active' ? 'default' : 'secondary'} className="text-xs px-1 py-0">
                {clientData.status || 'N/A'}
              </Badge>
            </div>
          </div>
        )
      
      default:
        return null
    }
  }

  // Función para renderizar tags
  const renderTags = () => {
    const tags = logoData?.tags || productData?.tags || []
    if (tags.length === 0) return null

    return (
      <div className="flex flex-wrap gap-1 mb-2">
        {tags.slice(0, 2).map((tag, index) => (
          <Badge key={index} variant="secondary" className="text-xs px-1 py-0">
            {tag}
          </Badge>
        ))}
        {tags.length > 2 && (
          <Badge variant="outline" className="text-xs px-1 py-0">
            +{tags.length - 2}
          </Badge>
        )}
      </div>
    )
  }

  return (
    <Card 
      className={`hover:shadow-2xl hover:shadow-purple-500/20 hover:ring-2 hover:ring-purple-400 hover:ring-opacity-60 hover:-translate-y-1 transition-all duration-500 ease-out flex flex-col h-72 overflow-hidden cursor-pointer group ${maxWidth} ${className}`}
      onClick={onClick}
    >
      {/* Imagen/Thumbnail */}
      <div className="relative h-40 bg-muted flex items-center justify-center overflow-hidden group-hover:bg-gradient-to-br group-hover:from-purple-50 group-hover:to-pink-50 transition-all duration-500">
        {thumbnailUrl ? (
          <img
            src={thumbnailUrl}
            alt={name}
            className="max-w-full max-h-full object-contain group-hover:scale-110 transition-transform duration-500 ease-out"
          />
        ) : (
          <div className="text-muted-foreground text-center group-hover:text-purple-400 transition-colors duration-500">
            <div className="group-hover:scale-110 transition-transform duration-500 ease-out">
              {getTypeIcon()}
            </div>
            <p className="text-xs">{fallbackText || 'Sin vista previa'}</p>
          </div>
        )}
      </div>
      
      {/* Contenido de la card */}
      <CardContent className="p-3 flex-1 flex flex-col group-hover:bg-gradient-to-b group-hover:from-transparent group-hover:to-purple-50/30 transition-all duration-500">
        <div className="flex-1">
          <h3 className="font-semibold text-base mb-1 line-clamp-1">{name}</h3>
          <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
            {description || 'Sin descripción'}
          </p>
          
          {/* Información específica del tipo */}
          {renderTypeSpecificInfo()}
          
          {/* Tags */}
          {renderTags()}
        </div>
        
        {/* Botones de acción */}
        {showActions && (
          <div className="flex gap-1 mt-3">
            {onView && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onView()
                }}
                className="flex-1 h-8 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors duration-200"
              >
                <Eye className="h-4 w-4" />
              </Button>
            )}
            {onEdit && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onEdit()
                }}
                className="h-8 px-2 hover:bg-green-50 hover:border-green-300 hover:text-green-600 transition-colors duration-200"
              >
                <Edit className="h-4 w-4" />
              </Button>
            )}
            {onDownload && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDownload()
                }}
                className="h-8 px-2 hover:bg-purple-50 hover:border-purple-300 hover:text-purple-600 transition-colors duration-200"
              >
                <Download className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button 
                variant="outline" 
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete()
                }}
                className="h-8 px-2 text-destructive hover:bg-red-50 hover:border-red-300 hover:text-red-600 transition-colors duration-200"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
