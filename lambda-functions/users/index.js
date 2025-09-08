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
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
  },
  body: JSON.stringify(body)
});

// GET /users
exports.getUsers = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo users...');
    
    const { page = 1, limit = 10, status } = event.queryStringParameters || {};
    
    const params = {
      TableName: 'onpoint-admin-users-dev',
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
      users: result.Items || [],
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: result.Count || 0,
        totalPages: Math.ceil((result.Count || 0) / parseInt(limit))
      },
      message: 'Usuarios obtenidos exitosamente desde DynamoDB'
    });
    
  } catch (error) {
    console.error('❌ Error en getUsers:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener usuarios',
      message: error.message
    });
  }
};

// GET /users/stats
exports.getUserStats = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo estadísticas de usuarios...');
    
    const result = await docClient.send(new ScanCommand({
      TableName: 'onpoint-admin-users-dev'
    }));
    
    const users = result.Items || [];
    const stats = {
      total: users.length,
      active: users.filter(u => u.status === 'active').length,
      inactive: users.filter(u => u.status === 'inactive').length,
      pending: users.filter(u => u.status === 'pending').length,
      admins: users.filter(u => u.role === 'admin').length,
      managers: users.filter(u => u.role === 'manager').length,
      users: users.filter(u => u.role === 'user').length
    };
    
    return createResponse(200, {
      success: true,
      stats,
      message: 'Estadísticas de usuarios obtenidas exitosamente'
    });
    
  } catch (error) {
    console.error('❌ Error en getUserStats:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener estadísticas de usuarios',
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
    
    if (path === '/users/stats') {
      return await exports.getUserStats(event);
    } else if (path === '/users') {
      return await exports.getUsers(event);
    } else {
      return createResponse(404, {
        success: false,
        error: 'Endpoint no encontrado',
        message: `Ruta ${path} no existe`
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
