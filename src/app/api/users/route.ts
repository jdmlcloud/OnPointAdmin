import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptionsDev } from '@/lib/auth-dev'
import DynamoDBUserRepositoryProduction from '@/lib/db/repositories/dynamodb-user-repository-production'
import { z } from 'zod'

const userRepository = DynamoDBUserRepositoryProduction.getInstance()

// GET /api/users - Listar usuarios
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos de administrador
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const role = searchParams.get('role')
    const status = searchParams.get('status')

    // Obtener todos los usuarios usando el repositorio híbrido
    const users = await userRepository.listAll()

    // Paginación manual
    const startIndex = (page - 1) * limit
    const endIndex = startIndex + limit
    const paginatedUsers = users.slice(startIndex, endIndex)

    return NextResponse.json({
      users: paginatedUsers,
      pagination: {
        page,
        limit,
        total: users.length,
        totalPages: Math.ceil(users.length / limit),
      },
      source: `DynamoDB (${userRepository.getMode() === 'real' ? 'Real' : 'Simulado'})`,
    })
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// POST /api/users - Crear usuario
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos de administrador
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const body = await request.json()
    
    // Validar datos básicos
    const { name, email, role = 'user', status = 'active' } = body

    if (!name || !email) {
      return NextResponse.json(
        { error: 'Nombre y email son requeridos' },
        { status: 400 }
      )
    }

    // Verificar si el email ya existe
    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      return NextResponse.json(
        { error: 'El email ya está registrado' },
        { status: 400 }
      )
    }

    const newUser = await userRepository.create({
      name,
      email,
      role,
      status,
    })

    return NextResponse.json({
      ...newUser,
      source: `DynamoDB (${userRepository.getMode() === 'real' ? 'Real' : 'Simulado'})`,
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al crear usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
