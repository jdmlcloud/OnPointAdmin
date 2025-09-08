import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Configurar cliente DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
})
const dynamodb = DynamoDBDocumentClient.from(client)

// Detectar entorno dinámicamente
const detectEnvironment = () => {
  return 'local' // Para desarrollo local
}

const getTableName = (tableType: string, environment: string) => {
  return `OnPointAdmin-${tableType}-${environment}`
}

const createResponse = (statusCode: number, body: any) => {
  return NextResponse.json(body, { 
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }
  })
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { httpMethod, path, body: requestBody, headers } = body
    
    console.log('🔐 Auth Lambda - Event:', JSON.stringify(body, null, 2))
    
    const environment = detectEnvironment()
    console.log('🌍 Environment detected:', environment)
    
    // Manejar OPTIONS
    if (httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight' })
    }

    const pathSegments = path.split('/').filter(Boolean)
    
    // Rutas de autenticación
    if (pathSegments[0] === 'auth') {
      if (httpMethod === 'POST' && pathSegments[1] === 'login') {
        return await handleLogin(requestBody, environment)
      } else if (httpMethod === 'POST' && pathSegments[1] === 'verify-token') {
        return await handleVerifyToken(headers, environment)
      }
    }

    return createResponse(404, { error: 'Endpoint not found' })

  } catch (error) {
    console.error('❌ Auth Lambda Error:', error)
    return createResponse(500, { 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    })
  }
}

async function handleLogin(requestBody: string, environment: string) {
  try {
    const body = JSON.parse(requestBody || '{}')
    const { email, password } = body

    if (!email || !password) {
      return createResponse(400, { 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      })
    }

    // Buscar usuario por email
    const usersTable = getTableName('Users', environment)
    const params = {
      TableName: usersTable,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    }

    const result = await dynamodb.send(new GetCommand(params))
    
    if (!result.Item) {
      return createResponse(401, { 
        success: false, 
        message: 'Credenciales inválidas' 
      })
    }

    const user = result.Item

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    
    if (!isValidPassword) {
      return createResponse(401, { 
        success: false, 
        message: 'Credenciales inválidas' 
      })
    }

    // Verificar que el usuario esté activo
    if (user.status !== 'active') {
      return createResponse(401, { 
        success: false, 
        message: 'Usuario inactivo' 
      })
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        environment 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    )

    // Actualizar último login
    const updateParams = {
      TableName: usersTable,
      Key: { id: user.id },
      UpdateExpression: 'SET lastLogin = :lastLogin',
      ExpressionAttributeValues: {
        ':lastLogin': new Date().toISOString()
      }
    }

    await dynamodb.send(new PutCommand(updateParams))

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user

    return createResponse(200, {
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login exitoso'
    })

  } catch (error) {
    console.error('❌ Login Error:', error)
    return createResponse(500, { 
      success: false, 
      message: 'Error interno del servidor' 
    })
  }
}

async function handleVerifyToken(headers: any, environment: string) {
  try {
    const token = headers?.Authorization?.replace('Bearer ', '') || 
                  headers?.authorization?.replace('Bearer ', '')

    if (!token) {
      return createResponse(401, { 
        success: false, 
        message: 'Token no proporcionado' 
      })
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as any
    
    // Buscar usuario
    const usersTable = getTableName('Users', environment)
    const params = {
      TableName: usersTable,
      Key: { id: decoded.userId }
    }

    const result = await dynamodb.send(new GetCommand(params))
    
    if (!result.Item) {
      return createResponse(401, { 
        success: false, 
        message: 'Usuario no encontrado' 
      })
    }

    const { password: _, ...userWithoutPassword } = result.Item

    return createResponse(200, {
      success: true,
      user: userWithoutPassword,
      message: 'Token válido'
    })

  } catch (error) {
    console.error('❌ Verify Token Error:', error)
    return createResponse(401, { 
      success: false, 
      message: 'Token inválido' 
    })
  }
}
