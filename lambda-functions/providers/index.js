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

// GET /providers
exports.getProviders = async (event) => {
  try {
    const environment = detectEnvironment(event);
    console.log('🔍 Lambda: Obteniendo providers...', { environment, stage: event.requestContext?.stage });
    
    const { page = 1, limit = 10, status } = event.queryStringParameters || {};
    
    const params = {
      TableName: getTableName('Providers', environment),
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
      providers: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0,
        totalPages: Math.ceil((result.Count || 0) / parseInt(limit))
      },
      message: 'Proveedores obtenidos exitosamente desde DynamoDB'
    });
    
  } catch (error) {
    console.error('❌ Error en getProviders:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener proveedores',
      message: error.message
    });
  }
};

// POST /providers
exports.createProvider = async (event) => {
  try {
    const environment = detectEnvironment(event);
    console.log('🔍 Lambda: Creando provider...', { environment, stage: event.requestContext?.stage });
    
    const body = JSON.parse(event.body);
    const { name, email, company, phone, description, website, address, contacts, status, logo, notes, tags } = body;
    
    if (!name || !email || !company || !phone) {
      return createResponse(400, {
        success: false,
        error: 'Faltan campos requeridos',
        message: 'name, email, company y phone son obligatorios'
      });
    }
    
    const provider = {
      id: `provider-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name,
      email,
      company,
      phone,
      description: description || '',
      website: website || '',
      address: address || {},
      contacts: contacts || [],
      status: status || 'active',
      logo: logo || null,
      notes: notes || '',
      tags: tags || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    await docClient.send(new PutCommand({
      TableName: getTableName('Providers', environment),
      Item: provider
    }));
    
    return createResponse(201, {
      success: true,
      provider,
      message: 'Proveedor creado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en createProvider:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al crear proveedor',
      message: error.message
    });
  }
};

// PUT /providers/{id}
exports.updateProvider = async (event) => {
  try {
    const environment = detectEnvironment(event);
    console.log('🔍 Lambda: Actualizando provider...', { environment, stage: event.requestContext?.stage });
    
    const providerId = event.pathParameters?.id;
    if (!providerId) {
      return createResponse(400, {
        success: false,
        error: 'ID de proveedor requerido',
        message: 'Se requiere el ID del proveedor en la URL'
      });
    }
    
    const body = JSON.parse(event.body);
    const { name, email, company, phone, description, website, address, contacts, status, logo, notes, tags } = body;
    
    const updateData = {
      ...(name && { name }),
      ...(email && { email }),
      ...(company && { company }),
      ...(phone && { phone }),
      ...(description !== undefined && { description }),
      ...(website !== undefined && { website }),
      ...(address && { address }),
      ...(contacts && { contacts }),
      ...(status && { status }),
      ...(logo !== undefined && { logo }),
      ...(notes !== undefined && { notes }),
      ...(tags && { tags }),
      updatedAt: new Date().toISOString()
    };
    
    await docClient.send(new UpdateCommand({
      TableName: getTableName('Providers', environment),
      Key: { id: providerId },
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
    
    // Obtener el proveedor actualizado
    const result = await docClient.send(new GetCommand({
      TableName: getTableName('Providers', environment),
      Key: { id: providerId }
    }));
    
    return createResponse(200, {
      success: true,
      provider: result.Item,
      message: 'Proveedor actualizado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en updateProvider:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al actualizar proveedor',
      message: error.message
    });
  }
};

// DELETE /providers/{id}
exports.deleteProvider = async (event) => {
  try {
    const environment = detectEnvironment(event);
    console.log('🔍 Lambda: Eliminando provider...', { environment, stage: event.requestContext?.stage });
    
    const providerId = event.pathParameters?.id;
    if (!providerId) {
      return createResponse(400, {
        success: false,
        error: 'ID de proveedor requerido',
        message: 'Se requiere el ID del proveedor en la URL'
      });
    }
    
    await docClient.send(new DeleteCommand({
      TableName: getTableName('Providers', environment),
      Key: { id: providerId }
    }));
    
    return createResponse(200, {
      success: true,
      message: 'Proveedor eliminado exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en deleteProvider:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al eliminar proveedor',
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
    if (path.includes('/providers/') && path.split('/').length > 2) {
      const providerId = path.split('/').pop();
      event.pathParameters = { id: providerId };
      
      switch (httpMethod) {
        case 'PUT':
          return await exports.updateProvider(event);
        case 'DELETE':
          return await exports.deleteProvider(event);
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
        return await exports.getProviders(event);
      case 'POST':
        return await exports.createProvider(event);
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
