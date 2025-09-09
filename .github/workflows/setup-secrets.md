# Configuración de Secretos para GitHub Actions

## Secretos Requeridos

### Para Sandbox
- `AWS_ACCESS_KEY_ID`: Clave de acceso AWS para sandbox
- `AWS_SECRET_ACCESS_KEY`: Clave secreta AWS para sandbox

### Para Producción
- `AWS_ACCESS_KEY_ID_PROD`: Clave de acceso AWS para producción
- `AWS_SECRET_ACCESS_KEY_PROD`: Clave secreta AWS para producción
- `CLOUDFRONT_DISTRIBUTION_ID`: ID de distribución CloudFront

## Cómo Configurar los Secretos

1. Ve a tu repositorio en GitHub
2. Haz clic en "Settings" (Configuración)
3. En el menú lateral, haz clic en "Secrets and variables" > "Actions"
4. Haz clic en "New repository secret"
5. Agrega cada secreto con su nombre y valor correspondiente

## Permisos IAM Requeridos

### Para Sandbox
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*",
        "dynamodb:*",
        "apigateway:*",
        "s3:*",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

### Para Producción
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "lambda:*",
        "dynamodb:*",
        "apigateway:*",
        "s3:*",
        "cloudfront:*",
        "iam:PassRole"
      ],
      "Resource": "*"
    }
  ]
}
```

## Variables de Entorno

También puedes configurar variables de entorno en GitHub Actions:

- `AWS_REGION`: us-east-1
- `STAGE`: sandbox o prod
- `NODE_VERSION`: 18
