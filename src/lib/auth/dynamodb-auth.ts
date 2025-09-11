import AWS from 'aws-sdk';
import bcrypt from 'bcryptjs';

// Configurar DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

const USERS_TABLE = process.env.USERS_TABLE || 'OnPointAdmin-Users-sandbox';

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
  error?: string;
}

/**
 * Autentica un usuario usando DynamoDB
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<LoginResult> {
  try {
    console.log('🔍 Buscando usuario en DynamoDB:', credentials.email);
    
    // Buscar usuario por email
    const result = await dynamodb.query({
      TableName: USERS_TABLE,
      IndexName: 'EmailIndex', // Necesitamos crear este índice
      KeyConditionExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': credentials.email
      }
    }).promise();

    if (!result.Items || result.Items.length === 0) {
      console.log('❌ Usuario no encontrado:', credentials.email);
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    }

    const user = result.Items[0] as any;
    console.log('✅ Usuario encontrado:', user.email, 'Rol:', user.role);

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(credentials.password, user.password);
    
    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta para:', credentials.email);
      return {
        success: false,
        error: 'Credenciales inválidas'
      };
    }

    // Verificar que el usuario esté activo
    if (user.status !== 'active') {
      console.log('❌ Usuario inactivo:', credentials.email);
      return {
        success: false,
        error: 'Cuenta inactiva'
      };
    }

    // Retornar usuario sin la contraseña
    const { password, ...userWithoutPassword } = user;
    
    console.log('✅ Autenticación exitosa para:', user.email);
    return {
      success: true,
      user: userWithoutPassword as User
    };

  } catch (error) {
    console.error('❌ Error en autenticación:', error);
    return {
      success: false,
      error: 'Error interno del servidor'
    };
  }
}

/**
 * Obtiene un usuario por ID
 */
export async function getUserById(userId: string): Promise<User | null> {
  try {
    const result = await dynamodb.get({
      TableName: USERS_TABLE,
      Key: { id: userId }
    }).promise();

    if (!result.Item) {
      return null;
    }

    const { password, ...userWithoutPassword } = result.Item as any;
    return userWithoutPassword as User;

  } catch (error) {
    console.error('❌ Error obteniendo usuario:', error);
    return null;
  }
}

/**
 * Obtiene un usuario por email (usando scan como fallback)
 */
export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    // Intentar con scan si no hay índice
    const result = await dynamodb.scan({
      TableName: USERS_TABLE,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }).promise();

    if (!result.Items || result.Items.length === 0) {
      return null;
    }

    const user = result.Items[0] as any;
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword as User;

  } catch (error) {
    console.error('❌ Error obteniendo usuario por email:', error);
    return null;
  }
}
