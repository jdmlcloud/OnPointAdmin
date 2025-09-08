const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});
const dynamodb = DynamoDBDocumentClient.from(client);

// Detectar entorno dinámicamente
const detectEnvironment = () => {
  const environment = process.env.ENVIRONMENT || 'local';
  return environment;
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
  console.log('🎭 Roles Lambda - Event:', JSON.stringify(event, null, 2));
  
  const environment = detectEnvironment();
  console.log('🌍 Environment detected:', environment);
  
  try {
    // Manejar OPTIONS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight' });
    }

    const { httpMethod, path } = event;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Rutas de roles
    if (pathSegments[0] === 'roles') {
      if (httpMethod === 'GET' && pathSegments.length === 1) {
        return await handleGetRoles(event, environment);
      } else if (httpMethod === 'GET' && pathSegments.length === 2) {
        return await handleGetRole(event, environment, pathSegments[1]);
      } else if (httpMethod === 'POST' && pathSegments.length === 1) {
        return await handleCreateRole(event, environment);
      } else if (httpMethod === 'PUT' && pathSegments.length === 2) {
        return await handleUpdateRole(event, environment, pathSegments[1]);
      } else if (httpMethod === 'DELETE' && pathSegments.length === 2) {
        return await handleDeleteRole(event, environment, pathSegments[1]);
      }
    }

    return createResponse(404, { error: 'Endpoint not found' });

  } catch (error) {
    console.error('❌ Roles Lambda Error:', error);
    return createResponse(500, { 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

async function handleGetRoles(event, environment) {
  try {
    const rolesTable = getTableName('Roles', environment);
    const params = {
      TableName: rolesTable
    };

    const result = await dynamodb.send(new ScanCommand(params));
    const roles = result.Items || [];

    return createResponse(200, {
      success: true,
      roles,
      count: roles.length
    });

  } catch (error) {
    console.error('❌ Get Roles Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al obtener roles' 
    });
  }
}

async function handleGetRole(event, environment, roleId) {
  try {
    const rolesTable = getTableName('Roles', environment);
    const params = {
      TableName: rolesTable,
      Key: { id: roleId }
    };

    const result = await dynamodb.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, { 
        success: false, 
        message: 'Rol no encontrado' 
      });
    }

    return createResponse(200, {
      success: true,
      role: result.Item
    });

  } catch (error) {
    console.error('❌ Get Role Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al obtener rol' 
    });
  }
}

async function handleCreateRole(event, environment) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { name, level, permissions, description } = body;

    // Validaciones básicas
    if (!name || !level || !permissions) {
      return createResponse(400, { 
        success: false, 
        message: 'Nombre, nivel y permisos son requeridos' 
      });
    }

    // Verificar si el rol ya existe
    const rolesTable = getTableName('Roles', environment);
    const checkParams = {
      TableName: rolesTable,
      FilterExpression: '#name = :name',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name
      }
    };

    const existingRole = await dynamodb.send(new ScanCommand(checkParams));
    
    if (existingRole.Items && existingRole.Items.length > 0) {
      return createResponse(400, { 
        success: false, 
        message: 'El rol ya existe' 
      });
    }

    // Crear rol
    const roleId = `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newRole = {
      id: roleId,
      name,
      level: parseInt(level),
      permissions: Array.isArray(permissions) ? permissions : [],
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system' // En producción sería el ID del usuario que lo crea
    };

    const putParams = {
      TableName: rolesTable,
      Item: newRole
    };

    await dynamodb.send(new PutCommand(putParams));

    return createResponse(201, {
      success: true,
      role: newRole,
      message: 'Rol creado exitosamente'
    });

  } catch (error) {
    console.error('❌ Create Role Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al crear rol' 
    });
  }
}

async function handleUpdateRole(event, environment, roleId) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { name, level, permissions, description } = body;

    // Verificar que el rol existe
    const rolesTable = getTableName('Roles', environment);
    const getParams = {
      TableName: rolesTable,
      Key: { id: roleId }
    };

    const existingRole = await dynamodb.send(new GetCommand(getParams));
    
    if (!existingRole.Item) {
      return createResponse(404, { 
        success: false, 
        message: 'Rol no encontrado' 
      });
    }

    // Construir expresión de actualización
    const updateExpressions = [];
    const expressionAttributeValues = {};
    const expressionAttributeNames = {};

    if (name) {
      updateExpressions.push('#name = :name');
      expressionAttributeNames['#name'] = 'name';
      expressionAttributeValues[':name'] = name;
    }

    if (level) {
      updateExpressions.push('#level = :level');
      expressionAttributeNames['#level'] = 'level';
      expressionAttributeValues[':level'] = parseInt(level);
    }

    if (permissions) {
      updateExpressions.push('#permissions = :permissions');
      expressionAttributeNames['#permissions'] = 'permissions';
      expressionAttributeValues[':permissions'] = Array.isArray(permissions) ? permissions : [];
    }

    if (description !== undefined) {
      updateExpressions.push('#description = :description');
      expressionAttributeNames['#description'] = 'description';
      expressionAttributeValues[':description'] = description;
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
      TableName: rolesTable,
      Key: { id: roleId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.send(new UpdateCommand(updateParams));

    return createResponse(200, {
      success: true,
      role: result.Attributes,
      message: 'Rol actualizado exitosamente'
    });

  } catch (error) {
    console.error('❌ Update Role Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al actualizar rol' 
    });
  }
}

async function handleDeleteRole(event, environment, roleId) {
  try {
    const rolesTable = getTableName('Roles', environment);
    const params = {
      TableName: rolesTable,
      Key: { id: roleId }
    };

    await dynamodb.send(new DeleteCommand(params));

    return createResponse(200, {
      success: true,
      message: 'Rol eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Delete Role Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al eliminar rol' 
    });
  }
}
