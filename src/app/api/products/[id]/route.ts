import { NextRequest, NextResponse } from 'next/server'

// URLs de las Lambda functions
const LAMBDA_URLS = {
  sandbox: 'https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox',
  prod: 'https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod'
}

// Detectar entorno dinámicamente
const detectEnvironment = () => {
  return process.env.NODE_ENV === 'production' ? 'prod' : 'sandbox'
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

// GET /api/products/[id] - Obtener producto por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Products API - GET by ID (proxy to Lambda):', params.id)
    
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    console.log(`🌍 Environment: ${environment}, Lambda URL: ${lambdaUrl}`)
    
    const response = await fetch(`${lambdaUrl}/products/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener producto')
    }
    
    return createResponse(200, data)

  } catch (error) {
    console.error('❌ Products API Error:', error)
    return createResponse(500, { 
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

// PUT /api/products/[id] - Actualizar producto por ID
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Products API - PUT by ID (proxy to Lambda):', params.id)
    
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    console.log(`🌍 Environment: ${environment}, Lambda URL: ${lambdaUrl}`)
    
    const updateData = await request.json()
    
    const response = await fetch(`${lambdaUrl}/products/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar producto')
    }
    
    return createResponse(200, data)

  } catch (error) {
    console.error('❌ Products API Error:', error)
    return createResponse(500, { 
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

// DELETE /api/products/[id] - Eliminar producto por ID
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    console.log('🔍 Products API - DELETE by ID (proxy to Lambda):', params.id)
    
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    console.log(`🌍 Environment: ${environment}, Lambda URL: ${lambdaUrl}`)
    
    const response = await fetch(`${lambdaUrl}/products/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar producto')
    }
    
    return createResponse(200, data)

  } catch (error) {
    console.error('❌ Products API Error:', error)
    return createResponse(500, { 
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

// OPTIONS - Manejar CORS preflight
export async function OPTIONS() {
  return createResponse(200, { message: 'CORS preflight' })
}
