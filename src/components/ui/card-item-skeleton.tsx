"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface CardItemSkeletonProps {
  className?: string
}

export function CardItemSkeleton({ className }: CardItemSkeletonProps) {
  return (
    <Card className={cn("bg-card border-border card-fixed-layout animate-pulse pointer-events-none", className)}>
      {/* Imagen/Icono */}
      <div className="card-image-section">
        <div className="w-16 h-16 bg-muted rounded-lg" />
        <div className="h-4 w-24 bg-muted rounded mt-2" />
      </div>

      {/* Título */}
      <div className="card-title-section">
        <div className="h-6 w-3/4 bg-muted rounded" />
      </div>

      {/* Descripción */}
      <div className="card-description-section">
        <div className="space-y-2">
          <div className="h-3 w-full bg-muted rounded" />
          <div className="h-3 w-2/3 bg-muted rounded" />
        </div>
      </div>

      {/* Estado */}
      <div className="card-info-section">
        <div className="h-5 w-20 bg-muted rounded" />
      </div>

      {/* Rating (opcional) */}
      <div className="card-rating-section">
        <div className="h-4 w-12 bg-muted rounded" />
      </div>

      {/* Espaciador */}
      <div />

      {/* Contacto / Footer info */}
      <div className="card-contact-section">
        <div className="h-4 w-5/6 bg-muted rounded mb-2" />
        <div className="h-4 w-2/3 bg-muted rounded" />
      </div>

      {/* Acciones */}
      <div className="card-actions-section">
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded" />
        <div className="h-8 w-8 bg-muted rounded" />
      </div>
    </Card>
  )
}


