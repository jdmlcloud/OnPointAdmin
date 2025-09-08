const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
const bcrypt = require('bcryptjs');

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
  console.log('👥 Users Lambda - Event:', JSON.stringify(event, null, 2));
  
  const environment = detectEnvironment();
  console.log('🌍 Environment detected:', environment);
  
  try {
    // Manejar OPTIONS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight' });
    }

    const { httpMethod, path } = event;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Rutas de usuarios
    if (pathSegments[0] === 'users') {
      if (httpMethod === 'GET' && pathSegments.length === 1) {
        return await handleGetUsers(event, environment);
      } else if (httpMethod === 'GET' && pathSegments.length === 2) {
        return await handleGetUser(event, environment, pathSegments[1]);
      } else if (httpMethod === 'POST' && pathSegments.length === 1) {
        return await handleCreateUser(event, environment);
      } else if (httpMethod === 'PUT' && pathSegments.length === 2) {
        return await handleUpdateUser(event, environment, pathSegments[1]);
      } else if (httpMethod === 'DELETE' && pathSegments.length === 2) {
        return await handleDeleteUser(event, environment, pathSegments[1]);
      }
    }

    return createResponse(404, { error: 'Endpoint not found' });

  } catch (error) {
    console.error('❌ Users Lambda Error:', error);
    return createResponse(500, { 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

async function handleGetUsers(event, environment) {
  try {
    const usersTable = getTableName('Users', environment);
    const params = {
      TableName: usersTable
    };

    const result = await dynamodb.send(new ScanCommand(params));
    
    // Remover contraseñas de la respuesta
    const users = result.Items?.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }) || [];

    return createResponse(200, {
      success: true,
      users,
      count: users.length
    });

  } catch (error) {
    console.error('❌ Get Users Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al obtener usuarios' 
    });
  }
}

async function handleGetUser(event, environment, userId) {
  try {
    const usersTable = getTableName('Users', environment);
    const params = {
      TableName: usersTable,
      Key: { id: userId }
    };

    const result = await dynamodb.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, { 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Remover contraseña de la respuesta
    const { password, ...userWithoutPassword } = result.Item;

    return createResponse(200, {
      success: true,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('❌ Get User Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al obtener usuario' 
    });
  }
}

async function handleCreateUser(event, environment) {
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
    console.error('❌ Create User Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al crear usuario' 
    });
  }
}

async function handleUpdateUser(event, environment, userId) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { firstName, lastName, phone, role, department, position, status } = body;

    // Verificar que el usuario existe
    const usersTable = getTableName('Users', environment);
    const getParams = {
      TableName: usersTable,
      Key: { id: userId }
    };

    const existingUser = await dynamodb.send(new GetCommand(getParams));
    
    if (!existingUser.Item) {
      return createResponse(404, { 
        success: false, 
        message: 'Usuario no encontrado' 
      });
    }

    // Construir expresión de actualización
    const updateExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    if (firstName) {
      updateExpressions.push('#firstName = :firstName');
      expressionAttributeNames['#firstName'] = 'firstName';
      expressionAttributeValues[':firstName'] = firstName;
    }

    if (lastName) {
      updateExpressions.push('#lastName = :lastName');
      expressionAttributeNames['#lastName'] = 'lastName';
      expressionAttributeValues[':lastName'] = lastName;
    }

    if (phone) {
      updateExpressions.push('#phone = :phone');
      expressionAttributeNames['#phone'] = 'phone';
      expressionAttributeValues[':phone'] = phone.startsWith('+52') ? phone : `+52${phone}`;
    }

    if (role) {
      updateExpressions.push('#role = :role');
      expressionAttributeNames['#role'] = 'role';
      expressionAttributeValues[':role'] = role;
    }

    if (department) {
      updateExpressions.push('#department = :department');
      expressionAttributeNames['#department'] = 'department';
      expressionAttributeValues[':department'] = department;
    }

    if (position) {
      updateExpressions.push('#position = :position');
      expressionAttributeNames['#position'] = 'position';
      expressionAttributeValues[':position'] = position;
    }

    if (status) {
      updateExpressions.push('#status = :status');
      expressionAttributeNames['#status'] = 'status';
      expressionAttributeValues[':status'] = status;
    }

    if (updateExpressions.length === 0) {
      return createResponse(400, { 
        success: false, 
        message: 'No hay campos para actualizar' 
      });
    }

    // Agregar updatedAt
    updateExpressions.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();

    const updateParams = {
      TableName: usersTable,
      Key: { id: userId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.send(new UpdateCommand(updateParams));

    // Retornar usuario actualizado sin contraseña
    const { password: _, ...userWithoutPassword } = result.Attributes;

    return createResponse(200, {
      success: true,
      user: userWithoutPassword,
      message: 'Usuario actualizado exitosamente'
    });

  } catch (error) {
    console.error('❌ Update User Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al actualizar usuario' 
    });
  }
}

async function handleDeleteUser(event, environment, userId) {
  try {
    const usersTable = getTableName('Users', environment);
    const params = {
      TableName: usersTable,
      Key: { id: userId }
    };

    await dynamodb.send(new DeleteCommand(params));

    return createResponse(200, {
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Delete User Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al eliminar usuario' 
    });
  }
}