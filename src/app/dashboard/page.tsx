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
  ArrowRight,
  Building2,
  Image,
  BarChart3,
  FileBarChart,
  Palette,
  Zap,
  Cpu,
  Bot,
  MessageCircle
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/lib/auth/auth-context"
import { useUsers } from "@/hooks/use-users"
import { useProviders } from "@/hooks/use-providers"
import { useStats } from "@/hooks/use-stats"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthContext()
  const { users, loading: usersLoading } = useUsers()
  const { providers, loading: providersLoading } = useProviders()
  const { stats, loading: statsLoading } = useStats()

  const services = [
    {
      title: "Proveedores",
      description: "Gestión de proveedores",
      icon: Building2,
      href: "/providers",
      color: "bg-blue-500"
    },
    {
      title: "Productos",
      description: "Catálogo de productos",
      icon: Package,
      href: "/products",
      color: "bg-green-500"
    },
    {
      title: "Logos",
      description: "Gestión de logos",
      icon: Image,
      href: "/logos",
      color: "bg-purple-500"
    },
    {
      title: "WhatsApp + IA",
      description: "Mensajes con IA",
      icon: MessageSquare,
      href: "/whatsapp",
      color: "bg-yellow-500"
    },
    {
      title: "Cotizaciones",
      description: "Sistema de cotizaciones",
      icon: TrendingUp,
      href: "/quotations",
      color: "bg-pink-500"
    },
    {
      title: "Propuestas",
      description: "Gestión de propuestas",
      icon: FileText,
      href: "/proposals",
      color: "bg-orange-500"
    },
    {
      title: "Generador PDFs",
      description: "Creación de PDFs",
      icon: FileBarChart,
      href: "/pdf-generator",
      color: "bg-red-500"
    },
    {
      title: "Envío y Tracking",
      description: "Seguimiento de envíos",
      icon: BarChart3,
      href: "/tracking",
      color: "bg-cyan-500"
    },
    {
      title: "Editor Visual",
      description: "Editor de contenido",
      icon: Palette,
      href: "/editor",
      color: "bg-teal-500"
    },
    {
      title: "Configuración",
      description: "Configuración del sistema",
      icon: Settings,
      href: "/settings",
      color: "bg-gray-500"
    }
  ]

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">
              Hola {user?.firstName ? user.firstName : 'Usuario'}
            </h1>
            <p className="text-muted-foreground">
              Bienvenido a JDML Cloud - Servicios de Infraestructura
            </p>
          </div>
        </div>

        {/* Accesos Rápidos */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Accesos Rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {services.map((service) => {
              const Icon = service.icon
              return (
                <Card 
                  key={service.title}
                  className="hover:shadow-lg transition-shadow cursor-pointer h-24"
                  onClick={() => router.push(service.href)}
                >
                  <CardContent className="p-4 h-full flex flex-col items-center justify-center text-center">
                    <div className={`w-8 h-8 rounded-lg ${service.color} flex items-center justify-center mb-2`}>
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <h3 className="text-sm font-medium truncate w-full">{service.title}</h3>
                    <p className="text-xs text-muted-foreground truncate w-full">{service.description}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        {/* Métricas del Sistema */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Métricas del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Proveedores */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">
                      {providersLoading ? "..." : providers.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Proveedores</p>
                    <p className="text-xs text-gray-500">Registrados en el sistema</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usuarios Activos */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {usersLoading ? "..." : users.filter(u => u.status === 'active').length}
                    </p>
                    <p className="text-sm text-muted-foreground">Usuarios Activos</p>
                    <p className="text-xs text-gray-500">de {usersLoading ? "..." : users.length} totales</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Servicios Disponibles */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">{services.length}</p>
                    <p className="text-sm text-muted-foreground">Servicios</p>
                    <p className="text-xs text-gray-500">Disponibles en la plataforma</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Estado del Sistema */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Cpu className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">Online</p>
                    <p className="text-sm text-muted-foreground">Estado del Sistema</p>
                    <p className="text-xs text-gray-500">Todos los servicios operativos</p>
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

        {/* Chat Flotante con IA */}
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => {
              // Aquí se puede implementar la funcionalidad del chat
              console.log('Abrir chat con IA')
            }}
          >
            <Bot className="h-6 w-6 text-white" />
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}