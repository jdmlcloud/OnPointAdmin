// Integración con el sistema de autenticación existente
// Mantiene compatibilidad con el sistema actual y agrega nuevas funcionalidades

import { User, LoginResponse, UserRoleType } from '@/types/users'

// Configuración de usuarios existentes (compatible con tu sistema actual)
export const EXISTING_USERS = {
  'superadmin@onpoint.com': { 
    role: 'SUPERADMIN' as UserRoleType, 
    name: 'Super Admin',
    firstName: 'Super',
    lastName: 'Admin',
    phone: '+525512345680',
    department: 'IT',
    position: 'Super Administrador'
  },
  'admin@onpoint.com': { 
    role: 'ADMIN' as UserRoleType, 
    name: 'Admin',
    firstName: 'Admin',
    lastName: 'User',
    phone: '+525512345678',
    department: 'IT',
    position: 'Administrador'
  },
  'ejecutivo@onpoint.com': { 
    role: 'EXECUTIVE' as UserRoleType, 
    name: 'Ejecutivo',
    firstName: 'Ejecutivo',
    lastName: 'User',
    phone: '+525512345679',
    department: 'Ventas',
    position: 'Ejecutivo de Ventas'
  }
}

// Función para autenticar con el sistema existente
export const authenticateExistingUser = async (email: string, password: string): Promise<LoginResponse> => {
  try {
    // Verificar credenciales existentes
    const userData = EXISTING_USERS[email as keyof typeof EXISTING_USERS]
    
    if (userData && password === 'password') {
      const user: User = {
        id: `user-${email.split('@')[0]}-001`,
        email,
        password: 'hashed_password_placeholder',
        firstName: userData.firstName,
        lastName: userData.lastName,
        name: userData.name,
        phone: userData.phone,
        role: userData.role,
        department: userData.department,
        position: userData.position,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        createdBy: 'system'
      }
      
      const token = `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      
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
    console.error('Error en autenticación:', error)
    return {
      success: false,
      message: 'Error de conexión'
    }
  }
}

// Función para crear nuevo usuario (integración con Lambda)
export const createNewUser = async (userData: {
  email: string
  role: UserRoleType
  firstName: string
  lastName: string
  department: string
  position: string
  createdBy: string
}): Promise<LoginResponse> => {
  try {
    // En desarrollo, simular creación
    if (process.env.NODE_ENV === 'development') {
      console.log('📧 [DEV] Creando usuario:', userData.email)
      console.log('👤 [DEV] Rol:', userData.role)
      
      return {
        success: true,
        message: 'Usuario creado exitosamente (modo desarrollo)',
        user: {
          id: `user-${Date.now()}`,
          email: userData.email,
          password: 'hashed_password_placeholder',
          firstName: userData.firstName,
          lastName: userData.lastName,
          name: `${userData.firstName} ${userData.lastName}`,
          phone: '',
          role: userData.role,
          department: userData.department,
          position: userData.position,
          status: 'pending_verification',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: userData.createdBy
        } as User,
        token: `temp_token_${Date.now()}`
      }
    }
    
    // En producción, usar Lambda
    const response = await fetch('/api/auth/send-verification', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData)
    })
    
    const data = await response.json()
    
    if (data.success) {
      return {
        success: true,
        message: data.message,
        user: null, // Usuario pendiente de verificación
        token: null
      }
    } else {
      return {
        success: false,
        message: data.message || 'Error creando usuario'
      }
    }
  } catch (error) {
    console.error('Error creando usuario:', error)
    return {
      success: false,
      message: 'Error de conexión'
    }
  }
}

// Función para verificar si un usuario puede crear otros usuarios
export const canCreateUsers = (userRole: UserRoleType): boolean => {
  return userRole === 'SUPERADMIN' || userRole === 'ADMIN'
}

// Función para obtener roles disponibles según el usuario actual
export const getAvailableRoles = (userRole: UserRoleType): UserRoleType[] => {
  switch (userRole) {
    case 'SUPERADMIN':
      return ['ADMIN', 'EXECUTIVE']
    case 'ADMIN':
      return ['EXECUTIVE']
    default:
      return []
  }
}
