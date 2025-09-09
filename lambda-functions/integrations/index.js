const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Configuración de DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
  // No especificar credenciales - usar el rol IAM de Lambda
});

const docClient = DynamoDBDocumentClient.from(client);

// Función para generar respuesta CORS
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Max-Age': '86400'
  },
  body: JSON.stringify(body)
});

// GET /integrations
exports.getIntegrations = async (event, tableName) => {
  try {
    console.log('🔍 Lambda: Obteniendo integraciones...');
    
    const { page = 1, limit = 10, status } = event.queryStringParameters || {};
    
    const params = {
      TableName: tableName,
      Limit: parseInt(limit),
      ExclusiveStartKey: page > 1 ? { id: `page-${page}` } : undefined
    };
    
    if (status) {
      params.FilterExpression = '#status = :status';
      params.ExpressionAttributeNames = { '#status': 'status' };
      params.ExpressionAttributeValues = { ':status': status };
    }
    
    const result = await docClient.send(new ScanCommand(params));
    
    return createResponse(200, {
      success: true,
      integrations: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo integraciones:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// GET /integrations/{id}
exports.getIntegration = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de integración requerido'
      });
    }
    
    console.log(`🔍 Lambda: Obteniendo integración ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    const result = await docClient.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, {
        success: false,
        error: 'Integración no encontrada'
      });
    }
    
    return createResponse(200, {
      success: true,
      integration: result.Item
    });
  } catch (error) {
    console.error('❌ Error obteniendo integración:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// POST /integrations
exports.createIntegration = async (event) => {
  try {
    const integrationData = JSON.parse(event.body || '{}');
    
    if (!integrationData.name || !integrationData.type) {
      return createResponse(400, {
        success: false,
        error: 'Nombre y tipo son requeridos'
      });
    }
    
    console.log('➕ Lambda: Creando integración...');
    
    const integration = {
      id: `integration-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...integrationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'inactive'
    };
    
    const params = {
      TableName: tableName,
      Item: integration
    };
    
    await docClient.send(new PutCommand(params));
    
    return createResponse(201, {
      success: true,
      integration,
      message: 'Integración creada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando integración:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// PUT /integrations/{id}
exports.updateIntegration = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    const updateData = JSON.parse(event.body || '{}');
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de integración requerido'
      });
    }
    
    console.log(`✏️ Lambda: Actualizando integración ${id}...`);
    
    const updateExpression = [];
    const expressionAttributeNames = {};
    const expressionAttributeValues = {};
    
    Object.keys(updateData).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        updateExpression.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = updateData[key];
      }
    });
    
    if (updateExpression.length === 0) {
      return createResponse(400, {
        success: false,
        error: 'No hay campos para actualizar'
      });
    }
    
    updateExpression.push('#updatedAt = :updatedAt');
    expressionAttributeNames['#updatedAt'] = 'updatedAt';
    expressionAttributeValues[':updatedAt'] = new Date().toISOString();
    
    const params = {
      TableName: tableName,
      Key: { id },
      UpdateExpression: `SET ${updateExpression.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues,
      ReturnValues: 'ALL_NEW'
    };
    
    const result = await docClient.send(new UpdateCommand(params));
    
    return createResponse(200, {
      success: true,
      integration: result.Attributes,
      message: 'Integración actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando integración:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// DELETE /integrations/{id}
exports.deleteIntegration = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de integración requerido'
      });
    }
    
    console.log(`🗑️ Lambda: Eliminando integración ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    await docClient.send(new DeleteCommand(params));
    
    return createResponse(200, {
      success: true,
      message: 'Integración eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando integración:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Handler principal
exports.handler = async (event) => {
  console.log('🔗 Lambda Integrations - Evento recibido:', JSON.stringify(event, null, 2));
  
  const { httpMethod, pathParameters, queryStringParameters } = event;
  
  try {
    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.id) {
          return await exports.getIntegration(event);
        } else {
          return await exports.getIntegrations(event, tableName);
        }
      case 'POST':
        return await exports.createIntegration(event);
      case 'PUT':
        return await exports.updateIntegration(event);
      case 'DELETE':
        return await exports.deleteIntegration(event);
      case 'OPTIONS':
        return createResponse(200, { message: 'CORS preflight' });
      default:
        return createResponse(405, {
          success: false,
          error: 'Método no permitido'
        });
    }
  } catch (error) {
    console.error('❌ Error en handler principal:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};
