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
  console.log('🔐 Permissions Lambda - Event:', JSON.stringify(event, null, 2));
  
  const environment = detectEnvironment();
  console.log('🌍 Environment detected:', environment);
  
  try {
    // Manejar OPTIONS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight' });
    }

    const { httpMethod, path } = event;
    const pathSegments = path.split('/').filter(Boolean);
    
    // Rutas de permisos
    if (pathSegments[0] === 'permissions') {
      if (httpMethod === 'GET' && pathSegments.length === 1) {
        return await handleGetPermissions(event, environment);
      } else if (httpMethod === 'GET' && pathSegments.length === 2) {
        return await handleGetPermission(event, environment, pathSegments[1]);
      } else if (httpMethod === 'POST' && pathSegments.length === 1) {
        return await handleCreatePermission(event, environment);
      } else if (httpMethod === 'PUT' && pathSegments.length === 2) {
        return await handleUpdatePermission(event, environment, pathSegments[1]);
      } else if (httpMethod === 'DELETE' && pathSegments.length === 2) {
        return await handleDeletePermission(event, environment, pathSegments[1]);
      }
    }

    return createResponse(404, { error: 'Endpoint not found' });

  } catch (error) {
    console.error('❌ Permissions Lambda Error:', error);
    return createResponse(500, { 
      error: 'Internal server error',
      message: error.message 
    });
  }
};

async function handleGetPermissions(event, environment) {
  try {
    const permissionsTable = getTableName('Permissions', environment);
    const params = {
      TableName: permissionsTable
    };

    const result = await dynamodb.send(new ScanCommand(params));
    const permissions = result.Items || [];

    return createResponse(200, {
      success: true,
      permissions,
      count: permissions.length
    });

  } catch (error) {
    console.error('❌ Get Permissions Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al obtener permisos' 
    });
  }
}

async function handleGetPermission(event, environment, permissionId) {
  try {
    const permissionsTable = getTableName('Permissions', environment);
    const params = {
      TableName: permissionsTable,
      Key: { id: permissionId }
    };

    const result = await dynamodb.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, { 
        success: false, 
        message: 'Permiso no encontrado' 
      });
    }

    return createResponse(200, {
      success: true,
      permission: result.Item
    });

  } catch (error) {
    console.error('❌ Get Permission Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al obtener permiso' 
    });
  }
}

async function handleCreatePermission(event, environment) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { name, resource, action, description } = body;

    // Validaciones básicas
    if (!name || !resource || !action) {
      return createResponse(400, { 
        success: false, 
        message: 'Nombre, recurso y acción son requeridos' 
      });
    }

    // Verificar si el permiso ya existe
    const permissionsTable = getTableName('Permissions', environment);
    const checkParams = {
      TableName: permissionsTable,
      FilterExpression: '#name = :name',
      ExpressionAttributeNames: {
        '#name': 'name'
      },
      ExpressionAttributeValues: {
        ':name': name
      }
    };

    const existingPermission = await dynamodb.send(new ScanCommand(checkParams));
    
    if (existingPermission.Items && existingPermission.Items.length > 0) {
      return createResponse(400, { 
        success: false, 
        message: 'El permiso ya existe' 
      });
    }

    // Crear permiso
    const permissionId = `permission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const newPermission = {
      id: permissionId,
      name,
      resource,
      action,
      description: description || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system' // En producción sería el ID del usuario que lo crea
    };

    const putParams = {
      TableName: permissionsTable,
      Item: newPermission
    };

    await dynamodb.send(new PutCommand(putParams));

    return createResponse(201, {
      success: true,
      permission: newPermission,
      message: 'Permiso creado exitosamente'
    });

  } catch (error) {
    console.error('❌ Create Permission Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al crear permiso' 
    });
  }
}

async function handleUpdatePermission(event, environment, permissionId) {
  try {
    const body = JSON.parse(event.body || '{}');
    const { name, resource, action, description } = body;

    // Verificar que el permiso existe
    const permissionsTable = getTableName('Permissions', environment);
    const getParams = {
      TableName: permissionsTable,
      Key: { id: permissionId }
    };

    const existingPermission = await dynamodb.send(new GetCommand(getParams));
    
    if (!existingPermission.Item) {
      return createResponse(404, { 
        success: false, 
        message: 'Permiso no encontrado' 
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

    if (resource) {
      updateExpressions.push('#resource = :resource');
      expressionAttributeNames['#resource'] = 'resource';
      expressionAttributeValues[':resource'] = resource;
    }

    if (action) {
      updateExpressions.push('#action = :action');
      expressionAttributeNames['#action'] = 'action';
      expressionAttributeValues[':action'] = action;
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
      TableName: permissionsTable,
      Key: { id: permissionId },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };

    const result = await dynamodb.send(new UpdateCommand(updateParams));

    return createResponse(200, {
      success: true,
      permission: result.Attributes,
      message: 'Permiso actualizado exitosamente'
    });

  } catch (error) {
    console.error('❌ Update Permission Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al actualizar permiso' 
    });
  }
}

async function handleDeletePermission(event, environment, permissionId) {
  try {
    const permissionsTable = getTableName('Permissions', environment);
    const params = {
      TableName: permissionsTable,
      Key: { id: permissionId }
    };

    await dynamodb.send(new DeleteCommand(params));

    return createResponse(200, {
      success: true,
      message: 'Permiso eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Delete Permission Error:', error);
    return createResponse(500, { 
      success: false, 
      message: 'Error al eliminar permiso' 
    });
  }
}
