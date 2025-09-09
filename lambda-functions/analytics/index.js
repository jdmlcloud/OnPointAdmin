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

// GET /analytics
exports.getAnalytics = async (event, tableName) => {
  try {
    console.log('🔍 Lambda: Obteniendo datos de analytics...');
    
    const { page = 1, limit = 10, type } = event.queryStringParameters || {};
    
    const params = {
      TableName: tableName,
      Limit: parseInt(limit),
      ExclusiveStartKey: page > 1 ? { id: `page-${page}` } : undefined
    };
    
    if (type) {
      params.FilterExpression = '#type = :type';
      params.ExpressionAttributeNames = { '#type': 'type' };
      params.ExpressionAttributeValues = { ':type': type };
    }
    
    const result = await docClient.send(new ScanCommand(params));
    
    return createResponse(200, {
      success: true,
      analytics: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo datos de analytics:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// GET /analytics/{id}
exports.getAnalytic = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de analytics requerido'
      });
    }
    
    console.log(`🔍 Lambda: Obteniendo analytics ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    const result = await docClient.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, {
        success: false,
        error: 'Datos de analytics no encontrados'
      });
    }
    
    return createResponse(200, {
      success: true,
      analytic: result.Item
    });
  } catch (error) {
    console.error('❌ Error obteniendo analytics:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// POST /analytics
exports.createAnalytic = async (event) => {
  try {
    const analyticData = JSON.parse(event.body || '{}');
    
    if (!analyticData.type || !analyticData.metric) {
      return createResponse(400, {
        success: false,
        error: 'Tipo y métrica son requeridos'
      });
    }
    
    console.log('➕ Lambda: Creando datos de analytics...');
    
    const analytic = {
      id: `analytic-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...analyticData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'active'
    };
    
    const params = {
      TableName: tableName,
      Item: analytic
    };
    
    await docClient.send(new PutCommand(params));
    
    return createResponse(201, {
      success: true,
      analytic,
      message: 'Datos de analytics creados exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando analytics:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// PUT /analytics/{id}
exports.updateAnalytic = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    const updateData = JSON.parse(event.body || '{}');
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de analytics requerido'
      });
    }
    
    console.log(`✏️ Lambda: Actualizando analytics ${id}...`);
    
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
      analytic: result.Attributes,
      message: 'Datos de analytics actualizados exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando analytics:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// DELETE /analytics/{id}
exports.deleteAnalytic = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de analytics requerido'
      });
    }
    
    console.log(`🗑️ Lambda: Eliminando analytics ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    await docClient.send(new DeleteCommand(params));
    
    return createResponse(200, {
      success: true,
      message: 'Datos de analytics eliminados exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando analytics:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Handler principal
exports.handler = async (event) => {
  console.log('📊 Lambda Analytics - Evento recibido:', JSON.stringify(event, null, 2));
  
  const { httpMethod, pathParameters, queryStringParameters } = event;
  
  try {
    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.id) {
          return await exports.getAnalytic(event);
        } else {
          return await exports.getAnalytics(event, tableName);
        }
      case 'POST':
        return await exports.createAnalytic(event);
      case 'PUT':
        return await exports.updateAnalytic(event);
      case 'DELETE':
        return await exports.deleteAnalytic(event);
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
