const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const dynamodb = new AWS.DynamoDB.DocumentClient();
const ses = new AWS.SES({ region: 'us-east-1' });
const sns = new AWS.SNS({ region: 'us-east-1' });

const USERS_TABLE = process.env.USERS_TABLE || 'OnPointAdmin-Users-sandbox';
const VERIFICATION_TOKENS_TABLE = process.env.VERIFICATION_TOKENS_TABLE || 'OnPointAdmin-VerificationTokens-sandbox';
const SESSIONS_TABLE = process.env.SESSIONS_TABLE || 'OnPointAdmin-Sessions-sandbox';
const TWO_FA_CODES_TABLE = process.env.TWO_FA_CODES_TABLE || 'OnPointAdmin-TwoFACodes-sandbox';
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@onpoint.com';

// Helper function para generar tokens
const generateToken = (prefix = 'token') => {
  return `${prefix}_${Date.now()}_${crypto.randomBytes(8).toString('hex')}`;
};

// Helper function para generar códigos 2FA
const generate2FACode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Función para enviar email de verificación
const sendVerificationEmail = async (email, token, userData) => {
  try {
    const verificationUrl = `${process.env.APP_URL}/auth/verify?token=${token}`;
    
    // Plantilla HTML mejorada
    const htmlTemplate = `
      <!DOCTYPE html>
      <html lang="es">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verificación de Email - OnPoint Admin</title>
          <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f4f4f4; }
              .container { background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 0 20px rgba(0,0,0,0.1); }
              .header { text-align: center; margin-bottom: 30px; }
              .logo { font-size: 28px; font-weight: bold; color: #2563eb; margin-bottom: 10px; }
              .title { color: #1f2937; font-size: 24px; margin-bottom: 20px; }
              .content { margin-bottom: 30px; }
              .button { display: inline-block; background-color: #2563eb; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; text-align: center; margin: 20px 0; }
              .button:hover { background-color: #1d4ed8; }
              .info { background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
              .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; }
              .warning { background-color: #fef3c7; border: 1px solid #f59e0b; color: #92400e; padding: 15px; border-radius: 8px; margin: 20px 0; }
          </style>
      </head>
      <body>
          <div class="container">
              <div class="header">
                  <div class="logo">OnPoint Admin</div>
                  <h1 class="title">Verificación de Email</h1>
              </div>
              <div class="content">
                  <p>Hola <strong>${userData.firstName} ${userData.lastName}</strong>,</p>
                  <p>Bienvenido a OnPoint Admin. Para completar tu registro y activar tu cuenta, necesitas verificar tu dirección de email.</p>
                  <div class="info">
                      <p><strong>Detalles de tu cuenta:</strong></p>
                      <ul>
                          <li><strong>Email:</strong> ${email}</li>
                          <li><strong>Rol:</strong> ${userData.role}</li>
                          <li><strong>Departamento:</strong> ${userData.department}</li>
                          <li><strong>Posición:</strong> ${userData.position}</li>
                      </ul>
                  </div>
                  <p>Haz clic en el siguiente botón para verificar tu email:</p>
                  <div style="text-align: center;">
                      <a href="${verificationUrl}" class="button">Verificar Email</a>
                  </div>
                  <div class="warning">
                      <p><strong>⚠️ Importante:</strong></p>
                      <ul>
                          <li>Este enlace expira en 24 horas</li>
                          <li>Si no solicitaste esta cuenta, ignora este email</li>
                          <li>No compartas este enlace con nadie</li>
                      </ul>
                  </div>
                  <p>Si el botón no funciona, copia y pega este enlace en tu navegador:</p>
                  <p style="word-break: break-all; color: #2563eb;">${verificationUrl}</p>
              </div>
              <div class="footer">
                  <p>Este email fue enviado por OnPoint Admin</p>
                  <p>Si tienes preguntas, contacta a tu administrador</p>
                  <p>© 2024 OnPoint Admin. Todos los derechos reservados.</p>
              </div>
          </div>
      </body>
      </html>
    `;
    
    const params = {
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: [email]
      },
      Message: {
        Subject: {
          Data: 'Verificación de Email - OnPoint Admin',
          Charset: 'UTF-8'
        },
        Body: {
          Html: {
            Data: htmlTemplate,
            Charset: 'UTF-8'
          }
        }
      }
    };
    
    await ses.sendEmail(params).promise();
    console.log('✅ Email de verificación enviado a:', email);
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    throw error;
  }
};

// Función para enviar código 2FA por SMS
const send2FASMS = async (phone, code) => {
  try {
    const message = `Tu código de verificación OnPoint Admin es: ${code}. Válido por 10 minutos. No compartas este código.`;
    
    const params = {
      Message: message,
      PhoneNumber: phone
    };
    
    await sns.publish(params).promise();
    console.log('✅ SMS 2FA enviado a:', phone);
  } catch (error) {
    console.error('❌ Error enviando SMS:', error);
    throw error;
  }
};

// Helper function para enviar email
const sendEmail = async (to, subject, htmlContent) => {
  const params = {
    Destination: { ToAddresses: [to] },
    Message: {
      Body: { Html: { Data: htmlContent } },
      Subject: { Data: subject }
    },
    Source: FROM_EMAIL
  };
  
  try {
    await ses.sendEmail(params).promise();
    console.log(`📧 Email enviado a: ${to}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
};

// Helper function para enviar SMS
const sendSMS = async (phoneNumber, message) => {
  const params = {
    Message: message,
    PhoneNumber: phoneNumber
  };
  
  try {
    await sns.publish(params).promise();
    console.log(`📱 SMS enviado a: ${phoneNumber}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error enviando SMS:', error);
    return { success: false, error: error.message };
  }
};

// Función principal
exports.handler = async (event) => {
  console.log('🔐 Auth Handler - Event:', JSON.stringify(event, null, 2));
  
  const { httpMethod, path, body, queryStringParameters } = event;
  const requestBody = body ? JSON.parse(body) : {};
  
  try {
    switch (path) {
      case '/auth/send-verification':
        return await handleSendVerification(requestBody);
      
      case '/auth/verify-email':
        return await handleVerifyEmail(requestBody);
      
      case '/auth/setup-password':
        return await handleSetupPassword(requestBody);
      
      case '/auth/verify-2fa':
        return await handleVerify2FA(requestBody);
      
      case '/auth/login':
        return await handleLogin(requestBody);
      
      case '/auth/logout':
        return await handleLogout(requestBody);
      
      case '/auth/refresh':
        return await handleRefresh(requestBody);
      
      default:
        return {
          statusCode: 404,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
            'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
          },
          body: JSON.stringify({
            success: false,
            message: 'Endpoint no encontrado'
          })
        };
    }
  } catch (error) {
    console.error('❌ Error en auth handler:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: false,
        message: 'Error interno del servidor',
        error: error.message
      })
    };
  }
};

// Enviar verificación por email
async function handleSendVerification(body) {
  const { email, role, firstName, lastName, department, position, createdBy } = body;
  
  if (!email || !role || !createdBy) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Email, rol y creador son requeridos'
      })
    };
  }
  
  // Generar token de verificación
  const verificationToken = generateToken('verify');
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas
  
  // Guardar token en DynamoDB
  await dynamodb.put({
    TableName: VERIFICATION_TOKENS_TABLE,
    Item: {
      token: verificationToken,
      type: 'email_verification',
      email,
      role,
      firstName: firstName || '',
      lastName: lastName || '',
      department: department || '',
      position: position || '',
      createdBy,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt
    }
  }).promise();
  
  // Enviar email de verificación con plantilla mejorada
  try {
    const userData = {
      firstName: firstName || 'Usuario',
      lastName: lastName || '',
      role,
      department: department || '',
      position: position || ''
    };
    
    await sendVerificationEmail(email, verificationToken, userData);
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Error enviando email de verificación'
      })
    };
  }
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      success: true,
      message: 'Email de verificación enviado',
      data: { email, role, expiresAt }
    })
  };
}

// Verificar email
async function handleVerifyEmail(body) {
  const { token } = body;
  
  if (!token) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Token requerido'
      })
    };
  }
  
  // Buscar token en DynamoDB
  const result = await dynamodb.get({
    TableName: VERIFICATION_TOKENS_TABLE,
    Key: { token }
  }).promise();
  
  if (!result.Item || result.Item.type !== 'email_verification') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Token inválido'
      })
    };
  }
  
  // Verificar expiración
  if (new Date() > new Date(result.Item.expiresAt)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Token expirado'
      })
    };
  }
  
  // Generar token para configuración de contraseña
  const passwordSetupToken = generateToken('setup');
  const setupExpiresAt = new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(); // 2 horas
  
  // Guardar token de configuración
  await dynamodb.put({
    TableName: VERIFICATION_TOKENS_TABLE,
    Item: {
      token: passwordSetupToken,
      type: 'password_setup',
      email: result.Item.email,
      role: result.Item.role,
      firstName: result.Item.firstName,
      lastName: result.Item.lastName,
      department: result.Item.department,
      position: result.Item.position,
      createdBy: result.Item.createdBy,
      status: 'pending',
      createdAt: new Date().toISOString(),
      expiresAt: setupExpiresAt
    }
  }).promise();
  
  // Eliminar token de verificación usado
  await dynamodb.delete({
    TableName: VERIFICATION_TOKENS_TABLE,
    Key: { token }
  }).promise();
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      success: true,
      message: 'Email verificado exitosamente',
      data: {
        passwordSetupToken,
        user: {
          email: result.Item.email,
          role: result.Item.role,
          firstName: result.Item.firstName,
          lastName: result.Item.lastName
        }
      }
    })
  };
}

// Configurar contraseña
async function handleSetupPassword(body) {
  const { passwordSetupToken, password, confirmPassword } = body;
  
  if (!passwordSetupToken || !password || !confirmPassword) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Token, contraseña y confirmación son requeridos'
      })
    };
  }
  
  if (password !== confirmPassword) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Las contraseñas no coinciden'
      })
    };
  }
  
  if (password.length < 8) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'La contraseña debe tener al menos 8 caracteres'
      })
    };
  }
  
  // Buscar token de configuración
  const result = await dynamodb.get({
    TableName: VERIFICATION_TOKENS_TABLE,
    Key: { token: passwordSetupToken }
  }).promise();
  
  if (!result.Item || result.Item.type !== 'password_setup') {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Token inválido'
      })
    };
  }
  
  // Verificar expiración
  if (new Date() > new Date(result.Item.expiresAt)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Token expirado'
      })
    };
  }
  
  // Hash de la contraseña
  const hashedPassword = await bcrypt.hash(password, 12);
  
  // Generar código 2FA
  const twoFACode = generate2FACode();
  const twoFAExpiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutos
  
  // Crear usuario con estructura compatible
  const userId = `user-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  const user = {
    id: userId,
    email: result.Item.email,
    password: hashedPassword,
    role: result.Item.role,
    firstName: result.Item.firstName,
    lastName: result.Item.lastName,
    name: `${result.Item.firstName} ${result.Item.lastName}`.trim(),
    phone: result.Item.phone || '',
    department: result.Item.department,
    position: result.Item.position,
    status: 'pending_2fa',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: result.Item.createdBy
  };
  
  // Guardar usuario
  await dynamodb.put({
    TableName: USERS_TABLE,
    Item: user
  }).promise();
  
  // Guardar código 2FA
  await dynamodb.put({
    TableName: TWO_FA_CODES_TABLE,
    Item: {
      userId,
      code: twoFACode,
      email: result.Item.email,
      phone: '',
      createdAt: new Date().toISOString(),
      expiresAt: twoFAExpiresAt
    }
  }).promise();
  
  // Eliminar token de configuración
  await dynamodb.delete({
    TableName: VERIFICATION_TOKENS_TABLE,
    Key: { token: passwordSetupToken }
  }).promise();
  
  // Enviar código 2FA por SMS
  try {
    if (result.Item.phone) {
      await send2FASMS(result.Item.phone, twoFACode);
    } else {
      // Fallback a email si no hay teléfono
      const emailContent = `
        <h2>Código de Verificación 2FA</h2>
        <p>Tu código de verificación es:</p>
        <h1 style="color: #007bff; font-size: 32px; text-align: center; letter-spacing: 5px;">${twoFACode}</h1>
        <p>Este código expira en 10 minutos.</p>
        <p>Si no solicitaste este código, contacta al administrador.</p>
      `;
      await sendEmail(result.Item.email, 'Código de Verificación 2FA - OnPoint Admin', emailContent);
    }
  } catch (error) {
    console.error('❌ Error enviando 2FA:', error);
    // Continuar aunque falle el envío
  }
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      success: true,
      message: 'Contraseña configurada exitosamente. Revisa tu email para el código de verificación.',
      data: {
        userId,
        email: result.Item.email,
        role: result.Item.role
      }
    })
  };
}

// Verificar 2FA
async function handleVerify2FA(body) {
  const { userId, twoFACode } = body;
  
  if (!userId || !twoFACode) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'ID de usuario y código 2FA son requeridos'
      })
    };
  }
  
  // Buscar código 2FA
  const result = await dynamodb.get({
    TableName: TWO_FA_CODES_TABLE,
    Key: { userId, code: twoFACode }
  }).promise();
  
  if (!result.Item) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Código 2FA incorrecto'
      })
    };
  }
  
  // Verificar expiración
  if (new Date() > new Date(result.Item.expiresAt)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Código 2FA expirado'
      })
    };
  }
  
  // Buscar usuario
  const userResult = await dynamodb.get({
    TableName: USERS_TABLE,
    Key: { id: userId }
  }).promise();
  
  if (!userResult.Item) {
    return {
      statusCode: 404,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Usuario no encontrado'
      })
    };
  }
  
  // Activar usuario
  await dynamodb.update({
    TableName: USERS_TABLE,
    Key: { id: userId },
    UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
    ExpressionAttributeNames: { '#status': 'status' },
    ExpressionAttributeValues: {
      ':status': 'active',
      ':updatedAt': new Date().toISOString()
    }
  }).promise();
  
  // Eliminar código 2FA usado
  await dynamodb.delete({
    TableName: TWO_FA_CODES_TABLE,
    Key: { userId, code: twoFACode }
  }).promise();
  
  // Generar JWT
  const token = jwt.sign(
    { 
      userId, 
      email: userResult.Item.email, 
      role: userResult.Item.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Crear sesión
  const sessionId = generateToken('session');
  const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
  await dynamodb.put({
    TableName: SESSIONS_TABLE,
    Item: {
      sessionId,
      userId,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: sessionExpiresAt
    }
  }).promise();
  
  // Retornar usuario sin contraseña
  const { password, ...userWithoutPassword } = userResult.Item;
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      success: true,
      message: 'Verificación 2FA exitosa',
      data: {
        user: userWithoutPassword,
        token,
        sessionId
      }
    })
  };
}

// Login
async function handleLogin(body) {
  const { email, password } = body;
  
  if (!email || !password) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Email y contraseña son requeridos'
      })
    };
  }
  
  // Buscar usuario por email (scan ya que no hay GSI)
  const result = await dynamodb.scan({
    TableName: USERS_TABLE,
    FilterExpression: 'email = :email',
    ExpressionAttributeValues: { ':email': email }
  }).promise();
  
  if (!result.Items || result.Items.length === 0) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Credenciales inválidas'
      })
    };
  }
  
  const user = result.Items[0];
  
  // Verificar contraseña
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Credenciales inválidas'
      })
    };
  }
  
  // Verificar estado del usuario
  if (user.status !== 'active') {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Usuario no activo'
      })
    };
  }
  
  // Generar JWT
  const token = jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Crear sesión
  const sessionId = generateToken('session');
  const sessionExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  
  await dynamodb.put({
    TableName: SESSIONS_TABLE,
    Item: {
      sessionId,
      userId: user.id,
      token,
      createdAt: new Date().toISOString(),
      expiresAt: sessionExpiresAt
    }
  }).promise();
  
  // Retornar usuario sin contraseña
  const { password: _, ...userWithoutPassword } = user;
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      success: true,
      message: 'Login exitoso',
      data: {
        user: userWithoutPassword,
        token,
        sessionId
      }
    })
  };
}

// Logout
async function handleLogout(body) {
  const { sessionId } = body;
  
  if (sessionId) {
    // Eliminar sesión
    await dynamodb.delete({
      TableName: SESSIONS_TABLE,
      Key: { sessionId }
    }).promise();
  }
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      success: true,
      message: 'Logout exitoso'
    })
  };
}

// Refresh token
async function handleRefresh(body) {
  const { sessionId } = body;
  
  if (!sessionId) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Session ID requerido'
      })
    };
  }
  
  // Buscar sesión
  const result = await dynamodb.get({
    TableName: SESSIONS_TABLE,
    Key: { sessionId }
  }).promise();
  
  if (!result.Item) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Sesión no válida'
      })
    };
  }
  
  // Verificar expiración
  if (new Date() > new Date(result.Item.expiresAt)) {
    // Eliminar sesión expirada
    await dynamodb.delete({
      TableName: SESSIONS_TABLE,
      Key: { sessionId }
    }).promise();
    
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: false,
        message: 'Sesión expirada'
      })
    };
  }
  
  // Generar nuevo token
  const newToken = jwt.sign(
    { 
      userId: result.Item.userId, 
      email: result.Item.email, 
      role: result.Item.role 
    },
    JWT_SECRET,
    { expiresIn: '24h' }
  );
  
  // Actualizar sesión
  const newExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
  await dynamodb.update({
    TableName: SESSIONS_TABLE,
    Key: { sessionId },
    UpdateExpression: 'SET token = :token, expiresAt = :expiresAt, updatedAt = :updatedAt',
    ExpressionAttributeValues: {
      ':token': newToken,
      ':expiresAt': newExpiresAt,
      ':updatedAt': new Date().toISOString()
    }
  }).promise();
  
  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        token: newToken,
        sessionId
      }
    })
  };
}
