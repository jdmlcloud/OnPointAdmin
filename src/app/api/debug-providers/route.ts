import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBProviderRepository } from '@/lib/db/repositories/dynamodb-provider-repository'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Iniciando test de providers...')
    
    const providerRepository = new DynamoDBProviderRepository()
    
    // Test 1: Verificar conexión
    console.log('🔍 Test 1: Verificando conexión...')
    const connectionTest = await providerRepository.testConnection()
    console.log('🔍 Test 1 Resultado:', connectionTest)
    
    // Test 2: Intentar obtener todos los providers
    console.log('🔍 Test 2: Obteniendo todos los providers...')
    const result = await providerRepository.findAll()
    console.log('🔍 Test 2 Resultado:', result)
    
    // Test 3: Verificar variables de entorno
    console.log('🔍 Test 3: Verificando variables de entorno...')
    const envCheck = {
      DYNAMODB_REGION: process.env.DYNAMODB_REGION,
      DYNAMODB_ACCESS_KEY_ID: process.env.DYNAMODB_ACCESS_KEY_ID ? '✅ Configurado' : '❌ No configurado',
      DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY ? '✅ Configurado' : '❌ No configurado',
      NODE_ENV: process.env.NODE_ENV
    }
    console.log('🔍 Test 3 Variables:', envCheck)
    
    return NextResponse.json({
      success: true,
      debug: {
        connectionTest,
        providersResult: result,
        environment: envCheck,
        timestamp: new Date().toISOString()
      },
      message: 'Debug de providers completado'
    })
  } catch (error) {
    console.error('❌ Error en debug de providers:', error)
    return NextResponse.json({
      success: false,
      error: 'Error en debug de providers',
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
