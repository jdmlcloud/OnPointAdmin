import { 
  DynamoDBDocumentClient, 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  ScanCommand,
  QueryCommand,
  BatchGetCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb'
import { dynamoDBDocumentClient } from '@/lib/aws/dynamodb'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export abstract class DynamoDBBaseRepository<T extends BaseEntity> {
  protected client: DynamoDBDocumentClient
  protected tableName: string

  constructor(tableName: string) {
    this.client = dynamoDBDocumentClient
    this.tableName = tableName
  }

  // Crear item
  async create(item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const now = new Date().toISOString()
    const id = this.generateId()
    
    const newItem = {
      ...item,
      id,
      createdAt: now,
      updatedAt: now,
    } as T

    const command = new PutCommand({
      TableName: this.tableName,
      Item: newItem,
    })

    await this.client.send(command)
    return newItem
  }

  // Obtener por ID
  async findById(id: string): Promise<T | null> {
    const command = new GetCommand({
      TableName: this.tableName,
      Key: { id },
    })

    const result = await this.client.send(command)
    return result.Item as T || null
  }

  // Actualizar item
  async update(id: string, updates: Partial<Omit<T, 'id' | 'createdAt'>>): Promise<T | null> {
    const existingItem = await this.findById(id)
    if (!existingItem) {
      return null
    }

    const updatedItem = {
      ...existingItem,
      ...updates,
      updatedAt: new Date().toISOString(),
    } as T

    const command = new PutCommand({
      TableName: this.tableName,
      Item: updatedItem,
    })

    await this.client.send(command)
    return updatedItem
  }

  // Eliminar item
  async delete(id: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: this.tableName,
      Key: { id },
    })

    await this.client.send(command)
    return true
  }

  // Listar todos con paginación
  async findAll(options: PaginationOptions = {}): Promise<PaginatedResult<T>> {
    const { page = 1, limit = 10 } = options
    const offset = (page - 1) * limit

    const command = new ScanCommand({
      TableName: this.tableName,
      Limit: limit,
    })

    const result = await this.client.send(command)
    const items = (result.Items || []) as T[]
    
    // Para obtener el total, necesitaríamos un scan completo
    // Por simplicidad, asumimos que tenemos todos los items
    const total = items.length
    const totalPages = Math.ceil(total / limit)

    return {
      items: items.slice(offset, offset + limit),
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    }
  }

  // Buscar por campo específico
  async findByField(fieldName: string, value: any): Promise<T[]> {
    const command = new ScanCommand({
      TableName: this.tableName,
      FilterExpression: `#${fieldName} = :value`,
      ExpressionAttributeNames: {
        [`#${fieldName}`]: fieldName,
      },
      ExpressionAttributeValues: {
        ':value': value,
      },
    })

    const result = await this.client.send(command)
    return (result.Items || []) as T[]
  }

  // Generar ID único
  protected generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  // Verificar conexión
  async testConnection(): Promise<boolean> {
    try {
      const command = new ScanCommand({
        TableName: this.tableName,
        Limit: 1,
      })
      
      await this.client.send(command)
      return true
    } catch (error) {
      console.error(`❌ Error conectando a tabla ${this.tableName}:`, error)
      return false
    }
  }
}
