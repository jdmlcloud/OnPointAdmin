import { DynamoDBClient, ScanCommand, GetItemCommand, PutItemCommand, UpdateItemCommand, DeleteItemCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, ScanCommand as DocScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb';
import { DynamoDBProduct } from '@/lib/aws/dynamodb';

export class DynamoDBProductRepositoryReal {
  private static instance: DynamoDBProductRepositoryReal;
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
    this.tableName = process.env.DYNAMODB_PRODUCTS_TABLE || 'onpoint-admin-products-dev';
  }

  public static getInstance(): DynamoDBProductRepositoryReal {
    if (!DynamoDBProductRepositoryReal.instance) {
      DynamoDBProductRepositoryReal.instance = new DynamoDBProductRepositoryReal();
    }
    return DynamoDBProductRepositoryReal.instance;
  }

  // Obtener todos los productos
  async listAll(): Promise<DynamoDBProduct[]> {
    try {
      const command = new DocScanCommand({
        TableName: this.tableName,
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBProduct[]) || [];
    } catch (error) {
      console.error('Error al obtener productos de DynamoDB:', error);
      throw error;
    }
  }

  // Obtener producto por ID
  async findById(id: string): Promise<DynamoDBProduct | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      });

      const response = await this.client.send(command);
      return response.Item as DynamoDBProduct || null;
    } catch (error) {
      console.error('Error al obtener producto por ID:', error);
      throw error;
    }
  }

  // Obtener productos por proveedor
  async findByProvider(providerId: string): Promise<DynamoDBProduct[]> {
    try {
      const command = new DocScanCommand({
        TableName: this.tableName,
        FilterExpression: 'providerId = :providerId',
        ExpressionAttributeValues: {
          ':providerId': providerId,
        },
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBProduct[]) || [];
    } catch (error) {
      console.error('Error al obtener productos por proveedor:', error);
      throw error;
    }
  }

  // Obtener productos por categoría
  async findByCategory(category: string): Promise<DynamoDBProduct[]> {
    try {
      const command = new DocScanCommand({
        TableName: this.tableName,
        FilterExpression: 'category = :category',
        ExpressionAttributeValues: {
          ':category': category,
        },
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBProduct[]) || [];
    } catch (error) {
      console.error('Error al obtener productos por categoría:', error);
      throw error;
    }
  }

  // Obtener productos por estado
  async findByStatus(status: 'active' | 'inactive' | 'out_of_stock'): Promise<DynamoDBProduct[]> {
    try {
      const command = new DocScanCommand({
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
      return (response.Items as DynamoDBProduct[]) || [];
    } catch (error) {
      console.error('Error al obtener productos por estado:', error);
      throw error;
    }
  }

  // Crear nuevo producto
  async create(productData: Omit<DynamoDBProduct, 'id' | 'createdAt' | 'updatedAt'>): Promise<DynamoDBProduct> {
    try {
      const now = new Date().toISOString();
      const id = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const newProduct: DynamoDBProduct = {
        ...productData,
        id,
        createdAt: now,
        updatedAt: now,
      };

      const command = new PutCommand({
        TableName: this.tableName,
        Item: newProduct,
      });

      await this.client.send(command);
      return newProduct;
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  }

  // Actualizar producto
  async update(id: string, productData: Partial<DynamoDBProduct>): Promise<DynamoDBProduct | null> {
    try {
      const now = new Date().toISOString();
      
      const updateExpression: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      // Construir expresión de actualización dinámicamente
      Object.keys(productData).forEach((key, index) => {
        if (key !== 'id' && key !== 'createdAt') {
          updateExpression.push(`#attr${index} = :val${index}`);
          expressionAttributeNames[`#attr${index}`] = key;
          expressionAttributeValues[`:val${index}`] = productData[key as keyof DynamoDBProduct];
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
      return response.Attributes as DynamoDBProduct || null;
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  }

  // Eliminar producto
  async delete(id: string): Promise<boolean> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
      });

      await this.client.send(command);
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  }

  // Obtener estadísticas
  async getStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
    outOfStock: number;
    byCategory: Record<string, number>;
    totalValue: number;
  }> {
    try {
      const products = await this.listAll();
      
      const stats = {
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        inactive: products.filter(p => p.status === 'inactive').length,
        outOfStock: products.filter(p => p.status === 'out_of_stock').length,
        byCategory: {} as Record<string, number>,
        totalValue: 0,
      };

      // Calcular estadísticas por categoría y valor total
      products.forEach(product => {
        // Por categoría
        if (stats.byCategory[product.category]) {
          stats.byCategory[product.category]++;
        } else {
          stats.byCategory[product.category] = 1;
        }

        // Valor total
        stats.totalValue += product.price;
      });

      return stats;
    } catch (error) {
      console.error('Error al obtener estadísticas de productos:', error);
      throw error;
    }
  }

  // Buscar productos
  async search(query: string): Promise<DynamoDBProduct[]> {
    try {
      const command = new DocScanCommand({
        TableName: this.tableName,
        FilterExpression: 'contains(#name, :query) OR contains(description, :query)',
        ExpressionAttributeNames: {
          '#name': 'name',
        },
        ExpressionAttributeValues: {
          ':query': query,
        },
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBProduct[]) || [];
    } catch (error) {
      console.error('Error al buscar productos:', error);
      throw error;
    }
  }

  // Obtener productos activos
  async getActiveProducts(): Promise<DynamoDBProduct[]> {
    return this.findByStatus('active');
  }

  // Obtener productos por rango de precio
  async findByPriceRange(minPrice: number, maxPrice: number): Promise<DynamoDBProduct[]> {
    try {
      const command = new DocScanCommand({
        TableName: this.tableName,
        FilterExpression: 'price BETWEEN :minPrice AND :maxPrice',
        ExpressionAttributeValues: {
          ':minPrice': minPrice,
          ':maxPrice': maxPrice,
        },
      });

      const response = await this.client.send(command);
      return (response.Items as DynamoDBProduct[]) || [];
    } catch (error) {
      console.error('Error al obtener productos por rango de precio:', error);
      throw error;
    }
  }
}

export default DynamoDBProductRepositoryReal;
