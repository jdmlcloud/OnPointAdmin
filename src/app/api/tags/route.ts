import { NextResponse } from 'next/server'

import { DynamoDBProviderRepository } from '@/lib/db/repositories/dynamodb-provider-repository'

const providerRepository = new DynamoDBProviderRepository()

export async function GET() {
  try {
    // Obtener todos los proveedores directamente del repositorio
    const result = await providerRepository.findAll()
    const providers = result.items || []
    
    // Extraer todas las etiquetas únicas
    const allTags = new Set<string>()
    
    providers.forEach((provider: any) => {
      if (provider.tags && Array.isArray(provider.tags)) {
        provider.tags.forEach((tag: string) => {
          if (tag && typeof tag === 'string' && tag.trim()) {
            // Normalizar etiquetas (sin tildes, minúsculas)
            const normalizedTag = tag.trim().toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
            allTags.add(normalizedTag)
          }
        })
      }
    })
    
    // Convertir a array y ordenar alfabéticamente
    const uniqueTags = Array.from(allTags).sort()
    
    return NextResponse.json({
      success: true,
      tags: uniqueTags
    })

  } catch (error) {
    console.error('Error getting tags:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener etiquetas',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
