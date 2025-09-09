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
  MessageCircle,
  Activity,
  Clock,
  Database,
  Server,
  Shield,
  Globe,
  Smartphone,
  Monitor,
  Laptop,
  HardDrive,
  Bell,
  CheckCircle,
  AlertCircle,
  UserPlus,
  MessageSquarePlus,
  FileTextIcon,
  Calendar,
  Target,
  TrendingDown,
  Eye,
  Mail
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/lib/auth/auth-context"
import { useUsers } from "@/hooks/use-users"
import { useProviders } from "@/hooks/use-providers"
import { useStats } from "@/hooks/use-stats"
import { useLogos } from "@/hooks/use-logos"
import { useProducts } from "@/hooks/use-products"
import { useClients } from "@/hooks/use-clients"

export default function DashboardPage() {
  const router = useRouter()
  const { user } = useAuthContext()
  const { users, loading: usersLoading } = useUsers()
  const { providers, loading: providersLoading } = useProviders()
  const { stats, loading: statsLoading } = useStats()
  const { logos, loading: logosLoading } = useLogos()
  const { products, loading: productsLoading } = useProducts()
  const { clients, loading: clientsLoading } = useClients()

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

        {/* Pendientes y Actividades - Para Ejecutivos y Administradores */}
        <div className="space-y-6">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-500" />
            <h2 className="text-xl font-semibold">Pendientes y Actividades</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Propuestas Pendientes */}
            <Card className="border-orange-200 dark:border-orange-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <FileTextIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">3</p>
                    <p className="text-sm text-muted-foreground">Propuestas Pendientes</p>
                    <p className="text-xs text-gray-500">Requieren revisión</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-orange-600 border-orange-200 hover:bg-orange-50"
                    onClick={() => router.push('/proposals')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Revisar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Clientes Nuevos */}
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <UserPlus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">5</p>
                    <p className="text-sm text-muted-foreground">Clientes Nuevos</p>
                    <p className="text-xs text-gray-500">Esta semana</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-green-600 border-green-200 hover:bg-green-50"
                    onClick={() => router.push('/logos')}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Clientes
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* WhatsApp Nuevos */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <MessageSquarePlus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-blue-600">12</p>
                    <p className="text-sm text-muted-foreground">Mensajes WhatsApp</p>
                    <p className="text-xs text-gray-500">Sin responder</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => router.push('/whatsapp')}
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Responder
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tareas Pendientes */}
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Target className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">8</p>
                    <p className="text-sm text-muted-foreground">Tareas Pendientes</p>
                    <p className="text-xs text-gray-500">Por completar</p>
                  </div>
                </div>
                <div className="mt-3">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full text-purple-600 border-purple-200 hover:bg-purple-50"
                    onClick={() => router.push('/tasks')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Ver Tareas
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Notificaciones y Alertas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Notificaciones Urgentes */}
            <Card className="border-red-200 dark:border-red-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <AlertCircle className="h-5 w-5" />
                  Urgentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                      <FileTextIcon className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Propuesta ABC</p>
                      <p className="text-xs text-muted-foreground">Vence en 2 horas</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs">Urgente</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-red-500 flex items-center justify-center">
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Cotización HBO</p>
                      <p className="text-xs text-muted-foreground">Vence mañana</p>
                    </div>
                  </div>
                  <Badge variant="destructive" className="text-xs">Vence</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Mensajes y Comunicación */}
            <Card className="border-blue-200 dark:border-blue-800">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-blue-600">
                  <MessageSquare className="h-5 w-5" />
                  Comunicación
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <MessageSquarePlus className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">WhatsApp +52 55 1234</p>
                      <p className="text-xs text-muted-foreground">Hace 30 min</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">Nuevo</Badge>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-6 w-6 rounded-full bg-blue-500 flex items-center justify-center">
                      <Mail className="h-3 w-3 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Email Netflix</p>
                      <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">Pendiente</Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Resumen de Productividad */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Tareas Completadas Hoy */}
            <Card className="border-green-200 dark:border-green-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500 flex items-center justify-center">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">5</p>
                    <p className="text-sm text-muted-foreground">Tareas Completadas</p>
                    <p className="text-xs text-gray-500">Hoy</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clientes Contactados */}
            <Card className="border-purple-200 dark:border-purple-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-500 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">8</p>
                    <p className="text-sm text-muted-foreground">Clientes Contactados</p>
                    <p className="text-xs text-gray-500">Esta semana</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Propuestas Enviadas */}
            <Card className="border-orange-200 dark:border-orange-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-500 flex items-center justify-center">
                    <FileTextIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">12</p>
                    <p className="text-sm text-muted-foreground">Propuestas Enviadas</p>
                    <p className="text-xs text-gray-500">Este mes</p>
                  </div>
                </div>
              </CardContent>
            </Card>
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
        <div className="space-y-6">
          <h2 className="text-xl font-semibold">Métricas del Sistema</h2>
          
          {/* Primera fila - Datos principales */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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

            {/* Productos */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Package className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">
                      {productsLoading ? "..." : products.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Productos</p>
                    <p className="text-xs text-gray-500">En el catálogo</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Logos */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Image className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-purple-600">
                      {logosLoading ? "..." : logos.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Logos</p>
                    <p className="text-xs text-gray-500">Archivos de marca</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Clientes */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-orange-600">
                      {clientsLoading ? "..." : clients.length}
                    </p>
                    <p className="text-sm text-muted-foreground">Clientes</p>
                    <p className="text-xs text-gray-500">Empresas registradas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Segunda fila - Usuarios y actividad */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Usuarios Activos */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Users className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
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
                  <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{services.length}</p>
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

            {/* Uptime */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-cyan-500 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-cyan-600">99.9%</p>
                    <p className="text-sm text-muted-foreground">Uptime</p>
                    <p className="text-xs text-gray-500">Disponibilidad del sistema</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tercera fila - Infraestructura y rendimiento */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Base de Datos */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-red-500 flex items-center justify-center">
                    <Database className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">DynamoDB</p>
                    <p className="text-sm text-muted-foreground">Base de Datos</p>
                    <p className="text-xs text-gray-500">AWS DynamoDB activa</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Almacenamiento */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-yellow-500 flex items-center justify-center">
                    <HardDrive className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-yellow-600">S3</p>
                    <p className="text-sm text-muted-foreground">Almacenamiento</p>
                    <p className="text-xs text-gray-500">AWS S3 para archivos</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Servidor */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-teal-500 flex items-center justify-center">
                    <Server className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-teal-600">Lambda</p>
                    <p className="text-sm text-muted-foreground">Servidor</p>
                    <p className="text-xs text-gray-500">AWS Lambda functions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Seguridad */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-pink-500 flex items-center justify-center">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-pink-600">HTTPS</p>
                    <p className="text-sm text-muted-foreground">Seguridad</p>
                    <p className="text-xs text-gray-500">Conexión encriptada</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Actividad Reciente y Estadísticas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Actividad Reciente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5" />
                Actividad Reciente
              </CardTitle>
              <CardDescription>
                Últimas acciones realizadas en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <Building2 className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Nuevo proveedor agregado</p>
                    <p className="text-xs text-muted-foreground">Hace 2 minutos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Image className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Logo actualizado</p>
                    <p className="text-xs text-muted-foreground">Hace 15 minutos</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-purple-50 dark:bg-purple-950/20 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-purple-500 flex items-center justify-center">
                    <Package className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Producto creado</p>
                    <p className="text-xs text-muted-foreground">Hace 1 hora</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                    <Users className="h-4 w-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Cliente registrado</p>
                    <p className="text-xs text-muted-foreground">Hace 2 horas</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Estadísticas de Uso */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Estadísticas de Uso
              </CardTitle>
              <CardDescription>
                Métricas de rendimiento y uso del sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Uso de CPU */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Uso de CPU</span>
                    <span className="text-sm text-muted-foreground">45%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{width: '45%'}}></div>
                  </div>
                </div>

                {/* Memoria */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Memoria</span>
                    <span className="text-sm text-muted-foreground">2.1GB / 4GB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{width: '52%'}}></div>
                  </div>
                </div>

                {/* Almacenamiento */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Almacenamiento</span>
                    <span className="text-sm text-muted-foreground">15.2GB / 100GB</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-yellow-500 h-2 rounded-full" style={{width: '15%'}}></div>
                  </div>
                </div>

                {/* Requests por minuto */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Requests/min</span>
                    <span className="text-sm text-muted-foreground">127</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{width: '63%'}}></div>
                  </div>
                </div>

                {/* Tiempo de respuesta */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Tiempo de respuesta</span>
                    <span className="text-sm text-muted-foreground">245ms</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div className="bg-cyan-500 h-2 rounded-full" style={{width: '25%'}}></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Información del Sistema */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Versión del Sistema */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold">v1.0.0</p>
                  <p className="text-sm text-muted-foreground">Versión del Sistema</p>
                  <p className="text-xs text-gray-500">Última actualización: Hoy</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Entorno */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                  <Monitor className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold">Sandbox</p>
                  <p className="text-sm text-muted-foreground">Entorno Actual</p>
                  <p className="text-xs text-gray-500">Desarrollo y pruebas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Región AWS */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-orange-500 flex items-center justify-center">
                  <Server className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold">us-east-1</p>
                  <p className="text-sm text-muted-foreground">Región AWS</p>
                  <p className="text-xs text-gray-500">N. Virginia, Estados Unidos</p>
                </div>
              </div>
            </CardContent>
          </Card>
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
