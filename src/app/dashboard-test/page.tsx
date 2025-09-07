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
  RefreshCw
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"

interface DashboardStats {
  users: number
  providers: number
  products: number
  source: string
}

export default function DashboardTestPage() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchStats = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Obtener estadísticas de DynamoDB
      const [usersRes, providersRes, productsRes] = await Promise.all([
        fetch('/api/dynamodb/users'),
        fetch('/api/dynamodb/providers'),
        fetch('/api/dynamodb/products')
      ])

      const [usersData, providersData, productsData] = await Promise.all([
        usersRes.json(),
        providersRes.json(),
        productsRes.json()
      ])

      setStats({
        users: usersData.count || 0,
        providers: providersData.count || 0,
        products: productsData.count || 0,
        source: usersData.source || 'Desconocido'
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
      console.error('Error fetching stats:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStats()
  }, [])

  const modules = [
    {
      title: "Gestión de Proveedores",
      description: "Administra proveedores, logos y información comercial",
      icon: Users,
      href: "/providers",
      status: "✅ Conectado",
      color: "bg-blue-500",
      count: stats?.providers || 0
    },
    {
      title: "Gestión de Productos",
      description: "CRUD de productos, variantes y precios escalonados",
      icon: Package,
      href: "/products",
      status: "✅ Conectado",
      color: "bg-green-500",
      count: stats?.products || 0
    },
    {
      title: "Usuarios del Sistema",
      description: "Gestión de usuarios y permisos",
      icon: Users,
      href: "/users",
      status: "✅ Conectado",
      color: "bg-purple-500",
      count: stats?.users || 0
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
      color: "bg-indigo-500"
    },
    {
      title: "Propuestas Comerciales",
      description: "Creación y gestión de propuestas personalizadas",
      icon: TrendingUp,
      href: "/proposals",
      status: "V4 - En desarrollo",
      color: "bg-pink-500"
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <div className="space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Dashboard Principal - MVP</h1>
              <p className="text-muted-foreground">
                Sistema conectado a AWS DynamoDB - Datos reales
              </p>
              {stats && (
                <Badge variant="outline" className="mt-2">
                  {stats.source}
                </Badge>
              )}
            </div>
            <div className="flex gap-2">
              <Button onClick={fetchStats} disabled={loading}>
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </Button>
              <Button onClick={() => router.push('/dashboard-dynamodb')}>
                <ArrowRight className="h-4 w-4 mr-2" />
                Ver DynamoDB
              </Button>
            </div>
          </div>

          {/* Error State */}
          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="pt-6">
                <p className="text-red-600">Error: {error}</p>
                <Button onClick={fetchStats} className="mt-2" variant="outline">
                  Reintentar
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Loading State */}
          {loading && !stats && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Cargando estadísticas...</span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Overview */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.users}</div>
                  <p className="text-xs text-muted-foreground">
                    Usuarios registrados
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Proveedores</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.providers}</div>
                  <p className="text-xs text-muted-foreground">
                    Proveedores activos
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Productos</CardTitle>
                  <Package className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.products}</div>
                  <p className="text-xs text-muted-foreground">
                    Productos disponibles
                  </p>
                </CardContent>
              </Card>
            </div>
          )}

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
                    {module.count !== undefined && (
                      <div className="mb-4">
                        <span className="text-2xl font-bold">{module.count}</span>
                        <span className="text-sm text-muted-foreground ml-1">elementos</span>
                      </div>
                    )}
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

          {/* Connection Status */}
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Estado de Conexión</CardTitle>
                <CardDescription>
                  Verificación de servicios AWS conectados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span>AWS DynamoDB</span>
                    <Badge variant="default" className="bg-green-500">
                      ✅ Conectado
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Fuente de Datos</span>
                    <Badge variant="outline">
                      {stats.source}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Total de Elementos</span>
                    <Badge variant="outline">
                      {stats.users + stats.providers + stats.products} elementos
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
