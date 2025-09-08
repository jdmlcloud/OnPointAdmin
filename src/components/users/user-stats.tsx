'use client'

import React from 'react'
import { User, Role, Permission } from '@/types/users'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Users, Shield, ShieldCheck, UserCheck, UserX, Crown, UserCog } from 'lucide-react'

interface UserStatsProps {
  users: User[]
  roles: Role[]
  permissions: Permission[]
}

export const UserStats: React.FC<UserStatsProps> = ({ users, roles, permissions }) => {
  const activeUsers = users.filter(user => user.status === 'active').length
  const inactiveUsers = users.filter(user => user.status === 'inactive').length
  const systemRoles = roles.filter(role => role.isSystem).length
  const customRoles = roles.filter(role => !role.isSystem).length
  const systemPermissions = permissions.filter(permission => permission.isSystem).length
  const customPermissions = permissions.filter(permission => !permission.isSystem).length

  const getRoleCount = (roleType: string) => {
    return users.filter(user => user.role === roleType).length
  }

  const superAdmins = getRoleCount('SUPER_ADMIN')
  const admins = getRoleCount('ADMIN')
  const executives = getRoleCount('EXECUTIVE')

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {/* Usuarios Activos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuarios Activos</CardTitle>
          <UserCheck className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            de {users.length} usuarios totales
          </p>
        </CardContent>
      </Card>

      {/* Usuarios Inactivos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuarios Inactivos</CardTitle>
          <UserX className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">{inactiveUsers}</div>
          <p className="text-xs text-muted-foreground">
            {inactiveUsers > 0 ? 'Requieren atención' : 'Todos activos'}
          </p>
        </CardContent>
      </Card>

      {/* Roles Personalizados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Roles Personalizados</CardTitle>
          <Shield className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{customRoles}</div>
          <p className="text-xs text-muted-foreground">
            + {systemRoles} roles del sistema
          </p>
        </CardContent>
      </Card>

      {/* Permisos Personalizados */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Permisos Personalizados</CardTitle>
          <ShieldCheck className="h-4 w-4 text-purple-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-600">{customPermissions}</div>
          <p className="text-xs text-muted-foreground">
            + {systemPermissions} permisos del sistema
          </p>
        </CardContent>
      </Card>

      {/* Distribución por Roles */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Distribución por Roles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-red-100 rounded-full">
                <Crown className="h-4 w-4 text-red-600" />
              </div>
              <div className="text-lg font-bold text-red-600">{superAdmins}</div>
              <p className="text-xs text-muted-foreground">Super Admins</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-blue-100 rounded-full">
                <UserCog className="h-4 w-4 text-blue-600" />
              </div>
              <div className="text-lg font-bold text-blue-600">{admins}</div>
              <p className="text-xs text-muted-foreground">Administradores</p>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center w-8 h-8 mx-auto mb-2 bg-green-100 rounded-full">
                <Users className="h-4 w-4 text-green-600" />
              </div>
              <div className="text-lg font-bold text-green-600">{executives}</div>
              <p className="text-xs text-muted-foreground">Ejecutivos</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumen del Sistema */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Resumen del Sistema</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total de Usuarios:</span>
              <span className="font-medium">{users.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total de Roles:</span>
              <span className="font-medium">{roles.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Total de Permisos:</span>
              <span className="font-medium">{permissions.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Sistema:</span>
              <span className="font-medium text-green-600">Operativo</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
