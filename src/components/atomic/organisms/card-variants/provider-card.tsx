"use client"

import { CardItem, CardItemProps } from "@/components/ui/card-item"
import { Building2 } from "lucide-react"

export interface ProviderCardProps extends Omit<CardItemProps, 'type'> {
  // Campos específicos de proveedores
  website?: string
  phone?: string
  email?: string
  rating?: number
  isActive?: boolean
  company?: string
  industry?: string
}

export function ProviderCard({
  isActive = true,
  status,
  company,
  industry,
  ...props
}: ProviderCardProps) {
  return (
    <CardItem
      {...props}
      type="provider"
      status={status || (isActive ? "active" : "inactive")}
      badgeVariant={isActive ? "default" : "secondary"}
      badge={industry || company}
    />
  )
}

export function ProviderCardSkeleton() {
  const { CardItemSkeleton } = require("@/components/ui/card-item-skeleton")
  return <CardItemSkeleton className="w-full" />
}
