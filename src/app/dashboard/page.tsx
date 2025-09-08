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
import { useAuthContext } from "@/lib/auth/auth-context"
import { getVersionString } from "@/lib/version"

export default function DashboardPage() {
  const router = useRouter()
  const { user, logout } = useAuthContext()

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

  const getStatusColor = (status: string) => {
    if (status.includes("Disponible")) return "bg-green-100 text-green-800"
    if (status.includes("En desarrollo")) return "bg-yellow-100 text-yellow-800"
    return "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-gray-900">
                  OnPoint Admin
                </h1>
              </div>
              <div className="ml-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getVersionString()}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">
                  {user?.email}
                </p>
              </div>
              <Button
                onClick={logout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Dashboard
            </h2>
            <p className="text-gray-600">
              Bienvenido al sistema de gestión OnPoint Admin
            </p>
          </div>

          {/* Modules Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {modules.map((module, index) => {
              const IconComponent = module.icon
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg ${module.color}`}>
                        <IconComponent className="h-6 w-6 text-white" />
                      </div>
                      <Badge className={getStatusColor(module.status)}>
                        {module.status}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{module.title}</CardTitle>
                    <CardDescription className="text-sm">
                      {module.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
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

          {/* Quick Actions */}
          <div className="mt-12">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-blue-100 rounded-lg">
                      <Users className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Gestión de Usuarios</h4>
                      <p className="text-sm text-gray-600">Administra usuarios, roles y permisos</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => router.push('/users')}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-green-100 rounded-lg">
                      <Package className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Nuevo Producto</h4>
                      <p className="text-sm text-gray-600">Agregar producto al catálogo</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => router.push('/products')}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="hover:shadow-lg transition-shadow duration-200">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-purple-100 rounded-lg">
                      <FileText className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">Reportes</h4>
                      <p className="text-sm text-gray-600">Ver estadísticas y reportes</p>
                    </div>
                    <Button 
                      size="sm" 
                      onClick={() => router.push('/analytics')}
                    >
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default DashboardPage