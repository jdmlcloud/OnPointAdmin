"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useState } from "react"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      console.log('🚀 Intentando navegar al dashboard...')
      // Redirigir directamente al dashboard sin autenticación
      await router.push('/dashboard')
      console.log('✅ Navegación exitosa al dashboard')
    } catch (error) {
      console.error('❌ Error navigating to dashboard:', error)
      // Fallback: usar window.location
      window.location.href = '/dashboard'
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">OnPoint Admin</CardTitle>
          <CardDescription>
            Plataforma de Ventas B2B con IA Integrada
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={handleSignIn}
            disabled={isLoading}
            className="w-full"
            size="lg"
          >
            {isLoading ? 'Accediendo...' : 'Acceder al Dashboard'}
          </Button>
          
          <Button 
            onClick={() => window.location.href = '/dashboard'}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Acceso Directo (Fallback)
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Acceso directo al sistema de administración</p>
            <p className="text-xs mt-2">
              Si el botón principal no funciona, usa el botón de fallback
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
