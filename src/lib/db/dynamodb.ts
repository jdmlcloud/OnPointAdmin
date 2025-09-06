import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { envDev } from '@/config/env-dev'

// Configuración del cliente DynamoDB
const client = new DynamoDBClient({
  region: envDev.AWS_REGION,
  credentials: {
    accessKeyId: envDev.AWS_ACCESS_KEY_ID,
    secretAccessKey: envDev.AWS_SECRET_ACCESS_KEY,
  },
})

// Cliente de documentos DynamoDB
export const dynamoDB = DynamoDBDocumentClient.from(client)

// Configuración de tablas
export const TABLES = {
  USERS: `${envDev.DYNAMODB_TABLE_PREFIX}-users`,
  PROVIDERS: `${envDev.DYNAMODB_TABLE_PREFIX}-providers`,
  PRODUCTS: `${envDev.DYNAMODB_TABLE_PREFIX}-products`,
  QUOTATIONS: `${envDev.DYNAMODB_TABLE_PREFIX}-quotations`,
  PROPOSALS: `${envDev.DYNAMODB_TABLE_PREFIX}-proposals`,
  WHATSAPP_MESSAGES: `${envDev.DYNAMODB_TABLE_PREFIX}-whatsapp-messages`,
  ANALYTICS: `${envDev.DYNAMODB_TABLE_PREFIX}-analytics`,
  INTEGRATIONS: `${envDev.DYNAMODB_TABLE_PREFIX}-integrations`,
  SYSTEM_LOGS: `${envDev.DYNAMODB_TABLE_PREFIX}-system-logs`,
} as const

// Tipos de datos para DynamoDB
export interface DynamoDBItem {
  PK: string // Partition Key
  SK: string // Sort Key
  GSI1PK?: string // Global Secondary Index 1 Partition Key
  GSI1SK?: string // Global Secondary Index 1 Sort Key
  GSI2PK?: string // Global Secondary Index 2 Partition Key
  GSI2SK?: string // Global Secondary Index 2 Sort Key
  createdAt: string
  updatedAt: string
  ttl?: number // Time To Live
}

// Esquemas de tablas
export const TABLE_SCHEMAS = {
  [TABLES.USERS]: {
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ]
  },
  [TABLES.PROVIDERS]: {
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ]
  },
  [TABLES.PRODUCTS]: {
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ]
  },
  [TABLES.QUOTATIONS]: {
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ]
  },
  [TABLES.PROPOSALS]: {
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ]
  },
  [TABLES.WHATSAPP_MESSAGES]: {
    KeySchema: [
      { AttributeName: 'PK', KeyType: 'HASH' },
      { AttributeName: 'SK', KeyType: 'RANGE' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'PK', AttributeType: 'S' },
      { AttributeName: 'SK', AttributeType: 'S' },
      { AttributeName: 'GSI1PK', AttributeType: 'S' },
      { AttributeName: 'GSI1SK', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [
      {
        IndexName: 'GSI1',
        KeySchema: [
          { AttributeName: 'GSI1PK', KeyType: 'HASH' },
          { AttributeName: 'GSI1SK', KeyType: 'RANGE' }
        ],
        Projection: { ProjectionType: 'ALL' }
      }
    ]
  }
} as const

// Utilidades para DynamoDB
export class DynamoDBUtils {
  static generatePK(entity: string, id: string): string {
    return `${entity}#${id}`
  }

  static generateSK(entity: string, id: string): string {
    return `${entity}#${id}`
  }

  static generateGSI1PK(entity: string, type: string): string {
    return `${entity}#${type}`
  }

  static generateGSI1SK(timestamp: string): string {
    return timestamp
  }

  static getCurrentTimestamp(): string {
    return new Date().toISOString()
  }

  static getTTL(days: number = 30): number {
    return Math.floor(Date.now() / 1000) + (days * 24 * 60 * 60)
  }
}
