import { NextRequest, NextResponse } from 'next/server'

// Mock data para desarrollo local
const mockProviders = [
  {
    id: '1',
    name: 'Proveedor Demo 1',
    description: 'Proveedor de productos electrónicos',
    logo: '/logos/demo1.png',
    website: 'https://demo1.com',
    email: 'contacto@demo1.com',
    phone: '+52 55 1234 5678',
    rating: 4.5,
    isActive: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'Proveedor Demo 2',
    description: 'Proveedor de productos de oficina',
    logo: '/logos/demo2.png',
    website: 'https://demo2.com',
    email: 'contacto@demo2.com',
    phone: '+52 55 8765 4321',
    rating: 4.2,
    isActive: true,
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z'
  }
]

// GET /api/providers - Obtener todos los proveedores
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/providers - Obteniendo proveedores')
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({
      success: true,
      providers: mockProviders,
      pagination: {
        page: 1,
        limit: 10,
        total: mockProviders.length,
        totalPages: 1
      },
      message: 'Proveedores obtenidos exitosamente'
    })
  } catch (error) {
    console.error('Error getting providers:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error obteniendo proveedores',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// POST /api/providers - Crear nuevo proveedor
export async function POST(request: NextRequest) {
  try {
    console.log('➕ POST /api/providers - Creando proveedor')
    
    const body = await request.json()
    const { name, description, email, phone, website } = body
    
    // Validar datos requeridos
    if (!name || !email) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Nombre y email son requeridos'
        },
        { status: 400 }
      )
    }
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newProvider = {
      id: (mockProviders.length + 1).toString(),
      name,
      description: description || '',
      logo: '/logos/default.png',
      website: website || '',
      email,
      phone: phone || '',
      rating: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    mockProviders.push(newProvider)
    
    return NextResponse.json({
      success: true,
      provider: newProvider,
      message: 'Proveedor creado exitosamente'
    })
  } catch (error) {
    console.error('Error creating provider:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error creando proveedor',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
