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

// GET /editor
exports.getEditorContent = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo contenido del editor...');
    
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
      content: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo contenido del editor:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// GET /editor/{id}
exports.getEditorItem = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de contenido requerido'
      });
    }
    
    console.log(`🔍 Lambda: Obteniendo contenido del editor ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    const result = await docClient.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, {
        success: false,
        error: 'Contenido no encontrado'
      });
    }
    
    return createResponse(200, {
      success: true,
      content: result.Item
    });
  } catch (error) {
    console.error('❌ Error obteniendo contenido del editor:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// POST /editor
exports.createEditorContent = async (event) => {
  try {
    const contentData = JSON.parse(event.body || '{}');
    
    if (!contentData.title || !contentData.content) {
      return createResponse(400, {
        success: false,
        error: 'Título y contenido son requeridos'
      });
    }
    
    console.log('➕ Lambda: Creando contenido del editor...');
    
    const content = {
      id: `editor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...contentData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    const params = {
      TableName: tableName,
      Item: content
    };
    
    await docClient.send(new PutCommand(params));
    
    return createResponse(201, {
      success: true,
      content,
      message: 'Contenido del editor creado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando contenido del editor:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// PUT /editor/{id}
exports.updateEditorContent = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    const updateData = JSON.parse(event.body || '{}');
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de contenido requerido'
      });
    }
    
    console.log(`✏️ Lambda: Actualizando contenido del editor ${id}...`);
    
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
      content: result.Attributes,
      message: 'Contenido del editor actualizado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando contenido del editor:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// DELETE /editor/{id}
exports.deleteEditorContent = async (event) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de contenido requerido'
      });
    }
    
    console.log(`🗑️ Lambda: Eliminando contenido del editor ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    await docClient.send(new DeleteCommand(params));
    
    return createResponse(200, {
      success: true,
      message: 'Contenido del editor eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando contenido del editor:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Handler principal
exports.handler = async (event) => {
  console.log('✏️ Lambda Editor - Evento recibido:', JSON.stringify(event, null, 2));
  
  const { httpMethod, pathParameters, queryStringParameters } = event;
  
  try {
    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.id) {
          return await exports.getEditorItem(event);
        } else {
          return await exports.getEditorContent(event);
        }
      case 'POST':
        return await exports.createEditorContent(event);
      case 'PUT':
        return await exports.updateEditorContent(event);
      case 'DELETE':
        return await exports.deleteEditorContent(event);
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
