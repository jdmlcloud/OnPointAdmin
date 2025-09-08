const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

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
    'Access-Control-Allow-Methods': 'GET,OPTIONS'
  },
  body: JSON.stringify(body)
});

// GET /stats
exports.getStats = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo estadísticas generales...');
    
    // Obtener estadísticas de usuarios
    const usersResult = await docClient.send(new ScanCommand({
      TableName: 'onpoint-admin-users-dev'
    }));
    
    // Obtener estadísticas de providers
    const providersResult = await docClient.send(new ScanCommand({
      TableName: 'onpoint-admin-providers-dev'
    }));
    
    // Obtener estadísticas de products
    const productsResult = await docClient.send(new ScanCommand({
      TableName: 'onpoint-admin-products-dev'
    }));
    
    const users = usersResult.Items || [];
    const providers = providersResult.Items || [];
    const products = productsResult.Items || [];
    
    const stats = {
      users: {
        total: users.length,
        active: users.filter(u => u.status === 'active').length,
        inactive: users.filter(u => u.status === 'inactive').length,
        pending: users.filter(u => u.status === 'pending').length
      },
      providers: {
        total: providers.length,
        active: providers.filter(p => p.status === 'active').length,
        inactive: providers.filter(p => p.status === 'inactive').length,
        pending: providers.filter(p => p.status === 'pending').length
      },
      products: {
        total: products.length,
        active: products.filter(p => p.status === 'active').length,
        inactive: products.filter(p => p.status === 'inactive').length
      },
      overview: {
        totalUsers: users.length,
        totalProviders: providers.length,
        totalProducts: products.length,
        totalActiveUsers: users.filter(u => u.status === 'active').length,
        totalActiveProviders: providers.filter(p => p.status === 'active').length,
        totalActiveProducts: products.filter(p => p.status === 'active').length
      }
    };
    
    return createResponse(200, {
      success: true,
      stats,
      message: 'Estadísticas obtenidas exitosamente desde DynamoDB'
    });
    
  } catch (error) {
    console.error('❌ Error en getStats:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener estadísticas',
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
    if (event.httpMethod === 'GET') {
      return await exports.getStats(event);
    } else {
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
