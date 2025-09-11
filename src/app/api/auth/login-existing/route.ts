import { NextRequest, NextResponse } from 'next/server'
import { authenticateUser } from '@/lib/auth/dynamodb-auth'

// Función para llamar a la Lambda de AWS
const callLambdaFunction = async (path: string, body: any) => {
  const lambdaUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-api-gateway-url.amazonaws.com/prod'
    : 'https://your-api-gateway-url.amazonaws.com/sandbox'
  
  try {
    const response = await fetch(`${lambdaUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    return await response.json()
  } catch (error) {
    console.error('❌ Error llamando Lambda:', error)
    throw error
  }
}

// Función para autenticación con DynamoDB
const authenticateExistingUser = async (email: string, password: string) => {
  console.log('🔐 Iniciando autenticación para:', email)
  
  const result = await authenticateUser({ email, password })
  
  if (!result.success) {
    throw new Error(result.error || 'Credenciales inválidas')
  }

  // Generar token JWT simple (en producción usar jwt.sign)
  const token = `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  return {
    user: result.user,
    token,
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }
    
    // En desarrollo, usar autenticación con DynamoDB
    if (process.env.NODE_ENV === 'development') {
      try {
        const result = await authenticateExistingUser(email, password)
        
        return NextResponse.json({
          success: true,
          message: 'Login exitoso (modo desarrollo)',
          data: result
        })
      } catch (error) {
        console.error('❌ Error en autenticación:', error)
        return NextResponse.json(
          { success: false, message: error.message || 'Credenciales inválidas' },
          { status: 401 }
        )
      }
    }
    
    // En producción/sandbox, usar Lambda
    const result = await callLambdaFunction('/auth/login', { email, password })
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ Error en login:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}