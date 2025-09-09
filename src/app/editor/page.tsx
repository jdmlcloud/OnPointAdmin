"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Edit, Save, FileText, Palette } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function EditorPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Editor</h1>
            <p className="text-muted-foreground">
              Editor de documentos y propuestas
            </p>
          </div>
          <Button>
              <Save className="h-4 w-4 mr-2" />
            Guardar
          </Button>
        </div>

        <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb-2">
              <CardTitle className="text-sm font-medium">Documentos Creados</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                +- desde ayer
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb-2">
              <CardTitle className="text-sm font-medium">Templates</CardTitle>
              <Palette className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                +- nuevos templates
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb-2">
              <CardTitle className="text-sm font-medium">Documentos Guardados</CardTitle>
              <Save className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                +-% este mes
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb-2">
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <Edit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-min</div>
              <p className="text-xs text-muted-foreground">
                --min desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Editor de Documentos</CardTitle>
            <CardDescription>
              Crea y edita documentos profesionales
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Edit className="h-4 w-4 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                El editor de documentos estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
