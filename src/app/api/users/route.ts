import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptionsDev } from '@/lib/auth-dev'
import { z } from 'zod'

// TODO: Implementar repositorio de usuarios cuando se configure DynamoDB

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

    // TODO: Implementar cuando se configure DynamoDB
    return NextResponse.json({
      users: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
      },
      message: 'DynamoDB no configurado - Solo Cognito activo',
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
      source: 'DynamoDB (Producción - Solo Real)',
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
