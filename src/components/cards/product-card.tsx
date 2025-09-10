"use client"

import { CardItem, CardItemProps } from "@/components/ui/card-item"
import { Package } from "lucide-react"

export interface ProductCardProps extends Omit<CardItemProps, 'type'> {
  // Campos específicos de productos
  price?: number
  stock?: number
  category?: string
  isActive?: boolean
}

export function ProductCard({
  isActive = true,
  status,
  price,
  stock,
  category,
  ...props
}: ProductCardProps) {
  const stockStatus = stock === 0 ? "inactive" : stock && stock < 10 ? "pending" : "active"
  
  return (
    <CardItem
      {...props}
      type="product"
      status={status || (isActive ? stockStatus : "inactive")}
      badgeVariant={isActive ? "default" : "secondary"}
      badge={price ? `$${price.toLocaleString()}` : undefined}
    />
  )
}
