import { NextRequest, NextResponse } from 'next/server';
import DynamoDBProviderRepositoryProduction from '@/lib/db/repositories/dynamodb-provider-repository-production';

const providerRepository = DynamoDBProviderRepositoryProduction.getInstance();

// GET /api/dynamodb/providers - Obtener todos los proveedores
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let providers;

    if (search) {
      providers = await providerRepository.search(search);
    } else if (status && ['active', 'inactive', 'pending'].includes(status)) {
      providers = await providerRepository.findByStatus(status as 'active' | 'inactive' | 'pending');
    } else {
      providers = await providerRepository.listAll();
    }

    return NextResponse.json({
      success: true,
      data: providers,
      count: providers.length,
      source: 'DynamoDB (Producción - Solo Real)',
    });
  } catch (error) {
    console.error('Error al obtener proveedores DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener proveedores',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

// POST /api/dynamodb/providers - Crear nuevo proveedor
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, email, company, phone, address, status, cognitoId } = body;

    if (!name || !email || !company || !phone || !address) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos requeridos faltantes',
          message: 'Nombre, email, empresa, teléfono y dirección son obligatorios',
        },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existingProvider = await providerRepository.findByEmail(email);
    if (existingProvider) {
      return NextResponse.json(
        {
          success: false,
          error: 'Proveedor ya existe',
          message: 'Ya existe un proveedor con este email',
        },
        { status: 409 }
      );
    }

    const newProvider = await providerRepository.create({
      name,
      email,
      company,
      phone,
      address,
      status: status || 'pending',
      cognitoId,
    });

    return NextResponse.json({
      success: true,
      data: newProvider,
      message: 'Proveedor creado exitosamente',
      source: 'DynamoDB (Producción - Solo Real)',
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear proveedor DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear proveedor',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
