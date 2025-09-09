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