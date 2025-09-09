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

// GET /proposals
exports.getProposals = async (event, tableName) => {
  try {
    console.log('🔍 Lambda: Obteniendo propuestas...');
    
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
      proposals: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0
      }
    });
  } catch (error) {
    console.error('❌ Error obteniendo propuestas:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// GET /proposals/{id}
exports.getProposal = async (event, tableName) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de propuesta requerido'
      });
    }
    
    console.log(`🔍 Lambda: Obteniendo propuesta ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    const result = await docClient.send(new GetCommand(params));
    
    if (!result.Item) {
      return createResponse(404, {
        success: false,
        error: 'Propuesta no encontrada'
      });
    }
    
    return createResponse(200, {
      success: true,
      proposal: result.Item
    });
  } catch (error) {
    console.error('❌ Error obteniendo propuesta:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// POST /proposals
exports.createProposal = async (event, tableName) => {
  try {
    const proposalData = JSON.parse(event.body || '{}');
    
    if (!proposalData.title || !proposalData.description) {
      return createResponse(400, {
        success: false,
        error: 'Título y descripción son requeridos'
      });
    }
    
    console.log('➕ Lambda: Creando propuesta...');
    
    const proposal = {
      id: `proposal-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...proposalData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'draft'
    };
    
    const params = {
      TableName: tableName,
      Item: proposal
    };
    
    await docClient.send(new PutCommand(params));
    
    return createResponse(201, {
      success: true,
      proposal,
      message: 'Propuesta creada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error creando propuesta:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// PUT /proposals/{id}
exports.updateProposal = async (event, tableName) => {
  try {
    const { id } = event.pathParameters || {};
    const updateData = JSON.parse(event.body || '{}');
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de propuesta requerido'
      });
    }
    
    console.log(`✏️ Lambda: Actualizando propuesta ${id}...`);
    
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
      proposal: result.Attributes,
      message: 'Propuesta actualizada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error actualizando propuesta:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// DELETE /proposals/{id}
exports.deleteProposal = async (event, tableName) => {
  try {
    const { id } = event.pathParameters || {};
    
    if (!id) {
      return createResponse(400, {
        success: false,
        error: 'ID de propuesta requerido'
      });
    }
    
    console.log(`🗑️ Lambda: Eliminando propuesta ${id}...`);
    
    const params = {
      TableName: tableName,
      Key: { id }
    };
    
    await docClient.send(new DeleteCommand(params));
    
    return createResponse(200, {
      success: true,
      message: 'Propuesta eliminada exitosamente'
    });
  } catch (error) {
    console.error('❌ Error eliminando propuesta:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor'
    });
  }
};

// Handler principal
exports.handler = async (event) => {
  const stage = event.requestContext.stage; // Obtener el stage de la solicitud
  const tableName = `OnPointAdmin-Proposals-${stage}`; // Construir el nombre de la tabla dinámicamente
  console.log('📄 Lambda Proposals - Evento recibido:', JSON.stringify(event, null, 2));
  
  const { httpMethod, pathParameters, queryStringParameters } = event;
  
  try {
    switch (httpMethod) {
      case 'GET':
        if (pathParameters && pathParameters.id) {
          return await exports.getProposal(event, tableName);
        } else {
          return await exports.getProposals(event, tableName);
        }
      case 'POST':
        return await exports.createProposal(event, tableName);
      case 'PUT':
        return await exports.updateProposal(event, tableName);
      case 'DELETE':
        return await exports.deleteProposal(event, tableName);
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
