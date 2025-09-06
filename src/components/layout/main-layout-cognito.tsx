"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { SidebarCognito } from './sidebar-cognito'
import { useCognitoAuth } from '@/hooks/use-cognito-auth'
import { configureAmplify } from '@/lib/aws/amplify'
import { Loader2 } from 'lucide-react'

interface MainLayoutCognitoProps {
  children: React.ReactNode
}

export function MainLayoutCognito({ children }: MainLayoutCognitoProps) {
  const { user, loading, isAuthenticated } = useCognitoAuth()
  const router = useRouter()

  // Configurar Amplify al cargar
  useEffect(() => {
    configureAmplify()
  }, [])

  // Redirigir si no está autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push('/auth/cognito-signin')
    }
  }, [loading, isAuthenticated, router])

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Verificando autenticación...</p>
        </div>
      </div>
    )
  }

  // Si no está autenticado, no mostrar nada (será redirigido)
  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SidebarCognito />
      <main className="flex-1 overflow-y-auto">
        <div className="p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
