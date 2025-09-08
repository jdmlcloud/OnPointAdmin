export const env = {
  // Database
  DYNAMODB_REGION: process.env.DYNAMODB_REGION || 'us-east-1',
  DYNAMODB_TABLE_PREFIX: process.env.DYNAMODB_TABLE_PREFIX || 'onpoint',
  
  // AWS Configuration
  AWS_REGION: process.env.AWS_REGION || 'us-east-1',
  AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
  AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
  
  // S3 Configuration
  S3_BUCKET_NAME: process.env.S3_BUCKET_NAME || 'onpoint-storage',
  S3_REGION: process.env.S3_REGION || 'us-east-1',
  CLOUDFRONT_DOMAIN: process.env.CLOUDFRONT_DOMAIN || '',
  
  // Authentication
  NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'https://sandbox.d3ts6pwgn7uyyh.amplifyapp.com',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || '',
  COGNITO_CLIENT_ID: process.env.COGNITO_CLIENT_ID || '',
  COGNITO_CLIENT_SECRET: process.env.COGNITO_CLIENT_SECRET || '',
  COGNITO_ISSUER: process.env.COGNITO_ISSUER || '',
  
  // AI Services
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || '',
  
  // WhatsApp Business API
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || '',
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || '',
  
  // Email Service
  RESEND_API_KEY: process.env.RESEND_API_KEY || '',
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const
