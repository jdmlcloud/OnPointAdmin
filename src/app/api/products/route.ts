import { NextRequest, NextResponse } from 'next/server'

// Mock data para productos
const mockProducts = [
  {
    id: '1',
    providerId: '1',
    name: 'Laptop Dell Inspiron 15',
    description: 'Laptop para oficina con procesador Intel i5',
    category: 'Electrónicos',
    variants: [
      {
        id: '1-1',
        name: '8GB RAM, 256GB SSD',
        price: 15000,
        stock: 10,
        color: 'Negro',
        size: '15 pulgadas'
      },
      {
        id: '1-2',
        name: '16GB RAM, 512GB SSD',
        price: 18000,
        stock: 5,
        color: 'Negro',
        size: '15 pulgadas'
      }
    ],
    pricing: [
      { minQuantity: 1, maxQuantity: 4, price: 15000, discount: 0 },
      { minQuantity: 5, maxQuantity: 9, price: 14250, discount: 5 },
      { minQuantity: 10, maxQuantity: 99, price: 13500, discount: 10 }
    ],
    stock: {
      total: 15,
      available: 15,
      reserved: 0,
      lowStock: false
    },
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    providerId: '2',
    name: 'Silla de Oficina Ergonómica',
    description: 'Silla ergonómica con soporte lumbar',
    category: 'Muebles',
    variants: [
      {
        id: '2-1',
        name: 'Modelo Básico',
        price: 2500,
        stock: 20,
        color: 'Negro',
        size: 'Estándar'
      },
      {
        id: '2-2',
        name: 'Modelo Premium',
        price: 3500,
        stock: 15,
        color: 'Gris',
        size: 'Estándar'
      }
    ],
    pricing: [
      { minQuantity: 1, maxQuantity: 4, price: 2500, discount: 0 },
      { minQuantity: 5, maxQuantity: 9, price: 2375, discount: 5 },
      { minQuantity: 10, maxQuantity: 99, price: 2250, discount: 10 }
    ],
    stock: {
      total: 35,
      available: 35,
      reserved: 0,
      lowStock: false
    },
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
]

// GET /api/products - Obtener todos los productos
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/products - Obteniendo productos')
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({
      success: true,
      products: mockProducts,
      pagination: {
        page: 1,
        limit: 10,
        total: mockProducts.length,
        totalPages: 1
      },
      message: 'Productos obtenidos exitosamente'
    })
  } catch (error) {
    console.error('Error getting products:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error obteniendo productos',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// POST /api/products - Crear nuevo producto
export async function POST(request: NextRequest) {
  try {
    console.log('➕ POST /api/products - Creando producto')
    
    const body = await request.json()
    const { providerId, name, description, category } = body
    
    // Validar datos requeridos
    if (!providerId || !name || !category) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Provider ID, nombre y categoría son requeridos'
        },
        { status: 400 }
      )
    }
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newProduct = {
      id: (mockProducts.length + 1).toString(),
      providerId,
      name,
      description: description || '',
      category,
      variants: [],
      pricing: [
        { minQuantity: 1, maxQuantity: 99, price: 0, discount: 0 }
      ],
      stock: {
        total: 0,
        available: 0,
        reserved: 0,
        lowStock: false
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockProducts.push(newProduct)
    
    return NextResponse.json({
      success: true,
      product: newProduct,
      message: 'Producto creado exitosamente'
    })
  } catch (error) {
    console.error('Error creating product:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error creando producto',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}