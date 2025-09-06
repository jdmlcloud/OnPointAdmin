import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptionsDev } from '@/lib/auth-dev'
import { aiService } from '@/lib/ai/ai-service'
import { whatsappAIService } from '@/lib/ai/services/whatsapp-ai'
import { quotationAIService } from '@/lib/ai/services/quotation-ai'

// POST /api/ai/test - Probar servicios de IA
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admin puede probar servicios de IA
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    const { type, data } = body

    // Inicializar el servicio de IA
    await aiService.initialize()

    let result

    switch (type) {
      case 'text':
        result = await aiService.generateText(data.prompt, {
          maxTokens: data.maxTokens || 500,
          temperature: data.temperature || 0.7,
          systemPrompt: data.systemPrompt
        })
        break

      case 'whatsapp':
        result = await whatsappAIService.analyzeMessage({
          from: data.from || '+1234567890',
          to: data.to || '+0987654321',
          content: data.content,
          type: 'text',
          timestamp: new Date().toISOString()
        })
        break

      case 'quotation':
        result = await quotationAIService.generateQuotation({
          clientInfo: {
            name: data.clientName || 'Cliente Test',
            email: data.clientEmail || 'test@example.com',
            company: data.clientCompany,
            phone: data.clientPhone
          },
          requirements: data.requirements || 'Necesito automatizar mis ventas B2B',
          budget: data.budget,
          timeline: data.timeline,
          previousInteractions: data.previousInteractions
        })
        break

      default:
        return NextResponse.json(
          { error: 'Tipo de prueba no válido' },
          { status: 400 }
        )
    }

    return NextResponse.json({
      success: true,
      provider: aiService.getCurrentProvider(),
      result,
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    console.error('Error testing AI service:', error)
    return NextResponse.json(
      { 
        error: 'Error probando servicio de IA',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// GET /api/ai/test - Obtener estado de los servicios de IA
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admin puede ver el estado
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    // Inicializar el servicio de IA
    await aiService.initialize()

    return NextResponse.json({
      success: true,
      currentProvider: aiService.getCurrentProvider(),
      timestamp: new Date().toISOString(),
      availableProviders: [
        'AWS Bedrock',
        'OpenAI',
        'Anthropic'
      ]
    })
  } catch (error) {
    console.error('Error getting AI service status:', error)
    return NextResponse.json(
      { 
        error: 'Error obteniendo estado del servicio de IA',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
