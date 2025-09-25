# Docker Helpers

## DynamoDB Local

Arranca una instancia local en memoria de DynamoDB para desarrollo.

Comandos:

```bash
# Levantar
docker compose -f docker/dynamodb-local/docker-compose.yml up -d

# Ver logs
docker compose -f docker/dynamodb-local/docker-compose.yml logs -f

# Apagar
docker compose -f docker/dynamodb-local/docker-compose.yml down
```

Variables recomendadas en local:

```bash
# .env.local o config/local.env
AWS_REGION=us-east-1
DDB_ENDPOINT=http://localhost:8000
```

Uso con AWS CLI:

```bash
aws dynamodb list-tables --endpoint-url http://localhost:8000 --region us-east-1
```
