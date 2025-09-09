const { DynamoDBClient } = require('@aws-sdk/client-dynamodb')
const { DynamoDBDocumentClient, ScanCommand, PutCommand, UpdateCommand, DeleteCommand, GetCommand } = require('@aws-sdk/lib-dynamodb')
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3')

// Configurar clientes AWS
const dynamodb = new DynamoDBClient({ region: 'us-east-1' })
const s3 = new S3Client({ region: 'us-east-1' })

// Detectar entorno dinámicamente
const detectEnvironment = () => {
  const environment = process.env.ENVIRONMENT || 'sandbox'
  return environment
}

const getTableName = (environment) => {
  return `OnPointAdmin-Logos-${environment}`
}

const getBucketName = (environment) => {
  return `onpoint-logos-${environment}`
}

// Función para crear respuesta HTTP
const createResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token',
      'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS'
    },
    body: JSON.stringify(body)
  }
}

exports.handler = async (event) => {
  console.log('🔍 Event:', JSON.stringify(event, null, 2))
  
  try {
    const environment = detectEnvironment()
    const tableName = getTableName(environment)
    const bucketName = getBucketName(environment)
    
    console.log(`🌍 Environment: ${environment}, Table: ${tableName}, Bucket: ${bucketName}`)

    // GET /logos - Listar todos los logos
    if (event.httpMethod === 'GET') {
      console.log('📋 GET request received')
      
      const params = {
        TableName: tableName
      }

      const result = await dynamodb.send(new ScanCommand(params))
      
      return createResponse(200, {
        success: true,
        logos: result.Items || [],
        message: 'Logos obtenidos exitosamente'
      })
    }

    // POST /logos - Crear nuevo logo
    if (event.httpMethod === 'POST') {
      console.log('📝 POST request received')
      console.log('Event body:', event.body)
      
      let logoData
      try {
        logoData = typeof event.body === 'string' ? JSON.parse(event.body) : event.body
        console.log('Parsed logo data:', logoData)
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError)
        return createResponse(400, {
          success: false,
          error: 'Invalid JSON',
          message: 'El cuerpo de la petición no es un JSON válido'
        })
      }
      
      // Validar datos requeridos
      if (!logoData.name || !logoData.category || !logoData.fileUrl || !logoData.clientName) {
        return createResponse(400, {
          success: false,
          error: 'Faltan campos requeridos',
          message: 'name, category, fileUrl y clientName son obligatorios'
        })
      }

      const logo = {
        id: `logo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: logoData.name,
        description: logoData.description || '',
        category: logoData.category,
        fileType: logoData.fileType || 'unknown',
        fileSize: logoData.fileSize || 0,
        fileUrl: logoData.fileUrl,
        thumbnailUrl: logoData.thumbnailUrl || null,
        tags: logoData.tags || [],
        status: logoData.status || 'active',
        // Campos específicos para logos de clientes
        clientId: logoData.clientId || `client-${Date.now()}`,
        clientName: logoData.clientName || '',
        variant: logoData.variant || '',
        isPrimary: logoData.isPrimary === 'true' || logoData.isPrimary === true,
        brand: logoData.brand || '',
        version: logoData.version || '',
        colorVariants: logoData.colorVariants || [],
        usageRights: logoData.usageRights || [],
        dimensions: logoData.dimensions || null,
        dpi: logoData.dpi || null,
        format: logoData.format || logoData.fileType,
        isVector: logoData.isVector || false,
        isTransparent: logoData.isTransparent || false,
        lastUsed: logoData.lastUsed || null,
        downloadCount: logoData.downloadCount || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const params = {
        TableName: tableName,
        Item: logo
      }

      console.log('Saving logo to DynamoDB:', params)
      await dynamodb.send(new PutCommand(params))
      
      return createResponse(201, {
        success: true,
        logo,
        message: 'Logo creado exitosamente'
      })
    }

    // PUT /logos/{id} - Actualizar logo
    if (event.httpMethod === 'PUT') {
      console.log('📝 PUT request received')
      console.log('Event pathParameters:', event.pathParameters)
      console.log('Event path:', event.path)
      
      const logoId = event.pathParameters?.id
      console.log('Logo ID extracted:', logoId)
      
      if (!logoId) {
        return createResponse(400, {
          success: false,
          error: 'ID de logo requerido',
          message: 'No se encontró el ID del logo en la URL'
        })
      }

      const updateData = JSON.parse(event.body)
      console.log('Update data received:', updateData)
      
      // Construir la expresión de actualización dinámicamente
      const updateExpression = []
      const expressionAttributeNames = {}
      const expressionAttributeValues = {}

      // Agregar campos que están presentes en updateData
      Object.keys(updateData).forEach(key => {
        if (key !== 'id' && key !== 'createdAt') {
          updateExpression.push(`#${key} = :${key}`)
          expressionAttributeNames[`#${key}`] = key
          expressionAttributeValues[`:${key}`] = updateData[key]
        }
      })

      // Siempre agregar updatedAt
      updateExpression.push('#updatedAt = :updatedAt')
      expressionAttributeNames['#updatedAt'] = 'updatedAt'
      expressionAttributeValues[':updatedAt'] = new Date().toISOString()

      if (updateExpression.length === 0) {
        return createResponse(400, {
          success: false,
          error: 'No hay datos para actualizar',
          message: 'Debe proporcionar al menos un campo para actualizar'
        })
      }

      const params = {
        TableName: tableName,
        Key: { id: logoId },
        UpdateExpression: `SET ${updateExpression.join(', ')}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
      }

      console.log('Updating logo in DynamoDB:', params)
      const result = await dynamodb.send(new UpdateCommand(params))
      
      return createResponse(200, {
        success: true,
        logo: result.Attributes,
        message: 'Logo actualizado exitosamente'
      })
    }

    // DELETE /logos/{id} - Eliminar logo
    if (event.httpMethod === 'DELETE') {
      console.log('🗑️ DELETE request received')
      console.log('Event pathParameters:', event.pathParameters)
      console.log('Event path:', event.path)
      
      const logoId = event.pathParameters?.id
      console.log('Logo ID extracted:', logoId)
      
      if (!logoId) {
        return createResponse(400, {
          success: false,
          error: 'ID de logo requerido',
          message: 'No se encontró el ID del logo en la URL'
        })
      }

      // Primero obtener el logo para obtener la URL del archivo
      const getParams = {
        TableName: tableName,
        Key: { id: logoId }
      }

      const logoResult = await dynamodb.send(new GetCommand(getParams))
      
      if (!logoResult.Item) {
        return createResponse(404, {
          success: false,
          error: 'Logo no encontrado',
          message: 'El logo especificado no existe'
        })
      }

      // Eliminar archivo de S3 si existe
      if (logoResult.Item.fileUrl) {
        try {
          const s3Key = logoResult.Item.fileUrl.split('/').pop()
          const deleteParams = {
            Bucket: bucketName,
            Key: s3Key
          }
          await s3.send(new DeleteObjectCommand(deleteParams))
          console.log('File deleted from S3:', s3Key)
        } catch (s3Error) {
          console.error('Error deleting file from S3:', s3Error)
          // Continuar con la eliminación del registro aunque falle S3
        }
      }

      // Eliminar registro de DynamoDB
      const params = {
        TableName: tableName,
        Key: { id: logoId }
      }

      console.log('Deleting logo from DynamoDB:', params)
      await dynamodb.send(new DeleteCommand(params))
      
      return createResponse(200, {
        success: true,
        message: 'Logo eliminado exitosamente'
      })
    }

    // GET /logos/{id} - Obtener logo específico
    if (event.httpMethod === 'GET' && event.pathParameters?.id) {
      console.log('📋 GET by ID request received')
      console.log('Event pathParameters:', event.pathParameters)
      
      const logoId = event.pathParameters.id
      console.log('Logo ID extracted:', logoId)
      
      const params = {
        TableName: tableName,
        Key: { id: logoId }
      }

      const result = await dynamodb.send(new GetCommand(params))
      
      if (!result.Item) {
        return createResponse(404, {
          success: false,
          error: 'Logo no encontrado',
          message: 'El logo especificado no existe'
        })
      }
      
      return createResponse(200, {
        success: true,
        logo: result.Item,
        message: 'Logo obtenido exitosamente'
      })
    }

    return createResponse(405, {
      success: false,
      error: 'Método no permitido',
      message: `Método ${event.httpMethod} no soportado`
    })

  } catch (error) {
    console.error('❌ Error:', error)
    console.error('❌ Error stack:', error.stack)
    return createResponse(500, {
      success: false,
      error: 'Error interno del servidor',
      message: error.message || 'Error desconocido'
    })
  }
}
