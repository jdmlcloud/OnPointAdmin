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
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Max-Age': '86400'
  },
  body: JSON.stringify(body)
});

// GET /stats
exports.getStats = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo estadísticas generales...');
    
    // Obtener estadísticas de usuarios
    const usersResult = await docClient.send(new ScanCommand({
      TableName: process.env.DYNAMODB_USERS_TABLE || 'OnPointAdmin-Users-sandbox'
    }));
    
    // Obtener estadísticas de providers
    const providersResult = await docClient.send(new ScanCommand({
      TableName: process.env.DYNAMODB_PROVIDERS_TABLE || 'OnPointAdmin-Providers-sandbox'
    }));
    
    // Obtener estadísticas de products
    const productsResult = await docClient.send(new ScanCommand({
      TableName: process.env.DYNAMODB_PRODUCTS_TABLE || 'OnPointAdmin-Products-sandbox'
    }));
    
    // Obtener estadísticas de logos
    const logosResult = await docClient.send(new ScanCommand({
      TableName: process.env.DYNAMODB_LOGOS_TABLE || 'OnPointAdmin-Logos-sandbox'
    }));
    
    // Obtener estadísticas de clients
    const clientsResult = await docClient.send(new ScanCommand({
      TableName: process.env.DYNAMODB_CLIENTS_TABLE || 'OnPointAdmin-Clients-sandbox'
    }));
    
    const users = usersResult.Items || [];
    const providers = providersResult.Items || [];
    const products = productsResult.Items || [];
    const logos = logosResult.Items || [];
    const clients = clientsResult.Items || [];
    
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
      logos: {
        total: logos.length,
        byFormat: logos.reduce((acc, logo) => {
          const format = logo.format || 'unknown';
          acc[format] = (acc[format] || 0) + 1;
          return acc;
        }, {}),
        byClient: logos.reduce((acc, logo) => {
          const client = logo.brand || 'unknown';
          acc[client] = (acc[client] || 0) + 1;
          return acc;
        }, {}),
        recent: logos.filter(logo => {
          const createdAt = new Date(logo.createdAt || logo.created_at);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return createdAt > weekAgo;
        }).length
      },
      clients: {
        total: clients.length,
        withLogos: clients.filter(client => {
          const clientLogos = logos.filter(logo => logo.brand === client.brand);
          return clientLogos.length > 0;
        }).length,
        recent: clients.filter(client => {
          const createdAt = new Date(client.createdAt || client.created_at);
          const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          return createdAt > weekAgo;
        }).length
      },
      overview: {
        totalUsers: users.length,
        totalProviders: providers.length,
        totalProducts: products.length,
        totalLogos: logos.length,
        totalClients: clients.length,
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
