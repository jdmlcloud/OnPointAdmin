import { aiService } from '../ai-service'

export interface WhatsAppMessage {
  from: string
  to: string
  content: string
  type: 'text' | 'image' | 'document'
  timestamp: string
}

export interface AIResponse {
  response: string
  intent: 'greeting' | 'inquiry' | 'quotation_request' | 'complaint' | 'other'
  confidence: number
  suggestedActions: string[]
  extractedData?: {
    name?: string
    email?: string
    phone?: string
    company?: string
    productInterest?: string
    budget?: string
  }
}

export class WhatsAppAIService {
  private systemPrompt = `Eres un asistente de IA especializado en ventas B2B para OnPoint Admin. 
Tu trabajo es analizar mensajes de WhatsApp de clientes potenciales y:

1. Identificar la intención del mensaje
2. Extraer información relevante del cliente
3. Generar respuestas profesionales y útiles
4. Sugerir acciones de seguimiento

Contexto de la empresa:
- Somos una plataforma B2B que automatiza procesos de ventas
- Ofrecemos integración con WhatsApp, generación de cotizaciones, propuestas y PDFs
- Nuestros clientes son empresas que buscan automatizar sus ventas

Responde siempre en español y de manera profesional.`

  async analyzeMessage(message: WhatsAppMessage): Promise<AIResponse> {
    try {
      const prompt = `
Analiza el siguiente mensaje de WhatsApp y proporciona una respuesta estructurada:

Mensaje: "${message.content}"
De: ${message.from}
Hora: ${message.timestamp}

Proporciona tu análisis en el siguiente formato JSON:
{
  "response": "Respuesta profesional y útil para el cliente",
  "intent": "greeting|inquiry|quotation_request|complaint|other",
  "confidence": 0.95,
  "suggestedActions": ["Acción 1", "Acción 2", "Acción 3"],
  "extractedData": {
    "name": "Nombre si se menciona",
    "email": "Email si se menciona", 
    "phone": "Teléfono si se menciona",
    "company": "Empresa si se menciona",
    "productInterest": "Producto/servicio de interés",
    "budget": "Presupuesto si se menciona"
  }
}

Solo responde con el JSON, sin texto adicional.`

      const response = await aiService.generateText(prompt, {
        maxTokens: 1000,
        temperature: 0.3,
        systemPrompt: this.systemPrompt
      })

      // Parsear la respuesta JSON
      const parsedResponse = JSON.parse(response)
      
      return {
        response: parsedResponse.response,
        intent: parsedResponse.intent,
        confidence: parsedResponse.confidence,
        suggestedActions: parsedResponse.suggestedActions,
        extractedData: parsedResponse.extractedData
      }
    } catch (error) {
      console.error('Error analyzing WhatsApp message:', error)
      
      // Respuesta de fallback
      return {
        response: "Gracias por contactarnos. Un ejecutivo se pondrá en contacto contigo pronto.",
        intent: 'other',
        confidence: 0.5,
        suggestedActions: ['Contactar manualmente', 'Agendar seguimiento'],
        extractedData: {}
      }
    }
  }

  async generateResponse(message: WhatsAppMessage, context?: any): Promise<string> {
    try {
      const prompt = `
Genera una respuesta profesional para el siguiente mensaje de WhatsApp:

Mensaje original: "${message.content}"
De: ${message.from}

Contexto adicional: ${context ? JSON.stringify(context) : 'Ninguno'}

La respuesta debe ser:
- Profesional y amigable
- Útil y específica
- En español
- Máximo 200 palabras
- Incluir un call-to-action apropiado

Responde solo con el texto de la respuesta, sin formato adicional.`

      return await aiService.generateText(prompt, {
        maxTokens: 300,
        temperature: 0.7,
        systemPrompt: this.systemPrompt
      })
    } catch (error) {
      console.error('Error generating WhatsApp response:', error)
      return "Gracias por contactarnos. Un ejecutivo se pondrá en contacto contigo pronto."
    }
  }

  async generateFollowUpMessage(clientData: any, lastInteraction: string): Promise<string> {
    try {
      const prompt = `
Genera un mensaje de seguimiento para un cliente potencial:

Datos del cliente: ${JSON.stringify(clientData)}
Última interacción: "${lastInteraction}"

El mensaje debe ser:
- Personalizado y relevante
- Profesional pero cercano
- Incluir valor específico
- Máximo 150 palabras
- En español

Responde solo con el texto del mensaje.`

      return await aiService.generateText(prompt, {
        maxTokens: 250,
        temperature: 0.8,
        systemPrompt: this.systemPrompt
      })
    } catch (error) {
      console.error('Error generating follow-up message:', error)
      return "Hola, espero que estés bien. ¿Te gustaría que te ayude con alguna consulta sobre nuestros servicios?"
    }
  }
}

export const whatsappAIService = new WhatsAppAIService()
