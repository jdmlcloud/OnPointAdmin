"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Calculator, FileText, Plus, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function QuotationsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Cotizaciones</h1>
            <p className="text-muted-foreground">
              Sistema de cotización inteligente
            </p>
          </div>
          <Button>
            <Plus className="h14 w-4 mr-2" />
            Nueva Cotización
          </Button>
        </div>

        <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Cotizaciones Pendientes</CardTitle>
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
              <CardTitle className="text-sm font-medium">Cotizaciones Aprobadas</CardTitle>
              <TrendingUp className="h14 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Valor Total</CardTitle>
              <Calculator className="h14 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$-</div>
              <p className="text-xs text-muted-foreground">
                +- este mes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Tasa de Conversión</CardTitle>
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
            <CardTitle>Cotizaciones Recientes</CardTitle>
            <CardDescription>
              Últimas cotizaciones generadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py--">
              <Calculator className="h14 w-4 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                El sistema de cotización inteligente estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
