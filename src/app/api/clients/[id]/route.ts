import { NextRequest, NextResponse } from 'next/server'

// Función para detectar el entorno
function detectEnvironment() {
  const host = process.env.VERCEL_URL || 'localhost:3000'
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return 'local'
  } else if (host.includes('sandbox') || host.includes('staging')) {
    return 'sandbox'
  } else {
    return 'production'
  }
}

// URLs de Lambda por entorno
const LAMBDA_URLS = {
  local: 'http://localhost:3001',
  sandbox: 'https://api-sandbox.onpoint.com.mx',
  production: 'https://api.onpoint.com.mx'
}

// Función para crear respuesta consistente
function createResponse(status: number, data: any) {
  return NextResponse.json(data, { status })
}

// GET - Obtener cliente específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Clients API - GET request for client:', params.id)
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]

    const response = await fetch(`${lambdaUrl}/clients/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener cliente')
    }

    return createResponse(200, data)
  } catch (error) {
    console.error('Error in GET /api/clients/[id]:', error)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

// PUT - Actualizar cliente
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Clients API - PUT request for client:', params.id)
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]

    const clientData = await request.json()

    // Prepare client data for Lambda
    const lambdaPayload = {
      ...clientData,
      updatedAt: new Date().toISOString()
    }

    const response = await fetch(`${lambdaUrl}/clients/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lambdaPayload)
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.message || 'Error al actualizar cliente')
    }

    return createResponse(200, responseData)
  } catch (error) {
    console.error('Error in PUT /api/clients/[id]:', error)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

// DELETE - Eliminar cliente
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Clients API - DELETE request for client:', params.id)
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]

    const response = await fetch(`${lambdaUrl}/clients/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.message || 'Error al eliminar cliente')
    }

    return createResponse(200, responseData)
  } catch (error) {
    console.error('Error in DELETE /api/clients/[id]:', error)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
