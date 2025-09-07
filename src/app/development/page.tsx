"use client"

import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Construction, Clock, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DevelopmentPage() {
  const router = useRouter()

  return (
    <MainLayout>
      <div className="h-full flex flex-col space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.back()}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-3">
                <Construction className="h-8 w-8 text-orange-500" />
                En Desarrollo
              </h1>
              <p className="text-muted-foreground">
                Esta funcionalidad está siendo desarrollada
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex items-center justify-center">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-orange-100 dark:bg-orange-900/20 rounded-full w-fit">
                <Construction className="h-12 w-12 text-orange-500" />
              </div>
              <CardTitle className="text-2xl">Funcionalidad en Desarrollo</CardTitle>
              <CardDescription className="text-lg">
                Estamos trabajando en esta funcionalidad para brindarte la mejor experiencia.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    Próximamente disponible
                  </span>
                </div>
                
                <div className="flex items-center justify-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" />
                  <span className="text-muted-foreground">
                    Funcionalidades avanzadas en desarrollo
                  </span>
                </div>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">¿Qué está disponible ahora?</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">✅</Badge>
                    <span className="text-sm">Dashboard principal</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">✅</Badge>
                    <span className="text-sm">Gestión de Proveedores</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">✅</Badge>
                    <span className="text-sm">Gestión de Productos</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">✅</Badge>
                    <span className="text-sm">Gestión de Usuarios</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="default" className="text-xs">✅</Badge>
                    <span className="text-sm">Sistema y Configuración</span>
                  </div>
                </div>
              </div>

              <div className="text-center">
                <Button onClick={() => router.push('/dashboard')}>
                  Ir al Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  )
}
