import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime'
import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import { envDev } from '@/config/env-dev'

// Tipos para la abstracción de IA
export interface AIProvider {
  name: string
  generateText(prompt: string, options?: AIGenerateOptions): Promise<string>
  generateImage(prompt: string, options?: AIImageOptions): Promise<string>
  isAvailable(): Promise<boolean>
}

export interface AIGenerateOptions {
  maxTokens?: number
  temperature?: number
  model?: string
  systemPrompt?: string
}

export interface AIImageOptions {
  size?: '256x256' | '512x512' | '1024x1024'
  quality?: 'standard' | 'hd'
  style?: 'vivid' | 'natural'
}

// Configuración de modelos
export const AI_MODELS = {
  AWS: {
    text: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
    image: 'stability.stable-diffusion-xl-v1',
  },
  OPENAI: {
    text: 'gpt-4o',
    image: 'dall-e-3',
  },
  ANTHROPIC: {
    text: 'claude-3-5-sonnet-20241022',
  }
} as const

// Cliente AWS Bedrock
const bedrockClient = new BedrockRuntimeClient({
  region: envDev.AWS_REGION,
  credentials: {
    accessKeyId: envDev.AWS_ACCESS_KEY_ID,
    secretAccessKey: envDev.AWS_SECRET_ACCESS_KEY,
  },
})

// Cliente OpenAI
const openaiClient = new OpenAI({
  apiKey: envDev.OPENAI_API_KEY,
})

// Cliente Anthropic
const anthropicClient = new Anthropic({
  apiKey: envDev.ANTHROPIC_API_KEY,
})

// Implementación AWS Bedrock
export class AWSBedrockProvider implements AIProvider {
  name = 'AWS Bedrock'

  async generateText(prompt: string, options: AIGenerateOptions = {}): Promise<string> {
    try {
      const systemPrompt = options.systemPrompt || 'Eres un asistente de IA especializado en ventas B2B y generación de contenido comercial.'
      
      const input = {
        modelId: options.model || AI_MODELS.AWS.text,
        contentType: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: options.maxTokens || 4000,
          temperature: options.temperature || 0.7,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      }

      const command = new InvokeModelCommand(input)
      const response = await bedrockClient.send(command)
      
      const responseBody = JSON.parse(new TextDecoder().decode(response.body))
      return responseBody.content[0].text
    } catch (error) {
      console.error('AWS Bedrock error:', error)
      throw new Error('Error generando texto con AWS Bedrock')
    }
  }

  async generateImage(prompt: string, options: AIImageOptions = {}): Promise<string> {
    try {
      const input = {
        modelId: AI_MODELS.AWS.image,
        contentType: 'application/json',
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt
            }
          ],
          cfg_scale: 10,
          seed: 0,
          steps: 50,
          width: options.size === '1024x1024' ? 1024 : options.size === '512x512' ? 512 : 256,
          height: options.size === '1024x1024' ? 1024 : options.size === '512x512' ? 512 : 256,
        })
      }

      const command = new InvokeModelCommand(input)
      const response = await bedrockClient.send(command)
      
      const responseBody = JSON.parse(new TextDecoder().decode(response.body))
      return responseBody.artifacts[0].base64
    } catch (error) {
      console.error('AWS Bedrock image error:', error)
      throw new Error('Error generando imagen con AWS Bedrock')
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      // Test simple para verificar disponibilidad
      await this.generateText('Test', { maxTokens: 10 })
      return true
    } catch {
      return false
    }
  }
}

// Implementación OpenAI
export class OpenAIProvider implements AIProvider {
  name = 'OpenAI'

  async generateText(prompt: string, options: AIGenerateOptions = {}): Promise<string> {
    try {
      const response = await openaiClient.chat.completions.create({
        model: options.model || AI_MODELS.OPENAI.text,
        messages: [
          ...(options.systemPrompt ? [{ role: 'system' as const, content: options.systemPrompt }] : []),
          { role: 'user', content: prompt }
        ],
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
      })

      return response.choices[0]?.message?.content || ''
    } catch (error) {
      console.error('OpenAI error:', error)
      throw new Error('Error generando texto con OpenAI')
    }
  }

  async generateImage(prompt: string, options: AIImageOptions = {}): Promise<string> {
    try {
      const response = await openaiClient.images.generate({
        model: AI_MODELS.OPENAI.image,
        prompt,
        size: options.size || '1024x1024',
        quality: options.quality || 'standard',
        style: options.style || 'vivid',
        n: 1,
      })

      return response.data[0]?.url || ''
    } catch (error) {
      console.error('OpenAI image error:', error)
      throw new Error('Error generando imagen con OpenAI')
    }
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.generateText('Test', { maxTokens: 10 })
      return true
    } catch {
      return false
    }
  }
}

// Implementación Anthropic
export class AnthropicProvider implements AIProvider {
  name = 'Anthropic'

  async generateText(prompt: string, options: AIGenerateOptions = {}): Promise<string> {
    try {
      const response = await anthropicClient.messages.create({
        model: options.model || AI_MODELS.ANTHROPIC.text,
        max_tokens: options.maxTokens || 4000,
        temperature: options.temperature || 0.7,
        system: options.systemPrompt || 'Eres un asistente de IA especializado en ventas B2B y generación de contenido comercial.',
        messages: [
          { role: 'user', content: prompt }
        ],
      })

      return response.content[0]?.type === 'text' ? response.content[0].text : ''
    } catch (error) {
      console.error('Anthropic error:', error)
      throw new Error('Error generando texto con Anthropic')
    }
  }

  async generateImage(prompt: string, options: AIImageOptions = {}): Promise<string> {
    throw new Error('Anthropic no soporta generación de imágenes')
  }

  async isAvailable(): Promise<boolean> {
    try {
      await this.generateText('Test', { maxTokens: 10 })
      return true
    } catch {
      return false
    }
  }
}

// Servicio principal de IA con fallback
export class AIService {
  private providers: AIProvider[]
  private currentProvider: AIProvider | null = null

  constructor() {
    this.providers = [
      new AWSBedrockProvider(), // Prioridad 1: AWS
      new OpenAIProvider(),     // Prioridad 2: OpenAI
      new AnthropicProvider(),  // Prioridad 3: Anthropic
    ]
  }

  // Inicializar el servicio y encontrar el mejor proveedor disponible
  async initialize(): Promise<void> {
    for (const provider of this.providers) {
      try {
        const isAvailable = await provider.isAvailable()
        if (isAvailable) {
          this.currentProvider = provider
          console.log(`✅ AI Service initialized with: ${provider.name}`)
          return
        }
      } catch (error) {
        console.warn(`⚠️ Provider ${provider.name} not available:`, error)
      }
    }
    
    throw new Error('No AI providers available')
  }

  // Generar texto con fallback automático
  async generateText(prompt: string, options: AIGenerateOptions = {}): Promise<string> {
    if (!this.currentProvider) {
      await this.initialize()
    }

    // Intentar con el proveedor actual
    try {
      return await this.currentProvider!.generateText(prompt, options)
    } catch (error) {
      console.warn(`Error with ${this.currentProvider!.name}, trying fallback...`)
      
      // Buscar un proveedor alternativo
      for (const provider of this.providers) {
        if (provider === this.currentProvider) continue
        
        try {
          const isAvailable = await provider.isAvailable()
          if (isAvailable) {
            this.currentProvider = provider
            console.log(`🔄 Switched to fallback provider: ${provider.name}`)
            return await provider.generateText(prompt, options)
          }
        } catch (fallbackError) {
          console.warn(`Fallback provider ${provider.name} also failed:`, fallbackError)
        }
      }
      
      throw new Error('All AI providers failed')
    }
  }

  // Generar imagen con fallback automático
  async generateImage(prompt: string, options: AIImageOptions = {}): Promise<string> {
    if (!this.currentProvider) {
      await this.initialize()
    }

    // Intentar con el proveedor actual
    try {
      return await this.currentProvider!.generateImage(prompt, options)
    } catch (error) {
      console.warn(`Error with ${this.currentProvider!.name}, trying fallback...`)
      
      // Buscar un proveedor alternativo que soporte imágenes
      for (const provider of this.providers) {
        if (provider === this.currentProvider) continue
        
        try {
          const isAvailable = await provider.isAvailable()
          if (isAvailable) {
            this.currentProvider = provider
            console.log(`🔄 Switched to fallback provider: ${provider.name}`)
            return await provider.generateImage(prompt, options)
          }
        } catch (fallbackError) {
          console.warn(`Fallback provider ${provider.name} also failed:`, fallbackError)
        }
      }
      
      throw new Error('All AI providers failed')
    }
  }

  // Obtener el proveedor actual
  getCurrentProvider(): string {
    return this.currentProvider?.name || 'None'
  }

  // Forzar cambio de proveedor
  async switchProvider(providerName: string): Promise<boolean> {
    const provider = this.providers.find(p => p.name === providerName)
    if (!provider) return false

    try {
      const isAvailable = await provider.isAvailable()
      if (isAvailable) {
        this.currentProvider = provider
        console.log(`🔄 Manually switched to: ${provider.name}`)
        return true
      }
    } catch (error) {
      console.error(`Failed to switch to ${providerName}:`, error)
    }
    
    return false
  }
}

// Instancia singleton del servicio de IA
export const aiService = new AIService()
