import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptionsDev } from '@/lib/auth-dev'
import { ProviderRepository } from '@/lib/db/repositories/provider.repository'
import { ProviderSchema, CreateProvider } from '@/lib/db/models'
import { z } from 'zod'

const providerRepository = new ProviderRepository()

// GET /api/providers - Listar proveedores
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    let providers
    if (category) {
      providers = await providerRepository.getByCategory(category)
    } else if (status) {
      providers = await providerRepository.search({ status })
    } else if (search) {
      providers = await providerRepository.searchByName(search)
    } else {
      const result = await providerRepository.listAll(limit * page)
      providers = result.items
    }

    // Paginación manual
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedProviders = providers.slice(startIndex, endIndex)

    return NextResponse.json({
      providers: paginatedProviders,
      pagination: {
        page,
        limit,
        total: providers.length,
        totalPages: Math.ceil(providers.length / limit),
      },
    })
  } catch (error) {
    console.error('Error al obtener proveedores:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/providers - Crear proveedor
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos (admin y ejecutivo pueden crear proveedores)
    if (!['admin', 'ejecutivo'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validar datos de entrada
    const validatedData = ProviderSchema.omit({ 
      id: true, 
      createdAt: true, 
      updatedAt: true,
      PK: true,
      SK: true,
      GSI1PK: true,
      GSI1SK: true
    }).parse(body)

    const newProvider = await providerRepository.createProvider(validatedData)

    return NextResponse.json(newProvider, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al crear proveedor:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
