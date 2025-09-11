'use client'

import * as React from 'react'
import { User, LoginRequest, LoginResponse, AuthContextType, UserRoleType } from '@/types/users'
import { hasPermission, hasRole, canManageUser, canAssignRole, getAssignableRoles, canAccessRoute } from './permission-utils'
import { authenticateUser } from './cognito-auth'

// Alias con 'any' para evitar conflictos de tipos de React en herramientas/linter
const ReactAny = React as any
const AuthContext = ReactAny.createContext(undefined as AuthContextType | undefined)

interface AuthProviderProps {
  children: any
}

export function AuthProvider({ children }: AuthProviderProps) {
  if (process.env.NODE_ENV === 'development') {
    console.log('🔐 AuthProvider inicializando...')
  }
  const [user, setUser] = ReactAny.useState(null as User | null)
  const [isAuthenticated, setIsAuthenticated] = ReactAny.useState(false)
  const [isLoading, setIsLoading] = ReactAny.useState(true)

  // Verificar si hay un token guardado al cargar la aplicación
  ReactAny.useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 useEffect ejecutándose en AuthProvider...')
    }
    
    const checkAuth = () => {
      if (process.env.NODE_ENV === 'development') {
        console.log('🔍 Verificando estado de autenticación...')
      }
      try {
        const token = localStorage.getItem('auth_token')
        const userData = localStorage.getItem('user_data')
        
        if (process.env.NODE_ENV === 'development') {
          console.log('📝 Token encontrado:', !!token)
          console.log('👤 Datos de usuario encontrados:', !!userData)
        }
        
        if (token && userData) {
          try {
            const user = JSON.parse(userData)
            if (process.env.NODE_ENV === 'development') {
              console.log('✅ Usuario autenticado:', user.email)
            }
            setUser({
              ...user,
              password: 'hashed_password_placeholder' // Placeholder para compatibilidad
            } as User)
            setIsAuthenticated(true)
          } catch (error) {
            console.error('❌ Error parsing user data:', error)
            localStorage.removeItem('auth_token')
            localStorage.removeItem('user_data')
          }
        } else {
          if (process.env.NODE_ENV === 'development') {
            console.log('ℹ️ No hay datos de autenticación guardados')
          }
        }
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error('❌ Error verificando autenticación:', error)
        }
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_data')
      } finally {
        if (process.env.NODE_ENV === 'development') {
          console.log('🏁 Finalizando verificación de autenticación')
        }
        setIsLoading(false)
      }
    }

    // Ejecutar inmediatamente
    checkAuth()
  }, []) // Solo ejecutar una vez al montar

  const login = async (email: string, password: string): Promise<LoginResponse> => {
    try {
      setIsLoading(true)
      
      // Usar la función de autenticación con Cognito
      const result = await authenticateUser({ email, password })
      
      if (result.success && result.user) {
        console.log('✅ Login exitoso:', result.user.email)
        
        // Generar token JWT simple (en producción usar jwt.sign)
        const token = `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Guardar token y usuario
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_data', JSON.stringify(result.user))
        setUser(result.user)
        setIsAuthenticated(true)
        
        return {
          success: true,
          message: 'Login exitoso',
          user: result.user,
          token
        }
      } else {
        console.log('❌ Login fallido:', result.error)
        return {
          success: false,
          message: result.error || 'Credenciales inválidas'
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
  const context = ReactAny.useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext debe ser usado dentro de un AuthProvider')
  }
  return context
}
