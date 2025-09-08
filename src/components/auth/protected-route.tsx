'use client'

import React, { ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-context'
import { UserRoleType } from '@/types/users'

interface ProtectedRouteProps {
  children: ReactNode
  requiredRole?: UserRoleType
  requiredPermission?: {
    resource: string
    action: string
  }
  fallbackPath?: string
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallbackPath = '/auth/login'
}) => {
  const { isAuthenticated, user, isLoading } = useAuth()
  const router = useRouter()

  // Mostrar loading mientras se verifica la autenticación
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Redirigir si no está autenticado
  if (!isAuthenticated || !user) {
    router.push(fallbackPath)
    return null
  }

  // Verificar rol requerido
  if (requiredRole && user.role !== requiredRole) {
    // Verificar si el usuario tiene un rol superior
    const roleLevels = {
      SUPER_ADMIN: 1,
      ADMIN: 2,
      EXECUTIVE: 3
    }

    const userLevel = roleLevels[user.role as keyof typeof roleLevels] || 999
    const requiredLevel = roleLevels[requiredRole] || 999

    if (userLevel > requiredLevel) {
      // Usuario no tiene el rol requerido
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Acceso Denegado
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              No tienes permisos para acceder a esta sección.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Rol requerido: {requiredRole} | Tu rol: {user.role}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      )
    }
  }

  // Verificar permiso requerido
  if (requiredPermission) {
    const { hasPermission } = useAuth()
    if (!hasPermission(requiredPermission.resource, requiredPermission.action)) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="mt-4 text-lg font-medium text-gray-900">
              Permiso Denegado
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              No tienes permisos para realizar esta acción.
            </p>
            <p className="mt-1 text-xs text-gray-500">
              Recurso: {requiredPermission.resource} | Acción: {requiredPermission.action}
            </p>
            <button
              onClick={() => router.push('/dashboard')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Volver al Dashboard
            </button>
          </div>
        </div>
      )
    }
  }

  // Usuario autenticado y con permisos
  return <>{children}</>
}

export default ProtectedRoute
