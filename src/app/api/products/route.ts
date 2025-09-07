import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBProductRepository } from '@/lib/db/repositories/dynamodb-product-repository'

const productRepository = new DynamoDBProductRepository()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const providerId = searchParams.get('providerId')

    let products
    
    if (category) {
      products = await productRepository.findByCategory(category)
    } else if (providerId) {
      products = await productRepository.findByProvider(providerId)
    } else {
      const result = await productRepository.findAll({ page, limit })
      products = result.items
    }
    
    return NextResponse.json({
      success: true,
      products,
      message: 'Productos obtenidos exitosamente desde DynamoDB'
    })
  } catch (error) {
    console.error('❌ Error obteniendo productos:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al obtener productos',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, price, category, sku, stock, status, images, specifications, providerId } = body

    if (!name || !description || !price || !category || !sku) {
      return NextResponse.json({
        success: false,
        error: 'Faltan campos requeridos',
        message: 'name, description, price, category y sku son obligatorios'
      }, { status: 400 })
    }

    // Verificar si el SKU ya existe
    const existingProduct = await productRepository.findBySku(sku)
    if (existingProduct) {
      return NextResponse.json({
        success: false,
        error: 'SKU ya existe',
        message: 'Ya existe un producto con este SKU'
      }, { status: 409 })
    }

    const newProduct = await productRepository.create({
      name,
      description,
      price: parseFloat(price),
      category,
      sku,
      stock: parseInt(stock) || 0,
      status: status || 'active',
      images: images || [],
      specifications: specifications || {},
      providerId
    })

    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Producto creado exitosamente'
    }, { status: 201 })
  } catch (error) {
    console.error('❌ Error creando producto:', error)
    return NextResponse.json({
      success: false,
      error: 'Error al crear producto',
      message: error instanceof Error ? error.message : 'Error desconocido'
    }, { status: 500 })
  }
}
