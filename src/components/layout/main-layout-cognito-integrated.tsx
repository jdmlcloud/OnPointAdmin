"use client"

import { useCognitoReal } from "@/hooks/use-cognito-real"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Sidebar } from "./sidebar"
import { HeaderCognitoIntegrated } from "./header-cognito-integrated"
import { Loader2 } from "lucide-react"

interface MainLayoutCognitoIntegratedProps {
  children: React.ReactNode
}

export function MainLayoutCognitoIntegrated({ children }: MainLayoutCognitoIntegratedProps) {
  const { user, loading, initialized } = useCognitoReal()
  const router = useRouter()

  useEffect(() => {
    // Solo redirigir si ya se completó la verificación inicial y no hay usuario
    if (initialized && !loading && !user) {
      console.log('No hay usuario autenticado, redirigiendo al login real...')
      router.push('/auth/cognito-real')
    }
  }, [user, loading, initialized, router])

  // Mostrar loading mientras se verifica la autenticación
  if (!initialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Verificando autenticación con AWS Cognito...</p>
        </div>
      </div>
    )
  }

  // Si ya se verificó y no hay usuario, mostrar mensaje mientras redirige
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-muted-foreground">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <HeaderCognitoIntegrated />
          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
