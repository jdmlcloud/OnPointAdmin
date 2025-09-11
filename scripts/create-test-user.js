const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const dynamodb = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' });

async function createTestUser() {
  try {
    const userId = `user-${Date.now()}-${uuidv4().substring(0, 8)}`;
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const userData = {
      id: userId,
      email: 'admin@onpoint.com',
      password: hashedPassword,
      firstName: 'Super',
      lastName: 'Admin',
      role: 'SUPER_ADMIN',
      department: 'IT',
      position: 'System Administrator',
      phone: '+1234567890',
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'system'
    };

    await dynamodb.put({
      TableName: 'OnPointAdmin-Users-sandbox',
      Item: userData
    }).promise();

    console.log('✅ Usuario de prueba creado exitosamente:');
    console.log('📧 Email: admin@onpoint.com');
    console.log('🔑 Password: admin123');
    console.log('👤 Rol: SUPER_ADMIN');
    console.log('🆔 ID:', userId);
    
  } catch (error) {
    console.error('❌ Error creando usuario de prueba:', error);
  }
}

createTestUser();
