import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function ProductListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <Card key={index} className="hover:shadow-lg transition-shadow flex flex-col h-full overflow-hidden">
          {/* Imagen skeleton */}
          <div className="relative h-48 bg-muted flex items-center justify-center overflow-hidden">
            <Skeleton className="w-full h-full" />
          </div>

          {/* Contenido skeleton */}
          <CardContent className="flex-1 flex flex-col p-4">
            {/* Nombre y categoría */}
            <div className="mb-3">
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            {/* Descripción */}
            <div className="mb-4">
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            
            {/* Información de precio */}
            <div className="space-y-2 mb-4 flex-1">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-20" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-4" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>

            {/* Botones skeleton */}
            <div className="flex gap-2 mt-auto">
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 flex-1" />
              <Skeleton className="h-8 w-8" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
