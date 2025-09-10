import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'

// Simulación de base de datos de usuarios
const users = new Map()

export async function POST(request: NextRequest) {
  try {
    const { userId, twoFACode } = await request.json()
    
    if (!userId || !twoFACode) {
      return NextResponse.json(
        { success: false, message: 'ID de usuario y código 2FA son requeridos' },
        { status: 400 }
      )
    }
    
    // Buscar usuario
    const user = users.get(userId)
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Usuario no encontrado' },
        { status: 404 }
      )
    }
    
    // Verificar estado
    if (user.status !== 'pending_2fa') {
      return NextResponse.json(
        { success: false, message: 'Usuario ya verificado' },
        { status: 400 }
      )
    }
    
    // Verificar expiración del código
    if (new Date() > new Date(user.twoFAExpiresAt)) {
      return NextResponse.json(
        { success: false, message: 'Código 2FA expirado' },
        { status: 400 }
      )
    }
    
    // Verificar código
    if (user.twoFACode !== twoFACode) {
      return NextResponse.json(
        { success: false, message: 'Código 2FA incorrecto' },
        { status: 400 }
      )
    }
    
    // Activar usuario
    user.status = 'active'
    user.updatedAt = new Date().toISOString()
    delete user.twoFACode
    delete user.twoFAExpiresAt
    
    users.set(userId, user)
    
    // Generar JWT
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '24h' }
    )
    
    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user
    
    return NextResponse.json({
      success: true,
      message: 'Verificación 2FA exitosa',
      data: {
        user: userWithoutPassword,
        token
      }
    })
    
  } catch (error) {
    console.error('❌ Error verificando 2FA:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
