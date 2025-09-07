import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBUserRepository } from '@/lib/db/repositories/dynamodb-user-repository'

// GET /api/users/stats - Obtener estadísticas de usuarios
export async function GET(request: NextRequest) {
  try {
    const userRepository = new DynamoDBUserRepository()
    
    // Obtener estadísticas desde DynamoDB
    const stats = await userRepository.getStats()
    
    return NextResponse.json({
      success: true,
      stats,
      message: 'Estadísticas de usuarios obtenidas exitosamente desde DynamoDB'
    })
  } catch (error) {
    console.error('Error al obtener estadísticas de usuarios:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al obtener estadísticas de usuarios',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
