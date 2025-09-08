import { Skeleton } from "./skeleton"
import { Card, CardContent } from "./card"

export function ProviderSkeleton() {
  return (
    <Card className="hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden">
      {/* Imagen skeleton */}
      <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Contenido skeleton */}
      <CardContent className="flex-1 flex flex-col p-4">
        {/* Nombre y empresa */}
        <div className="mb-3">
          <Skeleton className="h-6 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2" />
        </div>

        {/* Descripción */}
        <div className="mb-4">
          <Skeleton className="h-4 w-full mb-1" />
          <Skeleton className="h-4 w-2/3" />
        </div>
        
        {/* Información de contacto */}
        <div className="space-y-2 mb-4 flex-1">
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        </div>

        {/* Etiquetas skeleton */}
        <div className="flex flex-wrap gap-1 mb-4">
          <Skeleton className="h-6 w-16" />
          <Skeleton className="h-6 w-20" />
        </div>

        {/* Botones skeleton */}
        <div className="flex gap-2 mt-auto">
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 flex-1" />
          <Skeleton className="h-8 w-8" />
        </div>
      </CardContent>
    </Card>
  )
}

export function ProviderListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <ProviderSkeleton key={index} />
      ))}
    </div>
  )
}
