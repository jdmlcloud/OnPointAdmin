"use client"

import { CardItem, type CardItemProps } from "@/components/ui/card-item"
import { Building2, Image as ImageIcon, FileText, Star } from "lucide-react"

export interface ClientCardProps extends Omit<CardItemProps, 'type' | 'status' | 'badge' | 'badgeVariant'> {
  logosCount: number
  formatsCount: number
  createdAt?: string
  topFormats?: string[]
  hasPrimary?: boolean
}

export function ClientCard({ logosCount, formatsCount, createdAt, topFormats, hasPrimary, ...props }: ClientCardProps) {
  return (
    <CardItem
      {...props}
      type="system"
      status="active"
      badgeVariant="secondary"
      badge={`${logosCount} logos`}
      description={`${logosCount} logos • ${formatsCount} formatos${topFormats && topFormats.length ? ` · ${topFormats.slice(0,3).join(', ').toUpperCase()}` : ''}${hasPrimary ? ' · Principal' : ''}`}
      footerItems={[
        topFormats && topFormats.length ? { icon: <FileText className="h-4 w-4" />, text: `Formatos: ${topFormats.slice(0,3).join(', ').toUpperCase()}` } : undefined,
        { icon: <Star className="h-4 w-4" />, text: `Principal: ${hasPrimary ? 'Sí' : 'No'}` },
        createdAt ? { icon: <Building2 className="h-4 w-4" />, text: `Creado: ${new Date(createdAt).toLocaleDateString()}` } : undefined,
      ].filter(Boolean) as { icon?: React.ReactNode; text: string }[]}
    />
  )
}

export function ClientCardSkeleton() {
  const { CardItemSkeleton } = require("@/components/ui/card-item-skeleton")
  return <CardItemSkeleton className="w-full" />
}


