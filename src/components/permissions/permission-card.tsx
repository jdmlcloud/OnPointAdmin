'use client'

import React from 'react'
import { Permission } from '@/types/users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2, Shield, Users, Settings, FileText, BarChart3, Package, Building } from 'lucide-react'

interface PermissionCardProps {
  permission: Permission
  onEdit: (permission: Permission) => void
  onDelete: (permission: Permission) => void
  canManage: boolean
}

export const PermissionCard: React.FC<PermissionCardProps> = ({
  permission,
  onEdit,
  onDelete,
  canManage
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Usuarios':
        return <Users className="h-4 w-4" />
      case 'Roles':
      case 'Permisos':
        return <Shield className="h-4 w-4" />
      case 'Configuración':
        return <Settings className="h-4 w-4" />
      case 'Reportes':
        return <BarChart3 className="h-4 w-4" />
      case 'Proveedores':
        return <Building className="h-4 w-4" />
      case 'Productos':
        return <Package className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Usuarios':
        return 'bg-blue-100 text-blue-800'
      case 'Roles':
        return 'bg-purple-100 text-purple-800'
      case 'Permisos':
        return 'bg-indigo-100 text-indigo-800'
      case 'Proveedores':
        return 'bg-green-100 text-green-800'
      case 'Productos':
        return 'bg-yellow-100 text-yellow-800'
      case 'Reportes':
        return 'bg-pink-100 text-pink-800'
      case 'Configuración':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionColor = (action: string) => {
    switch (action) {
      case 'read':
      case 'view':
        return 'bg-green-100 text-green-800'
      case 'write':
        return 'bg-yellow-100 text-yellow-800'
      case 'manage':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getActionName = (action: string) => {
    switch (action) {
      case 'read':
        return 'Leer'
      case 'write':
        return 'Escribir'
      case 'manage':
        return 'Gestionar'
      case 'view':
        return 'Ver'
      default:
        return action
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

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              {getCategoryIcon(permission.resource)}
            </div>
            <div className="flex-1 min-w-0">
              <CardTitle className="text-sm font-mono truncate">
                {permission.name}
              </CardTitle>
            </div>
          </div>
          <div className="flex space-x-1">
            {canManage && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(permission)}
                  title="Editar permiso"
                >
                  <Edit className="h-3 w-3" />
                </Button>
                {!permission.resource.startsWith('system') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(permission)}
                    className="text-red-600 hover:text-red-700"
                    title="Eliminar permiso"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-2">
          <p className="text-sm text-gray-600 line-clamp-2">
            {permission.description}
          </p>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Categoría:</span>
            <Badge className={`${getCategoryColor(permission.resource)} text-xs`}>
              {permission.resource}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Acción:</span>
            <Badge className={`${getActionColor(permission.action)} text-xs`}>
              {getActionName(permission.action)}
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Estado:</span>
            <Badge className="bg-green-100 text-green-800 text-xs">
              Activo
            </Badge>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Tipo:</span>
            <Badge className={permission.resource.startsWith('system') ? 'bg-purple-100 text-purple-800 text-xs' : 'bg-gray-100 text-gray-800 text-xs'}>
              {permission.resource.startsWith('system') ? 'Sistema' : 'Personalizado'}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
