const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');

// Configurar DynamoDB
const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1'
});
const dynamodb = DynamoDBDocumentClient.from(client);

// Detectar entorno dinámicamente
const detectEnvironment = () => {
  const environment = process.env.ENVIRONMENT || 'sandbox';
  return environment;
};

const getTableName = (environment) => {
  return `OnPointAdmin-Products-${environment}`;
};

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
    const environment = detectEnvironment();
    const tableName = getTableName(environment);
    console.log(`🌍 Environment: ${environment}, Table: ${tableName}`);
    
    // Manejar OPTIONS para CORS
    if (event.httpMethod === 'OPTIONS') {
      return createResponse(200, { message: 'CORS preflight' });
    }

    if (event.httpMethod === 'GET') {
      const params = {
        TableName: tableName
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
      
      let productData;
      try {
        productData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body;
        console.log('Parsed product data:', productData);
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        return createResponse(400, {
          success: false,
          error: 'Invalid JSON',
          message: 'El cuerpo de la petición no es un JSON válido'
        });
      }
      
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
        name: productData.name,
        description: productData.description || '',
        category: productData.category,
        price: Number(productData.price),
        currency: productData.currency || 'USD',
        stock: productData.stock || 0,
        images: productData.images || [],
        status: productData.status || 'active',
        providerName: productData.providerName || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const params = {
        TableName: tableName,
        Item: product
      };

      console.log('Saving product to DynamoDB:', params);
      await dynamodb.send(new PutCommand(params));
      
      return createResponse(201, {
        success: true,
        product,
        message: 'Producto creado exitosamente'
      });
    }

    // PUT /products/{id} - Actualizar producto
    if (event.httpMethod === 'PUT') {
      console.log('📝 PUT request received');
      console.log('Event pathParameters:', event.pathParameters);
      console.log('Event path:', event.path);
      
      const productId = event.pathParameters?.id;
      console.log('Product ID extracted:', productId);
      
      if (!productId) {
        return createResponse(400, {
          success: false,
          error: 'ID de producto requerido',
          message: 'No se encontró el ID del producto en la URL'
        });
      }

      const updateData = JSON.parse(event.body);
      console.log('Update data received:', updateData);
      
      // Construir la expresión de actualización dinámicamente
      const updateExpression = [];
      const expressionAttributeNames = {};
      const expressionAttributeValues = {};

      // Agregar campos que están presentes en updateData
      Object.keys(updateData).forEach(key => {
        if (key !== 'id' && key !== 'createdAt') {
          updateExpression.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = updateData[key];
        }
      });

      // Siempre agregar updatedAt
      updateExpression.push('#updatedAt = :updatedAt');
      expressionAttributeNames['#updatedAt'] = 'updatedAt';
      expressionAttributeValues[':updatedAt'] = new Date().toISOString();

      if (updateExpression.length === 0) {
        return createResponse(400, {
          success: false,
          error: 'No hay datos para actualizar',
          message: 'Debe proporcionar al menos un campo para actualizar'
        });
      }

      const params = {
        TableName: tableName,
        Key: { id: productId },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      };

      const result = await dynamodb.send(new UpdateCommand(params));
      
      return createResponse(200, {
        success: true,
        product: result.Attributes,
        message: 'Producto actualizado exitosamente'
      });
    }

    // DELETE /products/{id} - Eliminar producto
    if (event.httpMethod === 'DELETE') {
      console.log('🗑️ DELETE request received');
      console.log('Event pathParameters:', event.pathParameters);
      console.log('Event path:', event.path);
      
      const productId = event.pathParameters?.id;
      console.log('Product ID extracted:', productId);
      
      if (!productId) {
        return createResponse(400, {
          success: false,
          error: 'ID de producto requerido',
          message: 'No se encontró el ID del producto en la URL'
        });
      }

      const params = {
        TableName: tableName,
        Key: { id: productId }
      };

      await dynamodb.send(new DeleteCommand(params));
      
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
    console.error('❌ Error stack:', error.stack);
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error.message || 'Error desconocido'
    });
  }
};
