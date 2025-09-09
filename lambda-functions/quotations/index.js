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

// GET /quotations
exports.getQuotations = async (event, tableName) => {
  try {
    console.log('🔍 Lambda: Obteniendo cotizaciones...');
    
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
      quotations: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo cotizaciones:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// GET /quotations/{id}
exports.getQuotation = async (event, tableName) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de cotización requerido'
      });
    }
    
    console.log(`🔍 Lambda: Obteniendo cotización ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    const result = await docClient.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, {
        success: false,
        error: 'Cotización no encontrada'
      });
    }
    
    return createResponse(200, {
      success: true,
      quotation: result.Item
    });
  } catch (error) {
    console.error('❌ Error obteniendo cotización:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// POST /quotations
exports.createQuotation = async (event, tableName) => {
  try {
    const quotationData = JSON.parse(event.body || '{}');
    
    if (!quotationData.clientName || !quotationData.products) {
      return createResponse(400, {
        success: false,
        error: 'Nombre del cliente y productos son requeridos'
      });
    }
    
    console.log('➕ Lambda: Creando cotización...');
    
    const quotation = {
      id: `quotation-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...quotationData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'pending'
    };
    
    const params = {
      TableName: tableName,
      Item: quotation
    };
    
    await docClient.send(new PutCommand(params));
    
    return createResponse(201, {
      success: true,
      quotation,
      message: 'Cotización creada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando cotización:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// PUT /quotations/{id}
exports.updateQuotation = async (event, tableName) => {
  try {
    const { id } = event.pathParameters || {};
    const updateData = JSON.parse(event.body || '{}');
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de cotización requerido'
      });
    }
    
    console.log(`✏️ Lambda: Actualizando cotización ${id}...`);
    
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
      quotation: result.Attributes,
      message: 'Cotización actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando cotización:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// DELETE /quotations/{id}
exports.deleteQuotation = async (event, tableName) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de cotización requerido'
      });
    }
    
    console.log(`🗑️ Lambda: Eliminando cotización ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    await docClient.send(new DeleteCommand(params));
    
    return createResponse(200, {
      success: true,
      message: 'Cotización eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando cotización:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Handler principal
exports.handler = async (event) => {
  console.log('📋 Lambda Quotations - Evento recibido:', JSON.stringify(event, null, 2));
  
  const { httpMethod, pathParameters, queryStringParameters } = event;
  const stage = event.requestContext.stage; // Obtener el stage de la solicitud
  const tableName = `OnPointAdmin-Quotations-${stage}`; // Construir el nombre de la tabla dinámicamente
  
  try {
    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.id) {
          return await exports.getQuotation(event, tableName);
        } else {
          return await exports.getQuotations(event, tableName);
        }
      case 'POST':
        return await exports.createQuotation(event, tableName);
      case 'PUT':
        return await exports.updateQuotation(event, tableName);
      case 'DELETE':
        return await exports.deleteQuotation(event, tableName);
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