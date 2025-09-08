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
      console.log('🚀 Limpiando cookies de NextAuth...')
      
      // Limpiar todas las cookies de NextAuth
      document.cookie = 'next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      document.cookie = 'next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
      
      console.log('🧹 Cookies limpiadas, navegando al dashboard...')
      
      // Usar window.location para forzar navegación completa
      window.location.href = '/dashboard'
      
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
            onClick={() => {
              // Limpiar cookies y navegar
              document.cookie = 'next-auth.csrf-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
              document.cookie = 'next-auth.callback-url=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
              document.cookie = 'next-auth.session-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
              window.location.href = '/dashboard'
            }}
            variant="outline"
            className="w-full"
            size="lg"
          >
            Acceso Directo (Sin Cookies)
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
