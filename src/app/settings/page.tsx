"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { 
  Settings, 
  Save, 
  RefreshCw,
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Globe,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  Bot,
  FileText
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { SettingsPageSkeleton } from "@/components/ui/page-skeletons"

export default function SettingsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleSave = async () => {
    setIsLoading(true)
    try {
      // Simular guardado
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Configuración guardada",
        description: "Los cambios se han aplicado exitosamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al guardar la configuración.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <SettingsPageSkeleton />
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Configuración</h1>
            <p className="text-muted-foreground">
              Ajustes del sistema y preferencias
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Restaurar
            </Button>
            <Button onClick={handleSave} disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar Cambios
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="profile">Perfil</TabsTrigger>
            <TabsTrigger value="notifications">Notificaciones</TabsTrigger>
            <TabsTrigger value="security">Seguridad</TabsTrigger>
            <TabsTrigger value="integrations">Integraciones</TabsTrigger>
            <TabsTrigger value="advanced">Avanzado</TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="h-5 w-5" />
                    Configuración General
                  </CardTitle>
                  <CardDescription>
                    Configuración básica del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="companyName">Nombre de la Empresa</Label>
                    <Input
                      id="companyName"
                      defaultValue="OnPoint Admin"
                      placeholder="Nombre de tu empresa"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Zona Horaria</Label>
                    <Select defaultValue="america/mexico_city">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="america/mexico_city">México (GMT-6)</SelectItem>
                        <SelectItem value="america/new_york">Nueva York (GMT-5)</SelectItem>
                        <SelectItem value="america/los_angeles">Los Ángeles (GMT-8)</SelectItem>
                        <SelectItem value="europe/madrid">Madrid (GMT+1)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="language">Idioma</Label>
                    <Select defaultValue="es">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="pt">Português</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="currency">Moneda</Label>
                    <Select defaultValue="USD">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD - Dólar Americano</SelectItem>
                        <SelectItem value="MXN">MXN - Peso Mexicano</SelectItem>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="CAD">CAD - Dólar Canadiense</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="h-5 w-5" />
                    Apariencia
                  </CardTitle>
                  <CardDescription>
                    Personaliza la apariencia del sistema
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Tema</Label>
                    <Select defaultValue="system">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Claro</SelectItem>
                        <SelectItem value="dark">Oscuro</SelectItem>
                        <SelectItem value="system">Sistema</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="primaryColor">Color Primario</Label>
                    <input
                      id="primaryColor"
                      type="color"
                      defaultValue="#10B981"
                      className="w-full h-10 border border-input rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="secondaryColor">Color Secundario</Label>
                    <input
                      id="secondaryColor"
                      type="color"
                      defaultValue="#000000"
                      className="w-full h-10 border border-input rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Densidad de la Interfaz</Label>
                    <Select defaultValue="comfortable">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="compact">Compacta</SelectItem>
                        <SelectItem value="comfortable">Cómoda</SelectItem>
                        <SelectItem value="spacious">Espaciosa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Profile Settings */}
          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Información del Perfil
                </CardTitle>
                <CardDescription>
                  Actualiza tu información personal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nombre</Label>
                    <Input
                      id="firstName"
                      defaultValue="Usuario"
                      placeholder="Tu nombre"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Apellido</Label>
                    <Input
                      id="lastName"
                      defaultValue="Demo"
                      placeholder="Tu apellido"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    defaultValue="admin@onpoint.com"
                    placeholder="tu@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    defaultValue="+52 55 1234 5678"
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="position">Posición</Label>
                  <Input
                    id="position"
                    defaultValue="Administrador"
                    placeholder="Tu posición en la empresa"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biografía</Label>
                  <Textarea
                    id="bio"
                    placeholder="Cuéntanos sobre ti..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bell className="h-5 w-5" />
                    Notificaciones del Sistema
                  </CardTitle>
                  <CardDescription>
                    Configura qué notificaciones recibir
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Nuevos mensajes de WhatsApp</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibir notificaciones cuando lleguen nuevos mensajes
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Cotizaciones pendientes</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificaciones sobre cotizaciones que requieren atención
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Propuestas generadas</Label>
                        <p className="text-sm text-muted-foreground">
                          Avisos cuando se generen nuevas propuestas
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Actualizaciones del sistema</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificaciones sobre actualizaciones y mantenimiento
                        </p>
                      </div>
                      <Checkbox />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5" />
                    Notificaciones por Email
                  </CardTitle>
                  <CardDescription>
                    Configura las notificaciones por correo electrónico
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Resumen diario</Label>
                        <p className="text-sm text-muted-foreground">
                          Recibir un resumen diario de actividad
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Alertas importantes</Label>
                        <p className="text-sm text-muted-foreground">
                          Notificaciones inmediatas para eventos críticos
                        </p>
                      </div>
                      <Checkbox defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Recordatorios de tareas</Label>
                        <p className="text-sm text-muted-foreground">
                          Recordatorios sobre tareas pendientes
                        </p>
                      </div>
                      <Checkbox />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5" />
                  Configuración de Seguridad
                </CardTitle>
                <CardDescription>
                  Gestiona la seguridad de tu cuenta
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Contraseña Actual</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      placeholder="Tu contraseña actual"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Nueva contraseña"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="Confirma tu nueva contraseña"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Autenticación de Dos Factores</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Habilitar 2FA</Label>
                      <p className="text-sm text-muted-foreground">
                        Añade una capa extra de seguridad a tu cuenta
                      </p>
                    </div>
                    <Checkbox />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Sesiones Activas</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Sesión Actual</p>
                        <p className="text-sm text-muted-foreground">
                          Chrome en macOS • Última actividad: hace 5 minutos
                        </p>
                      </div>
                      <Badge variant="outline">Activa</Badge>
                    </div>
                    <div className="flex items-center justify-between p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">Safari en iPhone</p>
                        <p className="text-sm text-muted-foreground">
                          Última actividad: hace 2 horas
                        </p>
                      </div>
                      <Button variant="outline" size="sm">
                        Cerrar Sesión
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Integrations Settings */}
          <TabsContent value="integrations" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    WhatsApp Business API
                  </CardTitle>
                  <CardDescription>
                    Configuración de la integración con WhatsApp
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="whatsappToken">Access Token</Label>
                    <Input
                      id="whatsappToken"
                      type="password"
                      placeholder="Tu access token de WhatsApp"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phoneNumberId">Phone Number ID</Label>
                    <Input
                      id="phoneNumberId"
                      placeholder="ID del número de teléfono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="webhookToken">Webhook Verify Token</Label>
                    <Input
                      id="webhookToken"
                      type="password"
                      placeholder="Token de verificación del webhook"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Estado de la Conexión</Label>
                      <p className="text-sm text-muted-foreground">
                        Verificar conexión con WhatsApp
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Conectado
                    </Badge>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Bot className="h-5 w-5" />
                    Servicios de IA
                  </CardTitle>
                  <CardDescription>
                    Configuración de OpenAI y Claude
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="openaiKey">OpenAI API Key</Label>
                    <Input
                      id="openaiKey"
                      type="password"
                      placeholder="Tu API key de OpenAI"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="anthropicKey">Anthropic API Key</Label>
                    <Input
                      id="anthropicKey"
                      type="password"
                      placeholder="Tu API key de Anthropic"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Modelo de OpenAI</Label>
                    <Select defaultValue="gpt-4">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gpt-4">GPT-4</SelectItem>
                        <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Estado de OpenAI</Label>
                      <p className="text-sm text-muted-foreground">
                        Verificar conexión con OpenAI
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-100 text-green-800">
                      Conectado
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Advanced Settings */}
          <TabsContent value="advanced" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Configuración Avanzada
                </CardTitle>
                <CardDescription>
                  Configuraciones técnicas del sistema
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Base de Datos</h4>
                  <div className="space-y-2">
                    <Label htmlFor="dbRegion">Región de DynamoDB</Label>
                    <Select defaultValue="us-east-1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us-east-1">US East (N. Virginia)</SelectItem>
                        <SelectItem value="us-west-2">US West (Oregon)</SelectItem>
                        <SelectItem value="eu-west-1">Europe (Ireland)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Almacenamiento</h4>
                  <div className="space-y-2">
                    <Label htmlFor="s3Bucket">Bucket de S3</Label>
                    <Input
                      id="s3Bucket"
                      defaultValue="onpoint-storage"
                      placeholder="Nombre del bucket"
                    />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Logs y Monitoreo</h4>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Habilitar logs detallados</Label>
                      <p className="text-sm text-muted-foreground">
                        Registrar información detallada para debugging
                      </p>
                    </div>
                    <Checkbox />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enviar métricas a CloudWatch</Label>
                      <p className="text-sm text-muted-foreground">
                        Enviar métricas de rendimiento a AWS CloudWatch
                      </p>
                    </div>
                    <Checkbox defaultChecked />
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-medium">Zona de Peligro</h4>
                  <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                    <h5 className="font-medium text-red-900 mb-2">Acciones Destructivas</h5>
                    <p className="text-sm text-red-700 mb-4">
                      Estas acciones no se pueden deshacer. Ten cuidado.
                    </p>
                    <div className="flex gap-2">
                      <Button variant="destructive" size="sm">
                        Limpiar Cache
                      </Button>
                      <Button variant="destructive" size="sm">
                        Resetear Configuración
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
