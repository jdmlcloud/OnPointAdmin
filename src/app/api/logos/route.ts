import { NextRequest, NextResponse } from 'next/server'

const LAMBDA_URLS = {
  sandbox: 'https://m4ijnyg5da.execute-api.us-east-1.amazonaws.com/sandbox',
  prod: 'https://9o43ckvise.execute-api.us-east-1.amazonaws.com/prod'
}

const detectEnvironment = () => {
  return process.env.NODE_ENV === 'production' ? 'prod' : 'sandbox'
}

const createResponse = (statusCode: number, body: any) => {
  return new NextResponse(JSON.stringify(body), {
    status: statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    }
  })
}

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Logos API - GET request (proxy to Lambda)')
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    
    const response = await fetch(`${lambdaUrl}/logos`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener logos')
    }
    
    return createResponse(200, data)
  } catch (error) {
    console.error('Error in GET /api/logos:', error)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 Logos API - POST request (proxy to Lambda)')
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    
    const logoData = await request.json()
    
    const response = await fetch(`${lambdaUrl}/logos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logoData)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al crear logo')
    }
    
    return createResponse(201, data)
  } catch (error) {
    console.error('Error in POST /api/logos:', error)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

export async function OPTIONS() {
  return createResponse(200, { message: 'OK' })
}
