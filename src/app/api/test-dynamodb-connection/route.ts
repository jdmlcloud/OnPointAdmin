import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient, DescribeTableCommand } from '@aws-sdk/client-dynamodb'

export async function GET(request: NextRequest) {
  try {
    // Crear cliente DynamoDB con las credenciales disponibles
    const client = new DynamoDBClient({
      region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY || ''
      }
    })

    const testResults = {
      timestamp: new Date().toISOString(),
      credentials: {
        region: process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1',
        hasAccessKey: !!(process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID),
        hasSecretKey: !!(process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY)
      },
      tables: {} as any
    }

    // Probar conexión con cada tabla
    const tables = [
      'onpoint-admin-users-dev',
      'onpoint-admin-providers-dev', 
      'onpoint-admin-products-dev',
      'onpoint-admin-orders-dev'
    ]

    for (const tableName of tables) {
      try {
        const command = new DescribeTableCommand({ TableName: tableName })
        const result = await client.send(command)
        testResults.tables[tableName] = {
          status: 'SUCCESS',
          tableStatus: result.Table?.TableStatus,
          itemCount: result.Table?.ItemCount,
          creationDate: result.Table?.CreationDateTime
        }
      } catch (error) {
        testResults.tables[tableName] = {
          status: 'ERROR',
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }
    }

    return NextResponse.json({
      success: true,
      testResults,
      message: 'DynamoDB connection test completed'
    })

  } catch (error) {
    console.error('Error testing DynamoDB connection:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Error testing DynamoDB connection'
    }, { status: 500 })
  }
}
