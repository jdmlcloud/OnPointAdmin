import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // En desarrollo local, simular la llamada a la Lambda function
    // En producción, esto se conectaría con API Gateway
    const lambdaResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL_LOCAL || 'http://localhost:3000'}/api/lambda/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        httpMethod: 'POST',
        path: '/auth/login',
        body: JSON.stringify({ email, password })
      })
    })

    if (!lambdaResponse.ok) {
      return NextResponse.json(
        { success: false, message: 'Error de conexión con el servidor' },
        { status: 500 }
      )
    }

    const data = await lambdaResponse.json()
    return NextResponse.json(data)

  } catch (error) {
    console.error('Error en login API:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
