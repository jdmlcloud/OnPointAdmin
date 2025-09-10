import { NextRequest, NextResponse } from 'next/server'

// Simulación de base de datos de usuarios pendientes
const pendingUsers = new Map()

// Simulación de verificación de token
const verifyToken = (token: string) => {
  // En producción, verificar token JWT real
  if (!token.startsWith('verify_')) {
    return null
  }
  
  // Simular verificación exitosa
  return {
    email: 'usuario@ejemplo.com',
    role: 'ADMIN',
    createdBy: 'superadmin@onpoint.com',
    createdAt: new Date().toISOString()
  }
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Token requerido' },
        { status: 400 }
      )
    }
    
    // Verificar token
    const userData = verifyToken(token)
    
    if (!userData) {
      return NextResponse.json(
        { success: false, message: 'Token inválido o expirado' },
        { status: 400 }
      )
    }
    
    // Generar token de configuración de contraseña
    const passwordSetupToken = `setup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Guardar token para configuración de contraseña
    pendingUsers.set(passwordSetupToken, {
      ...userData,
      passwordSetupToken,
      expiresAt: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString() // 2 horas
    })
    
    return NextResponse.json({
      success: true,
      message: 'Email verificado exitosamente',
      data: {
        passwordSetupToken,
        user: {
          email: userData.email,
          role: userData.role
        }
      }
    })
    
  } catch (error) {
    console.error('❌ Error verificando email:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
