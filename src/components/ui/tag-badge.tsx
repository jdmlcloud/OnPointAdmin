"use client"

import { Badge } from "@/components/ui/badge"
import { getTagColor } from "@/lib/utils/tag-colors"

interface TagBadgeProps {
  tag: string
  onRemove?: () => void
  showRemove?: boolean
}

export function TagBadge({ tag, onRemove, showRemove = false }: TagBadgeProps) {
  const colorClasses = getTagColor(tag)
  
  return (
    <Badge 
      variant="secondary" 
      className={`${colorClasses} text-xs font-medium border`}
    >
      {tag}
      {showRemove && onRemove && (
        <button 
          type="button"
          onClick={onRemove}
          className="ml-1 text-current hover:opacity-70 transition-opacity"
        >
          ×
        </button>
      )}
    </Badge>
  )
}
