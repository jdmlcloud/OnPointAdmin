import { NextRequest, NextResponse } from 'next/server';
import DynamoDBUserRepository from '@/lib/db/repositories/dynamodb-user-repository';

const userRepository = DynamoDBUserRepository.getInstance();

// GET /api/dynamodb/users/[id] - Obtener usuario por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await userRepository.findById(id);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado',
          message: `No se encontró usuario con ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
      source: 'DynamoDB (Simulado)',
    });
  } catch (error) {
    console.error('Error al obtener usuario DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener usuario',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

// PUT /api/dynamodb/users/[id] - Actualizar usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();

    const updatedUser = await userRepository.update(id, body);

    if (!updatedUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado',
          message: `No se encontró usuario con ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updatedUser,
      message: 'Usuario actualizado exitosamente',
      source: 'DynamoDB (Simulado)',
    });
  } catch (error) {
    console.error('Error al actualizar usuario DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al actualizar usuario',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

// DELETE /api/dynamodb/users/[id] - Eliminar usuario
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const deleted = await userRepository.delete(id);

    if (!deleted) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario no encontrado',
          message: `No se encontró usuario con ID: ${id}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Usuario eliminado exitosamente',
      source: 'DynamoDB (Simulado)',
    });
  } catch (error) {
    console.error('Error al eliminar usuario DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al eliminar usuario',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
