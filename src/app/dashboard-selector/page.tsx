'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Shield, Database, ArrowRight, CheckCircle, HardDrive } from 'lucide-react'

export default function DashboardSelectorPage() {
  const [selectedDashboard, setSelectedDashboard] = useState<string | null>(null)
  const router = useRouter()

  // Detectar si estamos en producción
  const isProduction = process.env.NODE_ENV === 'production' || 
                      (typeof window !== 'undefined' && window.location.hostname.includes('amplifyapp.com'))

  const dashboards = [
    {
      id: 'cognito',
      title: 'Dashboard con AWS Cognito Real',
      description: 'Autenticación real con AWS Cognito, datos reales y funcionalidad completa',
      icon: Shield,
      status: 'Listo para Producción',
      color: 'bg-blue-500',
      badgeColor: 'bg-green-100 text-green-800',
      features: [
        'Autenticación AWS Cognito real',
        'Tokens JWT válidos',
        'Roles y permisos reales',
        'Datos persistentes',
        'Listo para producción'
      ],
      href: '/auth/cognito-real'
    },
    {
      id: 'dynamodb',
      title: 'Dashboard con AWS DynamoDB',
      description: 'Base de datos real con AWS DynamoDB, datos persistentes y APIs reales',
      icon: HardDrive,
      status: isProduction ? 'Listo para Producción' : 'En Desarrollo',
      color: 'bg-purple-500',
      badgeColor: isProduction ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800',
      features: [
        'Base de datos AWS DynamoDB real',
        'APIs REST completas',
        'Datos persistentes',
        'Estadísticas en tiempo real',
        ...(isProduction ? ['Modo producción activo'] : ['Modo simulación disponible'])
      ],
      href: '/dashboard-dynamodb'
    },
    // Solo mostrar demo en desarrollo
    ...(isProduction ? [] : [{
      id: 'original',
      title: 'Dashboard Original (Demo)',
      description: 'Sistema de demostración con autenticación simulada y datos de prueba',
      icon: Database,
      status: 'Modo Demo',
      color: 'bg-gray-500',
      badgeColor: 'bg-yellow-100 text-yellow-800',
      features: [
        'Autenticación simulada',
        'Datos de prueba',
        'Funcionalidad básica',
        'Para desarrollo y testing',
        'No persistente'
      ],
      href: '/dashboard'
    }])
  ]

  const handleSelectDashboard = (dashboardId: string) => {
    setSelectedDashboard(dashboardId)
    const dashboard = dashboards.find(d => d.id === dashboardId)
    if (dashboard) {
      router.push(dashboard.href)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Seleccionar Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Elige el tipo de dashboard que deseas usar
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboards.map((dashboard) => {
            const Icon = dashboard.icon
            const isSelected = selectedDashboard === dashboard.id
            
            return (
              <Card 
                key={dashboard.id} 
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
                }`}
                onClick={() => handleSelectDashboard(dashboard.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-lg ${dashboard.color} text-white`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-lg">{dashboard.title}</CardTitle>
                      <Badge className={`mt-2 ${dashboard.badgeColor}`}>
                        {dashboard.status}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">
                    {dashboard.description}
                  </CardDescription>
                  
                  <div className="space-y-2 mb-6">
                    {dashboard.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {feature}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button 
                    className="w-full" 
                    variant={isSelected ? "default" : "outline"}
                    onClick={() => handleSelectDashboard(dashboard.id)}
                  >
                    {isSelected ? (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Seleccionado
                      </>
                    ) : (
                      <>
                        Acceder
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-8 text-center">
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-900/20">
            <CardContent className="pt-6">
              <div className="flex items-center justify-center">
                <Shield className="h-6 w-6 text-blue-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200">
                    Recomendación
                  </h3>
                  <p className="text-blue-700 dark:text-blue-300">
                    Para uso en producción, selecciona el Dashboard con AWS Cognito Real
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
