import { UserRole } from '@/hooks/use-roles'

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

export class CognitoDirectService {
  private static readonly REGION = 'us-east-1'
  private static readonly USER_POOL_ID = 'us-east-1_pnE1wndnB'
  private static readonly CLIENT_ID = '76ho4o7fqhh3vdsiqqq269jjt5'

  /**
   * Iniciar sesión usando la API directa de Cognito
   */
  static async signIn(credentials: LoginCredentials): Promise<CognitoUser> {
    try {
      // Simular autenticación exitosa para usuarios válidos
      const validUsers = [
        { email: 'admin@onpoint.com', password: 'Admin123!', role: 'admin' as UserRole },
        { email: 'ejecutivo@onpoint.com', password: 'Ejecutivo123!', role: 'ejecutivo' as UserRole }
      ]

      const validUser = validUsers.find(
        user => user.email === credentials.email && user.password === credentials.password
      )

      if (!validUser) {
        throw new Error('Credenciales incorrectas')
      }

      // Simular respuesta exitosa de Cognito
      const user: CognitoUser = {
        id: `cognito-${Date.now()}`,
        email: credentials.email,
        name: credentials.email.split('@')[0],
        role: validUser.role,
        accessToken: `mock-access-token-${Date.now()}`,
        refreshToken: `mock-refresh-token-${Date.now()}`
      }
      
      // Guardar usuario en localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('cognito_user', JSON.stringify(user))
      }
      
      console.log('Usuario autenticado exitosamente:', user)
      return user
    } catch (error) {
      console.error('Error en signIn:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Obtener información del usuario usando el access token
   */
  private static async getUserInfo(accessToken: string): Promise<any> {
    try {
      const response = await fetch(`https://cognito-idp.${this.REGION}.amazonaws.com/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.GetUser',
          'Authorization': `Bearer ${accessToken}`
        }
      })

      if (!response.ok) {
        throw new Error('Error al obtener información del usuario')
      }

      return await response.json()
    } catch (error) {
      console.error('Error al obtener información del usuario:', error)
      return { sub: 'unknown', name: 'Usuario' }
    }
  }

  /**
   * Cerrar sesión
   */
  static async signOut(): Promise<void> {
    try {
      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cognito_user')
      }
      console.log('Usuario desconectado')
    } catch (error) {
      console.error('Error en signOut:', error)
      throw new Error('Error al cerrar sesión')
    }
  }

  /**
   * Obtener usuario actual desde localStorage
   */
  static async getCurrentUser(): Promise<CognitoUser | null> {
    try {
      if (typeof window === 'undefined') return null
      
      const storedUser = localStorage.getItem('cognito_user')
      if (!storedUser) return null
      
      const user = JSON.parse(storedUser)
      
      // Verificar si el token sigue siendo válido (simplificado)
      if (user.accessToken) {
        return user
      }
      
      return null
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
      const user = await this.getCurrentUser()
      return user !== null
    } catch (error) {
      console.error('Error al verificar autenticación:', error)
      return false
    }
  }

  /**
   * Obtener mensaje de error legible
   */
  private static getErrorMessage(error: any): string {
    if (error.message) {
      if (error.message.includes('NotAuthorizedException')) {
        return 'Credenciales incorrectas'
      }
      if (error.message.includes('UserNotFoundException')) {
        return 'Usuario no encontrado'
      }
      if (error.message.includes('InvalidPasswordException')) {
        return 'Contraseña inválida'
      }
      if (error.message.includes('TooManyRequestsException')) {
        return 'Demasiados intentos. Intenta más tarde'
      }
      return error.message
    }
    return 'Error desconocido en la autenticación'
  }
}
