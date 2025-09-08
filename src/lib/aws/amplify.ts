import { Amplify } from 'aws-amplify'

// Configuración de AWS Amplify para Cognito
export const configureAmplify = () => {
  const config = {
    Auth: {
      Cognito: {
        userPoolId: 'us-east-1_pnE1wndnB',
        userPoolClientId: '76ho4o7fqhh3vdsiqqq269jjt5',
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
      region: 'us-east-1',
      userPoolId: 'us-east-1_pnE1wndnB',
      userPoolWebClientId: '76ho4o7fqhh3vdsiqqq269jjt5',
    }
  }
}
