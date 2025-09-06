import { aiService } from '../ai-service'

export interface QuotationRequest {
  clientInfo: {
    name: string
    email: string
    company?: string
    phone?: string
  }
  requirements: string
  budget?: string
  timeline?: string
  previousInteractions?: string[]
}

export interface AIQuotation {
  title: string
  description: string
  products: Array<{
    name: string
    description: string
    quantity: number
    unitPrice: number
    total: number
    category: string
  }>
  total: number
  validUntil: string
  terms: string[]
  recommendations: string[]
  nextSteps: string[]
}

export class QuotationAIService {
  private systemPrompt = `Eres un experto en ventas B2B y generación de cotizaciones para OnPoint Admin.

Tu trabajo es crear cotizaciones profesionales basadas en:
- Requerimientos del cliente
- Información de la empresa
- Productos/servicios disponibles
- Mejores prácticas de ventas

Contexto de la empresa:
- Plataforma B2B de automatización de ventas
- Servicios: WhatsApp Business, IA, cotizaciones, propuestas, PDFs
- Clientes: Empresas medianas y grandes
- Enfoque: Automatización y eficiencia

Genera cotizaciones que sean:
- Profesionales y detalladas
- Competitivas en precio
- Claras en términos y condiciones
- Orientadas a cerrar la venta`

  async generateQuotation(request: QuotationRequest): Promise<AIQuotation> {
    try {
      const prompt = `
Genera una cotización profesional basada en la siguiente información:

Cliente: ${request.clientInfo.name}
Empresa: ${request.clientInfo.company || 'No especificada'}
Email: ${request.clientInfo.email}
Teléfono: ${request.clientInfo.phone || 'No especificado'}

Requerimientos: ${request.requirements}
Presupuesto: ${request.budget || 'No especificado'}
Timeline: ${request.timeline || 'No especificado'}

Interacciones previas: ${request.previousInteractions?.join(', ') || 'Ninguna'}

Genera una cotización completa en formato JSON:
{
  "title": "Título de la cotización",
  "description": "Descripción detallada de la propuesta",
  "products": [
    {
      "name": "Nombre del producto/servicio",
      "description": "Descripción detallada",
      "quantity": 1,
      "unitPrice": 1000,
      "total": 1000,
      "category": "Categoría del producto"
    }
  ],
  "total": 1000,
  "validUntil": "2024-02-15",
  "terms": ["Término 1", "Término 2", "Término 3"],
  "recommendations": ["Recomendación 1", "Recomendación 2"],
  "nextSteps": ["Paso 1", "Paso 2", "Paso 3"]
}

Considera estos productos/servicios disponibles:
- Implementación de WhatsApp Business API
- Integración con IA para automatización
- Sistema de cotizaciones inteligentes
- Generador de propuestas automático
- Generación de PDFs profesionales
- Dashboard de analytics y reportes
- Soporte y capacitación

Solo responde con el JSON, sin texto adicional.`

      const response = await aiService.generateText(prompt, {
        maxTokens: 2000,
        temperature: 0.4,
        systemPrompt: this.systemPrompt
      })

      const parsedResponse = JSON.parse(response)
      
      return {
        title: parsedResponse.title,
        description: parsedResponse.description,
        products: parsedResponse.products,
        total: parsedResponse.total,
        validUntil: parsedResponse.validUntil,
        terms: parsedResponse.terms,
        recommendations: parsedResponse.recommendations,
        nextSteps: parsedResponse.nextSteps
      }
    } catch (error) {
      console.error('Error generating quotation:', error)
      
      // Cotización de fallback
      return {
        title: `Cotización para ${request.clientInfo.name}`,
        description: "Propuesta de servicios de automatización B2B",
        products: [
          {
            name: "Implementación de WhatsApp Business",
            description: "Configuración y integración de WhatsApp Business API",
            quantity: 1,
            unitPrice: 500,
            total: 500,
            category: "Integración"
          },
          {
            name: "Sistema de IA para Ventas",
            description: "Implementación de IA para automatización de respuestas",
            quantity: 1,
            unitPrice: 800,
            total: 800,
            category: "IA"
          }
        ],
        total: 1300,
        validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        terms: [
          "Pago 50% al inicio, 50% al finalizar",
          "Soporte incluido por 3 meses",
          "Garantía de funcionamiento"
        ],
        recommendations: [
          "Implementar por fases para mejor adopción",
          "Capacitar al equipo antes del lanzamiento"
        ],
        nextSteps: [
          "Revisar y aprobar cotización",
          "Firmar contrato",
          "Iniciar implementación"
        ]
      }
    }
  }

  async optimizeQuotation(quotation: AIQuotation, feedback?: string): Promise<AIQuotation> {
    try {
      const prompt = `
Optimiza la siguiente cotización basada en el feedback del cliente:

Cotización actual: ${JSON.stringify(quotation)}
Feedback del cliente: ${feedback || 'Ninguno'}

Optimiza considerando:
- Mejores precios competitivos
- Productos/servicios más relevantes
- Términos más atractivos
- Recomendaciones más específicas

Responde con la cotización optimizada en el mismo formato JSON.`

      const response = await aiService.generateText(prompt, {
        maxTokens: 2000,
        temperature: 0.3,
        systemPrompt: this.systemPrompt
      })

      return JSON.parse(response)
    } catch (error) {
      console.error('Error optimizing quotation:', error)
      return quotation // Retornar la cotización original si hay error
    }
  }

  async generateQuotationSummary(quotation: AIQuotation): Promise<string> {
    try {
      const prompt = `
Genera un resumen ejecutivo de la siguiente cotización:

${JSON.stringify(quotation)}

El resumen debe:
- Destacar los beneficios principales
- Ser conciso (máximo 100 palabras)
- Enfocarse en el valor para el cliente
- Incluir un call-to-action

Responde solo con el texto del resumen.`

      return await aiService.generateText(prompt, {
        maxTokens: 200,
        temperature: 0.6,
        systemPrompt: this.systemPrompt
      })
    } catch (error) {
      console.error('Error generating quotation summary:', error)
      return `Cotización por $${quotation.total} que incluye ${quotation.products.length} productos/servicios. Válida hasta ${quotation.validUntil}.`
    }
  }
}

export const quotationAIService = new QuotationAIService()
