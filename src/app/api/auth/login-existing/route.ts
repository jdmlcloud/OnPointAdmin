import { NextRequest, NextResponse } from 'next/server'

// Función para llamar a la Lambda de AWS
const callLambdaFunction = async (path: string, body: any) => {
  const lambdaUrl = process.env.NODE_ENV === 'production' 
    ? 'https://your-api-gateway-url.amazonaws.com/prod'
    : 'https://your-api-gateway-url.amazonaws.com/sandbox'
  
  try {
    const response = await fetch(`${lambdaUrl}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
    
    return await response.json()
  } catch (error) {
    console.error('❌ Error llamando Lambda:', error)
    throw error
  }
}

// Función para autenticación con sistema existente
const authenticateExistingUser = async (email: string, password: string) => {
  // Usuarios existentes del sistema (compatible con tu estructura actual)
  const existingUsers = [
    { 
      email: 'admin@onpoint.com', 
      password: 'admin123', 
      role: 'SUPER_ADMIN',
      id: 'user-1757550405081-7f5d3699',
      firstName: 'Super',
      lastName: 'Admin',
      name: 'Super Admin',
      phone: '+1234567890',
      department: 'IT',
      position: 'System Administrator',
      status: 'active',
      createdAt: '2025-09-11T00:16:45.081Z',
      updatedAt: '2025-09-11T00:16:45.081Z',
      createdBy: 'system'
    },
    { 
      email: 'ejecutivo@onpoint.com', 
      password: 'password', 
      role: 'EXECUTIVE',
      id: 'user-ejecutivo-001',
      firstName: 'Ejecutivo',
      lastName: 'User',
      name: 'Ejecutivo User',
      phone: '+525512345679',
      department: 'Ventas',
      position: 'Ejecutivo de Ventas',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system'
    },
    { 
      email: 'superadmin@onpoint.com', 
      password: 'password', 
      role: 'SUPERADMIN',
      id: 'user-superadmin-001',
      firstName: 'Super',
      lastName: 'Admin',
      name: 'Super Admin',
      phone: '+525512345680',
      department: 'IT',
      position: 'Super Administrador',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system'
    }
  ]

  const user = existingUsers.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return null
  }

  // Generar token JWT simple (en producción usar jwt.sign)
  const token = `jwt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  return {
    user: {
      id: user.id,
      email: user.email,
      role: user.role,
      firstName: user.firstName,
      lastName: user.lastName,
      name: user.name,
      phone: user.phone,
      department: user.department,
      position: user.position,
      status: user.status,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      createdBy: user.createdBy
    },
    token,
    sessionId: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()
    
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }
    
    // En desarrollo, usar autenticación local
    if (process.env.NODE_ENV === 'development') {
      const result = await authenticateExistingUser(email, password)
      
      if (!result) {
        return NextResponse.json(
          { success: false, message: 'Credenciales inválidas' },
          { status: 401 }
        )
      }
      
      return NextResponse.json({
        success: true,
        message: 'Login exitoso (modo desarrollo)',
        data: result
      })
    }
    
    // En producción/sandbox, usar Lambda
    const result = await callLambdaFunction('/auth/login', { email, password })
    
    return NextResponse.json(result)
    
  } catch (error) {
    console.error('❌ Error en login:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
