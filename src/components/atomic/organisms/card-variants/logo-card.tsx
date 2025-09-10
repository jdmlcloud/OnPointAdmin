"use client"

import { CardItem, CardItemProps } from "@/components/ui/card-item"
import { Image as ImageIcon, Tag as TagIcon, Building2, FileText } from "lucide-react"

export interface LogoCardProps extends Omit<CardItemProps, 'type'> {
  clientName?: string
  fileType?: string
  fileSize?: number
  category?: string
  isPrimary?: boolean
}

function formatBytes(bytes?: number): string | undefined {
  if (bytes === undefined) return undefined
  const sizes = ['B', 'KB', 'MB', 'GB']
  if (bytes === 0) return '0 B'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(1))} ${sizes[i]}`
}

export function LogoCard({
  clientName,
  fileType,
  fileSize,
  category,
  isPrimary = false,
  status,
  ...props
}: LogoCardProps) {
  return (
    <CardItem
      {...props}
      type="logo"
      status={status || (isPrimary ? 'active' : 'inactive')}
      badgeVariant={isPrimary ? "default" : "secondary"}
      badge={isPrimary ? 'Principal' : category}
      footerItems={[
        clientName ? { icon: <Building2 className="h-4 w-4" />, text: clientName } : undefined,
        fileType ? { icon: <FileText className="h-4 w-4" />, text: `${fileType.toUpperCase()}${fileSize ? ` • ${formatBytes(fileSize)}` : ''}` } : (fileSize !== undefined ? { icon: <FileText className="h-4 w-4" />, text: `${formatBytes(fileSize)}` } : undefined),
        category ? { icon: <TagIcon className="h-4 w-4" />, text: category } : undefined,
      ].filter(Boolean) as { icon?: React.ReactNode; text: string }[]}
    />
  )
}

export function LogoCardSkeleton() {
  const { CardItemSkeleton } = require("@/components/ui/card-item-skeleton")
  return <CardItemSkeleton className="w-full" />
}


