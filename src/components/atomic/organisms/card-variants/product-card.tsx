"use client"

import { CardItem, CardItemProps } from "@/components/ui/card-item"
import { Package, DollarSign, Boxes, Tag as TagIcon } from "lucide-react"

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
      badge={price ? `$${price.toLocaleString()}` : category}
      footerItems={[
        price !== undefined ? { icon: <DollarSign className="h-4 w-4" />, text: `$${price.toLocaleString()}` } : undefined,
        stock !== undefined ? { icon: <Boxes className="h-4 w-4" />, text: `Stock: ${stock}` } : undefined,
        category ? { icon: <TagIcon className="h-4 w-4" />, text: category } : undefined,
      ].filter(Boolean) as { icon?: React.ReactNode; text: string }[]}
    />
  )
}

export function ProductCardSkeleton() {
  const { CardItemSkeleton } = require("@/components/ui/card-item-skeleton")
  return <CardItemSkeleton className="w-full" />
}
