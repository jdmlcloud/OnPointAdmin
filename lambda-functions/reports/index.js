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

// GET /reports
exports.getReports = async (event, tableName) => {
  try {
    console.log('🔍 Lambda: Obteniendo reportes...');
    
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
      reports: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo reportes:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// GET /reports/{id}
exports.getReport = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de reporte requerido'
      });
    }
    
    console.log(`🔍 Lambda: Obteniendo reporte ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    const result = await docClient.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, {
        success: false,
        error: 'Reporte no encontrado'
      });
    }
    
    return createResponse(200, {
      success: true,
      report: result.Item
    });
  } catch (error) {
    console.error('❌ Error obteniendo reporte:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// POST /reports
exports.createReport = async (event) => {
  try {
    const reportData = JSON.parse(event.body || '{}');
    
    if (!reportData.title || !reportData.type) {
      return createResponse(400, {
        success: false,
        error: 'Título y tipo son requeridos'
      });
    }
    
    console.log('➕ Lambda: Creando reporte...');
    
    const report = {
      id: `report-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...reportData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    const params = {
      TableName: tableName,
      Item: report
    };
    
    await docClient.send(new PutCommand(params));
    
    return createResponse(201, {
      success: true,
      report,
      message: 'Reporte creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando reporte:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// PUT /reports/{id}
exports.updateReport = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    const updateData = JSON.parse(event.body || '{}');
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de reporte requerido'
      });
    }
    
    console.log(`✏️ Lambda: Actualizando reporte ${id}...`);
    
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
      report: result.Attributes,
      message: 'Reporte actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando reporte:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// DELETE /reports/{id}
exports.deleteReport = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de reporte requerido'
      });
    }
    
    console.log(`🗑️ Lambda: Eliminando reporte ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    await docClient.send(new DeleteCommand(params));
    
    return createResponse(200, {
      success: true,
      message: 'Reporte eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando reporte:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Handler principal
exports.handler = async (event) => {
  console.log('📈 Lambda Reports - Evento recibido:', JSON.stringify(event, null, 2));
  
  const { httpMethod, pathParameters, queryStringParameters } = event;
  
  try {
    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.id) {
          return await exports.getReport(event);
        } else {
          return await exports.getReports(event, tableName);
        }
      case 'POST':
        return await exports.createReport(event);
      case 'PUT':
        return await exports.updateReport(event);
      case 'DELETE':
        return await exports.deleteReport(event);
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
