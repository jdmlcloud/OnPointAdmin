'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, Shield } from 'lucide-react'
import { useCognitoReal } from '@/hooks/use-cognito-real'

export default function CognitoRealPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  
  const { signIn, loading, error, clearError } = useCognitoReal()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    
    try {
      const user = await signIn({ email, password })
      console.log('Usuario autenticado con AWS Cognito real:', user)
      
      // Limpiar campos
      setEmail('')
      setPassword('')
      
      // Redirigir usando window.location para asegurar la navegación
      console.log('Redirigiendo a dashboard real...')
      window.location.href = '/cognito-dashboard-real'
    } catch (err) {
      console.error('Error en login real:', err)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-2">
            <Shield className="h-8 w-8 text-blue-600 mr-2" />
            <CardTitle className="text-2xl font-bold">AWS Cognito Real</CardTitle>
          </div>
          <CardDescription>
            Autenticación real con AWS Cognito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
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
                disabled={loading}
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
                  disabled={loading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
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
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Autenticando con AWS...
                </>
              ) : (
                'Iniciar Sesión con AWS Cognito'
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
            <p className="mb-2">Usuarios de prueba en AWS Cognito:</p>
            <p><strong>Admin:</strong> admin@onpoint.com / Admin123!</p>
            <p><strong>Ejecutivo:</strong> ejecutivo@onpoint.com / Ejecutivo123!</p>
            <div className="mt-3 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-md">
              <p className="text-blue-700 dark:text-blue-300 text-xs">
                🔐 Conectando con AWS Cognito real
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
