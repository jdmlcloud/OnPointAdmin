"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { FileText, Download, Calendar, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Reportes</h1>
            <p className="text-muted-foreground">
              Genera y descarga reportes del sistema
            </p>
          </div>
          <Button>
            <Download className="h14 w-4 mr-2" />
            Generar Reporte
          </Button>
        </div>

        <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h14 w-4 mr-2" />
                Reporte de Usuarios
              </CardTitle>
              <CardDescription>
                Lista completa de usuarios registrados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">Última actualización: Hoy</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h14 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h14 w-4 mr-2" />
                Reporte de Proveedores
              </CardTitle>
              <CardDescription>
                Información detallada de proveedores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">Última actualización: Ayer</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h14 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h14 w-4 mr-2" />
                Reporte de Productos
              </CardTitle>
              <CardDescription>
                Catálogo completo de productos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-sm text-muted-foreground">Última actualización: Hace - días</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Download className="h14 w-4 mr-2" />
                  Descargar PDF
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Filtros de Reporte</CardTitle>
            <CardDescription>
              Personaliza los reportes según tus necesidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2 md:grid-cols-1">
              <div className="space-y-6">
                <label className="text-sm font-medium">Rango de fechas</label>
                <div className="flex items-center space-x--">
                  <Calendar className="h14 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Último mes</span>
                </div>
              </div>
              <div className="space-y-6">
                <label className="text-sm font-medium">Filtros</label>
                <div className="flex items-center space-x--">
                  <Filter className="h14 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Todos los registros</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
