'use client'

import React from 'react'
import { Role } from '@/types/users'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Shield, Users, Settings } from 'lucide-react'

interface RoleCardProps {
  role: Role
  onEdit: (role: Role) => void
  onDelete: (role: Role) => void
  canManage: boolean
}

export const RoleCard: React.FC<RoleCardProps> = ({
  role,
  onEdit,
  onDelete,
  canManage
}) => {
  const getLevelColor = (level: number) => {
    switch (level) {
      case 1:
        return 'bg-red-100 text-red-800'
      case 2:
        return 'bg-blue-100 text-blue-800'
      case 3:
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLevelName = (level: number) => {
    switch (level) {
      case 1:
        return 'Nivel 1 - Máximo'
      case 2:
        return 'Nivel 2 - Alto'
      case 3:
        return 'Nivel 3 - Medio'
      default:
        return `Nivel ${level} - Bajo`
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'inactive':
        return 'bg-gray-100 text-gray-800'
      case 'suspended':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPermissionIcon = (permission: any) => {
    const permissionStr = typeof permission === 'string' ? permission : permission.name || permission.resource || ''
    if (permissionStr.includes('users')) return <Users className="h-3 w-3" />
    if (permissionStr.includes('roles') || permissionStr.includes('permissions')) return <Shield className="h-3 w-3" />
    if (permissionStr.includes('settings')) return <Settings className="h-3 w-3" />
    return <Shield className="h-3 w-3" />
  }

  const getPermissionName = (permission: any) => {
    if (typeof permission === 'string') {
      const [resource, action] = permission.split(':')
      const resourceNames: Record<string, string> = {
        'users': 'Usuarios',
        'roles': 'Roles',
        'permissions': 'Permisos',
        'providers': 'Proveedores',
        'products': 'Productos',
        'reports': 'Reportes',
        'settings': 'Configuración'
      }
      const actionNames: Record<string, string> = {
        'read': 'Ver',
        'write': 'Editar',
        'manage': 'Gestionar',
        'view': 'Ver'
      }
      return `${actionNames[action] || action} ${resourceNames[resource] || resource}`
    } else {
      // Es un objeto Permission
      const resourceNames: Record<string, string> = {
        'users': 'Usuarios',
        'roles': 'Roles',
        'permissions': 'Permisos',
        'providers': 'Proveedores',
        'products': 'Productos',
        'reports': 'Reportes',
        'settings': 'Configuración'
      }
      const actionNames: Record<string, string> = {
        'read': 'Ver',
        'write': 'Editar',
        'manage': 'Gestionar',
        'view': 'Ver'
      }
      const resource = permission.resource || ''
      const action = permission.action || ''
      return `${actionNames[action] || action} ${resourceNames[resource] || resource}`
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Shield className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg">
                {role.name}
              </CardTitle>
              <CardDescription className="text-sm">
                {role.description}
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-1">
            {canManage && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(role)}
                  title="Editar rol"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                {!role.isSystem && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(role)}
                    className="text-red-600 hover:text-red-700"
                    title="Eliminar rol"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Nivel:</span>
            <Badge className={getLevelColor(role.level)}>
              {getLevelName(role.level)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Estado:</span>
            <Badge className={getStatusColor(role.status || 'active')}>
              {role.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Tipo:</span>
            <Badge className={role.level === 1 ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}>
              {role.level === 1 ? 'Sistema' : 'Personalizado'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Permisos:</span>
            <span className="text-sm font-medium">{Array.isArray(role.permissions) ? role.permissions.length : 0}</span>
          </div>
          
          {/* Permisos */}
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Permisos incluidos:</h4>
            <div className="space-y-1">
              {Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                <>
                  {role.permissions.slice(0, 3).map((permission, index) => (
                    <div key={index} className="flex items-center space-x-2 text-xs text-gray-600">
                      {getPermissionIcon(permission)}
                      <span>{getPermissionName(permission)}</span>
                    </div>
                  ))}
                  {role.permissions.length > 3 && (
                    <div className="text-xs text-gray-500">
                      +{role.permissions.length - 3} permisos más...
                    </div>
                  )}
                </>
              ) : (
                <div className="text-xs text-gray-500">
                  Sin permisos asignados
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
