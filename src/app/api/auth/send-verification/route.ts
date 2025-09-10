import { NextRequest, NextResponse } from 'next/server'

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // En desarrollo, usar lógica local
    if (process.env.NODE_ENV === 'development') {
      const { email, role, createdBy } = body
      
      if (!email || !role || !createdBy) {
        return NextResponse.json(
          { success: false, message: 'Email, rol y creador son requeridos' },
          { status: 400 }
        )
      }
      
      // Simular respuesta exitosa
      console.log('📧 [DEV] Enviando email de verificación a:', email)
      console.log('👤 [DEV] Rol:', role)
      
      return NextResponse.json({
        success: true,
        message: 'Email de verificación enviado (modo desarrollo)',
        data: {
          email,
          role,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
        }
      })
    }
    
    // En producción/sandbox, usar Lambda
    const result = await callLambdaFunction('/auth/send-verification', body)
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ Error enviando verificación:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
