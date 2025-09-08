const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});
const dynamodb = DynamoDBDocumentClient.from(client);

// Detectar entorno dinámicamente
const detectEnvironment = () => {
  const stage = process.env.STAGE || 'local';
  return stage === 'prod' ? 'prod' : 'sandbox';
};

const getTableName = (tableType, environment) => {
  return `OnPointAdmin-${tableType}-${environment}`;
};

const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  };
};

exports.handler = async (event) => {
  console.log('🔐 Auth Lambda - Event:', JSON.stringify(event, null, 2));
  
  const environment = detectEnvironment();
  console.log('🌍 Environment detected:', environment);
  
  try {
    // Manejar OPTIONS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight' });
    }

    const { httpMethod, path } = event;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Rutas de autenticación
    if (pathSegments[0] === 'auth') {
      if (httpMethod === 'POST' && pathSegments[1] === 'login') {
        return await handleLogin(event, environment);
      } else if (httpMethod === 'POST' && pathSegments[1] === 'register') {
        return await handleRegister(event, environment);
      } else if (httpMethod === 'POST' && pathSegments[1] === 'verify-token') {
        return await handleVerifyToken(event, environment);
      }
    }

    return createResponse(404, { error: 'Endpoint not found' });

  } catch (error) {
    console.error('❌ Auth Lambda Error:', error);
    return createResponse(500, { 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

async function handleLogin(event, environment) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password } = body;

    if (!email || !password) {
      return createResponse(400, { 
        success: false, 
        message: 'Email y contraseña son requeridos' 
      });
    }

    // Buscar usuario por email
    const usersTable = getTableName('Users', environment);
    const params = {
      TableName: usersTable,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const result = await dynamodb.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(401, { 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    const user = result.Item;

    // Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password);
    
    if (!isValidPassword) {
      return createResponse(401, { 
        success: false, 
        message: 'Credenciales inválidas' 
      });
    }

    // Verificar que el usuario esté activo
    if (user.status !== 'active') {
      return createResponse(401, { 
        success: false, 
        message: 'Usuario inactivo' 
      });
    }

    // Generar JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        environment 
      },
      process.env.JWT_SECRET || 'default-secret',
      { expiresIn: '24h' }
    );

    // Actualizar último login
    const updateParams = {
      TableName: usersTable,
      Key: { id: user.id },
      UpdateExpression: 'SET lastLogin = :lastLogin',
      ExpressionAttributeValues: {
        ':lastLogin': new Date().toISOString()
      }
    };

    await dynamodb.send(new PutCommand(updateParams));

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = user;

    return createResponse(200, {
      success: true,
      user: userWithoutPassword,
      token,
      message: 'Login exitoso'
    });

  } catch (error) {
    console.error('❌ Login Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
}

async function handleRegister(event, environment) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { email, password, firstName, lastName, phone, role, department, position } = body;

    // Validaciones básicas
    if (!email || !password || !firstName || !lastName || !phone) {
      return createResponse(400, { 
        success: false, 
        message: 'Todos los campos son requeridos' 
      });
    }

    // Verificar si el usuario ya existe
    const usersTable = getTableName('Users', environment);
    const checkParams = {
      TableName: usersTable,
      FilterExpression: 'email = :email',
      ExpressionAttributeValues: {
        ':email': email
      }
    };

    const existingUser = await dynamodb.send(new GetCommand(checkParams));
    
    if (existingUser.Item) {
      return createResponse(400, { 
        success: false, 
        message: 'El usuario ya existe' 
      });
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Formatear teléfono con +52
    const formattedPhone = phone.startsWith('+52') ? phone : `+52${phone}`;

    // Crear usuario
    const userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id: userId,
      email,
      password: hashedPassword,
      firstName,
      lastName,
      phone: formattedPhone,
      role: role || 'EXECUTIVE',
      department: department || 'General',
      position: position || 'Ejecutivo',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system' // En producción sería el ID del usuario que lo crea
    };

    const putParams = {
      TableName: usersTable,
      Item: newUser
    };

    await dynamodb.send(new PutCommand(putParams));

    // Retornar usuario sin contraseña
    const { password: _, ...userWithoutPassword } = newUser;

    return createResponse(201, {
      success: true,
      user: userWithoutPassword,
      message: 'Usuario creado exitosamente'
    });

  } catch (error) {
    console.error('❌ Register Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error interno del servidor' 
    });
  }
}

async function handleVerifyToken(event, environment) {
  try {
    const token = event.headers.Authorization?.replace('Bearer ', '') || 
                  event.headers.authorization?.replace('Bearer ', '');

    if (!token) {
      return createResponse(401, { 
        success: false, 
        message: 'Token no proporcionado' 
      });
    }

    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret');
    
    // Buscar usuario
    const usersTable = getTableName('Users', environment);
    const params = {
      TableName: usersTable,
      Key: { id: decoded.userId }
    };

    const result = await dynamodb.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(401, { 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    const { password: _, ...userWithoutPassword } = result.Item;

    return createResponse(200, {
      success: true,
      user: userWithoutPassword,
      message: 'Token válido'
    });

  } catch (error) {
    console.error('❌ Verify Token Error:', error);
    return createResponse(401, { 
      success: false, 
      message: 'Token inválido' 
    });
  }
}
