import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

// Configuración del cliente DynamoDB
const createDynamoDBClient = () => {
  const client = new DynamoDBClient({
    region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1',
    credentials: {
      accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
    },
  });

  return DynamoDBDocumentClient.from(client);
};

// Cliente DynamoDB global
export const dynamoDBClient = createDynamoDBClient();

// Configuración de tablas
export const DYNAMODB_TABLES = {
  USERS: process.env.DYNAMODB_USERS_TABLE || 'onpoint-users',
  PROVIDERS: process.env.DYNAMODB_PROVIDERS_TABLE || 'onpoint-providers',
  PRODUCTS: process.env.DYNAMODB_PRODUCTS_TABLE || 'onpoint-products',
  ORDERS: process.env.DYNAMODB_ORDERS_TABLE || 'onpoint-orders',
} as const;

// Tipos de datos para DynamoDB
export interface DynamoDBUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user' | 'provider';
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  cognitoId?: string;
}

export interface DynamoDBProvider {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  cognitoId?: string;
}

export interface DynamoDBProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  providerId: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  createdAt: string;
  updatedAt: string;
}

export interface DynamoDBOrder {
  id: string;
  userId: string;
  providerId: string;
  products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

// Utilidades para DynamoDB
export const dynamoDBUtils = {
  // Generar ID único
  generateId: () => `dynamodb_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  
  // Formatear fecha para DynamoDB
  formatDate: (date: Date = new Date()) => date.toISOString(),
  
  // Crear item con metadatos
  createItem: <T extends Record<string, any>>(data: T) => ({
    ...data,
    id: data.id || dynamoDBUtils.generateId(),
    createdAt: data.createdAt || dynamoDBUtils.formatDate(),
    updatedAt: dynamoDBUtils.formatDate(),
  }),
  
  // Actualizar item con timestamp
  updateItem: <T extends Record<string, any>>(data: T) => ({
    ...data,
    updatedAt: dynamoDBUtils.formatDate(),
  }),
};

// Estado de conexión DynamoDB
export interface DynamoDBStatus {
  connected: boolean;
  region: string;
  tables: {
    users: boolean;
    providers: boolean;
    products: boolean;
    orders: boolean;
  };
  lastChecked: string;
  error?: string;
}

// Función para verificar estado de DynamoDB
export const checkDynamoDBStatus = async (): Promise<DynamoDBStatus> => {
  try {
    // Verificar si DynamoDB está configurado
    if (!process.env.DYNAMODB_CONFIGURED || process.env.DYNAMODB_CONFIGURED !== 'true') {
      return {
        connected: false,
        region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1',
        tables: {
          users: false,
          providers: false,
          products: false,
          orders: false,
        },
        lastChecked: new Date().toISOString(),
        error: 'DynamoDB no está configurado. Ejecuta el script de configuración.',
      };
    }

    // En modo real, verificar conexión
    const client = createDynamoDBClient();
    
    // Verificar cada tabla usando AWS SDK
    const { DynamoDBClient, DescribeTableCommand } = await import('@aws-sdk/client-dynamodb');
    const dynamoClient = new DynamoDBClient({
      region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    });

    const tables = {
      users: false,
      providers: false,
      products: false,
      orders: false,
    };

    // Verificar tabla de usuarios
    try {
      await dynamoClient.send(new DescribeTableCommand({
        TableName: process.env.DYNAMODB_USERS_TABLE || 'onpoint-admin-users-dev'
      }));
      tables.users = true;
    } catch (error) {
      console.error('Error verificando tabla users:', error);
    }

    // Verificar tabla de proveedores
    try {
      await dynamoClient.send(new DescribeTableCommand({
        TableName: process.env.DYNAMODB_PROVIDERS_TABLE || 'onpoint-admin-providers-dev'
      }));
      tables.providers = true;
    } catch (error) {
      console.error('Error verificando tabla providers:', error);
    }

    // Verificar tabla de productos
    try {
      await dynamoClient.send(new DescribeTableCommand({
        TableName: process.env.DYNAMODB_PRODUCTS_TABLE || 'onpoint-admin-products-dev'
      }));
      tables.products = true;
    } catch (error) {
      console.error('Error verificando tabla products:', error);
    }

    // Verificar tabla de órdenes
    try {
      await dynamoClient.send(new DescribeTableCommand({
        TableName: process.env.DYNAMODB_ORDERS_TABLE || 'onpoint-admin-orders-dev'
      }));
      tables.orders = true;
    } catch (error) {
      console.error('Error verificando tabla orders:', error);
    }

    const allTablesConnected = Object.values(tables).every(status => status);

    return {
      connected: allTablesConnected,
      region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1',
      tables,
      lastChecked: new Date().toISOString(),
    };
  } catch (error) {
    return {
      connected: false,
      region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1',
      tables: {
        users: false,
        providers: false,
        products: false,
        orders: false,
      },
      lastChecked: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Error desconocido',
    };
  }
};

export default dynamoDBClient;
