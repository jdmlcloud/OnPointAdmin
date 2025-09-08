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

// Función para normalizar tags
const normalizeTag = (tag) => {
  return tag.toLowerCase().trim();
};

// GET /tags
exports.getTags = async (event) => {
  try {
    console.log('🔍 Lambda: Obteniendo tags...');
    
    const result = await docClient.send(new ScanCommand({
      TableName: 'onpoint-admin-providers-dev',
      ProjectionExpression: 'tags'
    }));
    
    const providers = result.Items || [];
    const allTags = new Set();
    
    providers.forEach(provider => {
      if (provider.tags && Array.isArray(provider.tags)) {
        provider.tags.forEach(tag => {
          if (tag && typeof tag === 'string') {
            allTags.add(normalizeTag(tag));
          }
        });
      }
    });
    
    const uniqueTags = Array.from(allTags).sort();
    
    return createResponse(200, {
      success: true,
      tags: uniqueTags,
      message: 'Tags obtenidos exitosamente desde DynamoDB'
    });
    
  } catch (error) {
    console.error('❌ Error en getTags:', error);
    return createResponse(500, {
      success: false,
      error: 'Error al obtener tags',
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
      return await exports.getTags(event);
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
