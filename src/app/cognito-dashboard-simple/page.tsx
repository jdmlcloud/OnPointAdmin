"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Package, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Settings,
  Plus,
  ArrowRight,
  LogOut
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function CognitoDashboardSimplePage() {
  const router = useRouter()

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
      description: "Generación automática de cotizaciones con IA",
      icon: FileText,
      href: "/quotations",
      status: "V3 - En desarrollo",
      color: "bg-purple-500"
    },
    {
      title: "Propuestas Comerciales",
      description: "Creación y gestión de propuestas personalizadas",
      icon: TrendingUp,
      href: "/proposals",
      status: "V4 - En desarrollo",
      color: "bg-indigo-500"
    },
    {
      title: "Generador PDF",
      description: "Creación automática de documentos PDF",
      icon: FileText,
      href: "/pdf-generator",
      status: "V5 - En desarrollo",
      color: "bg-pink-500"
    },
    {
      title: "Seguimiento",
      description: "Tracking de propuestas y clientes",
      icon: TrendingUp,
      href: "/tracking",
      status: "V6 - En desarrollo",
      color: "bg-orange-500"
    },
    {
      title: "Editor Visual",
      description: "Editor de templates y mockups",
      icon: Settings,
      href: "/visual-editor",
      status: "V7 - En desarrollo",
      color: "bg-teal-500"
    }
  ]

  const handleLogout = () => {
    router.push('/auth/cognito-signin-simple')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">OP</span>
              </div>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">OnPoint Admin</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                AWS Cognito (Demo)
              </Badge>
              <Badge variant="outline">
                Administrador
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1">
                Bienvenido, Usuario Demo • Administrador
              </p>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-sm text-muted-foreground">Usuarios</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Package className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Proveedores</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <MessageSquare className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">24</p>
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
                    <p className="text-2xl font-bold">12</p>
                    <p className="text-sm text-muted-foreground">Propuestas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Modules Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Módulos del Sistema</h2>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Versiones V1-V7
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {modules.map((module, index) => {
                const Icon = module.icon
                return (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className={`p-2 rounded-lg ${module.color}`}>
                          <Icon className="h-6 w-6 text-white" />
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {module.status}
                        </Badge>
                      </div>
                      <CardTitle className="text-lg">{module.title}</CardTitle>
                      <CardDescription>{module.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Button 
                        className="w-full" 
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
          </div>

          {/* Información de AWS Cognito */}
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900">🔐 AWS Cognito - Modo Demo</CardTitle>
              <CardDescription className="text-blue-700">
                Sistema de autenticación en desarrollo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-900">Estado:</p>
                  <p className="text-sm text-yellow-700">⚠️ Configuración pendiente</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Próximo paso:</p>
                  <p className="text-sm text-blue-700">Ejecutar script de configuración</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Script:</p>
                  <p className="text-sm text-blue-700">./scripts/setup-cognito.sh</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Documentación:</p>
                  <p className="text-sm text-blue-700">docs/aws-cognito.md</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
