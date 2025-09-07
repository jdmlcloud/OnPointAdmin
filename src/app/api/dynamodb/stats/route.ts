import { NextRequest, NextResponse } from 'next/server';
import DynamoDBUserRepositoryHybrid from '@/lib/db/repositories/dynamodb-user-repository-hybrid';
import DynamoDBProviderRepositoryHybrid from '@/lib/db/repositories/dynamodb-provider-repository-hybrid';
import DynamoDBProductRepositoryHybrid from '@/lib/db/repositories/dynamodb-product-repository-hybrid';
import { checkDynamoDBStatus } from '@/lib/aws/dynamodb';

const userRepository = DynamoDBUserRepositoryHybrid.getInstance();
const providerRepository = DynamoDBProviderRepositoryHybrid.getInstance();
const productRepository = DynamoDBProductRepositoryHybrid.getInstance();

// GET /api/dynamodb/stats - Obtener estadísticas de DynamoDB
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const forceReal = searchParams.get('forceReal') === 'true';
    
    // Forzar modo real en producción si se solicita
    if (forceReal) {
      process.env.DYNAMODB_CONFIGURED = 'true';
    }

    if (type === 'status') {
      // Obtener estado de conexión DynamoDB
      const status = await checkDynamoDBStatus();
      return NextResponse.json({
        success: true,
        data: status,
        source: `DynamoDB (${status.connected ? 'Real' : 'Simulado'})`,
      });
    }

    if (type === 'users') {
      // Estadísticas de usuarios
      const stats = await userRepository.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
        source: `DynamoDB (${userRepository.getMode() === 'real' ? 'Real' : 'Simulado'})`,
      });
    }

    if (type === 'providers') {
      // Estadísticas de proveedores
      const stats = await providerRepository.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
        source: 'DynamoDB (Simulado)',
      });
    }

    if (type === 'products') {
      // Estadísticas de productos
      const stats = await productRepository.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
        source: 'DynamoDB (Simulado)',
      });
    }

    // Estadísticas generales
    const [userStats, providerStats, productStats, dbStatus] = await Promise.all([
      userRepository.getStats(),
      providerRepository.getStats(),
      productRepository.getStats(),
      checkDynamoDBStatus(),
    ]);

    const generalStats = {
      database: dbStatus,
      users: userStats,
      providers: providerStats,
      products: productStats,
      summary: {
        totalUsers: userStats.total,
        totalProviders: providerStats.total,
        totalProducts: productStats.total,
        totalValue: productStats.totalValue,
        activeUsers: userStats.active,
        activeProviders: providerStats.active,
        activeProducts: productStats.active,
      },
    };

    return NextResponse.json({
      success: true,
      data: generalStats,
      source: `DynamoDB (${userRepository.getMode() === 'real' ? 'Real' : 'Simulado'})`,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener estadísticas',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
