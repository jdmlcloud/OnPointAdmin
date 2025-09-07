import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// Configuración robusta para DynamoDB
const createDynamoDBClient = () => {
  const region = process.env.DYNAMODB_REGION || 'us-east-1'
  
  // Solo usar variables DYNAMODB_* para evitar conflictos con Amplify
  const accessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID
  const secretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY
  
  if (!accessKeyId || !secretAccessKey) {
    console.warn('⚠️ Variables DYNAMODB_* no configuradas - usando configuración por defecto')
    return new DynamoDBClient({ region })
  }
  
  console.log('✅ Configuración DynamoDB con credenciales DYNAMODB_*')
  
  return new DynamoDBClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
  })
}

// Cliente principal
export const dynamoDBClient = createDynamoDBClient()

// Cliente document (más fácil de usar)
export const dynamoDBDocumentClient = DynamoDBDocumentClient.from(dynamoDBClient)

// Configuración de tablas
export const TABLE_NAMES = {
  USERS: 'onpoint-admin-users-dev',
  PRODUCTS: 'onpoint-admin-products-dev',
  PROVIDERS: 'onpoint-admin-providers-dev',
  ORDERS: 'onpoint-admin-orders-dev',
} as const

// Función para verificar conexión
export const testDynamoDBConnection = async () => {
  try {
    const { ListTablesCommand } = await import('@aws-sdk/client-dynamodb')
    const result = await dynamoDBClient.send(new ListTablesCommand({}))
    
    return {
      success: true,
      tables: result.TableNames || [],
      region: process.env.DYNAMODB_REGION || 'us-east-1',
      hasCredentials: !!(process.env.DYNAMODB_ACCESS_KEY_ID && process.env.DYNAMODB_SECRET_ACCESS_KEY)
    }
  } catch (error) {
    console.error('❌ Error conectando a DynamoDB:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Error desconocido',
      tables: [],
      region: process.env.DYNAMODB_REGION || 'us-east-1',
      hasCredentials: !!(process.env.DYNAMODB_ACCESS_KEY_ID && process.env.DYNAMODB_SECRET_ACCESS_KEY)
    }
  }
}
