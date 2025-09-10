'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { LogOut, User, Mail, Shield, CheckCircle, Loader2 } from 'lucide-react'
import { useCognitoDirect } from '@/hooks/use-cognito-direct'

export default function CognitoDashboardDirectPage() {
  const { user, signOut, loading, error, initialized } = useCognitoDirect()
  const router = useRouter()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  useEffect(() => {
    // Solo redirigir si ya se completó la verificación inicial y no hay usuario
    if (initialized && !loading && !user) {
      console.log('No hay usuario autenticado, redirigiendo al login...')
      router.push('/auth/cognito-direct')
    }
  }, [user, loading, initialized, router])

  const handleSignOut = async () => {
    try {
      setIsLoggingOut(true)
      await signOut()
      router.push('/auth/cognito-direct')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Mostrar loading mientras se verifica la autenticación
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-green-500 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si ya se verificó y no hay usuario, mostrar mensaje mientras redirige
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                OnPoint Admin - AWS Cognito
              </h1>
              <Badge variant="secondary" className="ml-3">
                Simulación de Autenticación
              </Badge>
            </div>
            <Button
              onClick={handleSignOut}
              disabled={isLoggingOut}
              variant="outline"
              size="sm"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {isLoggingOut ? 'Cerrando...' : 'Cerrar Sesión'}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Dashboard de Cognito (Simulación)
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Simulación de autenticación exitosa con AWS Cognito
          </p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* User Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="h-5 w-5 mr-2" />
                Información del Usuario
              </CardTitle>
              <CardDescription>
                Datos obtenidos de AWS Cognito
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Email:</span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Nombre:</span>
                <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                  {user.name}
                </span>
              </div>
              <div className="flex items-center">
                <Shield className="h-4 w-4 mr-2 text-gray-500" />
                <span className="text-sm font-medium">Rol:</span>
                <Badge variant="outline" className="ml-2">
                  {typeof user.role === 'string' ? user.role : (user.role as any).name}
                </Badge>
              </div>
              <div className="flex items-center">
                <span className="text-sm font-medium">ID:</span>
                <span className="ml-2 text-xs text-gray-500 font-mono">
                  {user.id}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Authentication Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-2 text-green-500" />
                Estado de Autenticación
              </CardTitle>
              <CardDescription>
                Verificación de tokens JWT
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Access Token:</span>
                <Badge variant="outline" className="text-green-600">
                  Válido
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Refresh Token:</span>
                <Badge variant="outline" className="text-green-600">
                  Disponible
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Autenticación:</span>
                <Badge variant="outline" className="text-green-600">
                  Activa
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* AWS Cognito Info Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="h-5 w-5 mr-2" />
                AWS Cognito
              </CardTitle>
              <CardDescription>
                Configuración del servicio
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">User Pool:</span>
                <span className="text-xs text-gray-500 font-mono">
                  us-east-1_pnE1wndnB
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Client ID:</span>
                <span className="text-xs text-gray-500 font-mono">
                  76ho4o7fqhh3vdsiqqq269jjt5
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Región:</span>
                <Badge variant="outline">
                  us-east-1
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Success Message */}
        <Card className="mt-6 border-green-200 bg-green-50 dark:bg-green-900/20">
          <CardContent className="pt-6">
            <div className="flex items-center">
              <CheckCircle className="h-6 w-6 text-green-600 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
                  ¡Simulación de Autenticación Exitosa!
                </h3>
                <p className="text-green-700 dark:text-green-300">
                  Has iniciado sesión correctamente en la simulación de AWS Cognito.
                  Esta es una demostración del flujo de autenticación sin conexión real a AWS.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
