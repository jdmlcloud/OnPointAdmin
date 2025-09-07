import { NextRequest, NextResponse } from 'next/server';
import { simpleProductRepository } from '@/lib/db/repositories/dynamodb-simple-repository';

export async function GET(request: NextRequest) {
  try {
    console.log('🔧 SimpleDynamoDB Products: Obteniendo productos...');
    
    const products = await simpleProductRepository.listAll();
    
    return NextResponse.json({
      success: true,
      data: products,
      count: products.length,
      source: 'SimpleDynamoDB (Producción)',
      timestamp: new Date().toISOString(),
    });

  } catch (error: any) {
    console.error('❌ Error en SimpleDynamoDB Products:', error);
    return NextResponse.json({
      success: false,
      message: 'Error obteniendo productos SimpleDynamoDB',
      error: error.message,
      source: 'Error en SimpleDynamoDB (Producción)',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔧 SimpleDynamoDB Products: Creando producto...');
    
    const productData = await request.json();
    
    // Agregar ID si no existe
    if (!productData.id) {
      productData.id = `product_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    }
    
    // Agregar timestamps
    productData.createdAt = new Date().toISOString();
    productData.updatedAt = new Date().toISOString();
    
    const product = await simpleProductRepository.create(productData);
    
    return NextResponse.json({
      success: true,
      data: product,
      message: 'Producto creado exitosamente',
      source: 'SimpleDynamoDB (Producción)',
      timestamp: new Date().toISOString(),
    }, { status: 201 });

  } catch (error: any) {
    console.error('❌ Error creando producto SimpleDynamoDB:', error);
    return NextResponse.json({
      success: false,
      message: 'Error creando producto SimpleDynamoDB',
      error: error.message,
      source: 'Error en SimpleDynamoDB (Producción)',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
