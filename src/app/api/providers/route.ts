import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBProviderRepository } from '@/lib/db/repositories/dynamodb-provider-repository'

const providerRepository = new DynamoDBProviderRepository()

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Debug: Iniciando GET /api/providers...')
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    console.log('🔍 Parámetros:', { page, limit, status })

    let providers
    
    if (status) {
      console.log('🔍 Buscando por status:', status)
      providers = await providerRepository.findByStatus(status as any)
    } else {
      console.log('🔍 Obteniendo todos los providers...')
      const result = await providerRepository.findAll({ page, limit })
      providers = result.items
      console.log('🔍 Resultado findAll:', { itemsCount: providers.length, result })
    }
    
    console.log('🔍 Providers obtenidos:', providers.length)
    
    return NextResponse.json({
      success: true,
      providers,
      message: 'Proveedores obtenidos exitosamente desde DynamoDB'
    })
  } catch (error) {
    console.error('❌ Error obteniendo proveedores:', error)
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({
      success: false,
      error: 'Error al obtener proveedores',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { 
      name, 
      email, 
      company, 
      phone, 
      description,
      website,
      address, 
      contacts,
      status, 
      logo,
      notes,
      tags
    } = body

    if (!name || !email || !company || !phone) {
      return NextResponse.json({
        success: false,
        error: 'Faltan campos requeridos',
        message: 'name, email, company y phone son obligatorios'
      }, { status: 400 })
    }

    // Verificar si el email ya existe
    const existingProvider = await providerRepository.findByEmail(email)
    if (existingProvider) {
      return NextResponse.json({
        success: false,
        error: 'Email ya existe',
        message: 'Ya existe un proveedor con este email'
      }, { status: 409 })
    }

    const newProvider = await providerRepository.create({
      name,
      email,
      company,
      phone,
      description,
      website,
      address: address || {},
      contacts: contacts || [],
      status: status || 'active',
      logo,
      notes,
      tags: tags || []
    })

    return NextResponse.json({
      success: true,
      provider: newProvider,
      message: 'Proveedor creado exitosamente'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creando proveedor:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al crear proveedor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}