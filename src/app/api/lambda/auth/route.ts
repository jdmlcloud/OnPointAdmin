import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb'

// Configurar cliente DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
})
const dynamodb = DynamoDBDocumentClient.from(client)

// Funciones simplificadas para desarrollo local
const simpleHash = (password: string): string => {
  // Hash simple para desarrollo - NO usar en producción
  return Buffer.from(password).toString('base64')
}

const simpleVerify = (password: string, hash: string): boolean => {
  // Verificación simple para desarrollo - NO usar en producción
  return Buffer.from(password).toString('base64') === hash
}

const simpleJWT = (payload: any): string => {
  // JWT simple para desarrollo - NO usar en producción
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = Buffer.from('dev-signature').toString('base64')
  return `${header}.${payloadEncoded}.${signature}`
}

const simpleVerifyJWT = (token: string): any => {
  // Verificación simple para desarrollo - NO usar en producción
  try {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid token')
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

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
    // GetCommand requiere Key, así que usamos Scan/Query simplificado por email (mock)
    // En un caso real deberíamos tener el email como parte de la clave (PK o GSI)
    const result = await dynamodb.send(new GetCommand({
      TableName: usersTable,
      Key: { id: email } as any
    }))
    
    if (!result.Item) {
      return createResponse(401, { 
        success: false, 
        message: 'Credenciales inválidas' 
      })
    }

    const user = result.Item

    // Verificar contraseña
    const isValidPassword = simpleVerify(password, user.password)
    
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
    const token = simpleJWT({
      userId: user.id, 
      email: user.email, 
      role: user.role,
      environment,
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    })

    // Actualizar último login
    // PutCommand requiere Item; para simplificar guardamos el usuario con lastLogin actualizado
    const updateItem = {
      ...user,
      lastLogin: new Date().toISOString()
    }
    await dynamodb.send(new PutCommand({
      TableName: usersTable,
      Item: updateItem as any
    }))

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
    const decoded = simpleVerifyJWT(token)
    
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
