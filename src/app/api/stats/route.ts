import { NextRequest, NextResponse } from 'next/server'

// Mock data para estadísticas
const mockStats = {
  users: {
    total: 25,
    active: 23,
    inactive: 2,
    newThisMonth: 5
  },
  providers: {
    total: 12,
    active: 11,
    inactive: 1,
    newThisMonth: 3
  },
  products: {
    total: 156,
    active: 142,
    inactive: 14,
    newThisMonth: 28
  },
  quotations: {
    total: 89,
    pending: 12,
    approved: 65,
    rejected: 12,
    newThisMonth: 15
  },
  proposals: {
    total: 45,
    draft: 8,
    sent: 32,
    approved: 5,
    newThisMonth: 7
  },
  whatsapp: {
    messagesReceived: 234,
    messagesSent: 189,
    responsesGenerated: 156,
    newThisMonth: 45
  }
}

// GET /api/stats - Obtener estadísticas del sistema
export async function GET(request: NextRequest) {
  try {
    console.log('📊 GET /api/stats - Obteniendo estadísticas')
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300))
    
    return NextResponse.json({
      success: true,
      stats: mockStats,
      timestamp: new Date().toISOString(),
      message: 'Estadísticas obtenidas exitosamente'
    })
  } catch (error) {
    console.error('Error getting stats:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error obteniendo estadísticas',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
