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
    
    // Parse FormData
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const data = formData.get('data') as string | null

    if (!file || !data) {
      return createResponse(400, {
        success: false,
        error: 'Datos y archivo de logo requeridos'
      })
    }

    // Convert file to base64 for Lambda
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64File = buffer.toString('base64')

    const logoData = JSON.parse(data)
    
    // Validar campos requeridos
    if (!logoData.name || !logoData.category) {
      return createResponse(400, {
        success: false,
        error: 'name, category y fileUrl son obligatorios'
      })
    }
    
    const lambdaPayload = {
      data: JSON.stringify({
        ...logoData,
        fileType: file.name.split('.').pop()?.toUpperCase() || 'UNKNOWN',
        fileSize: file.size,
        fileUrl: `https://onpoint-logos-${environment}.s3.amazonaws.com/logos/${Date.now()}-${file.name}`
      }),
      file: {
        content: base64File,
        filename: file.name,
        contentType: file.type,
      },
    }
    
    const response = await fetch(`${lambdaUrl}/logos`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(lambdaPayload)
    })
    
    const responseData = await response.json()
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Error al crear logo')
    }
    
    return createResponse(201, responseData)
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
