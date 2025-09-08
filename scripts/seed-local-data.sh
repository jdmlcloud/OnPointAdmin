#!/bin/bash

# Script para poblar las tablas de DynamoDB con datos de prueba
# Versión: v1.1.0

echo "🌱 Poblando tablas con datos de prueba..."

# Configuración
REGION="us-east-1"
ENVIRONMENT="local"

# Función para insertar datos
insert_data() {
    local table_name=$1
    local data_file=$2
    
    if [ -f "$data_file" ]; then
        echo "📝 Insertando datos en $table_name desde $data_file"
        aws dynamodb batch-write-item --request-items "file://$data_file" --region "$REGION"
        if [ $? -eq 0 ]; then
            echo "✅ Datos insertados en $table_name"
        else
            echo "❌ Error insertando datos en $table_name"
        fi
    else
        echo "⚠️ Archivo $data_file no encontrado"
    fi
}

# Crear directorio de datos de prueba
mkdir -p data/seed

# Crear datos de prueba para roles
cat > data/seed/roles.json << 'EOF'
{
  "OnPointAdmin-Roles-local": [
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "role-super-admin"},
          "name": {"S": "Super Administrador"},
          "level": {"N": "1"},
          "permissions": {
            "L": [
              {"M": {"resource": {"S": "users"}, "action": {"S": "manage"}}},
              {"M": {"resource": {"S": "roles"}, "action": {"S": "manage"}}},
              {"M": {"resource": {"S": "providers"}, "action": {"S": "manage"}}},
              {"M": {"resource": {"S": "products"}, "action": {"S": "manage"}}},
              {"M": {"resource": {"S": "permissions"}, "action": {"S": "manage"}}}
            ]
          },
          "description": {"S": "Acceso total al sistema"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "role-admin"},
          "name": {"S": "Administrador"},
          "level": {"N": "2"},
          "permissions": {
            "L": [
              {"M": {"resource": {"S": "users"}, "action": {"S": "manage"}}},
              {"M": {"resource": {"S": "providers"}, "action": {"S": "manage"}}},
              {"M": {"resource": {"S": "products"}, "action": {"S": "manage"}}}
            ]
          },
          "description": {"S": "Administrador del sistema"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "role-executive"},
          "name": {"S": "Ejecutivo"},
          "level": {"N": "3"},
          "permissions": {
            "L": [
              {"M": {"resource": {"S": "providers"}, "action": {"S": "read"}}},
              {"M": {"resource": {"S": "providers"}, "action": {"S": "create"}}},
              {"M": {"resource": {"S": "providers"}, "action": {"S": "update"}}},
              {"M": {"resource": {"S": "products"}, "action": {"S": "read"}}},
              {"M": {"resource": {"S": "products"}, "action": {"S": "create"}}},
              {"M": {"resource": {"S": "products"}, "action": {"S": "update"}}}
            ]
          },
          "description": {"S": "Ejecutivo con acceso limitado"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    }
  ]
}
EOF

# Crear datos de prueba para permisos
cat > data/seed/permissions.json << 'EOF'
{
  "OnPointAdmin-Permissions-local": [
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "permission-users-manage"},
          "name": {"S": "Gestionar Usuarios"},
          "resource": {"S": "users"},
          "action": {"S": "manage"},
          "description": {"S": "Crear, leer, actualizar y eliminar usuarios"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "permission-roles-manage"},
          "name": {"S": "Gestionar Roles"},
          "resource": {"S": "roles"},
          "action": {"S": "manage"},
          "description": {"S": "Crear, leer, actualizar y eliminar roles"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "permission-providers-manage"},
          "name": {"S": "Gestionar Proveedores"},
          "resource": {"S": "providers"},
          "action": {"S": "manage"},
          "description": {"S": "Crear, leer, actualizar y eliminar proveedores"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "permission-products-manage"},
          "name": {"S": "Gestionar Productos"},
          "resource": {"S": "products"},
          "action": {"S": "manage"},
          "description": {"S": "Crear, leer, actualizar y eliminar productos"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    }
  ]
}
EOF

# Crear datos de prueba para usuarios
cat > data/seed/users.json << 'EOF'
{
  "OnPointAdmin-Users-local": [
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "user-super-admin"},
          "email": {"S": "superadmin@onpoint.com"},
          "password": {"S": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"},
          "firstName": {"S": "Super"},
          "lastName": {"S": "Administrador"},
          "phone": {"S": "+525512345678"},
          "role": {"S": "SUPER_ADMIN"},
          "department": {"S": "Tecnología"},
          "position": {"S": "Super Administrador"},
          "status": {"S": "active"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "user-admin"},
          "email": {"S": "admin@onpoint.com"},
          "password": {"S": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"},
          "firstName": {"S": "Admin"},
          "lastName": {"S": "Usuario"},
          "phone": {"S": "+525512345679"},
          "role": {"S": "ADMIN"},
          "department": {"S": "Administración"},
          "position": {"S": "Administrador"},
          "status": {"S": "active"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    },
    {
      "PutRequest": {
        "Item": {
          "id": {"S": "user-executive"},
          "email": {"S": "ejecutivo@onpoint.com"},
          "password": {"S": "$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi"},
          "firstName": {"S": "Ejecutivo"},
          "lastName": {"S": "Usuario"},
          "phone": {"S": "+525512345680"},
          "role": {"S": "EXECUTIVE"},
          "department": {"S": "Ventas"},
          "position": {"S": "Ejecutivo"},
          "status": {"S": "active"},
          "createdAt": {"S": "2024-12-19T00:00:00.000Z"},
          "updatedAt": {"S": "2024-12-19T00:00:00.000Z"},
          "createdBy": {"S": "system"}
        }
      }
    }
  ]
}
EOF

# Insertar datos
echo "📝 Insertando datos de prueba..."

insert_data "OnPointAdmin-Roles-local" "data/seed/roles.json"
insert_data "OnPointAdmin-Permissions-local" "data/seed/permissions.json"
insert_data "OnPointAdmin-Users-local" "data/seed/users.json"

echo "🎉 Datos de prueba insertados exitosamente!"
echo ""
echo "👤 Usuarios de prueba creados:"
echo "  - superadmin@onpoint.com (Super Administrador) - Contraseña: password"
echo "  - admin@onpoint.com (Administrador) - Contraseña: password"
echo "  - ejecutivo@onpoint.com (Ejecutivo) - Contraseña: password"
echo ""
echo "🔧 Próximos pasos:"
echo "1. Probar el login con los usuarios de prueba"
echo "2. Verificar que los roles y permisos funcionen correctamente"
echo "3. Desarrollar el frontend para gestión de usuarios"
