import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// Configuración robusta para DynamoDB
const createDynamoDBClient = () => {
  const region = process.env.DYNAMODB_REGION || 'us-east-1'
  
  // Solo usar variables DYNAMODB_* para evitar conflictos con Amplify
  const accessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID
  const secretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY
  
  // Debug: Log de variables de entorno
  console.log('🔍 Debug DynamoDB Config:')
  console.log('  - DYNAMODB_REGION:', region)
  console.log('  - DYNAMODB_ACCESS_KEY_ID:', accessKeyId ? '✅ Configurado' : '❌ No configurado')
  console.log('  - DYNAMODB_SECRET_ACCESS_KEY:', secretAccessKey ? '✅ Configurado' : '❌ No configurado')
  console.log('  - NODE_ENV:', process.env.NODE_ENV)
  
  // Fallback: Si no hay credenciales DYNAMODB_*, intentar con AWS_*
  const awsAccessKeyId = process.env.AWS_ACCESS_KEY_ID
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY
  
  console.log('  - AWS_ACCESS_KEY_ID:', awsAccessKeyId ? '✅ Configurado' : '❌ No configurado')
  console.log('  - AWS_SECRET_ACCESS_KEY:', awsSecretAccessKey ? '✅ Configurado' : '❌ No configurado')
  
  // Usar credenciales DYNAMODB_* si están disponibles, sino AWS_*, sino configuración por defecto
  if (accessKeyId && secretAccessKey) {
    console.log('✅ Usando credenciales DYNAMODB_*')
    return new DynamoDBClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    })
  } else if (awsAccessKeyId && awsSecretAccessKey) {
    console.log('✅ Usando credenciales AWS_* como fallback')
    return new DynamoDBClient({
      region,
      credentials: {
        accessKeyId: awsAccessKeyId,
        secretAccessKey: awsSecretAccessKey,
      },
    })
  } else {
    console.warn('⚠️ No hay credenciales configuradas - usando configuración por defecto')
    return new DynamoDBClient({ region })
  }
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
