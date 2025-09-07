import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Cliente DynamoDB simplificado y robusto
export const createSimpleDynamoDBClient = () => {
  console.log('🔧 Creando cliente DynamoDB simplificado...');
  
  // Obtener credenciales SOLO de DYNAMODB_* (no usar AWS_* en producción)
  const accessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID;
  const secretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY;
  const region = process.env.DYNAMODB_REGION || 'us-east-1';

  console.log('🔧 Access Key ID:', accessKeyId ? `${accessKeyId.substring(0, 8)}...` : 'NO CONFIGURADA');
  console.log('🔧 Secret Key:', secretAccessKey ? 'CONFIGURADA' : 'NO CONFIGURADA');
  console.log('🔧 Region:', region);

  if (!accessKeyId || !secretAccessKey) {
    throw new Error('Credenciales DynamoDB no configuradas correctamente');
  }

  // Crear cliente con configuración explícita
  const client = new DynamoDBClient({
    region: region,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
    // Configuraciones adicionales para mayor robustez
    maxAttempts: 3,
    retryMode: 'adaptive',
  });

  return DynamoDBDocumentClient.from(client);
};

// Cliente global simplificado
export const simpleDynamoDBClient = createSimpleDynamoDBClient();

// Configuración de tablas
export const SIMPLE_DYNAMODB_TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'onpoint-users',
  PROVIDERS: process.env.DYNAMODB_PROVIDERS_TABLE || 'onpoint-providers', 
  PRODUCTS: process.env.DYNAMODB_PRODUCTS_TABLE || 'onpoint-products',
  ORDERS: process.env.DYNAMODB_ORDERS_TABLE || 'onpoint-orders',
} as const;
