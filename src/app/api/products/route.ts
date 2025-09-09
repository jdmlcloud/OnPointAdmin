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

// GET /api/products - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Products API - GET request (proxy to Lambda)')
    
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    console.log(`🌍 Environment: ${environment}, Lambda URL: ${lambdaUrl}`)
    
    const response = await fetch(`${lambdaUrl}/products`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener productos')
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

// POST /api/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Products API - POST request (proxy to Lambda)')
    
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    console.log(`🌍 Environment: ${environment}, Lambda URL: ${lambdaUrl}`)
    
    const productData = await request.json()
    
    const response = await fetch(`${lambdaUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear producto')
    }
    
    return createResponse(201, data)

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
