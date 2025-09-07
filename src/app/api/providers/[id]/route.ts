import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBProviderRepository } from '@/lib/db/repositories/dynamodb-provider-repository'

const providerRepository = new DynamoDBProviderRepository()

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const body = await request.json()

    // Validar que el ID existe
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del proveedor es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el proveedor existe
    const existingProvider = await providerRepository.findById(id)
    if (!existingProvider) {
      return NextResponse.json(
        { success: false, error: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }

    // Preparar datos para actualización
    const updateData = {
      ...existingProvider,
      ...body,
      id, // Asegurar que el ID no cambie
      updatedAt: new Date().toISOString()
    }

    // Actualizar el proveedor
    const updatedProvider = await providerRepository.update(id, updateData)

    return NextResponse.json({
      success: true,
      message: 'Proveedor actualizado exitosamente',
      provider: updatedProvider
    })

  } catch (error) {
    console.error('Error updating provider:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar proveedor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validar que el ID existe
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del proveedor es requerido' },
        { status: 400 }
      )
    }

    // Verificar que el proveedor existe
    const existingProvider = await providerRepository.findById(id)
    if (!existingProvider) {
      return NextResponse.json(
        { success: false, error: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }

    // Eliminar el proveedor
    await providerRepository.delete(id)

    return NextResponse.json({
      success: true,
      message: 'Proveedor eliminado exitosamente'
    })

  } catch (error) {
    console.error('Error deleting provider:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al eliminar proveedor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params

    // Validar que el ID existe
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'ID del proveedor es requerido' },
        { status: 400 }
      )
    }

    // Buscar el proveedor
    const provider = await providerRepository.findById(id)
    if (!provider) {
      return NextResponse.json(
        { success: false, error: 'Proveedor no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      provider
    })

  } catch (error) {
    console.error('Error getting provider:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al obtener proveedor',
        message: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
