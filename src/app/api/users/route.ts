import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBUserRepository } from '@/lib/db/repositories/dynamodb-user-repository'

const userRepository = new DynamoDBUserRepository()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')

    const result = await userRepository.findAll({ page, limit })
    
    return NextResponse.json({
      success: true,
      users: result.items,
      pagination: result.pagination,
      message: 'Usuarios obtenidos exitosamente desde DynamoDB'
    })
  } catch (error) {
    console.error('❌ Error obteniendo usuarios:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al obtener usuarios',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, role, status } = body

    if (!name || !email || !role) {
      return NextResponse.json({
        success: false,
        error: 'Faltan campos requeridos',
        message: 'name, email y role son obligatorios'
      }, { status: 400 })
    }

    // Verificar si el email ya existe
    const existingUser = await userRepository.findByEmail(email)
    if (existingUser) {
      return NextResponse.json({
        success: false,
        error: 'Email ya existe',
        message: 'Ya existe un usuario con este email'
      }, { status: 409 })
    }

    const newUser = await userRepository.create({
      name,
      email,
      role: role || 'user',
      status: status || 'active'
    })

    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Usuario creado exitosamente'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creando usuario:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al crear usuario',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}