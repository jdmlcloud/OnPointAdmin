import { Amplify } from 'aws-amplify'

// Configuración de AWS Amplify para Cognito
export const configureAmplify = () => {
  const config = {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID || '',
        userPoolClientId: process.env.NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID || '',
        loginWith: {
          email: true,
          username: false,
          phone: false
        }
      }
    }
  }
  
  console.log('Configurando Amplify con:', {
    userPoolId: config.Auth.Cognito.userPoolId,
    userPoolClientId: config.Auth.Cognito.userPoolClientId
  })
  
  Amplify.configure(config)
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
