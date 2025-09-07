import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBUserRepository } from '@/lib/db/repositories/dynamodb-user-repository'
import { DynamoDBProductRepository } from '@/lib/db/repositories/dynamodb-product-repository'
import { DynamoDBProviderRepository } from '@/lib/db/repositories/dynamodb-provider-repository'

export async function GET(request: NextRequest) {
  try {
    const userRepository = new DynamoDBUserRepository()
    const productRepository = new DynamoDBProductRepository()
    const providerRepository = new DynamoDBProviderRepository()

    // Obtener estadísticas de todos los repositorios
    const [userStats, productStats, providerStats] = await Promise.all([
      userRepository.getStats(),
      productRepository.getStats(),
      providerRepository.getStats()
    ])

    const stats = {
      users: userStats,
      products: productStats,
      providers: providerStats,
      summary: {
        totalUsers: userStats.totalUsers,
        totalProducts: productStats.totalProducts,
        totalProviders: providerStats.totalProviders,
        activeUsers: userStats.activeUsers,
        activeProducts: productStats.activeProducts,
        activeProviders: providerStats.activeProviders,
      }
    }

    return NextResponse.json({
      success: true,
      stats,
      message: 'Estadísticas obtenidas exitosamente desde DynamoDB'
    })
  } catch (error) {
    console.error('❌ Error obteniendo estadísticas:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al obtener estadísticas',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
