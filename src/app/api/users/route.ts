import { NextRequest, NextResponse } from 'next/server'

// Mock data para desarrollo local
const mockUsers = [
  {
    id: '1',
    email: 'admin@onpoint.com',
    firstName: 'Admin',
    lastName: 'Sistema',
    name: 'Admin Sistema',
    phone: '+52 55 1234 5678',
    role: 'SUPER_ADMIN',
    department: 'IT',
    position: 'Administrador del Sistema',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    lastLogin: '2024-01-15T10:30:00Z',
    createdBy: 'system',
    avatar: '/avatars/admin.png'
  },
  {
    id: '2',
    email: 'ejecutivo@onpoint.com',
    firstName: 'Juan',
    lastName: 'Pérez',
    name: 'Juan Pérez',
    phone: '+52 55 8765 4321',
    role: 'EXECUTIVE',
    department: 'Ventas',
    position: 'Ejecutivo de Ventas',
    status: 'active',
    createdAt: '2024-01-02T00:00:00Z',
    updatedAt: '2024-01-02T00:00:00Z',
    lastLogin: '2024-01-15T09:15:00Z',
    createdBy: '1',
    avatar: '/avatars/juan.png'
  }
]

// GET /api/users - Obtener todos los usuarios
export async function GET(request: NextRequest) {
  try {
    console.log('🔍 GET /api/users - Obteniendo usuarios')
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 500))
    
    return NextResponse.json({
      success: true,
      users: mockUsers,
      pagination: {
        page: 1,
        limit: 10,
        total: mockUsers.length,
        totalPages: 1
      },
      message: 'Usuarios obtenidos exitosamente'
    })
  } catch (error) {
    console.error('Error getting users:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error obteniendo usuarios',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}

// POST /api/users - Crear nuevo usuario
export async function POST(request: NextRequest) {
  try {
    console.log('➕ POST /api/users - Creando usuario')
    
    const body = await request.json()
    const { email, firstName, lastName, phone, role, department, position } = body
    
    // Validar datos requeridos
    if (!email || !firstName || !lastName) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Email, nombre y apellido son requeridos'
        },
        { status: 400 }
      )
    }
    
    // Simular delay de red
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const newUser = {
      id: (mockUsers.length + 1).toString(),
      email,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      phone: phone || '',
      role: role || 'EXECUTIVE',
      department: department || '',
      position: position || '',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastLogin: null,
      createdBy: '1', // Admin por defecto
      avatar: '/avatars/default.png'
    }
    
    mockUsers.push(newUser)
    
    return NextResponse.json({
      success: true,
      user: newUser,
      message: 'Usuario creado exitosamente'
    })
  } catch (error) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { 
        success: false,
        error: 'Error creando usuario',
        details: error instanceof Error ? error.message : 'Error desconocido'
      },
      { status: 500 }
    )
  }
}
