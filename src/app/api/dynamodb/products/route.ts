import { NextRequest, NextResponse } from 'next/server';
import DynamoDBProductRepositoryHybrid from '@/lib/db/repositories/dynamodb-product-repository-hybrid';

const productRepository = DynamoDBProductRepositoryHybrid.getInstance();

// GET /api/dynamodb/products - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const status = searchParams.get('status');
    const providerId = searchParams.get('providerId');
    const search = searchParams.get('search');
    const minPrice = searchParams.get('minPrice');
    const maxPrice = searchParams.get('maxPrice');

    let products;

    if (search) {
      products = await productRepository.search(search);
    } else if (category) {
      products = await productRepository.findByCategory(category);
    } else if (status && ['active', 'inactive', 'out_of_stock'].includes(status)) {
      products = await productRepository.findByStatus(status as 'active' | 'inactive' | 'out_of_stock');
    } else if (providerId) {
      products = await productRepository.findByProvider(providerId);
    } else if (minPrice && maxPrice) {
      products = await productRepository.findByPriceRange(parseFloat(minPrice), parseFloat(maxPrice));
    } else {
      products = await productRepository.listAll();
    }

    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      source: `DynamoDB (${productRepository.getMode() === 'real' ? 'Real' : 'Simulado'})`,
    });
  } catch (error) {
    console.error('Error al obtener productos DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al obtener productos',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}

// POST /api/dynamodb/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const { name, description, price, category, providerId, status } = body;

    if (!name || !description || !price || !category || !providerId) {
      return NextResponse.json(
        {
          success: false,
          error: 'Datos requeridos faltantes',
          message: 'Nombre, descripción, precio, categoría y proveedor son obligatorios',
        },
        { status: 400 }
      );
    }

    if (typeof price !== 'number' || price <= 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Precio inválido',
          message: 'El precio debe ser un número positivo',
        },
        { status: 400 }
      );
    }

    const newProduct = await productRepository.create({
      name,
      description,
      price,
      category,
      providerId,
      status: status || 'active',
    });

    return NextResponse.json({
      success: true,
      data: newProduct,
      message: 'Producto creado exitosamente',
      source: `DynamoDB (${productRepository.getMode() === 'real' ? 'Real' : 'Simulado'})`,
    }, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto DynamoDB:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Error al crear producto',
        message: error instanceof Error ? error.message : 'Error desconocido',
      },
      { status: 500 }
    );
  }
}
