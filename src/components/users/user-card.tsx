'use client'

import React from 'react'
import { User } from '@/types/users'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Edit, Trash2 } from 'lucide-react'

interface UserCardProps {
  user: User
  onEdit: (user: User) => void
  onDelete: (user: User) => void
  canManage: boolean
}

export const UserCard: React.FC<UserCardProps> = ({
  user,
  onEdit,
  onDelete,
  canManage
}) => {
  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'Super Administrador'
      case 'ADMIN':
        return 'Administrador'
      case 'EXECUTIVE':
        return 'Ejecutivo'
      default:
        return role
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-red-100 text-red-800'
      case 'ADMIN':
        return 'bg-blue-100 text-blue-800'
      case 'EXECUTIVE':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
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
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-semibold text-sm">
                {(user.firstName || user.name || 'U')[0]}{(user.lastName || '')[0]}
              </span>
            </div>
            <div>
              <CardTitle className="text-lg">
                {user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.name || 'Usuario'}
              </CardTitle>
              <CardDescription className="text-sm">
                {user.email}
              </CardDescription>
            </div>
          </div>
          <div className="flex space-x-1">
            {canManage && (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(user)}
                  title="Editar usuario"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDelete(user)}
                  className="text-red-600 hover:text-red-700"
                  title="Eliminar usuario"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Rol:</span>
            <Badge className={getRoleColor(typeof user.role === 'string' ? user.role : (user.role as any).name)}>
              {getRoleDisplayName(typeof user.role === 'string' ? user.role : (user.role as any).name)}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Estado:</span>
            <Badge className={getStatusColor(user.status)}>
              {user.status}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Departamento:</span>
            <span className="text-sm font-medium">{user.department}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Posición:</span>
            <span className="text-sm font-medium">{user.position}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-500">Teléfono:</span>
            <span className="text-sm font-medium">{user.phone}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
