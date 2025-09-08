import { Amplify } from 'aws-amplify'

// Configuración de AWS Amplify para Cognito
export const configureAmplify = () => {
  const config = {
    Auth: {
      Cognito: {
        userPoolId: process.env.NEXT_PUBLIC_COGNITO_USER_POOL_ID || 'us-east-1_pnE1wndnB',
        userPoolClientId: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '76ho4o7fqhh3vdsiqqq269jjt5',
        loginWith: {
          email: true,
          username: false,
          phone: false
        }
      }
    }
  }
  
  // Solo mostrar logs en desarrollo
  if (process.env.NODE_ENV === 'development') {
    console.log('Configurando Amplify con:', {
      userPoolId: config.Auth.Cognito.userPoolId,
      userPoolClientId: config.Auth.Cognito.userPoolClientId
    })
  }
  
  Amplify.configure(config)
}

// Configuración para el lado del servidor
export const getAmplifyConfig = () => {
  return {
    Auth: {
      region: process.env.AWS_REGION || 'us-east-1',
      userPoolId: process.env.COGNITO_USER_POOL_ID || 'us-east-1_pnE1wndnB',
      userPoolWebClientId: process.env.COGNITO_CLIENT_ID || '76ho4o7fqhh3vdsiqqq269jjt5',
    }
  }
}
