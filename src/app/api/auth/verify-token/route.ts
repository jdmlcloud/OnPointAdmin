import { NextRequest, NextResponse } from 'next/server'

// Datos de prueba para desarrollo local (mismo que en login)
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

// Función para verificar JWT simple
const simpleVerifyJWT = (token: string): any => {
  // Verificación simple para desarrollo - NO usar en producción
  try {
    const parts = token.split('.')
    if (parts.length !== 3) throw new Error('Invalid token')
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString())
    
    // Verificar expiración
    if (payload.exp && Date.now() > payload.exp) {
      throw new Error('Token expired')
    }
    
    return payload
  } catch (error) {
    throw new Error('Invalid token')
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Token no proporcionado' },
        { status: 401 }
      )
    }

    const token = authHeader.replace('Bearer ', '')

    console.log('🔍 Verificando token...')

    // Verificar token
    const decoded = simpleVerifyJWT(token)
    
    // Buscar usuario
    const user = testUsers.find(u => u.id === decoded.userId)
    
    if (!user) {
      console.log('❌ Usuario no encontrado para token')
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 401 }
      )
    }

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user

    console.log('✅ Token válido para:', user.email)

    return NextResponse.json({
      success: true,
      user: userWithoutPassword,
      message: 'Token válido'
    })

  } catch (error) {
    console.error('❌ Verify Token Error:', error)
    return NextResponse.json(
      { success: false, message: 'Token inválido' },
      { status: 401 }
    )
  }
}