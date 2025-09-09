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

// GET /whatsapp
exports.getWhatsAppMessages = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo mensajes de WhatsApp...');
    
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
      messages: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo mensajes de WhatsApp:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// GET /whatsapp/{id}
exports.getWhatsAppMessage = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de mensaje requerido'
      });
    }
    
    console.log(`🔍 Lambda: Obteniendo mensaje de WhatsApp ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    const result = await docClient.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, {
        success: false,
        error: 'Mensaje no encontrado'
      });
    }
    
    return createResponse(200, {
      success: true,
      message: result.Item
    });
  } catch (error) {
    console.error('❌ Error obteniendo mensaje de WhatsApp:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// POST /whatsapp
exports.createWhatsAppMessage = async (event) => {
  try {
    const messageData = JSON.parse(event.body || '{}');
    
    if (!messageData.phoneNumber || !messageData.message) {
      return createResponse(400, {
        success: false,
        error: 'Número de teléfono y mensaje son requeridos'
      });
    }
    
    console.log('➕ Lambda: Creando mensaje de WhatsApp...');
    
    const message = {
      id: `whatsapp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...messageData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const params = {
      TableName: tableName,
      Item: message
    };
    
    await docClient.send(new PutCommand(params));
    
    return createResponse(201, {
      success: true,
      message,
      message: 'Mensaje de WhatsApp creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando mensaje de WhatsApp:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// PUT /whatsapp/{id}
exports.updateWhatsAppMessage = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    const updateData = JSON.parse(event.body || '{}');
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de mensaje requerido'
      });
    }
    
    console.log(`✏️ Lambda: Actualizando mensaje de WhatsApp ${id}...`);
    
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
      message: result.Attributes,
      message: 'Mensaje de WhatsApp actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando mensaje de WhatsApp:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// DELETE /whatsapp/{id}
exports.deleteWhatsAppMessage = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de mensaje requerido'
      });
    }
    
    console.log(`🗑️ Lambda: Eliminando mensaje de WhatsApp ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    await docClient.send(new DeleteCommand(params));
    
    return createResponse(200, {
      success: true,
      message: 'Mensaje de WhatsApp eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando mensaje de WhatsApp:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Handler principal
exports.handler = async (event) => {
  console.log('📱 Lambda WhatsApp - Evento recibido:', JSON.stringify(event, null, 2));
  
  const { httpMethod, pathParameters, queryStringParameters } = event;
  
  try {
    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.id) {
          return await exports.getWhatsAppMessage(event);
        } else {
          return await exports.getWhatsAppMessages(event);
        }
      case 'POST':
        return await exports.createWhatsAppMessage(event);
      case 'PUT':
        return await exports.updateWhatsAppMessage(event);
      case 'DELETE':
        return await exports.deleteWhatsAppMessage(event);
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
