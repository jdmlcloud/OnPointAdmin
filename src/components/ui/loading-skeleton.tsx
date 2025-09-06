"use client"

import { cn } from "@/lib/utils"

interface LoadingSkeletonProps {
  className?: string
  variant?: 'text' | 'rectangular' | 'circular' | 'card'
}

export function LoadingSkeleton({ className, variant = 'rectangular' }: LoadingSkeletonProps) {
  const getVariantClass = () => {
    switch (variant) {
      case 'text':
        return 'h-4 w-full'
      case 'circular':
        return 'h-10 w-10 rounded-full'
      case 'card':
        return 'h-32 w-full rounded-lg'
      case 'rectangular':
      default:
        return 'h-4 w-full rounded'
    }
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        getVariantClass(),
        className
      )}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <LoadingSkeleton variant="circular" className="h-10 w-10" />
        <div className="space-y-2 flex-1">
          <LoadingSkeleton className="h-4 w-3/4" />
          <LoadingSkeleton className="h-3 w-1/2" />
        </div>
      </div>
      <LoadingSkeleton className="h-20 w-full" />
      <div className="flex gap-2">
        <LoadingSkeleton className="h-8 w-20" />
        <LoadingSkeleton className="h-8 w-24" />
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-4">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  )
}
