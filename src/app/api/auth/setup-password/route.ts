import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'

// Simulación de base de datos de usuarios
const users = new Map()

// Simulación de envío de código 2FA
const send2FACode = async (email: string, code: string) => {
  console.log(`📱 Enviando código 2FA a: ${email}`)
  console.log(`🔢 Código: ${code}`)
  
  // En producción, enviar SMS o email con código
  return { success: true }
}

export async function POST(request: NextRequest) {
  try {
    const { passwordSetupToken, password, confirmPassword } = await request.json()
    
    if (!passwordSetupToken || !password || !confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Token, contraseña y confirmación son requeridos' },
        { status: 400 }
      )
    }
    
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Las contraseñas no coinciden' },
        { status: 400 }
      )
    }
    
    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }
    
    // En desarrollo, simular verificación de token
    if (process.env.NODE_ENV === 'development') {
      console.log('🔑 [DEV] Configurando contraseña para token:', passwordSetupToken)
      
      // Simular usuario pendiente
      const userData = {
        email: 'usuario@ejemplo.com',
        role: 'ADMIN',
        firstName: 'Usuario',
        lastName: 'Ejemplo',
        department: 'IT',
        position: 'Administrador',
        createdBy: 'superadmin@onpoint.com',
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
      }
      
      return NextResponse.json({
        success: true,
        message: 'Contraseña configurada exitosamente (modo desarrollo)',
        data: {
          user: userData,
          twoFAToken: `2fa_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        }
      })
    }
    
    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 12)
    
    // Generar código 2FA
    const twoFACode = Math.floor(100000 + Math.random() * 900000).toString()
    
    // Crear usuario final
    const newUser = {
      id: `user_${Date.now()}`,
      email: userData.email,
      password: hashedPassword,
      role: userData.role,
      firstName: userData.email.split('@')[0],
      lastName: '',
      name: userData.email.split('@')[0],
      phone: '',
      department: 'IT',
      position: userData.role === 'ADMIN' ? 'Administrador' : 'Ejecutivo',
      status: 'pending_2fa',
      twoFACode,
      twoFAExpiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutos
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userData.createdBy
    }
    
    // Guardar usuario
    users.set(newUser.id, newUser)
    
    // Limpiar token de configuración
    pendingUsers.delete(passwordSetupToken)
    
    // Enviar código 2FA
    await send2FACode(userData.email, twoFACode)
    
    return NextResponse.json({
      success: true,
      message: 'Contraseña configurada exitosamente. Revisa tu email/SMS para el código de verificación.',
      data: {
        userId: newUser.id,
        email: newUser.email,
        role: newUser.role
      }
    })
    
  } catch (error) {
    console.error('❌ Error configurando contraseña:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
