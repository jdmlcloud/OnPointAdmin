const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');

// Configurar DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});
const dynamodb = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'OnPointAdmin-Products-sandbox';

// Helper para crear respuestas con CORS
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

exports.handler = async (event) => {
  console.log('🔍 Simple Event:', JSON.stringify(event, null, 2));
  
  try {
    // Manejar OPTIONS para CORS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight' });
    }

    if (event.httpMethod === 'GET') {
      const params = {
        TableName: TABLE_NAME
      };

      const result = await dynamodb.send(new ScanCommand(params));
      
      return createResponse(200, {
        success: true,
        products: result.Items || [],
        message: 'Productos obtenidos exitosamente'
      });
    }

    if (event.httpMethod === 'POST') {
      console.log('📝 POST request received');
      console.log('Event body:', event.body);
      
      const productData = JSON.parse(event.body || '{}');
      console.log('Parsed product data:', productData);
      
      // Validar datos requeridos
      if (!productData.name || !productData.category || !productData.price) {
        return createResponse(400, {
          success: false,
          error: 'Faltan campos requeridos',
          message: 'name, category y price son obligatorios'
        });
      }

      const product = {
        id: `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...productData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const params = {
        TableName: TABLE_NAME,
        Item: product
      };

      await dynamodb.send(new PutCommand(params));
      
      return createResponse(201, {
        success: true,
        product,
        message: 'Producto creado exitosamente'
      });
    }

    return createResponse(405, {
      success: false,
      error: 'Método no permitido'
    });

  } catch (error) {
    console.error('❌ Error:', error);
    console.error('❌ Error stack:', error.stack);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error.message || 'Error desconocido'
    });
  }
};
