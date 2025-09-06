import { Amplify } from 'aws-amplify'

// Configuración de AWS Amplify para Cognito
export const configureAmplify = () => {
  Amplify.configure({
    Auth: {
      region: process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1',
      userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID || '',
      userPoolWebClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID || '',
    }
  })
}

// Configuración para el lado del servidor
export const getAmplifyConfig = () => {
  return {
    Auth: {
      region: process.env.AWS_REGION || 'us-east-1',
      userPoolId: process.env.AWS_COGNITO_USER_POOL_ID || '',
      userPoolWebClientId: process.env.AWS_COGNITO_CLIENT_ID || '',
    }
  }
}
