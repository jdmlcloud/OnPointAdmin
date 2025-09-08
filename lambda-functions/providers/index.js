const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, GetCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Configuración de DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const docClient = DynamoDBDocumentClient.from(client);

// Función para generar respuesta CORS
const createResponse = (statusCode, body) => ({
  statusCode,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  },
  body: JSON.stringify(body)
});

// GET /providers
exports.getProviders = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo providers...');
    
    const { page = 1, limit = 10, status } = event.queryStringParameters || {};
    
    const params = {
      TableName: 'onpoint-admin-providers-dev',
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
    console.log('🔍 Lambda: Creando provider...');
    
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
      TableName: 'onpoint-admin-providers-dev',
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

// Handler principal
exports.handler = async (event) => {
  console.log('🔍 Event:', JSON.stringify(event, null, 2));
  
  // Manejar CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return createResponse(200, { message: 'CORS preflight' });
  }
  
  try {
    switch (event.httpMethod) {
      case 'GET':
        return await exports.getProviders(event);
      case 'POST':
        return await exports.createProvider(event);
      default:
        return createResponse(405, {
          success: false,
          error: 'Método no permitido',
          message: `Método ${event.httpMethod} no soportado`
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
