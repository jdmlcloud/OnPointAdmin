"use client"

import { cn } from "@/lib/utils"

interface SkeletonBlockProps {
  className?: string
}

export function SkeletonBlock({ className }: SkeletonBlockProps) {
  return <div className={cn("bg-muted/70 rounded animate-pulse", className)} />
}


