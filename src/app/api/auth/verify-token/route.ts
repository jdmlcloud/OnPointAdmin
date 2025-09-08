import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    // En desarrollo local, simular la llamada a la Lambda function
    // En producción, esto se conectaría con API Gateway
    const lambdaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:3000'}/api/lambda/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        httpMethod: 'POST',
        path: '/auth/verify-token',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
    })

    if (!lambdaResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Token inválido' },
        { status: 401 }
      )
    }

    const data = await lambdaResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error en verify-token API:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
