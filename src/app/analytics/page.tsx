"use client"

import { useState } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown,
  Users,
  MessageSquare,
  FileText,
  Download,
  RefreshCw,
  Calendar,
  Filter,
  Eye,
  Target,
  Activity,
  DollarSign,
  Clock,
  CheckCircle,
  AlertCircle,
  Zap,
  PieChart,
  LineChart
} from "lucide-react"

interface AnalyticsData {
  totalRevenue: number
  totalQuotations: number
  totalProposals: number
  totalMessages: number
  conversionRate: number
  averageResponseTime: string
  topProducts: Array<{
    name: string
    count: number
    revenue: number
  }>
  monthlyTrends: Array<{
    month: string
    revenue: number
    quotations: number
    proposals: number
  }>
  channelPerformance: Array<{
    channel: string
    messages: number
    conversion: number
    revenue: number
  }>
}

export default function AnalyticsPage() {
  const { isLoading, simulateAction } = useMicrointeractions()
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [analyticsData] = useState<AnalyticsData>({
    totalRevenue: 125000,
    totalQuotations: 45,
    totalProposals: 32,
    totalMessages: 156,
    conversionRate: 68.5,
    averageResponseTime: "2h 15m",
    topProducts: [
      { name: "Tazas Personalizadas", count: 25, revenue: 45000 },
      { name: "Camisetas Corporativas", count: 18, revenue: 32000 },
      { name: "Lonas Publicitarias", count: 12, revenue: 28000 },
      { name: "Tarjetas de Presentación", count: 8, revenue: 15000 },
      { name: "Banners Digitales", count: 5, revenue: 5000 }
    ],
    monthlyTrends: [
      { month: "Ene", revenue: 45000, quotations: 15, proposals: 12 },
      { month: "Feb", revenue: 52000, quotations: 18, proposals: 14 },
      { month: "Mar", revenue: 48000, quotations: 16, proposals: 13 },
      { month: "Abr", revenue: 61000, quotations: 22, proposals: 18 },
      { month: "May", revenue: 58000, quotations: 20, proposals: 16 },
      { month: "Jun", revenue: 67000, quotations: 25, proposals: 20 }
    ],
    channelPerformance: [
      { channel: "WhatsApp", messages: 89, conversion: 72.5, revenue: 75000 },
      { channel: "Email", messages: 45, conversion: 65.2, revenue: 35000 },
      { channel: "Web", messages: 15, conversion: 58.3, revenue: 12000 },
      { channel: "SMS", messages: 7, conversion: 45.7, revenue: 3000 }
    ]
  })

  const handleExportAnalytics = async (format: 'pdf' | 'excel' | 'csv') => {
    await simulateAction(
      'export-analytics',
      async () => {
        // Simular exportación
        await new Promise(resolve => setTimeout(resolve, 2000))
      },
      {
        successMessage: `Analytics exportados como ${format.toUpperCase()}`,
        notification: {
          type: 'success',
          title: 'Exportación Completada',
          message: `El archivo ${format.toUpperCase()} se está descargando`
        }
      }
    )
  }

  const handleRefreshData = async () => {
    await simulateAction(
      'refresh-analytics',
      async () => {
        // Simular actualización de datos
        await new Promise(resolve => setTimeout(resolve, 1500))
      },
      {
        successMessage: "Datos actualizados exitosamente",
        notification: {
          type: 'success',
          title: 'Datos Actualizados',
          message: 'Los analytics se han actualizado con la información más reciente'
        }
      }
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Analytics</h1>
            <p className="text-muted-foreground">
              Análisis de rendimiento y métricas de negocio
            </p>
          </div>
          <div className="flex gap-2">
            <AnimatedButton 
              variant="outline"
              loading={isLoading('refresh-analytics')}
              loadingText="Actualizando..."
              onClick={handleRefreshData}
              animation="pulse"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualizar
            </AnimatedButton>
            <AnimatedButton 
              loading={isLoading('export-analytics')}
              loadingText="Exportando..."
              onClick={() => handleExportAnalytics('pdf')}
              animation="pulse"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </AnimatedButton>
          </div>
        </div>

        {/* Period Selector */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {['7d', '30d', '90d', '1y'].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period)}
              >
                {period === '7d' ? '7 días' : 
                 period === '30d' ? '30 días' :
                 period === '90d' ? '90 días' : '1 año'}
              </Button>
            ))}
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Última actualización: {new Date().toLocaleString()}</span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <DollarSign className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">${analyticsData.totalRevenue.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Ingresos Totales</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+12.5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{analyticsData.totalQuotations}</p>
                  <p className="text-sm text-muted-foreground">Cotizaciones</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+8.2%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Target className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">{analyticsData.conversionRate}%</p>
                  <p className="text-sm text-muted-foreground">Tasa de Conversión</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">+3.1%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">{analyticsData.averageResponseTime}</p>
                  <p className="text-sm text-muted-foreground">Tiempo de Respuesta</p>
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingDown className="h-3 w-3 text-green-500" />
                    <span className="text-xs text-green-500">-15min</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend */}
          <Card>
            <CardHeader>
              <CardTitle>Tendencia de Ingresos</CardTitle>
              <CardDescription>
                Evolución de ingresos en los últimos 6 meses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                <div className="text-center">
                  <LineChart className="h-12 w-12 mx-auto mb-2" />
                  <p>Gráfico de tendencia de ingresos</p>
                  <p className="text-sm">(Integrar con Chart.js)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Channel Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Rendimiento por Canal</CardTitle>
              <CardDescription>
                Comparación de canales de comunicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.channelPerformance.map((channel, index) => (
                  <div key={channel.channel} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium capitalize">{channel.channel}</span>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">{channel.messages} mensajes</span>
                        <Badge variant="outline">{channel.conversion}%</Badge>
                      </div>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className="bg-primary h-2 rounded-full transition-all duration-500"
                        style={{ width: `${channel.conversion}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>${channel.revenue.toLocaleString()} ingresos</span>
                      <span>{channel.conversion}% conversión</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle>Productos Más Vendidos</CardTitle>
            <CardDescription>
              Ranking de productos por volumen y ingresos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData.topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-semibold">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {product.count} ventas • ${product.revenue.toLocaleString()} ingresos
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${product.revenue.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{product.count} unidades</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Monthly Trends Table */}
        <Card>
          <CardHeader>
            <CardTitle>Tendencias Mensuales</CardTitle>
            <CardDescription>
              Comparación mensual de métricas clave
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Mes</th>
                    <th className="text-right py-3 px-4">Ingresos</th>
                    <th className="text-right py-3 px-4">Cotizaciones</th>
                    <th className="text-right py-3 px-4">Propuestas</th>
                    <th className="text-right py-3 px-4">Conversión</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.monthlyTrends.map((trend) => (
                    <tr key={trend.month} className="border-b">
                      <td className="py-3 px-4 font-medium">{trend.month}</td>
                      <td className="py-3 px-4 text-right">${trend.revenue.toLocaleString()}</td>
                      <td className="py-3 px-4 text-right">{trend.quotations}</td>
                      <td className="py-3 px-4 text-right">{trend.proposals}</td>
                      <td className="py-3 px-4 text-right">
                        <Badge variant="outline">
                          {((trend.proposals / trend.quotations) * 100).toFixed(1)}%
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Insights */}
        <Card>
          <CardHeader>
            <CardTitle>Insights Automáticos</CardTitle>
            <CardDescription>
              Análisis automático de tendencias y oportunidades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-green-600" />
                  <h4 className="font-medium text-green-900 dark:text-green-100">Tendencia Positiva</h4>
                </div>
                <p className="text-sm text-green-700 dark:text-green-300">
                  Los ingresos han aumentado 12.5% este mes, principalmente por tazas personalizadas
                </p>
              </div>
              
              <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <h4 className="font-medium text-blue-900 dark:text-blue-100">Oportunidad</h4>
                </div>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  WhatsApp tiene la mayor tasa de conversión (72.5%). Considera aumentar la inversión
                </p>
              </div>
              
              <div className="p-4 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="h-4 w-4 text-orange-600" />
                  <h4 className="font-medium text-orange-900 dark:text-orange-100">Atención</h4>
                </div>
                <p className="text-sm text-orange-700 dark:text-orange-300">
                  El tiempo de respuesta promedio ha aumentado. Revisa la carga de trabajo del equipo
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
