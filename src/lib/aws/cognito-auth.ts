import { signIn, signOut, getCurrentUser, fetchAuthSession } from 'aws-amplify/auth'
import { UserRole } from '@/hooks/use-roles'
import crypto from 'crypto'

export interface CognitoUser {
  id: string
  email: string
  name: string
  role: UserRole
  accessToken: string
  refreshToken: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  name: string
  role: UserRole
}

export class CognitoAuthService {
  /**
   * Generar SECRET_HASH para autenticación con App Client que tiene secret
   */
  private static generateSecretHash(username: string): string {
    const clientId = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID || ''
    const clientSecret = process.env.AWS_COGNITO_CLIENT_SECRET || ''
    
    if (!clientSecret) {
      throw new Error('AWS_COGNITO_CLIENT_SECRET no está configurado')
    }
    
    return crypto
      .createHmac('sha256', clientSecret)
      .update(username + clientId)
      .digest('base64')
  }

  /**
   * Iniciar sesión con email y password
   */
  static async signIn(credentials: LoginCredentials): Promise<CognitoUser> {
    try {
      const secretHash = this.generateSecretHash(credentials.email)
      
      const result = await signIn({
        username: credentials.email,
        password: credentials.password,
        options: {
          authFlowType: 'USER_PASSWORD_AUTH',
          clientMetadata: {
            SECRET_HASH: secretHash
          }
        }
      })
      
      if (result.isSignedIn) {
        // Obtener información del usuario
        const user = await getCurrentUser()
        const session = await fetchAuthSession()
        
        // Obtener atributos del usuario
        const attributes = user.signInDetails?.loginId ? { email: user.signInDetails.loginId } : {}
        const role = 'ejecutivo' // Por defecto, se puede obtener de atributos personalizados
        
        return {
          id: user.userId,
          email: credentials.email,
          name: 'Usuario',
          role: role as UserRole,
          accessToken: session.tokens?.accessToken?.toString() || '',
          refreshToken: ''
        }
      } else {
        throw new Error('Error en el proceso de autenticación')
      }
    } catch (error) {
      console.error('Error en signIn:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Cerrar sesión
   */
  static async signOut(): Promise<void> {
    try {
      await signOut()
    } catch (error) {
      console.error('Error en signOut:', error)
      throw new Error('Error al cerrar sesión')
    }
  }

  /**
   * Obtener usuario actual
   */
  static async getCurrentUser(): Promise<CognitoUser | null> {
    try {
      const user = await getCurrentUser()
      const session = await fetchAuthSession()
      
      if (!user) return null

      const role = 'ejecutivo' // Por defecto, se puede obtener de atributos personalizados
      
      return {
        id: user.userId,
        email: user.signInDetails?.loginId || '',
        name: 'Usuario',
        role: role as UserRole,
        accessToken: session.tokens?.accessToken?.toString() || '',
        refreshToken: ''
      }
    } catch (error) {
      console.error('Error al obtener usuario actual:', error)
      return null
    }
  }

  /**
   * Verificar si el usuario está autenticado
   */
  static async isAuthenticated(): Promise<boolean> {
    try {
      await getCurrentUser()
      return true
    } catch (error) {
      return false
    }
  }

  /**
   * Obtener token de acceso actual
   */
  static async getAccessToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession()
      return session.tokens?.accessToken?.toString() || null
    } catch (error) {
      console.error('Error al obtener token:', error)
      return null
    }
  }

  /**
   * Refrescar token de acceso
   */
  static async refreshAccessToken(): Promise<string | null> {
    try {
      const session = await fetchAuthSession({ forceRefresh: true })
      return session.tokens?.accessToken?.toString() || null
    } catch (error) {
      console.error('Error al refrescar token:', error)
      return null
    }
  }

  /**
   * Cambiar contraseña
   */
  static async changePassword(oldPassword: string, newPassword: string): Promise<void> {
    try {
      // En Amplify v6, esto se hace de manera diferente
      // Por ahora, lanzamos un error indicando que no está implementado
      throw new Error('Cambio de contraseña no implementado en esta versión')
    } catch (error) {
      console.error('Error al cambiar contraseña:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Solicitar reset de contraseña
   */
  static async forgotPassword(email: string): Promise<void> {
    try {
      // En Amplify v6, esto se hace de manera diferente
      // Por ahora, lanzamos un error indicando que no está implementado
      throw new Error('Reset de contraseña no implementado en esta versión')
    } catch (error) {
      console.error('Error al solicitar reset de contraseña:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Confirmar reset de contraseña
   */
  static async forgotPasswordSubmit(
    email: string, 
    code: string, 
    newPassword: string
  ): Promise<void> {
    try {
      // En Amplify v6, esto se hace de manera diferente
      // Por ahora, lanzamos un error indicando que no está implementado
      throw new Error('Confirmación de reset no implementada en esta versión')
    } catch (error) {
      console.error('Error al confirmar reset de contraseña:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Convertir errores de AWS a mensajes legibles
   */
  private static getErrorMessage(error: any): string {
    if (error.code) {
      switch (error.code) {
        case 'NotAuthorizedException':
          return 'Credenciales incorrectas'
        case 'UserNotFoundException':
          return 'Usuario no encontrado'
        case 'UserNotConfirmedException':
          return 'Usuario no confirmado'
        case 'PasswordResetRequiredException':
          return 'Se requiere reset de contraseña'
        case 'TooManyRequestsException':
          return 'Demasiados intentos. Intenta más tarde'
        case 'LimitExceededException':
          return 'Límite de intentos excedido'
        case 'InvalidPasswordException':
          return 'Contraseña inválida'
        case 'InvalidParameterException':
          return 'Parámetros inválidos'
        default:
          return error.message || 'Error de autenticación'
      }
    }
    return error.message || 'Error desconocido'
  }
}
