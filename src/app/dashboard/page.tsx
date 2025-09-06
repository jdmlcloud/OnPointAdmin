"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MainLayout } from "@/components/layout/main-layout"
import { 
  Users, 
  Package, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Settings,
  Plus,
  ArrowRight
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useRoles } from "@/hooks/use-roles"

export default function DashboardPage() {
  const router = useRouter()
  const { currentRole, hasPermission } = useRoles()
  
  // Debug: verificar permisos
  console.log('Dashboard - Current role:', currentRole)
  console.log('Dashboard - Can manage users:', hasPermission('canManageUsers'))

  const modules = [
    {
      title: "Gestión de Proveedores",
      description: "Administra proveedores, logos y información comercial",
      icon: Users,
      href: "/providers",
      status: "V1 - Disponible",
      color: "bg-blue-500"
    },
    {
      title: "Gestión de Productos",
      description: "CRUD de productos, variantes y precios escalonados",
      icon: Package,
      href: "/products",
      status: "V1 - Disponible",
      color: "bg-green-500"
    },
    {
      title: "WhatsApp + IA",
      description: "Procesamiento automático de mensajes con IA",
      icon: MessageSquare,
      href: "/whatsapp",
      status: "V2 - En desarrollo",
      color: "bg-yellow-500"
    },
    {
      title: "Cotización Inteligente",
      description: "Sistema de recomendación y cotizador automático",
      icon: TrendingUp,
      href: "/quotations",
      status: "V3 - Planificado",
      color: "bg-purple-500"
    },
    {
      title: "Diseño de Propuestas",
      description: "Generación de mockups y diseño visual",
      icon: FileText,
      href: "/proposals",
      status: "V4 - Planificado",
      color: "bg-pink-500"
    },
    {
      title: "Configuración",
      description: "Ajustes del sistema y preferencias",
      icon: Settings,
      href: "/settings",
      status: "V1 - Disponible",
      color: "bg-gray-500"
    }
  ]

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Principal</h1>
            <p className="text-muted-foreground">
              Bienvenido a OnPoint Admin - Plataforma de Ventas B2B con IA
            </p>
          </div>
          <Button onClick={() => router.push('/providers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>

        {/* Modules Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {modules.map((module) => {
            const Icon = module.icon
            return (
              <Card key={module.title} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${module.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <Badge variant="secondary" className="mt-1">
                        {module.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {module.description}
                  </CardDescription>
                  <Button 
                    className="w-full" 
                    variant="outline"
                    onClick={() => router.push(module.href)}
                  >
                    Acceder
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Stats Overview */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Resumen del Sistema</h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Proveedores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Productos</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Mensajes IA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <FileText className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-sm text-muted-foreground">Propuestas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Gestión de Usuarios - Solo para Administradores */}
        {hasPermission('canManageUsers') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
                <p className="text-muted-foreground">
                  Administra usuarios internos, roles y permisos del sistema
                </p>
              </div>
              <Button onClick={() => router.push('/users')}>
                <Users className="h-4 w-4 mr-2" />
                Ver Todos los Usuarios
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Users className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">5</p>
                      <p className="text-sm text-muted-foreground">Total Usuarios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">4</p>
                      <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-white font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">1</p>
                      <p className="text-sm text-muted-foreground">Pendientes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Usuarios Recientes</CardTitle>
                <CardDescription>
                  Últimos usuarios registrados y su actividad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">María González</h4>
                      <p className="text-sm text-muted-foreground">maria@onpoint.com • Administradora</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Hace 2 horas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Carlos Rodríguez</h4>
                      <p className="text-sm text-muted-foreground">carlos@onpoint.com • Ejecutivo</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-green-100 text-green-800">Activo</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Hace 4 horas</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4 p-3 border rounded-lg">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium">Roberto Silva</h4>
                      <p className="text-sm text-muted-foreground">roberto@onpoint.com • Ejecutivo</p>
                    </div>
                    <div className="text-right">
                      <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>
                      <p className="text-xs text-muted-foreground mt-1">Hace 1 día</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t">
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => router.push('/users')}
                  >
                    Ver Todos los Usuarios
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  )
}
