# Configuración de Infraestructura OnPoint Admin

Este directorio contiene los archivos de configuración para los diferentes entornos de OnPoint Admin.

## Estructura de archivos

### Archivos de configuración por entorno:
- `infrastructure-production.env` - Configuración completa de producción
- `infrastructure-sandbox.env` - Configuración completa de sandbox
- `aws-protection-production.env` - Protección AWS para producción
- `aws-protection-sandbox.env` - Protección AWS para sandbox
- `domain-production.env` - Configuración de dominio para producción
- `domain-sandbox.env` - Configuración de dominio para sandbox
- `api-production.env` - Configuración de API para producción
- `api-sandbox.env` - Configuración de API para sandbox

## Scripts de configuración

### Scripts principales:
- `../scripts/setup-production-infrastructure.sh` - Script maestro para configurar toda la infraestructura
- `../scripts/setup-aws-protection.sh` - Configurar protección AWS (WAF, Rate Limiting)
- `../scripts/setup-domain-registration.sh` - Registrar dominio y configurar DNS
- `../scripts/setup-custom-domain.sh` - Configurar dominio personalizado en API Gateway

### Uso de los scripts:

```bash
# Configurar infraestructura completa
./scripts/setup-production-infrastructure.sh production onpoint.com
./scripts/setup-production-infrastructure.sh sandbox onpoint.com

# Configurar solo protección AWS
./scripts/setup-aws-protection.sh production
./scripts/setup-aws-protection.sh sandbox

# Configurar solo dominio
./scripts/setup-domain-registration.sh onpoint.com production
./scripts/setup-domain-registration.sh onpoint.com sandbox

# Configurar solo dominio personalizado en API Gateway
./scripts/setup-custom-domain.sh production api.onpoint.com
./scripts/setup-custom-domain.sh sandbox api-sandbox.onpoint.com
```

## Entornos

### Producción
- **Dominio**: `onpoint.com`
- **API**: `api.onpoint.com`
- **App**: `app.onpoint.com`
- **Admin**: `admin.onpoint.com`
- **Rate Limit**: 1000 req/s
- **Burst**: 2000 req/s
- **Log Level**: INFO

### Sandbox
- **Dominio**: `onpoint.com`
- **API**: `api-sandbox.onpoint.com`
- **App**: `app-sandbox.onpoint.com`
- **Admin**: `admin-sandbox.onpoint.com`
- **Rate Limit**: 500 req/s
- **Burst**: 1000 req/s
- **Log Level**: DEBUG

## Protecciones implementadas

### WAF (Web Application Firewall)
- Rate Limiting (DDoS protection)
- AWS Managed Rules Common Rule Set (OWASP Top 10)
- AWS Managed Rules Known Bad Inputs
- AWS Managed Rules SQL Injection Protection

### Monitoreo
- CloudWatch Logs
- CloudWatch Alarms para errores 4xx y 5xx
- Métricas de API Gateway
- Alertas por SNS

### Seguridad
- Certificados SSL/TLS
- IAM roles seguros
- Throttling configurado
- Logging completo

## Variables de entorno

Cada archivo de configuración contiene las variables necesarias para:

- URLs de la API
- IDs de recursos AWS
- Configuración de seguridad
- Configuración de monitoreo
- Configuración de dominio

## Próximos pasos

1. **Registrar dominio**: Ejecutar `setup-domain-registration.sh`
2. **Configurar protección**: Ejecutar `setup-aws-protection.sh`
3. **Configurar dominio personalizado**: Ejecutar `setup-custom-domain.sh`
4. **Actualizar aplicación**: Usar las variables de entorno generadas
5. **Probar infraestructura**: Verificar que todo funcione correctamente

## Troubleshooting

### Problemas comunes:
- **Certificado no validado**: Esperar propagación DNS (5-10 minutos)
- **WAF no asociado**: Verificar permisos IAM
- **DNS no resuelve**: Verificar configuración de Route 53
- **API no accesible**: Verificar configuración de API Gateway

### Logs útiles:
- CloudWatch Logs: `/aws/apigateway/{environment}`
- WAF Logs: CloudWatch Logs del WAF
- API Gateway Logs: CloudWatch Logs de API Gateway
