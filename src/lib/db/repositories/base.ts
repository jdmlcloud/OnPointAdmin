import { 
  PutCommand, 
  GetCommand, 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand,
  ScanCommand,
  BatchGetCommand,
  BatchWriteCommand
} from '@aws-sdk/lib-dynamodb'
import { dynamoDB, DynamoDBUtils, TABLES } from '../dynamodb'
import { DynamoDBItem } from '../dynamodb'

export abstract class BaseRepository<T extends DynamoDBItem> {
  protected abstract tableName: string
  protected abstract entityType: string

  // Crear un elemento
  async create(item: Omit<T, 'PK' | 'SK' | 'createdAt' | 'updatedAt'>): Promise<T> {
    const now = DynamoDBUtils.getCurrentTimestamp()
    const id = crypto.randomUUID()
    
    const dynamoItem: T = {
      ...item,
      id,
      PK: DynamoDBUtils.generatePK(this.entityType, id),
      SK: DynamoDBUtils.generateSK(this.entityType, id),
      GSI1PK: DynamoDBUtils.generateGSI1PK(this.entityType, 'all'),
      GSI1SK: now,
      createdAt: now,
      updatedAt: now,
    } as T

    await dynamoDB.send(new PutCommand({
      TableName: this.tableName,
      Item: dynamoItem,
    }))

    return dynamoItem
  }

  // Obtener un elemento por ID
  async getById(id: string): Promise<T | null> {
    const result = await dynamoDB.send(new GetCommand({
      TableName: this.tableName,
      Key: {
        PK: DynamoDBUtils.generatePK(this.entityType, id),
        SK: DynamoDBUtils.generateSK(this.entityType, id),
      },
    }))

    return result.Item as T || null
  }

  // Actualizar un elemento
  async update(id: string, updates: Partial<Omit<T, 'id' | 'PK' | 'SK' | 'createdAt'>>): Promise<T | null> {
    const updateExpression: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}

    // Agregar campos a actualizar
    Object.entries(updates).forEach(([key, value]) => {
      if (value !== undefined) {
        updateExpression.push(`#${key} = :${key}`)
        expressionAttributeNames[`#${key}`] = key
        expressionAttributeValues[`:${key}`] = value
      }
    })

    // Siempre actualizar updatedAt
    updateExpression.push('#updatedAt = :updatedAt')
    expressionAttributeNames['#updatedAt'] = 'updatedAt'
    expressionAttributeValues[':updatedAt'] = DynamoDBUtils.getCurrentTimestamp()

    if (updateExpression.length === 0) {
      return this.getById(id)
    }

    const result = await dynamoDB.send(new UpdateCommand({
      TableName: this.tableName,
      Key: {
        PK: DynamoDBUtils.generatePK(this.entityType, id),
        SK: DynamoDBUtils.generateSK(this.entityType, id),
      },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW',
    }))

    return result.Attributes as T || null
  }

  // Eliminar un elemento
  async delete(id: string): Promise<boolean> {
    await dynamoDB.send(new DeleteCommand({
      TableName: this.tableName,
      Key: {
        PK: DynamoDBUtils.generatePK(this.entityType, id),
        SK: DynamoDBUtils.generateSK(this.entityType, id),
      },
    }))

    return true
  }

  // Listar todos los elementos (usando GSI1)
  async listAll(limit: number = 100, lastEvaluatedKey?: any): Promise<{ items: T[], lastEvaluatedKey?: any }> {
    const result = await dynamoDB.send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :gsi1pk',
      ExpressionAttributeValues: {
        ':gsi1pk': DynamoDBUtils.generateGSI1PK(this.entityType, 'all'),
      },
      ScanIndexForward: false, // Ordenar por fecha descendente
      Limit: limit,
      ExclusiveStartKey: lastEvaluatedKey,
    }))

    return {
      items: result.Items as T[] || [],
      lastEvaluatedKey: result.LastEvaluatedKey,
    }
  }

  // Buscar por GSI1
  async queryByGSI1(gsi1pk: string, gsi1sk?: string, limit: number = 100): Promise<T[]> {
    const keyConditionExpression = gsi1sk 
      ? 'GSI1PK = :gsi1pk AND GSI1SK = :gsi1sk'
      : 'GSI1PK = :gsi1pk'

    const expressionAttributeValues: Record<string, any> = {
      ':gsi1pk': gsi1pk,
    }

    if (gsi1sk) {
      expressionAttributeValues[':gsi1sk'] = gsi1sk
    }

    const result = await dynamoDB.send(new QueryCommand({
      TableName: this.tableName,
      IndexName: 'GSI1',
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ScanIndexForward: false,
      Limit: limit,
    }))

    return result.Items as T[] || []
  }

  // Buscar por filtros
  async search(filters: Record<string, any>, limit: number = 100): Promise<T[]> {
    const filterExpression: string[] = []
    const expressionAttributeNames: Record<string, string> = {}
    const expressionAttributeValues: Record<string, any> = {}

    Object.entries(filters).forEach(([key, value], index) => {
      if (value !== undefined) {
        filterExpression.push(`#${key} = :${key}`)
        expressionAttributeNames[`#${key}`] = key
        expressionAttributeValues[`:${key}`] = value
      }
    })

    const result = await dynamoDB.send(new ScanCommand({
      TableName: this.tableName,
      FilterExpression: filterExpression.length > 0 ? filterExpression.join(' AND ') : undefined,
      ExpressionAttributeNames: Object.keys(expressionAttributeNames).length > 0 ? expressionAttributeNames : undefined,
      ExpressionAttributeValues: Object.keys(expressionAttributeValues).length > 0 ? expressionAttributeValues : undefined,
      Limit: limit,
    }))

    return result.Items as T[] || []
  }

  // Obtener múltiples elementos por IDs
  async getByIds(ids: string[]): Promise<T[]> {
    if (ids.length === 0) return []

    const keys = ids.map(id => ({
      PK: DynamoDBUtils.generatePK(this.entityType, id),
      SK: DynamoDBUtils.generateSK(this.entityType, id),
    }))

    const result = await dynamoDB.send(new BatchGetCommand({
      RequestItems: {
        [this.tableName]: {
          Keys: keys,
        },
      },
    }))

    return result.Responses?.[this.tableName] as T[] || []
  }

  // Crear múltiples elementos
  async createBatch(items: Omit<T, 'PK' | 'SK' | 'createdAt' | 'updatedAt'>[]): Promise<T[]> {
    if (items.length === 0) return []

    const now = DynamoDBUtils.getCurrentTimestamp()
    const dynamoItems: T[] = items.map(item => ({
      ...item,
      id: crypto.randomUUID(),
      PK: DynamoDBUtils.generatePK(this.entityType, crypto.randomUUID()),
      SK: DynamoDBUtils.generateSK(this.entityType, crypto.randomUUID()),
      GSI1PK: DynamoDBUtils.generateGSI1PK(this.entityType, 'all'),
      GSI1SK: now,
      createdAt: now,
      updatedAt: now,
    })) as T[]

    // DynamoDB BatchWriteCommand permite máximo 25 items
    const chunks = []
    for (let i = 0; i < dynamoItems.length; i += 25) {
      chunks.push(dynamoItems.slice(i, i + 25))
    }

    for (const chunk of chunks) {
      await dynamoDB.send(new BatchWriteCommand({
        RequestItems: {
          [this.tableName]: chunk.map(item => ({
            PutRequest: {
              Item: item,
            },
          })),
        },
      }))
    }

    return dynamoItems
  }
}
