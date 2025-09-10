"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { FileText, Download, Plus, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNotifications } from "@/hooks/use-notifications"
import { PDFGeneratorPageSkeleton } from "@/components/ui/page-skeletons"

export default function PDFGeneratorPage() {
  const { loading } = useNotifications()
  const [splashLoading, setSplashLoading] = React.useState(true)
  React.useEffect(() => {
    const t = setTimeout(() => setSplashLoading(false), 300)
    return () => clearTimeout(t)
  }, [])

  if (loading || splashLoading) {
    return (
      <MainLayout>
        <PDFGeneratorPageSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Generador de PDFs</h1>
            <p className="text-muted-foreground">
              Crea y personaliza documentos PDF
            </p>
          </div>
          <Button>
            <Plus className="h14 w-4 mr-2" />
            Nuevo PDF
          </Button>
        </div>

        <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">PDFs Generados</CardTitle>
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
              <CardTitle className="text-sm font-medium">Templates Activos</CardTitle>
              <Settings className="h14 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Descargas</CardTitle>
              <Download className="h14 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Tiempo Promedio</CardTitle>
              <FileText className="h14 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">
                -- desde el mes pasado
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>PDFs Recientes</CardTitle>
            <CardDescription>
              Últimos documentos generados
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py--">
              <FileText className="h14 w-4 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                El generador de PDFs estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
