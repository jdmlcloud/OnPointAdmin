import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient, GetItemCommand } from '@aws-sdk/client-dynamodb'
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb'

// Configurar DynamoDB
const dynamodbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const USERS_TABLE = process.env.USERS_TABLE || 'OnPointAdmin-Users-sandbox';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return NextResponse.json(
        { success: false, error: 'Email es requerido' },
        { status: 400 }
      )
    }

    console.log('🔍 Buscando usuario en DynamoDB:', email)
    
    // Buscar usuario por email
    const command = new GetItemCommand({
      TableName: USERS_TABLE,
      Key: marshall({ email })
    });

    const result = await dynamodbClient.send(command)
    
    if (!result.Item) {
      console.log('❌ Usuario no encontrado en DynamoDB:', email)
      return NextResponse.json({
        success: false,
        error: 'Usuario no encontrado'
      })
    }

    const user = unmarshall(result.Item) as any
    console.log('✅ Usuario encontrado en DynamoDB:', user.email)
    
    // Retornar usuario sin la contraseña
    const { password, ...userWithoutPassword } = user
    
    return NextResponse.json({
      success: true,
      user: userWithoutPassword
    })

  } catch (error) {
    console.error('❌ Error obteniendo usuario de DynamoDB:', error)
    return NextResponse.json(
      { success: false, error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
