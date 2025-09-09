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

// GET - Obtener todos los clientes
export async function GET() {
  try {
    console.log('🔍 Clients API - GET request (proxy to Lambda)')
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]

    const response = await fetch(`${lambdaUrl}/clients`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener clientes')
    }

    return createResponse(200, data)
  } catch (error) {
    console.error('Error in GET /api/clients:', error)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

// POST - Crear nuevo cliente
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Clients API - POST request (proxy to Lambda)')
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]

    // Parse JSON body
    const clientData = await request.json()

    // Validar campos requeridos
    if (!clientData.name) {
      return createResponse(400, {
        success: false,
        error: 'name es obligatorio'
      })
    }

    // Prepare client data for Lambda
    const lambdaPayload = {
      name: clientData.name,
      description: clientData.description || '',
      industry: clientData.industry || 'Other',
      contactEmail: clientData.contactEmail || '',
      status: clientData.status || 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    const response = await fetch(`${lambdaUrl}/clients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lambdaPayload)
    })

    const responseData = await response.json()

    if (!response.ok) {
      throw new Error(responseData.message || 'Error al crear cliente')
    }

    return createResponse(201, responseData)
  } catch (error) {
    console.error('Error in POST /api/clients:', error)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}
