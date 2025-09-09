"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MainLayout } from "@/components/layout/main-layout"
import { MessageSquare, Bot, Users, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function WhatsAppPage() {
  return (
    <MainLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">WhatsApp + IA</h1>
            <p className="text-muted-foreground">
              Procesamiento automático de mensajes con IA
            </p>
          </div>
          <Button>
            <MessageSquare className="h14 w-4 mr-2" />
            Nuevo Mensaje
          </Button>
        </div>

        <div className="grid gap-2 md:grid-cols-1 lg:grid-cols-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-6 pb--">
              <CardTitle className="text-sm font-medium">Mensajes Procesados</CardTitle>
              <MessageSquare className="h14 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Respuestas Automáticas</CardTitle>
              <Bot className="h14 w-4 text-muted-foreground" />
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
              <CardTitle className="text-sm font-medium">Tiempo de Respuesta</CardTitle>
              <Clock className="h14 w-4 text-muted-foreground" />
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
            <CardTitle>Conversaciones Recientes</CardTitle>
            <CardDescription>
              Últimas conversaciones procesadas por IA
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py--">
              <Bot className="h14 w-4 mx-auto text-muted-foreground mb-2" />
              <p className="text-muted-foreground">
                El sistema de WhatsApp + IA estará disponible próximamente
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
