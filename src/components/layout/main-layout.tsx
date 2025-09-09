"use client"

import { Sidebar } from "./sidebar"
import { Header } from "./header"
import { useAuth } from "@/hooks/use-auth"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Loader2 } from "lucide-react"

interface MainLayoutProps {
  children: React.ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  const { user, loading, error } = useAuth()
  const router = useRouter()

  // Redirigir si no está autenticado - TEMPORALMENTE DESHABILITADO
  // useEffect(() => {
  //   if (!loading && !user) {
  //     console.log('❌ Usuario no autenticado, redirigiendo al login...')
  //     router.push('/auth/signin')
  //   }
  // }, [user, loading, router])

  // Mostrar loading mientras verifica autenticación - TEMPORALMENTE DESHABILITADO
  // if (loading) {
  //   return (
  //     <div className="h-screen bg-background flex items-center justify-center">
  //       <div className="flex items-center space-x-2">
  //         <Loader2 className="h-6 w-6 animate-spin" />
  //         <span>Verificando autenticación...</span>
  //       </div>
  //     </div>
  //   )
  // }

  // Mostrar error si hay problema de autenticación - TEMPORALMENTE DESHABILITADO
  // if (error) {
  //   return (
  //     <div className="h-screen bg-background flex items-center justify-center">
  //       <div className="text-center">
  //         <h2 className="text-xl font-semibold text-red-600">Error de autenticación</h2>
  //         <p className="text-muted-foreground mt-2">{error}</p>
  //         <button 
  //           onClick={() => router.push('/auth/signin')}
  //           className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
  //         >
  //           Volver al login
  //         </button>
  //       </div>
  //     </div>
  //   )
  // }

  // Si no hay usuario, no renderizar nada (se redirigirá) - TEMPORALMENTE DESHABILITADO
  // if (!user) {
  //   return null
  // }

  return (
    <div className="h-screen bg-background overflow-hidden">
      <div className="flex h-full">
        {/* Sidebar */}
        <Sidebar />
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-hidden p-6">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
