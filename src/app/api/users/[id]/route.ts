import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptionsDev } from '@/lib/auth-dev'
import { UserRepository } from '@/lib/db/repositories/user.repository'
import { UpdateUser } from '@/lib/db/models'
import { z } from 'zod'

const userRepository = new UserRepository()

// GET /api/users/[id] - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos (admin puede ver todos, otros solo su propio perfil)
    if (session.user.role !== 'admin' && session.user.id !== params.id) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    const user = await userRepository.getById(params.id)
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error al obtener usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/users/[id] - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Verificar permisos (admin puede editar todos, otros solo su propio perfil)
    if (session.user.role !== 'admin' && session.user.id !== params.id) {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

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
      const existingUser = await userRepository.getByEmail(validatedData.email)
      if (existingUser && existingUser.id !== params.id) {
        return NextResponse.json(
          { error: 'El email ya está registrado' },
          { status: 400 }
        )
      }
    }

    // Solo admin puede cambiar roles
    if (validatedData.role && session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Sin permisos para cambiar roles' },
        { status: 403 }
      )
    }

    const updatedUser = await userRepository.update(params.id, validatedData)
    
    if (!updatedUser) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    return NextResponse.json(updatedUser)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Datos inválidos', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error al actualizar usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/users/[id] - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptionsDev)
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    // Solo admin puede eliminar usuarios
    if (session.user.role !== 'admin') {
      return NextResponse.json({ error: 'Sin permisos' }, { status: 403 })
    }

    // No permitir auto-eliminación
    if (session.user.id === params.id) {
      return NextResponse.json(
        { error: 'No puedes eliminar tu propia cuenta' },
        { status: 400 }
      )
    }

    const user = await userRepository.getById(params.id)
    
    if (!user) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })
    }

    await userRepository.delete(params.id)

    return NextResponse.json({ message: 'Usuario eliminado exitosamente' })
  } catch (error) {
    console.error('Error al eliminar usuario:', error)
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
