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
    
    // Parse JSON body directly like providers
    const logoData = await request.json()
    
    // Validar campos requeridos
    if (!logoData.name || !logoData.category || !logoData.brand) {
      return createResponse(400, {
        success: false,
        error: 'name, category y brand son obligatorios'
      })
    }
    
    // Prepare logo data for Lambda
    const lambdaPayload = {
      name: logoData.name,
      description: logoData.description || '',
      category: logoData.category,
      brand: logoData.brand,
      clientName: logoData.brand, // Use brand as clientName
      clientId: logoData.clientId || `client-${logoData.brand.toLowerCase().replace(/\s+/g, '-')}`,
      variant: logoData.variant || '',
      version: logoData.version || 'v1.0',
      tags: logoData.tags || [],
      status: logoData.status || 'active',
      isPrimary: logoData.isPrimary || false,
      fileType: logoData.fileType || 'UNKNOWN',
      fileSize: logoData.fileSize || 0,
      fileUrl: logoData.fileUrl || `https://onpoint-logos-${environment}.s3.amazonaws.com/logos/${Date.now()}-${logoData.name.replace(/\s+/g, '-')}.${logoData.fileType?.toLowerCase() || 'png'}`,
      thumbnailUrl: logoData.thumbnailUrl || '',
      dimensions: logoData.dimensions || { width: 0, height: 0 },
      dpi: logoData.dpi || 300,
      format: logoData.format || logoData.fileType || 'PNG',
      isVector: logoData.isVector || false,
      isTransparent: logoData.isTransparent || false,
      colorVariants: logoData.colorVariants || [],
      usageRights: logoData.usageRights || [],
      lastUsed: logoData.lastUsed || null,
      downloadCount: logoData.downloadCount || 0,
      // Agregar contenido del archivo para Lambda
      fileContent: logoData.fileContent,
      fileName: logoData.fileName,
      fileContentType: logoData.fileContentType
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
