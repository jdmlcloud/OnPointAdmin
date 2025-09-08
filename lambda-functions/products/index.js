const AWS = require('aws-sdk');

// Configurar DynamoDB
const dynamodb = new AWS.DynamoDB.DocumentClient({
  region: process.env.AWS_REGION || 'us-east-1'
});

const TABLE_NAME = 'onpoint-products';

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

// GET /products - Obtener todos los productos
exports.handler = async (event) => {
  console.log('🔍 Event:', JSON.stringify(event, null, 2));
  
  try {
    // Manejar OPTIONS para CORS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight' });
    }

    if (event.httpMethod === 'GET') {
      const params = {
        TableName: TABLE_NAME
      };

      const result = await dynamodb.scan(params).promise();
      
      return createResponse(200, {
        success: true,
        products: result.Items || [],
        message: 'Productos obtenidos exitosamente'
      });
    }

    if (event.httpMethod === 'POST') {
      const productData = JSON.parse(event.body);
      
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

      await dynamodb.put(params).promise();
      
      return createResponse(201, {
        success: true,
        product,
        message: 'Producto creado exitosamente'
      });
    }

    // PUT /products/{id} - Actualizar producto
    if (event.httpMethod === 'PUT') {
      const productId = event.pathParameters?.id;
      if (!productId) {
        return createResponse(400, {
          success: false,
          error: 'ID de producto requerido'
        });
      }

      const updateData = JSON.parse(event.body);
      
      const params = {
        TableName: TABLE_NAME,
        Key: { id: productId },
        UpdateExpression: 'SET #name = :name, #description = :description, #category = :category, #price = :price, #currency = :currency, #stock = :stock, #status = :status, #updatedAt = :updatedAt',
        ExpressionAttributeNames: {
          '#name': 'name',
          '#description': 'description',
          '#category': 'category',
          '#price': 'price',
          '#currency': 'currency',
          '#stock': 'stock',
          '#status': 'status',
          '#updatedAt': 'updatedAt'
        },
        ExpressionAttributeValues: {
          ':name': updateData.name,
          ':description': updateData.description || '',
          ':category': updateData.category,
          ':price': updateData.price,
          ':currency': updateData.currency || 'USD',
          ':stock': updateData.stock || 0,
          ':status': updateData.status || 'active',
          ':updatedAt': new Date().toISOString()
        },
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.update(params).promise();
      
      return createResponse(200, {
        success: true,
        product: result.Attributes,
        message: 'Producto actualizado exitosamente'
      });
    }

    // DELETE /products/{id} - Eliminar producto
    if (event.httpMethod === 'DELETE') {
      const productId = event.pathParameters?.id;
      if (!productId) {
        return createResponse(400, {
          success: false,
          error: 'ID de producto requerido'
        });
      }

      const params = {
        TableName: TABLE_NAME,
        Key: { id: productId }
      };

      await dynamodb.delete(params).promise();
      
      return createResponse(200, {
        success: true,
        message: 'Producto eliminado exitosamente'
      });
    }

    return createResponse(405, {
      success: false,
      error: 'Método no permitido'
    });

  } catch (error) {
    console.error('❌ Error:', error);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error.message
    });
  }
};
