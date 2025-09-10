"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { MapPin, Clock, Users, TrendingUp } from "lucide-react"
import { useState, useEffect } from "react"
import { useNotifications } from "@/hooks/use-notifications"
import { TrackingPageSkeleton } from "@/components/ui/page-skeletons"

export default function TrackingPage() {
  const { loading } = useNotifications()
  const [splashLoading, setSplashLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setSplashLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  if (loading || splashLoading) {
    return (
      <MainLayout>
        <TrackingPageSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Tracking</h1>
          <p className="text-muted-foreground">
            Seguimiento y monitoreo de actividades
          </p>
        </div>

        <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Actividades Activas</CardTitle>
              <MapPin className="h14 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                +- desde ayer
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Clock className="h14 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-.-h</div>
              <p className="text-xs text-muted-foreground">
                --min desde ayer
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
              <Users className="h14 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                +- nuevos usuarios
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Eficiencia</CardTitle>
              <TrendingUp className="h14 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-%</div>
              <p className="text-xs text-muted-foreground">
                +Cargando datos...
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Actividades Recientes</CardTitle>
            <CardDescription>
              Últimas actividades registradas en el sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py--">
              <MapPin className="h14 w-4 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                El sistema de tracking estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
