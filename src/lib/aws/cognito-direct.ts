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
      const response = await fetch(`https://cognito-idp.${this.REGION}.amazonaws.com/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-amz-json-1.1',
          'X-Amz-Target': 'AWSCognitoIdentityProviderService.InitiateAuth'
        },
        body: JSON.stringify({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: this.CLIENT_ID,
          AuthParameters: {
            USERNAME: credentials.email,
            PASSWORD: credentials.password
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Error en la autenticación')
      }

      const data = await response.json()
      
      if (data.AuthenticationResult) {
        // Obtener información del usuario
        const userInfo = await this.getUserInfo(data.AuthenticationResult.AccessToken)
        
        return {
          id: userInfo.sub,
          email: credentials.email,
          name: userInfo.name || 'Usuario',
          role: 'ejecutivo' as UserRole, // Por defecto
          accessToken: data.AuthenticationResult.AccessToken,
          refreshToken: data.AuthenticationResult.RefreshToken || ''
        }
      } else {
        throw new Error('No se recibió el token de autenticación')
      }
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
      // En una implementación real, aquí se invalidaría el token
      console.log('Usuario desconectado')
    } catch (error) {
      console.error('Error en signOut:', error)
      throw new Error('Error al cerrar sesión')
    }
  }

  /**
   * Obtener usuario actual (simplificado)
   */
  static async getCurrentUser(): Promise<CognitoUser | null> {
    try {
      // En una implementación real, aquí se verificaría el token almacenado
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
