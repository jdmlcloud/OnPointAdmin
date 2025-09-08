import { NextRequest, NextResponse } from 'next/server'

// Datos de prueba para desarrollo local
const testUsers = [
  {
    id: 'user-super-admin',
    email: 'superadmin@onpoint.com',
    password: 'cGFzc3dvcmQ=', // base64 de 'password'
    firstName: 'Super',
    lastName: 'Administrador',
    phone: '+525512345678',
    role: 'SUPER_ADMIN',
    department: 'Tecnología',
    position: 'Super Administrador',
    status: 'active',
    createdAt: '2024-12-19T00:00:00.000Z',
    updatedAt: '2024-12-19T00:00:00.000Z',
    createdBy: 'system'
  },
  {
    id: 'user-admin',
    email: 'admin@onpoint.com',
    password: 'cGFzc3dvcmQ=', // base64 de 'password'
    firstName: 'Admin',
    lastName: 'Usuario',
    phone: '+525512345679',
    role: 'ADMIN',
    department: 'Administración',
    position: 'Administrador',
    status: 'active',
    createdAt: '2024-12-19T00:00:00.000Z',
    updatedAt: '2024-12-19T00:00:00.000Z',
    createdBy: 'system'
  },
  {
    id: 'user-executive',
    email: 'ejecutivo@onpoint.com',
    password: 'cGFzc3dvcmQ=', // base64 de 'password'
    firstName: 'Ejecutivo',
    lastName: 'Usuario',
    phone: '+525512345680',
    role: 'EXECUTIVE',
    department: 'Ventas',
    position: 'Ejecutivo',
    status: 'active',
    createdAt: '2024-12-19T00:00:00.000Z',
    updatedAt: '2024-12-19T00:00:00.000Z',
    createdBy: 'system'
  }
]

// Funciones simplificadas para desarrollo local
const simpleVerify = (password: string, hash: string): boolean => {
  // Verificación simple para desarrollo - NO usar en producción
  return Buffer.from(password).toString('base64') === hash
}

const simpleJWT = (payload: any): string => {
  // JWT simple para desarrollo - NO usar en producción
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64')
  const payloadEncoded = Buffer.from(JSON.stringify(payload)).toString('base64')
  const signature = Buffer.from('dev-signature').toString('base64')
  return `${header}.${payloadEncoded}.${signature}`
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('🔐 Login attempt:', { email })

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email y contraseña son requeridos' },
        { status: 400 }
      )
    }

    // Buscar usuario por email
    const user = testUsers.find(u => u.email === email)
    
    if (!user) {
      console.log('❌ Usuario no encontrado:', email)
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar contraseña
    const isValidPassword = simpleVerify(password, user.password)
    
    if (!isValidPassword) {
      console.log('❌ Contraseña incorrecta para:', email)
      return NextResponse.json(
        { success: false, message: 'Credenciales inválidas' },
        { status: 401 }
      )
    }

    // Verificar que el usuario esté activo
    if (user.status !== 'active') {
      console.log('❌ Usuario inactivo:', email)
      return NextResponse.json(
        { success: false, message: 'Usuario inactivo' },
        { status: 401 }
      )
    }

    // Generar JWT token
    const token = simpleJWT({
      userId: user.id, 
      email: user.email, 
      role: user.role,
      environment: 'local',
      exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
    })

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user

    console.log('✅ Login exitoso para:', email)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login exitoso'
    })

  } catch (error) {
    console.error('❌ Login Error:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}