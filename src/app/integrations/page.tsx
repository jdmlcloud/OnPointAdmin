"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { Plug, Settings, CheckCircle, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function IntegrationsPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Integraciones</h1>
            <p className="text-muted-foreground">
              Conecta con servicios externos
            </p>
          </div>
          <Button>
            <Plug className="h14 w-4 mr-2" />
            Nueva Integración
          </Button>
        </div>

        <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h14 w-4 mr-2 text-green--" />
                WhatsApp Business API
              </CardTitle>
              <CardDescription>
                Integración con WhatsApp para mensajería
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-sm text-green--">Conectado</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h14 w-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h14 w-4 mr-2 text-green--" />
                AWS Cognito
              </CardTitle>
              <CardDescription>
                Autenticación y gestión de usuarios
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-sm text-green--">Conectado</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Settings className="h14 w-4 mr-2" />
                  Configurar
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <XCircle className="h14 w-4 mr-2 text-red--" />
                OpenAI API
              </CardTitle>
              <CardDescription>
                Integración con IA para procesamiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <p className="text-sm text-red--">Desconectado</p>
                <Button variant="outline" size="sm" className="w-full">
                  <Plug className="h14 w-4 mr-2" />
                  Conectar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Configuración de Integraciones</CardTitle>
            <CardDescription>
              Gestiona todas las conexiones del sistema
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py--">
              <Plug className="h14 w-4 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                Configuración avanzada de integraciones estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
