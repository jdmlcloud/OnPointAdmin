import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptionsDev } from '@/lib/auth-dev'

// TODO: Implementar repositorio de usuarios cuando se configure DynamoDB

// GET /api/users/stats - Obtener estadísticas de usuarios
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admin puede ver estadísticas
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    // TODO: Implementar cuando se configure DynamoDB
    return NextResponse.json({
      totalUsers: 0,
      activeUsers: 0,
      pendingUsers: 0,
      message: 'DynamoDB no configurado - Solo Cognito activo',
    })
  } catch (error) {
    console.error('Error al obtener estadísticas de usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
