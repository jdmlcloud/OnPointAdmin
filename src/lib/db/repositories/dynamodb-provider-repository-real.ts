import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBProvider } from '@/lib/aws/dynamodb';

export class DynamoDBProviderRepositoryReal {
  private static instance: DynamoDBProviderRepositoryReal;
  private client: DynamoDBDocumentClient;
  private tableName: string;

  private constructor() {
    const dynamoDBClient = new DynamoDBClient({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
      },
    });

    this.client = DynamoDBDocumentClient.from(dynamoDBClient);
    this.tableName = process.env.DYNAMODB_PROVIDERS_TABLE || 'onpoint-admin-providers-dev';
  }

  public static getInstance(): DynamoDBProviderRepositoryReal {
    if (!DynamoDBProviderRepositoryReal.instance) {
      DynamoDBProviderRepositoryReal.instance = new DynamoDBProviderRepositoryReal();
    }
    return DynamoDBProviderRepositoryReal.instance;
  }

  // Obtener todos los proveedores
  async listAll(): Promise<DynamoDBProvider[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBProvider[]) || [];
    } catch (error) {
      console.error('Error al obtener proveedores de DynamoDB:', error);
      throw error;
    }
  }

  // Obtener proveedor por ID
  async findById(id: string): Promise<DynamoDBProvider | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      });

      const response = await this.client.send(command);
      return response.Item as DynamoDBProvider || null;
    } catch (error) {
      console.error('Error al obtener proveedor por ID:', error);
      throw error;
    }
  }

  // Obtener proveedor por email
  async findByEmail(email: string): Promise<DynamoDBProvider | null> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      });

      const response = await this.client.send(command);
      return response.Items?.[0] as DynamoDBProvider || null;
    } catch (error) {
      console.error('Error al obtener proveedor por email:', error);
      throw error;
    }
  }

  // Obtener proveedores por estado
  async findByStatus(status: 'active' | 'inactive' | 'pending'): Promise<DynamoDBProvider[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: '#status = :status',
        ExpressionAttributeNames: {
          '#status': 'status',
        },
        ExpressionAttributeValues: {
          ':status': status,
        },
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBProvider[]) || [];
    } catch (error) {
      console.error('Error al obtener proveedores por estado:', error);
      throw error;
    }
  }

  // Crear nuevo proveedor
  async create(providerData: Omit<DynamoDBProvider, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBProvider> {
    try {
      const now = new Date().toISOString();
      const id = `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newProvider: DynamoDBProvider = {
        ...providerData,
        id,
        createdAt: now,
        updatedAt: now,
      };

      const command = new PutCommand({
        TableName: this.tableName,
        Item: newProvider,
      });

      await this.client.send(command);
      return newProvider;
    } catch (error) {
      console.error('Error al crear proveedor:', error);
      throw error;
    }
  }

  // Actualizar proveedor
  async update(id: string, providerData: Partial<DynamoDBProvider>): Promise<DynamoDBProvider | null> {
    try {
      const now = new Date().toISOString();
      
      const updateExpression: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      // Construir expresión de actualización dinámicamente
      Object.keys(providerData).forEach((key, index) => {
        if (key !== 'id' && key !== 'createdAt') {
          updateExpression.push(`#attr${index} = :val${index}`);
          expressionAttributeNames[`#attr${index}`] = key;
          expressionAttributeValues[`:val${index}`] = providerData[key as keyof DynamoDBProvider];
        }
      });

      // Siempre actualizar updatedAt
      updateExpression.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = now;

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      });

      const response = await this.client.send(command);
      return response.Attributes as DynamoDBProvider || null;
    } catch (error) {
      console.error('Error al actualizar proveedor:', error);
      throw error;
    }
  }

  // Eliminar proveedor
  async delete(id: string): Promise<boolean> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('Error al eliminar proveedor:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
  }> {
    try {
      const providers = await this.listAll();
      
      return {
        total: providers.length,
        active: providers.filter(p => p.status === 'active').length,
        inactive: providers.filter(p => p.status === 'inactive').length,
        pending: providers.filter(p => p.status === 'pending').length,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas de proveedores:', error);
      throw error;
    }
  }

  // Buscar proveedores
  async search(query: string): Promise<DynamoDBProvider[]> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'contains(#name, :query) OR contains(email, :query) OR contains(company, :query)',
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':query': query,
        },
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBProvider[]) || [];
    } catch (error) {
      console.error('Error al buscar proveedores:', error);
      throw error;
    }
  }

  // Obtener proveedores activos
  async getActiveProviders(): Promise<DynamoDBProvider[]> {
    return this.findByStatus('active');
  }
}

export default DynamoDBProviderRepositoryReal;
