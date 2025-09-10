"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { Card, CardContent, CardHeader } from "./card"
import { CardImage, CardImageType } from "./card-image"
import { Badge } from "./badge"
import { Button } from "./button"
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  Star,
  Calendar,
  MapPin,
  Phone,
  Mail,
  ExternalLink
} from "lucide-react"

export interface CardItemProps {
  id: string
  title: string
  description?: string
  image?: string
  type: CardImageType
  status?: "active" | "inactive" | "pending" | "completed"
  rating?: number
  date?: string
  location?: string
  phone?: string
  email?: string
  website?: string
  badge?: string
  badgeVariant?: "default" | "secondary" | "destructive" | "outline"
  className?: string
  onEdit?: (id: string) => void
  onDelete?: (id: string) => void
  onView?: (id: string) => void
  onClick?: (id: string) => void
  footerItems?: { icon?: React.ReactNode; text: string }[]
}

const statusColors = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  inactive: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
}

export function CardItem({
  id,
  title,
  description,
  image,
  type,
  status,
  rating,
  date,
  location,
  phone,
  email,
  website,
  badge,
  badgeVariant = "secondary",
  className,
  onEdit,
  onDelete,
  onView,
  onClick,
  footerItems
}: CardItemProps) {
  const handleClick = () => {
    console.log('🖱️ CardItem clickeado:', { id, title, type })
    onClick?.(id)
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('✏️ Editando item:', { id, title, type })
    onEdit?.(id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('🗑️ Eliminando item:', { id, title, type })
    onDelete?.(id)
  }

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    console.log('👁️ Viendo item:', { id, title, type })
    onView?.(id)
  }

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-colors duration-200 bg-card border border-border hover:border-black/80 dark:hover:border-white/80 card-fixed-layout",
        className
      )}
      onClick={handleClick}
    >
      {/* Imagen/Icono superior - POSICIÓN FIJA */}
      <div className="card-image-section">
        <CardImage
          src={image}
          alt={title}
          type={type}
          size="lg"
          className="mx-auto"
        />
        {!image && (
          <p className="text-sm text-muted-foreground">Sin imagen</p>
        )}
      </div>

      {/* Título - POSICIÓN FIJA */}
      <div className="card-title-section">
        <h3 className="text-xl font-bold text-foreground leading-tight truncate whitespace-nowrap" title={title}>
          {title}
        </h3>
      </div>
      
      {/* Descripción - ALTURA FIJA */}
      <div className="card-description-section">
        {description && (
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        )}
      </div>

      {/* Estado - POSICIÓN FIJA */}
      <div className="card-info-section">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-muted-foreground">Estado:</span>
          {status ? (
            <Badge 
              variant={badgeVariant}
              className={cn("text-xs", statusColors[status])}
            >
              {status === 'active' ? 'Activo' : 
               status === 'inactive' ? 'Inactivo' : 
               status === 'pending' ? 'Pendiente' : 
               status === 'completed' ? 'Completado' : status}
            </Badge>
          ) : (
            <Badge variant="outline" className="text-xs">
              N/A
            </Badge>
          )}
        </div>
      </div>

      {/* Rating - POSICIÓN FIJA */}
      <div className="card-rating-section">
        {rating && (
          <div className="flex items-center space-x-1">
            <Star className="h-4 w-4 text-yellow-500 fill-current" />
            <span className="text-sm font-medium">{rating}</span>
            <span className="text-sm text-muted-foreground">/5</span>
          </div>
        )}
      </div>

      {/* Espacio flexible - se expande/contrae según contenido */}
      <div></div>

      {/* Sección inferior - soporta items personalizados; fallback a contacto */}
      <div className="card-contact-section">
        {footerItems && footerItems.length > 0 ? (
          footerItems.map((item, idx) => (
            <div key={idx} className="flex items-center space-x-2 text-sm text-muted-foreground mb-1 last:mb-0">
              {item.icon}
              <span className="truncate">{item.text}</span>
            </div>
          ))
        ) : (
          <>
            {phone && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Phone className="h-4 w-4" />
                <span className="truncate">{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-1">
                <Mail className="h-4 w-4" />
                <span className="truncate">{email}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <ExternalLink className="h-4 w-4" />
                <span className="truncate">{website}</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Acciones - POSICIÓN FIJA EN LA PARTE MÁS INFERIOR */}
      <div className="card-actions-section">
        {onView && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleView}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Eye className="h-4 w-4" />
          </Button>
        )}
        {onEdit && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEdit}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <Edit className="h-4 w-4" />
          </Button>
        )}
        {onDelete && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDelete}
            className="h-8 w-8 p-0 hover:bg-muted text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        )}
      </div>
    </Card>
  )
}
