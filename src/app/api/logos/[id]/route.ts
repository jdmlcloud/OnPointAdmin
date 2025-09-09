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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 Logos API - GET by ID (proxy to Lambda):', params.id)
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    
    const response = await fetch(`${lambdaUrl}/logos/${params.id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener logo')
    }
    
    return createResponse(200, data)
  } catch (error) {
    console.error('Error in GET /api/logos/[id]:', error)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 Logos API - PUT by ID (proxy to Lambda):', params.id)
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    
    const updateData = await request.json()
    
    const response = await fetch(`${lambdaUrl}/logos/${params.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updateData)
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al actualizar logo')
    }
    
    return createResponse(200, data)
  } catch (error) {
    console.error('Error in PUT /api/logos/[id]:', error)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('🔍 Logos API - DELETE by ID (proxy to Lambda):', params.id)
    const environment = detectEnvironment()
    const lambdaUrl = LAMBDA_URLS[environment]
    
    const response = await fetch(`${lambdaUrl}/logos/${params.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.message || 'Error al eliminar logo')
    }
    
    return createResponse(200, data)
  } catch (error) {
    console.error('Error in DELETE /api/logos/[id]:', error)
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
