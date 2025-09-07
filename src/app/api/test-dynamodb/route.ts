import { NextRequest, NextResponse } from 'next/server'
import { testDynamoDBConnection } from '@/lib/aws/dynamodb'
import { DynamoDBUserRepository } from '@/lib/db/repositories/dynamodb-user-repository'
import { DynamoDBProductRepository } from '@/lib/db/repositories/dynamodb-product-repository'
import { DynamoDBProviderRepository } from '@/lib/db/repositories/dynamodb-provider-repository'

export async function GET(request: NextRequest) {
  try {
    console.log('🧪 Iniciando test de conexión DynamoDB...')
    
    // Test de conexión básica
    const connectionTest = await testDynamoDBConnection()
    
    if (!connectionTest.success) {
      return NextResponse.json({
        success: false,
        error: 'Error de conexión',
        message: connectionTest.error,
        connectionTest
      }, { status: 500 })
    }

    // Test de repositorios individuales
    const userRepo = new DynamoDBUserRepository()
    const productRepo = new DynamoDBProductRepository()
    const providerRepo = new DynamoDBProviderRepository()

    const [userConnection, productConnection, providerConnection] = await Promise.all([
      userRepo.testConnection(),
      productRepo.testConnection(),
      providerRepo.testConnection()
    ])

    const repositoryTests = {
      users: userConnection,
      products: productConnection,
      providers: providerConnection
    }

    const allRepositoriesWorking = userConnection && productConnection && providerConnection

    return NextResponse.json({
      success: allRepositoriesWorking,
      message: allRepositoriesWorking 
        ? '✅ Todas las conexiones funcionando correctamente' 
        : '⚠️ Algunas conexiones fallaron',
      connectionTest,
      repositoryTests,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('❌ Error en test de conexión:', error)
    return NextResponse.json({
      success: false,
      error: 'Error en test de conexión',
      message: error instanceof Error ? error.message : 'Error desconocido',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
