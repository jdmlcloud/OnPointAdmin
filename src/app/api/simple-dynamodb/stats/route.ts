import { NextRequest, NextResponse } from 'next/server';
import { simpleUserRepository, simpleProviderRepository, simpleProductRepository } from '@/lib/db/repositories/dynamodb-simple-repository';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 SimpleDynamoDB Stats: Iniciando...');
    
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');

    if (type === 'users') {
      const stats = await simpleUserRepository.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
        source: 'SimpleDynamoDB (Producción)',
      });
    }

    if (type === 'providers') {
      const stats = await simpleProviderRepository.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
        source: 'SimpleDynamoDB (Producción)',
      });
    }

    if (type === 'products') {
      const stats = await simpleProductRepository.getStats();
      return NextResponse.json({
        success: true,
        data: stats,
        source: 'SimpleDynamoDB (Producción)',
      });
    }

    // Obtener todas las estadísticas
    const [userStats, providerStats, productStats] = await Promise.all([
      simpleUserRepository.getStats(),
      simpleProviderRepository.getStats(),
      simpleProductRepository.getStats(),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        totalUsers: userStats.total,
        totalProviders: providerStats.total,
        totalProducts: productStats.total,
        activeUsers: userStats.active,
        activeProviders: providerStats.active,
        activeProducts: productStats.active,
        inactiveUsers: userStats.inactive,
        inactiveProviders: providerStats.inactive,
        inactiveProducts: productStats.inactive,
      },
      source: 'SimpleDynamoDB (Producción)',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Error en SimpleDynamoDB Stats:', error);
    return NextResponse.json({
      success: false,
      message: 'Error obteniendo estadísticas SimpleDynamoDB',
      error: error.message,
      source: 'Error en SimpleDynamoDB (Producción)',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
