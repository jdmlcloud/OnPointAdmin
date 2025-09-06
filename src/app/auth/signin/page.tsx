"use client"

import { signIn, getSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function SignInPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    getSession().then((session) => {
      if (session) {
        router.push('/dashboard')
      }
    })
  }, [router])

  const handleSignIn = async () => {
    setIsLoading(true)
    try {
      // En modo desarrollo, usar credenciales por defecto
      await signIn('credentials', { 
        email: 'admin@onpoint.com',
        password: 'password',
        callbackUrl: '/dashboard' 
      })
    } catch (error) {
      console.error('Error signing in:', error)
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
            {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión (Modo Demo)'}
          </Button>
          
          <div className="text-center text-sm text-muted-foreground">
            <p>Modo desarrollo - Credenciales: admin@onpoint.com / password</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
