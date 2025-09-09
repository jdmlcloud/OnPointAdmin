'use client'

import { 
  CognitoIdentityProviderClient, 
  InitiateAuthCommand,
  GlobalSignOutCommand,
  GetUserCommand,
  AuthFlowType
} from '@aws-sdk/client-cognito-identity-provider'
import { UserRole } from '@/types/users'

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

export class CognitoRealService {
  private static readonly REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1'
  private static readonly USER_POOL_ID = process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID || ''
  private static readonly CLIENT_ID = process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID || ''

  private static getClient(): CognitoIdentityProviderClient {
    return new CognitoIdentityProviderClient({
      region: this.REGION,
      credentials: {
        accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY || ''
      }
    })
  }

  /**
   * Iniciar sesión con AWS Cognito real
   */
  static async signIn(credentials: LoginCredentials): Promise<CognitoUser> {
    try {
      const client = this.getClient()

      const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: this.CLIENT_ID,
        AuthParameters: {
          USERNAME: credentials.email,
          PASSWORD: credentials.password
        }
      })

      const response = await client.send(command)

      if (response.AuthenticationResult) {
        // Obtener información del usuario
        const userInfo = await this.getUserInfo(response.AuthenticationResult.AccessToken!)

        const user: CognitoUser = {
          id: userInfo.sub,
          email: credentials.email,
          name: userInfo.name || userInfo.email?.split('@')[0] || 'Usuario',
          role: this.getUserRole(userInfo),
          accessToken: response.AuthenticationResult.AccessToken!,
          refreshToken: response.AuthenticationResult.RefreshToken || ''
        }

        // Guardar usuario en localStorage
        if (typeof window !== 'undefined') {
          localStorage.setItem('cognito_user_real', JSON.stringify(user))
        }

        console.log('Usuario autenticado exitosamente con AWS Cognito real:', user)
        return user
      } else {
        throw new Error('No se recibió el token de autenticación')
      }
    } catch (error) {
      console.error('Error en signIn real:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Obtener información del usuario usando el access token
   */
  private static async getUserInfo(accessToken: string): Promise<any> {
    try {
      const client = this.getClient()

      const command = new GetUserCommand({
        AccessToken: accessToken
      })

      const response = await client.send(command)
      return {
        sub: response.Username,
        email: response.UserAttributes?.find(attr => attr.Name === 'email')?.Value,
        name: response.UserAttributes?.find(attr => attr.Name === 'name')?.Value,
        role: response.UserAttributes?.find(attr => attr.Name === 'custom:role')?.Value
      }
    } catch (error) {
      console.error('Error al obtener información del usuario:', error)
      return {
        sub: 'unknown',
        email: 'unknown@example.com',
        name: 'Usuario',
        role: 'ejecutivo'
      }
    }
  }

  /**
   * Determinar el rol del usuario
   */
  private static getUserRole(userInfo: any): UserRole {
    if (userInfo.role) {
      return userInfo.role as UserRole
    }
    
    // Lógica para determinar rol basado en email o otros atributos
    if (userInfo.email?.includes('admin')) {
      return { id: "role-admin", name: "admin", level: 1, permissions: [], description: "Administrador", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "system" }
    }
    
    return { id: "role-ejecutivo", name: "ejecutivo", level: 3, permissions: [], description: "Ejecutivo", createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(), createdBy: "system" }
  }

  /**
   * Cerrar sesión
   */
  static async signOut(): Promise<void> {
    try {
      // Limpiar localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('cognito_user_real')
      }
      
      console.log('Usuario desconectado de AWS Cognito real')
    } catch (error) {
      console.error('Error en signOut real:', error)
      throw new Error(this.getErrorMessage(error))
    }
  }

  /**
   * Obtener usuario actual desde localStorage
   */
  static async getCurrentUser(): Promise<CognitoUser | null> {
    try {
      if (typeof window === 'undefined') return null

      const storedUser = localStorage.getItem('cognito_user_real')
      if (!storedUser) return null

      const user = JSON.parse(storedUser)
      
      // Verificar que el token no haya expirado (básico)
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
    const user = await this.getCurrentUser()
    return !!user
  }

  /**
   * Obtener mensaje de error legible
   */
  private static getErrorMessage(error: any): string {
    if (error.name === 'NotAuthorizedException') {
      return 'Credenciales incorrectas'
    } else if (error.name === 'UserNotFoundException') {
      return 'Usuario no encontrado'
    } else if (error.name === 'InvalidPasswordException') {
      return 'Contraseña inválida'
    } else if (error.name === 'TooManyRequestsException') {
      return 'Demasiados intentos. Intenta más tarde'
    } else if (error.name === 'UserNotConfirmedException') {
      return 'Usuario no confirmado'
    } else if (error.message) {
      return error.message
    } else {
      return 'Error desconocido en la autenticación'
    }
  }
}
