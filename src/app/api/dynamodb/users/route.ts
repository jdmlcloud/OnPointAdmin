import { NextRequest, NextResponse } from 'next/server';
import DynamoDBUserRepositoryProduction from '@/lib/db/repositories/dynamodb-user-repository-production';

const userRepository = DynamoDBUserRepositoryProduction.getInstance();

// GET /api/dynamodb/users - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const search = searchParams.get('search');

    let users;

    if (search) {
      users = await userRepository.search(search);
    } else if (role && ['admin', 'user', 'provider'].includes(role)) {
      users = await userRepository.findByRole(role as 'admin' | 'user' | 'provider');
    } else {
      users = await userRepository.listAll();
    }

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
      source: 'DynamoDB (Producción - Solo Real)',
    });
  } catch (error) {
    console.error('Error al obtener usuarios DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener usuarios',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

// POST /api/dynamodb/users - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { email, name, role, status, cognitoId } = body;

    if (!email || !name || !role) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos requeridos faltantes',
          message: 'Email, nombre y rol son obligatorios',
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          error: 'Usuario ya existe',
          message: 'Ya existe un usuario con este email',
        },
        { status: 409 }
      );
    }

    const newUser = await userRepository.create({
      email,
      name,
      role,
      status: status || 'active',
      cognitoId,
    });

    return NextResponse.json({
      success: true,
      data: newUser,
      message: 'Usuario creado exitosamente',
      source: 'DynamoDB (Producción - Solo Real)',
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear usuario DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear usuario',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
