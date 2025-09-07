import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      NODE_ENV: process.env.NODE_ENV,
      DYNAMODB_REGION: process.env.DYNAMODB_REGION,
      DYNAMODB_ACCESS_KEY_ID: process.env.DYNAMODB_ACCESS_KEY_ID ? '✅ Configurado' : '❌ No configurado',
      DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY ? '✅ Configurado' : '❌ No configurado',
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '✅ Configurado' : '❌ No configurado',
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '✅ Configurado' : '❌ No configurado',
      AWS_REGION: process.env.AWS_REGION,
      // No mostrar valores reales por seguridad
      hasDynamoDBCreds: !!(process.env.DYNAMODB_ACCESS_KEY_ID && process.env.DYNAMODB_SECRET_ACCESS_KEY),
      hasAWSCreds: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
    }

    return NextResponse.json({
      success: true,
      environment: envVars,
      message: 'Variables de entorno obtenidas'
    })
  } catch (error) {
    console.error('Error obteniendo variables de entorno:', error)
    return NextResponse.json({
      success: false,
      error: 'Error obteniendo variables de entorno',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
