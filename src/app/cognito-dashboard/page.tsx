"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MainLayoutCognito } from "@/components/layout/main-layout-cognito"
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
import { useAuthRoles } from "@/hooks/use-auth-roles"
import { useUsers } from "@/hooks/use-users"
import { useProviders } from "@/hooks/use-providers"
import { useCognitoAuth } from "@/hooks/use-cognito-auth"

export default function CognitoDashboardPage() {
  const router = useRouter()
  const { currentRole, hasPermission } = useAuthRoles()
  const { users, loading: usersLoading } = useUsers()
  const { providers, loading: providersLoading } = useProviders()
  const { user: cognitoUser } = useCognitoAuth()

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

  return (
    <MainLayoutCognito>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-gray-600 mt-1">
              Bienvenido, {cognitoUser?.name || 'Usuario'} • {currentRole === 'admin' ? 'Administrador' : 'Ejecutivo'}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              AWS Cognito
            </Badge>
            <Badge variant="outline">
              {currentRole === 'admin' ? 'Administrador' : 'Ejecutivo'}
            </Badge>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {usersLoading ? "..." : users.length}
                  </p>
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
                  <p className="text-2xl font-bold">
                    {providersLoading ? "..." : providers.length}
                  </p>
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

        {/* Gestión de Usuarios - Solo para Administradores */}
        {hasPermission('users', 'manage') && (
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
                      <p className="text-2xl font-bold">
                        {usersLoading ? "..." : users.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Usuarios</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {usersLoading ? "..." : users.filter(u => u.status === 'active').length}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {usersLoading ? "..." : users.filter(u => u.status === 'active').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {usersLoading ? "..." : users.filter(u => u.status === 'pending').length}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {usersLoading ? "..." : users.filter(u => u.status === 'pending').length}
                      </p>
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
                  {usersLoading ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Cargando usuarios...</p>
                    </div>
                  ) : users.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No hay usuarios registrados</p>
                    </div>
                  ) : (
                    users.slice(0, 5).map((user) => (
                      <div key={user.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{user.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {user.email} • {user.role === 'admin' ? 'Administrador' : 'Ejecutivo'}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              user.status === 'active' 
                                ? "bg-green-100 text-green-800" 
                                : "bg-yellow-100 text-yellow-800"
                            }
                          >
                            {user.status === 'active' ? 'Activo' : 'Pendiente'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
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

        {/* Información de AWS Cognito */}
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">🔐 Autenticación AWS Cognito</CardTitle>
            <CardDescription className="text-blue-700">
              Sistema de autenticación configurado y funcionando
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-900">Usuario Actual:</p>
                <p className="text-sm text-blue-700">{cognitoUser?.email}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Rol:</p>
                <p className="text-sm text-blue-700">
                  {cognitoUser?.role === 'admin' ? 'Administrador' : 'Ejecutivo'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Token Status:</p>
                <p className="text-sm text-green-700">✅ Válido</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-900">Sesión:</p>
                <p className="text-sm text-green-700">✅ Activa</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayoutCognito>
  )
}
