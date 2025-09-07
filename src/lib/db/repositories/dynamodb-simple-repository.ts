import { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { simpleDynamoDBClient, SIMPLE_DYNAMODB_TABLES } from '@/lib/aws/dynamodb-simple';

// Repositorio simplificado para DynamoDB
export class SimpleDynamoDBRepository {
  private client: DynamoDBDocumentClient;
  private tableName: string;

  constructor(tableName: string) {
    this.client = simpleDynamoDBClient;
    this.tableName = tableName;
    console.log(`🔧 SimpleDynamoDBRepository inicializado para tabla: ${tableName}`);
  }

  // Obtener todos los elementos
  async listAll(): Promise<any[]> {
    try {
      console.log(`🔧 Listando todos los elementos de ${this.tableName}`);
      const command = new ScanCommand({
        TableName: this.tableName,
      });
      
      const result = await this.client.send(command);
      console.log(`✅ Encontrados ${result.Items?.length || 0} elementos en ${this.tableName}`);
      
      return result.Items || [];
    } catch (error: any) {
      console.error(`❌ Error listando elementos de ${this.tableName}:`, error);
      throw error;
    }
  }

  // Obtener por ID
  async getById(id: string): Promise<any | null> {
    try {
      console.log(`🔧 Obteniendo elemento ${id} de ${this.tableName}`);
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      });
      
      const result = await this.client.send(command);
      console.log(`✅ Elemento ${id} ${result.Item ? 'encontrado' : 'no encontrado'} en ${this.tableName}`);
      
      return result.Item || null;
    } catch (error: any) {
      console.error(`❌ Error obteniendo elemento ${id} de ${this.tableName}:`, error);
      throw error;
    }
  }

  // Crear elemento
  async create(item: any): Promise<any> {
    try {
      console.log(`🔧 Creando elemento en ${this.tableName}`);
      const command = new PutCommand({
        TableName: this.tableName,
        Item: item,
      });
      
      await this.client.send(command);
      console.log(`✅ Elemento creado en ${this.tableName}`);
      
      return item;
    } catch (error: any) {
      console.error(`❌ Error creando elemento en ${this.tableName}:`, error);
      throw error;
    }
  }

  // Actualizar elemento
  async update(id: string, updates: any): Promise<any | null> {
    try {
      console.log(`🔧 Actualizando elemento ${id} en ${this.tableName}`);
      
      // Construir expresión de actualización
      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};
      
      Object.keys(updates).forEach((key, index) => {
        if (key !== 'id') {
          updateExpressions.push(`#attr${index} = :val${index}`);
          expressionAttributeNames[`#attr${index}`] = key;
          expressionAttributeValues[`:val${index}`] = updates[key];
        }
      });
      
      if (updateExpressions.length === 0) {
        return await this.getById(id);
      }
      
      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW',
      });
      
      const result = await this.client.send(command);
      console.log(`✅ Elemento ${id} actualizado en ${this.tableName}`);
      
      return result.Attributes || null;
    } catch (error: any) {
      console.error(`❌ Error actualizando elemento ${id} en ${this.tableName}:`, error);
      throw error;
    }
  }

  // Eliminar elemento
  async delete(id: string): Promise<boolean> {
    try {
      console.log(`🔧 Eliminando elemento ${id} de ${this.tableName}`);
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      });
      
      await this.client.send(command);
      console.log(`✅ Elemento ${id} eliminado de ${this.tableName}`);
      
      return true;
    } catch (error: any) {
      console.error(`❌ Error eliminando elemento ${id} de ${this.tableName}:`, error);
      throw error;
    }
  }

  // Obtener estadísticas básicas
  async getStats(): Promise<{ total: number; active: number; inactive: number }> {
    try {
      console.log(`🔧 Obteniendo estadísticas de ${this.tableName}`);
      const items = await this.listAll();
      
      const stats = {
        total: items.length,
        active: items.filter(item => item.status === 'active' || item.active === true).length,
        inactive: items.filter(item => item.status === 'inactive' || item.active === false).length,
      };
      
      console.log(`✅ Estadísticas de ${this.tableName}:`, stats);
      return stats;
    } catch (error: any) {
      console.error(`❌ Error obteniendo estadísticas de ${this.tableName}:`, error);
      throw error;
    }
  }
}

// Instancias globales
export const simpleUserRepository = new SimpleDynamoDBRepository(SIMPLE_DYNAMODB_TABLES.USERS);
export const simpleProviderRepository = new SimpleDynamoDBRepository(SIMPLE_DYNAMODB_TABLES.PROVIDERS);
export const simpleProductRepository = new SimpleDynamoDBRepository(SIMPLE_DYNAMODB_TABLES.PRODUCTS);
export const simpleOrderRepository = new SimpleDynamoDBRepository(SIMPLE_DYNAMODB_TABLES.ORDERS);
