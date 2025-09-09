const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Configuración de DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
  // No especificar credenciales - usar el rol IAM de Lambda
});

const docClient = DynamoDBDocumentClient.from(client);

// Función para detectar el entorno basándose en el contexto de la invocación
const detectEnvironment = (event) => {
  // Detectar por el source ARN si está disponible
  if (event.requestContext && event.requestContext.identity && event.requestContext.identity.sourceIp) {
    // Si viene del API Gateway, detectar por el stage
    if (event.requestContext.stage === 'sandbox') {
      return 'sandbox';
    } else if (event.requestContext.stage === 'prod') {
      return 'prod';
    }
  }
  
  // Fallback a variable de entorno
  return process.env.ENVIRONMENT || 'sandbox';
};

// Función para obtener el nombre de tabla según el entorno
const getTableName = (baseTableName, environment) => {
  const env = environment || detectEnvironment({});
  const suffix = env === 'prod' ? 'prod' : 'sandbox';
  return `OnPointAdmin-${baseTableName}-${suffix}`;
};

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

// GET /clients
exports.getClients = async (event) => {
  try {
    const environment = detectEnvironment(event);
    console.log('🔍 Lambda: Obteniendo clients...', { environment, stage: event.requestContext?.stage });
    
    const { page = 1, limit = 10, status } = event.queryStringParameters || {};
    
    const params = {
      TableName: getTableName('Clients', environment),
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
      clients: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0,
        totalPages: Math.ceil((result.Count || 0) / parseInt(limit))
      },
      message: 'Clientes obtenidos exitosamente desde DynamoDB'
    });
    
  } catch (error) {
    console.error('❌ Error en getClients:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener clientes',
      message: error.message
    });
  }
};

// POST /clients
exports.createClient = async (event) => {
  try {
    const environment = detectEnvironment(event);
    console.log('🔍 Lambda: Creando client...', { environment, stage: event.requestContext?.stage });
    
    const body = JSON.parse(event.body);
    const { name, description, industry, contactEmail, status } = body;
    
    if (!name) {
      return createResponse(400, {
        success: false,
        error: 'Faltan campos requeridos',
        message: 'name es obligatorio'
      });
    }
    
    const client = {
      id: `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      description: description || '',
      industry: industry || 'Other',
      contactEmail: contactEmail || '',
      status: status || 'active',
      logos: [],
      primaryLogoId: null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await docClient.send(new PutCommand({
      TableName: getTableName('Clients', environment),
      Item: client
    }));
    
    return createResponse(201, {
      success: true,
      client,
      message: 'Cliente creado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en createClient:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al crear cliente',
      message: error.message
    });
  }
};

// PUT /clients/{id}
exports.updateClient = async (event) => {
  try {
    const environment = detectEnvironment(event);
    console.log('🔍 Lambda: Actualizando client...', { environment, stage: event.requestContext?.stage });
    
    const clientId = event.pathParameters?.id;
    if (!clientId) {
      return createResponse(400, {
        success: false,
        error: 'ID de cliente requerido',
        message: 'Se requiere el ID del cliente en la URL'
      });
    }
    
    const body = JSON.parse(event.body);
    const { name, description, industry, contactEmail, status, logos, primaryLogoId } = body;
    
    const updateData = {
      ...(name && { name }),
      ...(description !== undefined && { description }),
      ...(industry && { industry }),
      ...(contactEmail !== undefined && { contactEmail }),
      ...(status && { status }),
      ...(logos && { logos }),
      ...(primaryLogoId !== undefined && { primaryLogoId }),
      updatedAt: new Date().toISOString()
    };
    
    await docClient.send(new UpdateCommand({
      TableName: getTableName('Clients', environment),
      Key: { id: clientId },
      UpdateExpression: 'SET ' + Object.keys(updateData).map(key => `#${key} = :${key}`).join(', '),
      ExpressionAttributeNames: Object.keys(updateData).reduce((acc, key) => {
        acc[`#${key}`] = key;
        return acc;
      }, {}),
      ExpressionAttributeValues: Object.keys(updateData).reduce((acc, key) => {
        acc[`:${key}`] = updateData[key];
        return acc;
      }, {}),
      ReturnValues: 'ALL_NEW'
    }));
    
    // Obtener el cliente actualizado
    const result = await docClient.send(new GetCommand({
      TableName: getTableName('Clients', environment),
      Key: { id: clientId }
    }));
    
    return createResponse(200, {
      success: true,
      client: result.Item,
      message: 'Cliente actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en updateClient:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al actualizar cliente',
      message: error.message
    });
  }
};

// DELETE /clients/{id}
exports.deleteClient = async (event) => {
  try {
    const environment = detectEnvironment(event);
    console.log('🔍 Lambda: Eliminando client...', { environment, stage: event.requestContext?.stage });
    
    const clientId = event.pathParameters?.id;
    if (!clientId) {
      return createResponse(400, {
        success: false,
        error: 'ID de cliente requerido',
        message: 'Se requiere el ID del cliente en la URL'
      });
    }
    
    await docClient.send(new DeleteCommand({
      TableName: getTableName('Clients', environment),
      Key: { id: clientId }
    }));
    
    return createResponse(200, {
      success: true,
      message: 'Cliente eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en deleteClient:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al eliminar cliente',
      message: error.message
    });
  }
};

// Handler principal
exports.handler = async (event) => {
  console.log('🔍 Event:', JSON.stringify(event, null, 2));
  
  // Manejar CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, { message: 'CORS preflight' });
  }
  
  try {
    const path = event.path;
    const httpMethod = event.httpMethod;
    
    // Rutas con parámetros
    if (path.includes('/clients/') && path.split('/').length > 2) {
      const clientId = path.split('/').pop();
      event.pathParameters = { id: clientId };
      
      switch (httpMethod) {
        case 'PUT':
          return await exports.updateClient(event);
        case 'DELETE':
          return await exports.deleteClient(event);
        default:
          return createResponse(405, {
            success: false,
            error: 'Método no permitido',
            message: `Método ${httpMethod} no soportado para esta ruta`
          });
      }
    }
    
    // Rutas principales
    switch (httpMethod) {
      case 'GET':
        return await exports.getClients(event);
      case 'POST':
        return await exports.createClient(event);
      default:
        return createResponse(405, {
          success: false,
          error: 'Método no permitido',
          message: `Método ${httpMethod} no soportado`
        });
    }
  } catch (error) {
    console.error('❌ Error en handler:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
};
