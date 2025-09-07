import { DynamoDBUser, dynamoDBUtils, DYNAMODB_TABLES } from '@/lib/aws/dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { dynamoDBClient } from '@/lib/aws/dynamodb';

// Repositorio real para usuarios DynamoDB
export class DynamoDBUserRepositoryReal {
  private static instance: DynamoDBUserRepositoryReal;
  private client: DynamoDBDocumentClient;

  private constructor() {
    this.client = dynamoDBClient;
  }

  public static getInstance(): DynamoDBUserRepositoryReal {
    if (!DynamoDBUserRepositoryReal.instance) {
      DynamoDBUserRepositoryReal.instance = new DynamoDBUserRepositoryReal();
    }
    return DynamoDBUserRepositoryReal.instance;
  }

  // Obtener todos los usuarios
  async listAll(): Promise<DynamoDBUser[]> {
    try {
      const command = new ScanCommand({
        TableName: DYNAMODB_TABLES.USERS,
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBUser[]) || [];
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error('Error al obtener usuarios de DynamoDB');
    }
  }

  // Obtener usuario por ID
  async findById(id: string): Promise<DynamoDBUser | null> {
    try {
      const command = new GetCommand({
        TableName: DYNAMODB_TABLES.USERS,
        Key: { id },
      });

      const response = await this.client.send(command);
      return response.Item as DynamoDBUser || null;
    } catch (error) {
      console.error('Error al obtener usuario por ID:', error);
      throw new Error('Error al obtener usuario de DynamoDB');
    }
  }

  // Obtener usuario por email
  async findByEmail(email: string): Promise<DynamoDBUser | null> {
    try {
      const command = new QueryCommand({
        TableName: DYNAMODB_TABLES.USERS,
        IndexName: 'email-index',
        KeyConditionExpression: 'email = :email',
        ExpressionAttributeValues: {
          ':email': email,
        },
      });

      const response = await this.client.send(command);
      return (response.Items?.[0] as DynamoDBUser) || null;
    } catch (error) {
      console.error('Error al obtener usuario por email:', error);
      throw new Error('Error al obtener usuario por email de DynamoDB');
    }
  }

  // Obtener usuarios por rol
  async findByRole(role: 'admin' | 'user' | 'provider'): Promise<DynamoDBUser[]> {
    try {
      const command = new ScanCommand({
        TableName: DYNAMODB_TABLES.USERS,
        FilterExpression: '#role = :role',
        ExpressionAttributeNames: {
          '#role': 'role',
        },
        ExpressionAttributeValues: {
          ':role': role,
        },
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBUser[]) || [];
    } catch (error) {
      console.error('Error al obtener usuarios por rol:', error);
      throw new Error('Error al obtener usuarios por rol de DynamoDB');
    }
  }

  // Crear nuevo usuario
  async create(userData: Omit<DynamoDBUser, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBUser> {
    try {
      const newUser = dynamoDBUtils.createItem(userData);
      
      const command = new PutCommand({
        TableName: DYNAMODB_TABLES.USERS,
        Item: newUser,
      });

      await this.client.send(command);
      return newUser;
    } catch (error) {
      console.error('Error al crear usuario:', error);
      throw new Error('Error al crear usuario en DynamoDB');
    }
  }

  // Actualizar usuario
  async update(id: string, userData: Partial<DynamoDBUser>): Promise<DynamoDBUser | null> {
    try {
      const updatedUser = dynamoDBUtils.updateItem({
        ...userData,
        id,
      });

      const command = new PutCommand({
        TableName: DYNAMODB_TABLES.USERS,
        Item: updatedUser,
      });

      await this.client.send(command);
      return updatedUser;
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      throw new Error('Error al actualizar usuario en DynamoDB');
    }
  }

  // Eliminar usuario
  async delete(id: string): Promise<boolean> {
    try {
      const command = new DeleteCommand({
        TableName: DYNAMODB_TABLES.USERS,
        Key: { id },
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('Error al eliminar usuario:', error);
      throw new Error('Error al eliminar usuario de DynamoDB');
    }
  }

  // Obtener estadísticas
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    pending: number;
    byRole: {
      admin: number;
      user: number;
      provider: number;
    };
  }> {
    try {
      const users = await this.listAll();
      
      const total = users.length;
      const active = users.filter(u => u.status === 'active').length;
      const inactive = users.filter(u => u.status === 'inactive').length;
      const pending = users.filter(u => u.status === 'pending').length;
      
      const byRole = {
        admin: users.filter(u => u.role === 'admin').length,
        user: users.filter(u => u.role === 'user').length,
        provider: users.filter(u => u.role === 'provider').length,
      };

      return { total, active, inactive, pending, byRole };
    } catch (error) {
      console.error('Error al obtener estadísticas de usuarios:', error);
      throw new Error('Error al obtener estadísticas de usuarios de DynamoDB');
    }
  }

  // Buscar usuarios
  async search(query: string): Promise<DynamoDBUser[]> {
    try {
      const command = new ScanCommand({
        TableName: DYNAMODB_TABLES.USERS,
        FilterExpression: 'contains(#name, :query) OR contains(email, :query)',
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':query': query,
        },
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBUser[]) || [];
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw new Error('Error al buscar usuarios en DynamoDB');
    }
  }
}

export default DynamoDBUserRepositoryReal;
