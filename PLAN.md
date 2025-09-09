# PLAN.md — Reestructuración mínima y segura (dry‑run)

Estado: Solo plan. Sin cambios en frontend ni despliegues. Objetivo: preparar una transición ordenada a una arquitectura por dominios con CI/CD selectivo, IaC por stages y observabilidad básica, respetando entornos local → sandbox → prod.

## 1) Auditoría del repositorio actual

- Estructura relevante detectada:
  - `src/` (Next.js App Router, incluye `src/app/api/` y lógica de negocio en `src/services/`).
  - `backend/` con subcarpetas: `api-gateway/`, `lambda/`, `sqs/` (scripts/plantillas históricas de infraestructura).
  - `lambda-functions/` con funciones por dominio aproximado: `auth/`, `permissions/`, `products/`, `providers/`, `roles/`, `stats/`, `tags/`, `users/` (incluye `index.js`, `package.json` y algunos `.zip`).
  - `infrastructure/` con `aws/`, `terraform/`, `cloudformation/` (no hay CDK app ni Serverless Framework actual).
  - `.github/workflows/ci.yml` (pipeline CI/CD genérico; despliegue placeholder a Amplify, sin deploy selectivo por paths, enfocado a app web).
  - `scripts/` con múltiples scripts de AWS (API Gateway, CORS, Cognito, DynamoDB, deploy de lambdas, etc.).
  - `config/` con varios `.env` por entorno (e.g., `api-*.env`, `dynamodb-*.env`, `production.env`, `sandbox.env`): útiles para normalizar variables por stage.
  - `docs/` con arquitectura y guías; no hay OpenAPI por dominio aún.
- No se encontró `serverless.yml`, `template.yaml` (SAM) ni proyecto CDK.
- No se encontró AppConfig (feature flags) ni utilidades para lectura de flags en Lambdas.
- Variables actuales en código/README: `AWS_*`, `DYNAMODB_*`, `NEXTAUTH_*`, etc. Se requiere estandarizar credenciales de DynamoDB con prefijo `DYNAMODB_` y separar sandbox/prod estrictamente.

## 2) Principios y alcance

- Sin tocar `apps/frontend/*` ni `src/` de frontend; no cambiar Next.js.
- Sin crear/editar/borrar recursos en producción. Todo apunta a `sandbox` por defecto.
- Reestructuración mínima: introducir directorios y archivos base nuevos sin romper lo existente (no borrar `backend/` ni `lambda-functions/`).
- Stages: `local (dev) → sandbox → prod` completamente separados.
- Naming: `OnPointAdmin-<Dominio>-<stage>` para tablas, colas, funciones, roles, etc.

## 3) Qué conservar vs. qué normalizar

- Conservar:
  - `lambda-functions/*` y `backend/*` como legado de referencia. No se tocan ni se eliminan en esta fase.
  - `infrastructure/*` existente (terraform/cloudformation) como histórico.
  - `config/*` y `docs/*` actuales.
- Normalizar (sin romper compatibilidad):
  - Nueva estructura por dominios bajo `services/<dominio>/{handlers, package.json, serverless.yml}`. Migración incremental futura desde `lambda-functions/*`.
  - Variables por stage en `serverless.yml` y `infra/serverless.common.yml` con `stage: ${opt:stage, 'sandbox'}` y nombres `OnPointAdmin-<Dominio>-${self:provider.stage}`.
  - Canary deployments en cada servicio (`deploymentSettings: Linear10PercentEvery1Minute`, alias `live`).
  - Feature flags centralizados en `infra/appconfig.json` y helper de lectura en runtime (Lambdas). Frontend no participa.
  - CI/CD GitHub Actions con despliegue selectivo por paths a sandbox; producción solo al merge a `main` (canary) y nunca automático desde esta rama.

## 4) Riesgos y mitigaciones

- Recursos "-local" en AWS: riesgo de contaminación de cuentas. Mitigación: no crear recursos `-local` en AWS; `local` usa DynamoDB Local opcional (contenedor) con `DDB_ENDPOINT=http://localhost:8000` solo en dev.
- Colisión con recursos existentes (e.g., tablas/funciones con nombres distintos): usar convención `OnPointAdmin-<Dominio>-<stage>` y `stage=sandbox` por defecto para aislar. No eliminar recursos previos; ignorar en IaC nuevo.
- Mezcla de credenciales sandbox/prod: roles por rama y variables por stage. Asunción de rol distinta por entorno (`AWS_SANDBOX_ROLE` / `AWS_PROD_ROLE`). Nunca reutilizar credenciales.
- URLs/ARNs hardcodeados: reemplazar por outputs/vars en IaC; no hardcodear endpoints.
- Pipeline existente (`ci.yml`) despliega app, no servicios: convivirá. El nuevo `deploy.yml` solo afectará `services/**`, `layers/**` e `infra/**` y apuntará a sandbox por defecto.

## 5) Flujo de entornos (target)

- local (dev): desarrollo offline; DynamoDB Local opcional; `serverless offline` si aplica.
- sandbox: entorno de pruebas. Autodeploy selectivo desde ramas `sandbox` y PRs hacia `sandbox`.
- prod: despliegue solo vía PR a `main` y canary (no ejecutado ahora).

## 6) CI/CD (diagrama breve)

```
Dev push → branch sandbox ──[path filters]──▶ Deploy services cambiados (stage=sandbox)
                          └─▶ (layers si cambian)

PR → main ──(merge)──▶ Deploy canary a prod (alias live) [manual gate]

Notas:
- Role sandbox: `${{ secrets.AWS_SANDBOX_ROLE }}`
- Role prod: `${{ secrets.AWS_PROD_ROLE }}` (no ejecutar ahora)
- Sin pasos de frontend (Amplify sigue por ramas)
```

## 7) IaC objetivo (Serverless Framework/CDK si aplica)

- Base común `infra/serverless.common.yml` (provider, plugins, logs, alarms, variables por stage).
- Cada dominio en `services/<dominio>/serverless.yml` heredará del common y definirá:
  - `provider.stage: ${opt:stage, 'sandbox'}`
  - Recursos por stage: tablas DynamoDB `OnPointAdmin-<Dominio>-${self:provider.stage}`.
  - `deploymentSettings` con canary `Linear10PercentEvery1Minute` y alias `live`.
  - Alarmas básicas de `Errors` y `Throttles` para sandbox/prod (definición, no crear ahora).
- No crear ningún recurso `-local` en AWS.

## 8) Feature flags (AppConfig)

- `infra/appconfig.json` (ejemplo):
```json
{
  "features": {
    "users": { "enabled": true },
    "providers": { "enabled": true }
  }
}
```
- Helper mínimo en runtime (Lambdas) para leer flags desde AppConfig o, temporalmente, desde S3/variable inyectada. Frontend no se integra.

## 9) Layers (dependencias comunes)

- `layers/common/nodejs/package.json` con dependencias fijas (sin ^ ni ~): `@aws-sdk/* v3`, `uuid`, `ajv` (validación), `pino` (logs JSON), etc.
- Ajuste progresivo de funciones para consumir el layer; si es complejo, dejar TODOs y preparar `serverless.yml` para adjuntar el layer por stage.

## 10) Local (opcional pero listo)

- `docker/dynamodb-local/docker-compose.yml` exponiendo `:8000`.
- README: instrucciones `docker compose up -d`; `serverless offline` si se usa; `DDB_ENDPOINT` solo en dev/local.

## 11) Observabilidad y seguridad mínima

- Logs JSON estructurados en handlers: `requestId`, `stage`, `functionName`, `message`, `level`, `timestamp`.
- CloudWatch Alarms (plantillas) en `serverless.yml`: `Errors`, `Throttles`, `Duration` p95. Solo definidas; no crear en este PR.
- Buenas prácticas: sin credenciales hardcodeadas; separación total de sandbox/prod; prefijo `DYNAMODB_` para credenciales de DynamoDB.

## 12) Contratos API

- `services/<dominio>/openapi.yaml` con paths y models básicos. Si ya existe en `docs/api/`, se referencia.
- Verificación ligera en CI (lint OpenAPI) sin bloquear el build principal.

## 13) Cambios planeados (PR 2, sin ejecutar ahora)

- Rama: `chore/ci-arch-refactor` (ya creada).
- Añadir estructura mínima:
  - `services/<dominio>/{handlers, package.json, serverless.yml}` (ej. `users`, `providers`).
  - `layers/common/nodejs/package.json` (deps comunes).
  - `infra/{serverless.common.yml, appconfig.json}`.
  - `.github/workflows/deploy.yml` con filtros por paths y stages.
  - `docker/dynamodb-local/docker-compose.yml`.
- Validación sintaxis: `npx serverless --version` y `npx serverless print --stage sandbox` por servicio (dry-run), sin desplegar.

## 14) Placeholders/variables

- `AWS_REGION=us-east-1`
- `AWS_SANDBOX_ROLE=arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_SANDBOX>`
- `AWS_PROD_ROLE=arn:aws:iam::<ACCOUNT_ID>:role/<ROLE_PROD>`
- URLs de API: No hardcodear; leer de env/outputs de IaC.

## 15) Criterios de aceptación (PR 2)

- No hay cambios en `apps/frontend/**` ni en `src/` de frontend.
- Ningún job despliega a prod.
- `deploy.yml` filtra por paths y despliega solo servicios cambiados a sandbox.
- `serverless.yml` por dominio usa nombres por stage y canary configurado.
- `infra/appconfig.json` presente y documentado.
- README actualizado con flujo y comandos.
- No se crean recursos `-local` en AWS.

---

Este documento es el PR 1 (plan). PR 2 contendrá la implementación de la estructura, IaC, CI/CD y documentación actualizada, manteniendo sandbox como destino por defecto y sin tocar producción.


