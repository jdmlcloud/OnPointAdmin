'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginRequest, LoginResponse, AuthContextType, UserRoleType } from '@/types/users'

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
        setUser(data.user)
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

  const hasPermission = (resource: string, action: string): boolean => {
    if (!user || !user.role) return false

    // Super Admin tiene todos los permisos
    if (user.role === 'SUPER_ADMIN') return true

    // Admin tiene permisos de gestión
    if (user.role === 'ADMIN') {
      const adminPermissions = ['users', 'providers', 'products']
      return adminPermissions.includes(resource) && action === 'manage'
    }

    // Ejecutivo tiene permisos limitados
    if (user.role === 'EXECUTIVE') {
      const executivePermissions = ['providers', 'products']
      const executiveActions = ['read', 'create', 'update']
      return executivePermissions.includes(resource) && executiveActions.includes(action)
    }

    return false
  }

  const hasRole = (role: UserRoleType): boolean => {
    if (!user) return false
    return user.role === role
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
    hasPermission,
    hasRole
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider')
  }
  return context
}
