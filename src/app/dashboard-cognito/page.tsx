"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MainLayoutCognitoIntegrated } from "@/components/layout/main-layout-cognito-integrated"
import { 
  Users, 
  Package, 
  MessageSquare, 
  FileText, 
  TrendingUp,
  Settings,
  Plus,
  ArrowRight,
  Shield,
  Database
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCognitoReal } from "@/hooks/use-cognito-real"
import { UserRoleType } from "@/types/users"
import { useUsers } from "@/hooks/use-users"
import { useProviders } from "@/hooks/use-providers"

export default function DashboardCognitoPage() {
  const router = useRouter()
  const { user } = useCognitoReal()
  const { users, loading: usersLoading } = useUsers()
  const { providers, loading: providersLoading } = useProviders()

  // Determinar permisos basados en el rol de Cognito
  const hasPermission = (permission: string) => {
    if (!user) return false
    
    switch (permission) {
      case 'canManageUsers':
        return user.role === 'admin' as UserRoleType
      case 'canManageProviders':
        return user.role === 'admin' as UserRoleType
      default:
        return false
    }
  }

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
    <MainLayoutCognitoIntegrated>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard Principal</h1>
            <p className="text-muted-foreground">
              Bienvenido a OnPoint Admin - Plataforma de Ventas B2B con IA
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                🔐 AWS Cognito Real
              </Badge>
              <Badge variant="outline">
                {user?.role === 'admin' as UserRoleType ? 'Administrador' : 'Ejecutivo'}
              </Badge>
            </div>
          </div>
          <Button onClick={() => router.push('/providers/new')}>
            <Plus className="h-4 w-4 mr-2" />
            Nuevo Proveedor
          </Button>
        </div>

        {/* AWS Cognito Status Card */}
        <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <Shield className="h-6 w-6 text-blue-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                  Autenticación AWS Cognito Activa
                </h3>
                <p className="text-blue-700 dark:text-blue-300">
                  Usuario: {user?.email} • Rol: {user?.role} • ID: {user?.id}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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

        {/* Gestión de Proveedores - Solo para Administradores */}
        {hasPermission('canManageProviders') && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">Gestión de Proveedores</h2>
                <p className="text-muted-foreground">
                  Administra proveedores, logos y información comercial
                </p>
              </div>
              <Button onClick={() => router.push('/providers')}>
                <Package className="h-4 w-4 mr-2" />
                Ver Todos los Proveedores
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <Package className="h-8 w-8 text-blue-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {providersLoading ? "..." : providers.length}
                      </p>
                      <p className="text-sm text-muted-foreground">Total Proveedores</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {providersLoading ? "..." : providers.filter(p => p.status === 'active').length}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {providersLoading ? "..." : providers.filter(p => p.status === 'active').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Proveedores Activos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                      <span className="text-white font-bold">
                        {providersLoading ? "..." : providers.filter(p => p.status === 'inactive').length}
                      </span>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">
                        {providersLoading ? "..." : providers.filter(p => p.status === 'inactive').length}
                      </p>
                      <p className="text-sm text-muted-foreground">Inactivos</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Proveedores Recientes</CardTitle>
                <CardDescription>
                  Últimos proveedores registrados y su actividad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {providersLoading ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">Cargando proveedores...</p>
                    </div>
                  ) : providers.length === 0 ? (
                    <div className="text-center py-4">
                      <p className="text-muted-foreground">No hay proveedores registrados</p>
                    </div>
                  ) : (
                    providers.slice(0, 5).map((provider) => (
                      <div key={provider.id} className="flex items-center gap-4 p-3 border rounded-lg">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Package className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-medium">{provider.name}</h4>
                          <p className="text-sm text-muted-foreground">
                            {provider.email} • {provider.company || 'Sin empresa'}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge 
                            className={
                              provider.status === 'active' 
                                ? "bg-green-100 text-green-800" 
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {provider.status === 'active' ? 'Activo' : 'Inactivo'}
                          </Badge>
                          <p className="text-xs text-muted-foreground mt-1">
                            {new Date(provider.createdAt).toLocaleDateString()}
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
                    onClick={() => router.push('/providers')}
                  >
                    Ver Todos los Proveedores
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayoutCognitoIntegrated>
  )
}
