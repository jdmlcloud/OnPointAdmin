"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useAuthContext } from "@/lib/auth/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, isLoading, isAuthenticated } = useAuthContext()
  const router = useRouter()

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('❌ Usuario no autenticado, redirigiendo al login...')
      router.push('/auth/login')
    }
  }, [isAuthenticated, isLoading, router])

  // Mostrar loading mientras verifica autenticación
  if (isLoading) {
    return (
      <div className="h-screen bg-background flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Verificando autenticación...</span>
        </div>
      </div>
    )
  }

  // Si no hay usuario, no renderizar nada (se redirigirá)
  if (!user || !isAuthenticated) {
    return null
  }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
