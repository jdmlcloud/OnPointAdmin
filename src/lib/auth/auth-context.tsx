'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginRequest, LoginResponse, AuthContextType, UserRoleType } from '@/types/users'
import { hasPermission, hasRole, canManageUser, canAssignRole, getAssignableRoles, canAccessRoute } from './permission-utils'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('auth_token')
        if (token) {
          // Verificar si el token es válido
          const response = await fetch('/api/auth/verify-token', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          })

          if (response.ok) {
            const data = await response.json()
            if (data.success && data.user) {
              setUser(data.user)
              setIsAuthenticated(true)
            } else {
              // Token inválido, limpiar
              localStorage.removeItem('auth_token')
            }
          } else {
            // Token inválido, limpiar
            localStorage.removeItem('auth_token')
          }
        }
      } catch (error) {
        console.error('Error verificando autenticación:', error)
        localStorage.removeItem('auth_token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setIsLoading(true)
      
      const loginData: LoginRequest = { email, password }
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginData)
      })

      const data: LoginResponse = await response.json()

      if (data.success && data.user && data.token) {
        // Guardar token y usuario
        localStorage.setItem('auth_token', data.token)
        setUser({
          ...data.user,
          password: 'hashed_password_placeholder' // Placeholder para compatibilidad
        })
        setIsAuthenticated(true)
        
        return {
          success: true,
          user: data.user,
          token: data.token,
          message: 'Login exitoso'
        }
      } else {
        return {
          success: false,
          message: data.message || 'Error en el login'
        }
      }
    } catch (error) {
      console.error('Error en login:', error)
      return {
        success: false,
        message: 'Error de conexión. Verifica tu conexión a internet.'
      }
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('auth_token')
    setUser(null)
    setIsAuthenticated(false)
  }

  const checkPermission = (resource: string, action: string): boolean => {
    return hasPermission(user, resource, action)
  }

  const checkRole = (role: UserRoleType): boolean => {
    return hasRole(user, role)
  }

  const canManage = (targetUser: User | null): boolean => {
    return canManageUser(user, targetUser)
  }

  const canAssign = (targetRole: string): boolean => {
    return canAssignRole(user, targetRole)
  }

  const getAssignable = (): string[] => {
    return getAssignableRoles(user)
  }

  const canAccess = (route: string): boolean => {
    return canAccessRoute(user, route)
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasPermission: checkPermission,
    hasRole: checkRole,
    canManage,
    canAssign,
    getAssignableRoles: getAssignable,
    canAccessRoute: canAccess
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuthContext = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider')
  }
  return context
}
