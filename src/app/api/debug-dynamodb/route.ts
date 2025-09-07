import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Recopilar toda la información de debugging
    const debugInfo = {
      timestamp: new Date().toISOString(),
      environment: {
        NODE_ENV: process.env.NODE_ENV,
        VERCEL: process.env.VERCEL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
        DYNAMODB_CONFIGURED: process.env.DYNAMODB_CONFIGURED,
        DYNAMODB_REGION: process.env.DYNAMODB_REGION,
        DYNAMODB_ACCESS_KEY_ID: process.env.DYNAMODB_ACCESS_KEY_ID ? '***SET***' : 'undefined',
        DYNAMODB_SECRET_ACCESS_KEY: process.env.DYNAMODB_SECRET_ACCESS_KEY ? '***SET***' : 'undefined',
        AWS_REGION: process.env.AWS_REGION,
        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID ? '***SET***' : 'undefined',
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY ? '***SET***' : 'undefined',
      },
      productionDetection: {
        isProductionByNodeEnv: process.env.NODE_ENV === 'production',
        isProductionByVercel: process.env.VERCEL === '1',
        isProductionByNextAuthUrl: process.env.NEXTAUTH_URL?.includes('amplifyapp.com'),
        finalIsProduction: process.env.NODE_ENV === 'production' || 
                          process.env.VERCEL === '1' ||
                          process.env.NEXTAUTH_URL?.includes('amplifyapp.com')
      },
      shouldUseRealData: {
        hasDynamoDbConfigured: process.env.DYNAMODB_CONFIGURED === 'true',
        hasDynamoDbAccessKey: !!(process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID),
        hasDynamoDbSecretKey: !!(process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY),
        hasDynamoDbRegion: !!(process.env.DYNAMODB_REGION || process.env.AWS_REGION),
        finalShouldUseReal: (process.env.NODE_ENV === 'production' || 
                           process.env.VERCEL === '1' ||
                           process.env.NEXTAUTH_URL?.includes('amplifyapp.com')) ||
                          (process.env.DYNAMODB_CONFIGURED === 'true' && 
                           !!(process.env.DYNAMODB_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID) && 
                           !!(process.env.DYNAMODB_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY) &&
                           !!(process.env.DYNAMODB_REGION || process.env.AWS_REGION))
      }
    }

    return NextResponse.json({
      success: true,
      debug: debugInfo,
      message: 'Debug information collected successfully'
    })

  } catch (error) {
    console.error('Error in debug endpoint:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Error collecting debug information'
    }, { status: 500 })
  }
}
