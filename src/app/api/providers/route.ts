import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptionsDev } from '@/lib/auth-dev'
import DynamoDBProviderRepositoryHybrid from '@/lib/db/repositories/dynamodb-provider-repository-hybrid'
import { z } from 'zod'

const providerRepository = DynamoDBProviderRepositoryHybrid.getInstance()

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

    // Obtener todos los proveedores usando el repositorio híbrido
    const providers = await providerRepository.listAll()

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
      source: `DynamoDB (${providerRepository.getMode() === 'real' ? 'Real' : 'Simulado'})`,
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
    
    // Validar datos básicos
    const { name, email, company, phone, address, status = 'pending' } = body

    if (!name || !email || !company) {
      return NextResponse.json(
        { error: 'Nombre, email y empresa son requeridos' },
        { status: 400 }
      )
    }

    const newProvider = await providerRepository.create({
      name,
      email,
      company,
      phone: phone || '',
      address: address || '',
      status,
    })

    return NextResponse.json({
      ...newProvider,
      source: `DynamoDB (${providerRepository.getMode() === 'real' ? 'Real' : 'Simulado'})`,
    }, { status: 201 })
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
