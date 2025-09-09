"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { FileText, Palette, Plus, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ProposalsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Propuestas</h1>
            <p className="text-muted-foreground">
              Diseño y generación de propuestas
            </p>
          </div>
          <Button>
            <Plus className="h14 w-4 mr-2" />
            Nueva Propuesta
          </Button>
        </div>

        <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Propuestas en Proceso</CardTitle>
              <FileText className="h14 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Propuestas Completadas</CardTitle>
              <Eye className="h14 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                +-% este mes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Templates Disponibles</CardTitle>
              <Palette className="h14 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                +- nuevos templates
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <FileText className="h14 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-.-h</div>
              <p className="text-xs text-muted-foreground">
                --min desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Propuestas Recientes</CardTitle>
            <CardDescription>
              Últimas propuestas generadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py--">
              <Palette className="h14 w-4 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                El sistema de diseño de propuestas estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
