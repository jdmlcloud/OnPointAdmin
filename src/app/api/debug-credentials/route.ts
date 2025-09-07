import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 DEBUG: Verificando credenciales DynamoDB...');
    
    // Verificar variables de entorno
    const envVars = {
      DYNAMODB_ACCESS_KEY_ID: process.env.DYNAMODB_ACCESS_KEY_ID ? '✅ Configurada' : '❌ No configurada',
      DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY ? '✅ Configurada' : '❌ No configurada',
      DYNAMODB_REGION: process.env.DYNAMODB_REGION || '❌ No configurada',
      AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '✅ Configurada' : '❌ No configurada',
      AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '✅ Configurada' : '❌ No configurada',
      AWS_REGION: process.env.AWS_REGION || '❌ No configurada',
    };

    console.log('🔍 Variables de entorno:', envVars);

    // Crear cliente con configuración explícita
    const accessKeyId = process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.DYNAMODB_REGION || process.env.AWS_REGION || 'us-east-1';

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json({
        success: false,
        error: 'Credenciales no configuradas',
        envVars,
        message: 'Faltan ACCESS_KEY_ID o SECRET_ACCESS_KEY'
      }, { status: 500 });
    }

    console.log('🔍 Creando cliente DynamoDB...');
    console.log('🔍 Access Key ID:', accessKeyId.substring(0, 8) + '...');
    console.log('🔍 Region:', region);

    const dynamoDBClient = new DynamoDBClient({
      region: region,
      credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
      },
    });

    const client = DynamoDBDocumentClient.from(dynamoDBClient);

    console.log('🔍 Probando conexión con ListTables...');
    
    // Probar conexión con ListTables
    const command = new ListTablesCommand({});
    const result = await client.send(command);

    console.log('✅ Conexión exitosa! Tablas encontradas:', result.TableNames);

    return NextResponse.json({
      success: true,
      message: 'Conexión exitosa a DynamoDB',
      envVars,
      credentials: {
        accessKeyId: accessKeyId.substring(0, 8) + '...',
        region: region,
        hasSecretKey: !!secretAccessKey
      },
      tables: result.TableNames,
      timestamp: new Date().toISOString()
    });

  } catch (error: any) {
    console.error('❌ Error en debug-credentials:', error);
    
    return NextResponse.json({
      success: false,
      error: error.message,
      errorCode: error.name,
      errorStack: error.stack,
      envVars: {
        DYNAMODB_ACCESS_KEY_ID: process.env.DYNAMODB_ACCESS_KEY_ID ? '✅ Configurada' : '❌ No configurada',
        DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY ? '✅ Configurada' : '❌ No configurada',
        DYNAMODB_REGION: process.env.DYNAMODB_REGION || '❌ No configurada',
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '✅ Configurada' : '❌ No configurada',
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '✅ Configurada' : '❌ No configurada',
        AWS_REGION: process.env.AWS_REGION || '❌ No configurada',
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}
