import { CognitoIdentityProviderClient, InitiateAuthCommand, SignUpCommand, ConfirmSignUpCommand, ForgotPasswordCommand, ConfirmForgotPasswordCommand } from '@aws-sdk/client-cognito-identity-provider';

// Configurar clientes AWS
const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

// Configuración de Cognito
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID || 'us-east-1_pnE1wndnB';
const CLIENT_ID = process.env.COGNITO_CLIENT_ID || '76ho4o7fqhh3vdsiqqq269jjt5';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  position?: string;
  phone?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResult {
  success: boolean;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: string;
}

/**
 * Autentica un usuario usando AWS Cognito
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<LoginResult> {
  try {
    console.log('🔐 Iniciando autenticación con Cognito para:', credentials.email);
    
    // Autenticar con Cognito
    const authCommand = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: CLIENT_ID,
      AuthParameters: {
        USERNAME: credentials.email,
        PASSWORD: credentials.password
      }
    });

    const authResponse = await cognitoClient.send(authCommand);
    
    if (!authResponse.AuthenticationResult) {
      console.log('❌ Autenticación fallida en Cognito');
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    }

    const { AccessToken, RefreshToken } = authResponse.AuthenticationResult;
    console.log('✅ Autenticación exitosa en Cognito');

    // Obtener datos adicionales del usuario desde DynamoDB
    const userData = await getUserFromDynamoDB(credentials.email);
    
    if (!userData) {
      console.log('❌ Usuario no encontrado en DynamoDB');
      return {
        success: false,
        error: 'Datos de usuario no encontrados'
      };
    }

    console.log('✅ Usuario obtenido de DynamoDB:', userData.email);
    
    return {
      success: true,
      user: userData,
      accessToken: AccessToken,
      refreshToken: RefreshToken
    };

  } catch (error: any) {
    console.error('❌ Error en autenticación Cognito:', error);
    
    // Manejar errores específicos de Cognito
    if (error.name === 'NotAuthorizedException') {
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    } else if (error.name === 'UserNotConfirmedException') {
      return {
        success: false,
        error: 'Usuario no confirmado. Verifica tu email.'
      };
    } else if (error.name === 'UserNotFoundException') {
      return {
        success: false,
        error: 'Usuario no encontrado'
      };
    }
    
    return {
      success: false,
      error: 'Error interno del servidor'
    };
  }
}

/**
 * Obtiene datos adicionales del usuario desde DynamoDB via API Route
 */
async function getUserFromDynamoDB(email: string): Promise<User | null> {
  try {
    console.log('🔍 Obteniendo usuario de DynamoDB via API:', email)
    
    const response = await fetch('/api/auth/get-user', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email })
    });

    const result = await response.json();
    
    if (!result.success) {
      console.log('❌ Error obteniendo usuario:', result.error)
      return null;
    }

    console.log('✅ Usuario obtenido de DynamoDB:', result.user.email)
    return result.user as User;

  } catch (error) {
    console.error('❌ Error obteniendo usuario de DynamoDB:', error);
    return null;
  }
}

/**
 * Registra un nuevo usuario en Cognito
 */
export async function registerUser(userData: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
  department?: string;
  position?: string;
  phone?: string;
}): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('📝 Registrando usuario en Cognito:', userData.email);
    
    // Registrar en Cognito
    const signUpCommand = new SignUpCommand({
      ClientId: CLIENT_ID,
      Username: userData.email,
      Password: userData.password,
      UserAttributes: [
        { Name: 'email', Value: userData.email },
        { Name: 'given_name', Value: userData.firstName },
        { Name: 'family_name', Value: userData.lastName },
        { Name: 'phone_number', Value: userData.phone || '' }
      ]
    });

    await cognitoClient.send(signUpCommand);
    console.log('✅ Usuario registrado en Cognito');

    // TODO: Guardar datos adicionales en DynamoDB via API Route
    console.log('✅ Usuario registrado en Cognito');

    return { success: true };

  } catch (error: any) {
    console.error('❌ Error registrando usuario:', error);
    return {
      success: false,
      error: error.message || 'Error registrando usuario'
    };
  }
}

/**
 * Confirma el registro de un usuario
 */
export async function confirmUserRegistration(email: string, confirmationCode: string): Promise<{ success: boolean; error?: string }> {
  try {
    console.log('✅ Confirmando registro de usuario:', email);
    
    const command = new ConfirmSignUpCommand({
      ClientId: CLIENT_ID,
      Username: email,
      ConfirmationCode: confirmationCode
    });

    await cognitoClient.send(command);
    console.log('✅ Usuario confirmado exitosamente');

    // Actualizar estado en DynamoDB
    // TODO: Implementar actualización de estado

    return { success: true };

  } catch (error: any) {
    console.error('❌ Error confirmando usuario:', error);
    return {
      success: false,
      error: error.message || 'Error confirmando usuario'
    };
  }
}
