"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { 
  Building2, 
  Package, 
  Users, 
  Image, 
  FileText, 
  TrendingUp, 
  MessageSquare, 
  BarChart3,
  Shield,
  Settings,
  Zap,
  Palette,
  Cpu
} from "lucide-react"

// Mapeo de tipos a iconos por defecto
const DEFAULT_ICONS = {
  provider: Building2,
  product: Package,
  user: Users,
  logo: Image,
  proposal: FileText,
  quotation: TrendingUp,
  whatsapp: MessageSquare,
  analytics: BarChart3,
  system: Shield,
  settings: Settings,
  integration: Zap,
  template: Palette,
  task: Cpu,
  default: Image
} as const

export type CardImageType = keyof typeof DEFAULT_ICONS

interface CardImageProps {
  src?: string
  alt: string
  type: CardImageType
  className?: string
  fallbackClassName?: string
  size?: "sm" | "md" | "lg" | "xl"
}

const sizeClasses = {
  sm: "w-8 h-8",
  md: "w-12 h-12", 
  lg: "w-16 h-16",
  xl: "w-20 h-20"
}

export function CardImage({ 
  src, 
  alt, 
  type, 
  className, 
  fallbackClassName,
  size = "md" 
}: CardImageProps) {
  const [imageError, setImageError] = React.useState(false)
  const [imageLoaded, setImageLoaded] = React.useState(false)

  const DefaultIcon = DEFAULT_ICONS[type] || DEFAULT_ICONS.default
  const sizeClass = sizeClasses[size]

  const handleImageError = () => {
    console.log('🖼️ Error cargando imagen, usando fallback para tipo:', type)
    setImageError(true)
  }

  const handleImageLoad = () => {
    console.log('🖼️ Imagen cargada exitosamente')
    setImageLoaded(true)
  }

  // Si hay error o no hay src, mostrar icono por defecto
  if (imageError || !src) {
    return (
      <div 
        className={cn(
          "flex items-center justify-center bg-muted rounded-lg",
          sizeClass,
          fallbackClassName
        )}
      >
        <DefaultIcon className={cn("text-muted-foreground", {
          "h-4 w-4": size === "sm",
          "h-6 w-6": size === "md", 
          "h-8 w-8": size === "lg",
          "h-10 w-10": size === "xl"
        })} />
      </div>
    )
  }

  return (
    <div className={cn("relative", sizeClass)}>
      {!imageLoaded && (
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center bg-muted rounded-lg animate-pulse",
            fallbackClassName
          )}
        >
          <DefaultIcon className={cn("text-muted-foreground", {
            "h-4 w-4": size === "sm",
            "h-6 w-6": size === "md",
            "h-8 w-8": size === "lg", 
            "h-10 w-10": size === "xl"
          })} />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={cn(
          "object-cover rounded-lg transition-opacity duration-200",
          imageLoaded ? "opacity-100" : "opacity-0",
          sizeClass,
          className
        )}
        onError={handleImageError}
        onLoad={handleImageLoad}
      />
    </div>
  )
}
