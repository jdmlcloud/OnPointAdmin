'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, LoginRequest, LoginResponse, AuthContextType, UserRoleType } from '@/types/users'
import { hasPermission, hasRole, canManageUser, canAssignRole, getAssignableRoles, canAccessRoute } from './permission-utils'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  console.log('🔐 AuthProvider inicializando...')
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  // Verificar si hay un token guardado al cargar la aplicación
  useEffect(() => {
    console.log('🔍 useEffect ejecutándose en AuthProvider...')
    
    const checkAuth = () => {
      console.log('🔍 Verificando estado de autenticación...')
      try {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')
        
        console.log('📝 Token encontrado:', !!token)
        console.log('👤 Datos de usuario encontrados:', !!userData)
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData)
            console.log('✅ Usuario autenticado:', user.email)
            setUser({
              ...user,
              password: 'hashed_password_placeholder' // Placeholder para compatibilidad
            })
            setIsAuthenticated(true)
          } catch (error) {
            console.error('❌ Error parsing user data:', error)
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
          }
        } else {
          console.log('ℹ️ No hay datos de autenticación guardados')
        }
      } catch (error) {
        console.error('❌ Error verificando autenticación:', error)
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      } finally {
        console.log('🏁 Finalizando verificación de autenticación')
        setIsLoading(false)
      }
    }

    // Ejecutar inmediatamente
    checkAuth()
  }, []) // Solo ejecutar una vez al montar

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setIsLoading(true)
      
      // Simulación de login para demostración
      const mockUsers = {
        'superadmin@onpoint.com': { role: 'superadmin', name: 'Super Admin' },
        'admin@onpoint.com': { role: 'admin', name: 'Admin' },
        'ejecutivo@onpoint.com': { role: 'ejecutivo', name: 'Ejecutivo' }
      }
      
      const userData = mockUsers[email as keyof typeof mockUsers]
      
      if (userData && password === 'password') {
        const user = {
          id: '1',
          email,
          name: userData.name,
          role: userData.role as UserRoleType,
          avatar: null,
          password: 'hashed_password_placeholder',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
        
        const token = 'mock_token_' + Date.now()
        
        // Guardar token y usuario
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(user))
        setUser(user)
        setIsAuthenticated(true)
        
        return {
          success: true,
          user,
          token,
          message: 'Login exitoso'
        }
      } else {
        return {
          success: false,
          message: 'Credenciales inválidas'
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
    localStorage.removeItem('user_data')
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
