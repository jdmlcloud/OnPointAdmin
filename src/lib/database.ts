import { DynamoDBClient } from "@aws-sdk/client-dynamodb"
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand, DeleteCommand, ScanCommand, QueryCommand } from "@aws-sdk/lib-dynamodb"
import { env } from "@/config/env"

// Create DynamoDB client
const client = new DynamoDBClient({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_KEY_ID,
    secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
  },
})

export const dynamoClient = DynamoDBDocumentClient.from(client)

// Table names
export const TABLES = {
  PROVIDERS: `${env.DYNAMODB_TABLE_PREFIX}_providers`,
  PRODUCTS: `${env.DYNAMODB_TABLE_PREFIX}_products`,
  QUOTATIONS: `${env.DYNAMODB_TABLE_PREFIX}_quotations`,
  PROPOSALS: `${env.DYNAMODB_TABLE_PREFIX}_proposals`,
  WHATSAPP_MESSAGES: `${env.DYNAMODB_TABLE_PREFIX}_whatsapp_messages`,
  USERS: `${env.DYNAMODB_TABLE_PREFIX}_users`,
  AUTH: `${env.DYNAMODB_TABLE_PREFIX}_auth`,
} as const

// Database operations
export class DatabaseService {
  static async create(tableName: string, item: any) {
    const command = new PutCommand({
      TableName: tableName,
      Item: {
        ...item,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    })
    return await dynamoClient.send(command)
  }

  static async get(tableName: string, key: any) {
    const command = new GetCommand({
      TableName: tableName,
      Key: key,
    })
    const result = await dynamoClient.send(command)
    return result.Item
  }

  static async update(tableName: string, key: any, updates: any) {
    const updateExpression = Object.keys(updates)
      .map((key, index) => `${key} = :val${index}`)
      .join(', ')
    
    const expressionAttributeValues = Object.keys(updates).reduce((acc, key, index) => {
      acc[`:val${index}`] = updates[key]
      return acc
    }, {} as any)

    const command = new UpdateCommand({
      TableName: tableName,
      Key: key,
      UpdateExpression: `SET ${updateExpression}, updatedAt = :updatedAt`,
      ExpressionAttributeValues: {
        ...expressionAttributeValues,
        ':updatedAt': new Date().toISOString(),
      },
    })
    return await dynamoClient.send(command)
  }

  static async delete(tableName: string, key: any) {
    const command = new DeleteCommand({
      TableName: tableName,
      Key: key,
    })
    return await dynamoClient.send(command)
  }

  static async scan(tableName: string, filterExpression?: string, expressionAttributeValues?: any) {
    const command = new ScanCommand({
      TableName: tableName,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    })
    const result = await dynamoClient.send(command)
    return result.Items || []
  }

  static async query(tableName: string, keyConditionExpression: string, expressionAttributeValues?: any) {
    const command = new QueryCommand({
      TableName: tableName,
      KeyConditionExpression: keyConditionExpression,
      ExpressionAttributeValues: expressionAttributeValues,
    })
    const result = await dynamoClient.send(command)
    return result.Items || []
  }
}
