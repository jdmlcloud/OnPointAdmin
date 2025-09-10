"use client"

import { SkeletonBlock } from "./skeleton-block"
import { Card } from "./card"

export function LogosPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      {/* Header: título + subtítulo */}
      <div>
        <SkeletonBlock className="h-8 w-64 mb-2" />
        <SkeletonBlock className="h-4 w-96" />
      </div>

      {/* 4 cards de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <SkeletonBlock className="h-4 w-24 mb-2" />
                <SkeletonBlock className="h-6 w-12" />
              </div>
              <SkeletonBlock className="h-10 w-10 rounded" />
            </div>
          </Card>
        ))}
      </div>

      {/* Buscador + Filtros + Tabs */}
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-10 w-80" />
        <SkeletonBlock className="h-10 w-24" />
        <div className="flex gap-2">
          <SkeletonBlock className="h-10 w-28" />
          <SkeletonBlock className="h-10 w-36" />
        </div>
      </div>

      {/* Grid de cards (1 ejemplo) */}
      <div className="grid gap-4 items-stretch px-0 md:px-0 justify-start [grid-template-columns:repeat(auto-fill,minmax(280px,280px))] pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-0 card-fixed-layout">
            <div className="card-image-section">
              <SkeletonBlock className="w-16 h-16 rounded" />
              <SkeletonBlock className="h-4 w-24 mt-2" />
            </div>
            <div className="card-title-section">
              <SkeletonBlock className="h-6 w-3/4" />
            </div>
            <div className="card-description-section">
              <SkeletonBlock className="h-3 w-full" />
            </div>
            <div className="card-info-section">
              <SkeletonBlock className="h-5 w-20" />
            </div>
            <div className="card-rating-section">
              <SkeletonBlock className="h-4 w-12" />
            </div>
            <div />
            <div className="card-contact-section">
              <SkeletonBlock className="h-4 w-5/6 mb-2" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
            <div className="card-actions-section">
              <SkeletonBlock className="h-8 w-8 rounded" />
              <SkeletonBlock className="h-8 w-8 rounded" />
              <SkeletonBlock className="h-8 w-8 rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ProvidersPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div>
        <SkeletonBlock className="h-8 w-60 mb-2" />
        <SkeletonBlock className="h-4 w-80" />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-10 w-80" />
        <SkeletonBlock className="h-10 w-24" />
      </div>
      <div className="grid gap-4 items-stretch [grid-template-columns:repeat(auto-fill,minmax(280px,280px))] pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-0 card-fixed-layout">
            <div className="card-image-section">
              <SkeletonBlock className="w-16 h-16 rounded" />
              <SkeletonBlock className="h-4 w-24 mt-2" />
            </div>
            <div className="card-title-section">
              <SkeletonBlock className="h-6 w-3/4" />
            </div>
            <div className="card-description-section">
              <SkeletonBlock className="h-3 w-full" />
            </div>
            <div className="card-info-section">
              <SkeletonBlock className="h-5 w-20" />
            </div>
            <div className="card-rating-section">
              <SkeletonBlock className="h-4 w-12" />
            </div>
            <div />
            <div className="card-contact-section">
              <SkeletonBlock className="h-4 w-5/6 mb-2" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
            <div className="card-actions-section">
              <SkeletonBlock className="h-8 w-8 rounded" />
              <SkeletonBlock className="h-8 w-8 rounded" />
              <SkeletonBlock className="h-8 w-8 rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function ProductsPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div>
        <SkeletonBlock className="h-8 w-60 mb-2" />
        <SkeletonBlock className="h-4 w-80" />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-10 w-80" />
        <SkeletonBlock className="h-10 w-24" />
      </div>
      <div className="grid gap-4 items-stretch [grid-template-columns:repeat(auto-fill,minmax(280px,280px))] pointer-events-none">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-0 card-fixed-layout">
            <div className="card-image-section">
              <SkeletonBlock className="w-16 h-16 rounded" />
              <SkeletonBlock className="h-4 w-24 mt-2" />
            </div>
            <div className="card-title-section">
              <SkeletonBlock className="h-6 w-3/4" />
            </div>
            <div className="card-description-section">
              <SkeletonBlock className="h-3 w-full" />
            </div>
            <div className="card-info-section">
              <SkeletonBlock className="h-5 w-20" />
            </div>
            <div className="card-rating-section">
              <SkeletonBlock className="h-4 w-12" />
            </div>
            <div />
            <div className="card-contact-section">
              <SkeletonBlock className="h-4 w-5/6 mb-2" />
              <SkeletonBlock className="h-4 w-2/3" />
            </div>
            <div className="card-actions-section">
              <SkeletonBlock className="h-8 w-8 rounded" />
              <SkeletonBlock className="h-8 w-8 rounded" />
              <SkeletonBlock className="h-8 w-8 rounded" />
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div>
        <SkeletonBlock className="h-8 w-64 mb-2" />
        <SkeletonBlock className="h-4 w-96" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="p-4">
            <SkeletonBlock className="h-6 w-24 mb-3" />
            <SkeletonBlock className="h-10 w-20 mb-2" />
            <SkeletonBlock className="h-3 w-3/4" />
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-4"><SkeletonBlock className="h-64 w-full" /></Card>
        <Card className="p-4"><SkeletonBlock className="h-64 w-full" /></Card>
      </div>
    </div>
  )
}


// Users Page Skeleton
export function UsersPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-64 mb-2" />
          <SkeletonBlock className="h-4 w-96" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonBlock className="h-9 w-24" />
          <SkeletonBlock className="h-9 w-24" />
          <SkeletonBlock className="h-9 w-28" />
        </div>
      </div>
      <div className="grid w-full grid-cols-3 gap-2">
        <SkeletonBlock className="h-9 w-full" />
        <SkeletonBlock className="h-9 w-full" />
        <SkeletonBlock className="h-9 w-full" />
      </div>
      <div className="flex justify-between items-center">
        <SkeletonBlock className="h-10 w-80" />
        <SkeletonBlock className="h-10 w-36" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <SkeletonBlock className="h-6 w-3/4 mb-2" />
            <SkeletonBlock className="h-4 w-1/2 mb-4" />
            <SkeletonBlock className="h-6 w-1/4" />
          </Card>
        ))}
      </div>
    </div>
  )
}

// Tasks Page Skeleton
export function TasksPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-56 mb-2" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-10 w-32" />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-10 w-80" />
        <SkeletonBlock className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-5 w-5 rounded" />
              <div>
                <SkeletonBlock className="h-8 w-12 mb-1" />
                <SkeletonBlock className="h-3 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <SkeletonBlock className="h-6 w-3/4 mb-2" />
            <SkeletonBlock className="h-4 w-1/2 mb-4" />
            <SkeletonBlock className="h-6 w-1/4" />
          </Card>
        ))}
      </div>
    </div>
  )
}

// Proposals Page Skeleton
export function ProposalsPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-56 mb-2" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-10 w-36" />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-10 w-80" />
        <SkeletonBlock className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-5 w-5 rounded" />
              <div>
                <SkeletonBlock className="h-8 w-12 mb-1" />
                <SkeletonBlock className="h-3 w-20" />
              </div>
            </div>
          </Card>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <SkeletonBlock className="h-6 w-3/4 mb-2" />
            <SkeletonBlock className="h-4 w-1/2 mb-4" />
            <SkeletonBlock className="h-6 w-1/4" />
          </Card>
        ))}
      </div>
    </div>
  )
}

// Quotations Page Skeleton
export function QuotationsPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-48 mb-2" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-10 w-40" />
      </div>
      <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="p-4">
            <div className="flex items-center justify-between mb-4">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-5 w-5 rounded" />
            </div>
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-3 w-24 mt-2" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <SkeletonBlock className="h-6 w-48 mb-2" />
        <SkeletonBlock className="h-4 w-72" />
      </Card>
    </div>
  )
}

// Reports Page Skeleton
export function ReportsPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-48 mb-2" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-10 w-44" />
      </div>
      <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <SkeletonBlock className="h-5 w-48 mb-1" />
            <SkeletonBlock className="h-3 w-64 mb-3" />
            <SkeletonBlock className="h-10 w-full" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <SkeletonBlock className="h-6 w-56 mb-2" />
        <SkeletonBlock className="h-4 w-72 mb-4" />
        <div className="grid gap-2 md:grid-cols-1">
          <SkeletonBlock className="h-5 w-32 mb-2" />
          <SkeletonBlock className="h-4 w-40" />
        </div>
      </Card>
    </div>
  )
}

// Settings Page Skeleton
export function SettingsPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-56 mb-2" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="h-10 w-32" />
          <SkeletonBlock className="h-10 w-40" />
        </div>
      </div>
      <div className="grid w-full grid-cols-6 gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-9 w-full" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="p-6">
            <SkeletonBlock className="h-6 w-56 mb-2" />
            <SkeletonBlock className="h-4 w-72 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, j) => (
                <SkeletonBlock key={j} className="h-10 w-full" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}

// Integrations Page Skeleton
export function IntegrationsPageSkeleton() {
  return (
    <div className="flex-1 flex flex-col px-6 pb-6 gap-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-56 mb-2" />
          <SkeletonBlock className="h-4 w-64" />
        </div>
        <SkeletonBlock className="h-10 w-40" />
      </div>
      <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="p-4">
            <SkeletonBlock className="h-5 w-56 mb-2" />
            <SkeletonBlock className="h-3 w-64 mb-4" />
            <SkeletonBlock className="h-10 w-full" />
          </Card>
        ))}
      </div>
      <Card className="p-6">
        <SkeletonBlock className="h-6 w-64 mb-2" />
        <SkeletonBlock className="h-4 w-80" />
      </Card>
    </div>
  )
}

// --- WhatsApp Page Skeleton ---
export function WhatsAppPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-56 mb-2" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
        <SkeletonBlock className="h-10 w-36" />
      </div>
      <div className="flex items-center gap-4">
        <SkeletonBlock className="h-10 w-80" />
        <SkeletonBlock className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-5 w-5 rounded-full" />
              <div>
                <SkeletonBlock className="h-8 w-12 mb-1" />
                <SkeletonBlock className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <SkeletonBlock className="h-6 w-3/4 mb-2" />
            <SkeletonBlock className="h-4 w-1/2 mb-4" />
            <SkeletonBlock className="h-16 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

// --- Analytics Page Skeleton ---
export function AnalyticsPageSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <SkeletonBlock className="h-8 w-48 mb-2" />
        <SkeletonBlock className="h-4 w-64" />
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <SkeletonBlock className="h-5 w-24" />
              <SkeletonBlock className="h-5 w-5 rounded" />
            </div>
            <SkeletonBlock className="h-8 w-12" />
            <SkeletonBlock className="h-3 w-24 mt-2" />
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6">
        <SkeletonBlock className="h-6 w-40 mb-2" />
        <SkeletonBlock className="h-4 w-72 mb-4" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
    </div>
  )
}

// --- Tracking Page Skeleton ---
export function TrackingPageSkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <SkeletonBlock className="h-8 w-40 mb-2" />
        <SkeletonBlock className="h-4 w-64" />
      </div>
      <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-5 w-5 rounded" />
            </div>
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-3 w-24 mt-2" />
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6">
        <SkeletonBlock className="h-6 w-56 mb-2" />
        <SkeletonBlock className="h-4 w-72" />
      </div>
    </div>
  )
}

// --- System Page Skeleton ---
export function SystemPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-40 mb-2" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
        <div className="flex gap-2">
          <SkeletonBlock className="h-10 w-32" />
          <SkeletonBlock className="h-10 w-40" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <div className="flex items-center gap-3">
              <SkeletonBlock className="h-8 w-8 rounded-full" />
              <div>
                <SkeletonBlock className="h-8 w-12 mb-1" />
                <SkeletonBlock className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-6">
            <SkeletonBlock className="h-6 w-48 mb-4" />
            <SkeletonBlock className="h-10 w-full" />
          </div>
        ))}
      </div>
    </div>
  )
}

// --- PDF Generator Page Skeleton ---
export function PDFGeneratorPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-64 mb-2" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
        <SkeletonBlock className="h-10 w-32" />
      </div>
      <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-5 w-5 rounded" />
            </div>
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-3 w-24 mt-2" />
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6">
        <SkeletonBlock className="h-6 w-56 mb-2" />
        <SkeletonBlock className="h-4 w-72" />
      </div>
    </div>
  )
}

// --- Editor Page Skeleton ---
export function EditorPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-40 mb-2" />
          <SkeletonBlock className="h-4 w-72" />
        </div>
        <SkeletonBlock className="h-10 w-28" />
      </div>
      <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <SkeletonBlock className="h-5 w-40" />
              <SkeletonBlock className="h-5 w-5 rounded" />
            </div>
            <SkeletonBlock className="h-8 w-16" />
            <SkeletonBlock className="h-3 w-24 mt-2" />
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6">
        <SkeletonBlock className="h-6 w-64 mb-2" />
        <SkeletonBlock className="h-4 w-80" />
      </div>
    </div>
  )
}

// --- AI Test Page Skeleton ---
export function AITestPageSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <SkeletonBlock className="h-8 w-72 mb-2" />
          <SkeletonBlock className="h-4 w-96" />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex items-center gap-2">
              <SkeletonBlock className="h-5 w-5 rounded" />
              <div>
                <SkeletonBlock className="h-6 w-24 mb-1" />
                <SkeletonBlock className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="border rounded-lg p-6">
        <SkeletonBlock className="h-9 w-64 mb-3" />
        <SkeletonBlock className="h-24 w-full" />
      </div>
    </div>
  )
}
