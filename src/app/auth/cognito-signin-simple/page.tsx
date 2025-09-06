"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Eye, EyeOff } from 'lucide-react'

export default function CognitoSignInSimplePage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simular login por ahora
    setTimeout(() => {
      setIsLoading(false)
      if (email === 'admin@onpoint.com' && password === 'Admin123!') {
        router.push('/cognito-dashboard')
      } else if (email === 'ejecutivo@onpoint.com' && password === 'Ejecutivo123!') {
        router.push('/cognito-dashboard')
      } else {
        setError('Credenciales incorrectas')
      }
    }, 1000)
  }

  const handleDemoLogin = async (role: 'admin' | 'ejecutivo') => {
    setIsLoading(true)
    setError('')

    const credentials = {
      admin: { email: 'admin@onpoint.com', password: 'Admin123!' },
      ejecutivo: { email: 'ejecutivo@onpoint.com', password: 'Ejecutivo123!' }
    }

    setEmail(credentials[role].email)
    setPassword(credentials[role].password)

    setTimeout(() => {
      setIsLoading(false)
      router.push('/cognito-dashboard')
    }, 1000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">OnPoint Admin</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de gestión B2B con IA
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Iniciar Sesión</CardTitle>
            <CardDescription>
              Accede con tus credenciales de AWS Cognito
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md">
                  {error}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Tu contraseña"
                    required
                    disabled={isLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Iniciando sesión...
                  </>
                ) : (
                  'Iniciar Sesión'
                )}
              </Button>
            </form>

            <div className="mt-6 space-y-3">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    O prueba con usuarios demo
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('admin')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Admin Demo'
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleDemoLogin('ejecutivo')}
                  disabled={isLoading}
                  className="text-xs"
                >
                  {isLoading ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    'Ejecutivo Demo'
                  )}
                </Button>
              </div>
            </div>

            <div className="mt-4 text-center text-xs text-muted-foreground">
              <p>Usuarios demo para testing (sin AWS Cognito aún)</p>
              <p className="mt-1">
                Admin: admin@onpoint.com / Ejecutivo: ejecutivo@onpoint.com
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="text-center">
          <Button
            variant="link"
            onClick={() => router.push('/auth/signin')}
            className="text-sm"
          >
            ← Volver a NextAuth (temporal)
          </Button>
        </div>
      </div>
    </div>
  )
}
