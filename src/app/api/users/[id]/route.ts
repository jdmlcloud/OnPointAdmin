import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBUserRepository } from '@/lib/db/repositories/dynamodb-user-repository'
import { z } from 'zod'

const userRepository = new DynamoDBUserRepository()

// GET /api/users/[id] - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userRepository.findById(params.id)
    
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'Usuario no encontrado' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user
    })
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

// PUT /api/users/[id] - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    
    // Validar datos de entrada
    const updateSchema = z.object({
      name: z.string().min(1).optional(),
      email: z.string().email().optional(),
      role: z.enum(['admin', 'ejecutivo', 'cliente']).optional(),
      status: z.enum(['active', 'inactive', 'pending']).optional(),
      avatar: z.string().url().optional(),
    })

    const validatedData = updateSchema.parse(body)

    // Si se está actualizando el email, verificar que no exista
    if (validatedData.email) {
      const existingUser = await userRepository.findByEmail(validatedData.email)
      if (existingUser && existingUser.id !== params.id) {
        return NextResponse.json({
          success: false,
          error: 'El email ya está registrado'
        }, { status: 400 })
      }
    }

    const updatedUser = await userRepository.update(params.id, validatedData)
    
    if (!updatedUser) {
      return NextResponse.json({ 
        success: false,
        error: 'Usuario no encontrado' 
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      user: updatedUser
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({
        success: false,
        error: 'Datos inválidos', 
        details: error.errors
      }, { status: 400 })
    }

    console.error('Error al actualizar usuario:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

// DELETE /api/users/[id] - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await userRepository.findById(params.id)
    
    if (!user) {
      return NextResponse.json({ 
        success: false,
        error: 'Usuario no encontrado' 
      }, { status: 404 })
    }

    await userRepository.delete(params.id)

    return NextResponse.json({ 
      success: true,
      message: 'Usuario eliminado exitosamente' 
    })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return NextResponse.json({
      success: false,
      error: 'Error interno del servidor',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
