import { NextRequest, NextResponse } from 'next/server'

// Simulación de envío de email (en producción usar SES, SendGrid, etc.)
const sendVerificationEmail = async (email: string, token: string, role: string) => {
  console.log(`📧 Enviando email de verificación a: ${email}`)
  console.log(`🔗 Token: ${token}`)
  console.log(`👤 Rol: ${role}`)
  
  // En producción, aquí se enviaría el email real
  // const emailContent = {
  //   to: email,
  //   subject: 'Verificación de cuenta - OnPoint Admin',
  //   html: `
  //     <h2>Bienvenido a OnPoint Admin</h2>
  //     <p>Tu cuenta ha sido creada con el rol: <strong>${role}</strong></p>
  //     <p>Para completar tu registro, haz clic en el siguiente enlace:</p>
  //     <a href="${process.env.NEXT_PUBLIC_APP_URL}/auth/verify?token=${token}">Verificar cuenta</a>
  //     <p>Este enlace expira en 24 horas.</p>
  //   `
  // }
  
  return { success: true, message: 'Email enviado exitosamente' }
}

export async function POST(request: NextRequest) {
  try {
    const { email, role, createdBy } = await request.json()
    
    if (!email || !role || !createdBy) {
      return NextResponse.json(
        { success: false, message: 'Email, rol y creador son requeridos' },
        { status: 400 }
      )
    }
    
    // Generar token de verificación
    const verificationToken = `verify_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    
    // Simular guardado en base de datos (en producción usar DynamoDB)
    const pendingUser = {
      email,
      role,
      verificationToken,
      createdBy,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 horas
      status: 'pending_verification'
    }
    
    console.log('👤 Usuario pendiente creado:', pendingUser)
    
    // Enviar email de verificación
    await sendVerificationEmail(email, verificationToken, role)
    
    return NextResponse.json({
      success: true,
      message: 'Email de verificación enviado',
      data: {
        email,
        role,
        expiresAt: pendingUser.expiresAt
      }
    })
    
  } catch (error) {
    console.error('❌ Error enviando verificación:', error)
    return NextResponse.json(
      { success: false, message: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
