'use client'

import React, { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth/auth-context'
import ProtectedRoute from '@/components/auth/protected-route'
import { User, UserRole, Permission, UserRoleType } from '@/types/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Plus, Search, Edit, Trash2, Shield, Users, Settings, Eye, UserPlus, ShieldCheck } from 'lucide-react'
import { getVersionString } from '@/lib/version'
import { UserForm } from '@/components/users/user-form'
import { RoleForm } from '@/components/roles/role-form'
import { PermissionForm } from '@/components/permissions/permission-form'
import { UserCard } from '@/components/users/user-card'
import { RoleCard } from '@/components/roles/role-card'
import { PermissionCard } from '@/components/permissions/permission-card'
import { UserStats } from '@/components/users/user-stats'

const UserManagementPage: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuthContext()
  const [activeTab, setActiveTab] = useState('users')
  
  // Estados para usuarios
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  // Estados para roles
  const [roles, setUserRoles] = useState<UserRole[]>([])
  const [filteredUserRoles, setFilteredUserRoles] = useState<UserRole[]>([])
  const [roleSearchTerm, setUserRoleSearchTerm] = useState('')
  const [isCreateUserRoleDialogOpen, setIsCreateUserRoleDialogOpen] = useState(false)
  const [isEditUserRoleDialogOpen, setIsEditUserRoleDialogOpen] = useState(false)
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null)
  
  // Estados para permisos
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([])
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('')
  const [selectedPermissionCategory, setSelectedPermissionCategory] = useState<string>('all')
  const [isCreatePermissionDialogOpen, setIsCreatePermissionDialogOpen] = useState(false)
  const [isEditPermissionDialogOpen, setIsEditPermissionDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  // Datos de prueba para desarrollo local
  const testUsers: User[] = [
    {
      id: 'user-super-admin',
      email: 'superadmin@onpoint.com',
      password: 'password123',
      firstName: 'Super',
      lastName: 'Administrador',
      phone: '+525512345678',
      role: {
        id: 'role-super-admin',
        name: 'SUPER_ADMIN',
        level: 1,
        permissions: [],
        description: 'Super Administrador',
        createdAt: '2024-12-19T00:00:00.000Z',
        updatedAt: '2024-12-19T00:00:00.000Z',
        createdBy: 'system'
      },
      department: 'Tecnología',
      position: 'Super Administrador',
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'user-admin',
      email: 'admin@onpoint.com',
      password: 'password123',
      firstName: 'Admin',
      lastName: 'Usuario',
      phone: '+525512345679',
      role: {
        id: 'role-admin',
        name: 'ADMIN',
        level: 2,
        permissions: [],
        description: 'Administrador',
        createdAt: '2024-12-19T00:00:00.000Z',
        updatedAt: '2024-12-19T00:00:00.000Z',
        createdBy: 'system'
      },
      department: 'Administración',
      position: 'Administrador',
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'user-executive',
      email: 'ejecutivo@onpoint.com',
      password: 'password123',
      firstName: 'Ejecutivo',
      lastName: 'Usuario',
      phone: '+525512345680',
      role: {
        id: 'role-executive',
        name: 'EXECUTIVE',
        level: 3,
        permissions: [],
        description: 'Ejecutivo',
        createdAt: '2024-12-19T00:00:00.000Z',
        updatedAt: '2024-12-19T00:00:00.000Z',
        createdBy: 'system'
      },
      department: 'Ventas',
      position: 'Ejecutivo',
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    }
  ]

  const testUserRoles: UserRole[] = [
    {
      id: 'role-super-admin',
      name: 'Super Administrador',
      description: 'Acceso total al sistema, puede gestionar todo incluyendo otros administradores',
      permissions: [],
      level: 1,
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'role-admin',
      name: 'Administrador',
      description: 'Puede gestionar usuarios, proveedores y productos del sistema',
      permissions: [],
      level: 2,
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'role-executive',
      name: 'Ejecutivo',
      description: 'Puede ver y gestionar proveedores y productos asignados',
      permissions: [],
      level: 3,
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    }
  ]

  const testPermissions: Permission[] = [
    {
      id: 'permission-users-read',
      name: 'users:read',
      description: 'Ver usuarios',
      resource: 'users',
      action: 'read',
    },
    {
      id: 'permission-users-manage',
      name: 'users:manage',
      description: 'Gestionar usuarios',
      resource: 'users',
      action: 'manage',
    },
    {
      id: 'permission-roles-manage',
      name: 'roles:manage',
      description: 'Gestionar roles',
      resource: 'roles',
      action: 'manage',
    }
  ]

  const categories = [
    { id: 'all', name: 'Todas', icon: Shield },
    { id: 'Usuarios', name: 'Usuarios', icon: Users },
    { id: 'UserRoles', name: 'UserRoles', icon: Shield },
    { id: 'Permisos', name: 'Permisos', icon: Settings },
    { id: 'Proveedores', name: 'Proveedores', icon: Users },
    { id: 'Productos', name: 'Productos', icon: Users },
    { id: 'Reportes', name: 'Reportes', icon: Users },
    { id: 'Configuración', name: 'Configuración', icon: Settings }
  ]

  // Cargar datos
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true)
        await new Promise(resolve => setTimeout(resolve, 1000))
        setUsers(testUsers)
        setFilteredUsers(testUsers)
        setUserRoles(testUserRoles)
        setFilteredUserRoles(testUserRoles)
        setPermissions(testPermissions)
        setFilteredPermissions(testPermissions)
      } catch (error) {
        setError('Error al cargar datos')
        console.error('Error loading data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrar usuarios
  useEffect(() => {
    const filtered = users.filter(user =>
      user.firstName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(userSearchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(userSearchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [userSearchTerm, users])

  // Filtrar roles
  useEffect(() => {
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(roleSearchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(roleSearchTerm.toLowerCase())
    )
    setFilteredUserRoles(filtered)
  }, [roleSearchTerm, roles])

  // Filtrar permisos
  useEffect(() => {
    let filtered = permissions.filter(permission =>
      permission.name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
      permission.resource.toLowerCase().includes(permissionSearchTerm.toLowerCase())
    )

    if (selectedPermissionCategory !== 'all') {
      filtered = filtered.filter(permission => permission.resource === selectedPermissionCategory)
    }

    setFilteredPermissions(filtered)
  }, [permissionSearchTerm, selectedPermissionCategory, permissions])

  // Handlers para usuarios
  const handleCreateUser = () => setIsCreateUserDialogOpen(true)
  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditUserDialogOpen(true)
  }
  const handleDeleteUser = (user: User) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${user.firstName} ${user.lastName}?`)) {
      setUsers(prev => prev.filter(u => u.id !== user.id))
      setFilteredUsers(prev => prev.filter(u => u.id !== user.id))
    }
  }

  const handleCreateUserSubmit = async (userData: any) => {
    const newUser: User = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...userData,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    }
    setUsers(prev => [...prev, newUser])
    setFilteredUsers(prev => [...prev, newUser])
    setIsCreateUserDialogOpen(false)
    return true
  }

  const handleEditUserSubmit = async (userData: any) => {
    if (selectedUser) {
      setUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...userData, updatedAt: new Date().toISOString() }
          : user
      ))
      setFilteredUsers(prev => prev.map(user => 
        user.id === selectedUser.id 
          ? { ...user, ...userData, updatedAt: new Date().toISOString() }
          : user
      ))
      setIsEditUserDialogOpen(false)
      setSelectedUser(null)
      return true
    }
    return false
  }

  // Handlers para roles
  const handleCreateUserRole = () => setIsCreateUserRoleDialogOpen(true)
  const handleEditUserRole = (role: UserRole) => {
    setSelectedUserRole(role)
    setIsEditUserRoleDialogOpen(true)
  }
  const handleDeleteUserRole = (role: UserRole) => {
    // Los roles del sistema se identifican por tener level 1
    if (role.level === 1) {
      alert('No se pueden eliminar roles del sistema')
      return
    }
    if (confirm(`¿Estás seguro de que quieres eliminar el rol "${role.name}"?`)) {
      setUserRoles(prev => prev.filter(r => r.id !== role.id))
      setFilteredUserRoles(prev => prev.filter(r => r.id !== role.id))
    }
  }

  const handleCreateUserRoleSubmit = async (roleData: any) => {
    const newUserRole: UserRole = {
      id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...roleData,
      level: 4,
      isSystem: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    }
    setUserRoles(prev => [...prev, newUserRole])
    setFilteredUserRoles(prev => [...prev, newUserRole])
    setIsCreateUserRoleDialogOpen(false)
    return true
  }

  const handleEditUserRoleSubmit = async (roleData: any) => {
    if (selectedUserRole) {
      setUserRoles(prev => prev.map(role => 
        role.id === selectedUserRole.id 
          ? { ...role, ...roleData, updatedAt: new Date().toISOString() }
          : role
      ))
      setFilteredUserRoles(prev => prev.map(role => 
        role.id === selectedUserRole.id 
          ? { ...role, ...roleData, updatedAt: new Date().toISOString() }
          : role
      ))
      setIsEditUserRoleDialogOpen(false)
      setSelectedUserRole(null)
      return true
    }
    return false
  }

  // Handlers para permisos
  const handleCreatePermission = () => setIsCreatePermissionDialogOpen(true)
  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsEditPermissionDialogOpen(true)
  }
  const handleDeletePermission = (permission: Permission) => {
    // Los permisos del sistema se identifican por tener resource que empieza con 'system'
    if (permission.resource.startsWith('system')) {
      alert('No se pueden eliminar permisos del sistema')
      return
    }
    if (confirm(`¿Estás seguro de que quieres eliminar el permiso "${permission.name}"?`)) {
      setPermissions(prev => prev.filter(p => p.id !== permission.id))
      setFilteredPermissions(prev => prev.filter(p => p.id !== permission.id))
    }
  }

  const handleCreatePermissionSubmit = async (permissionData: any) => {
    const newPermission: Permission = {
      id: `permission-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...permissionData,
      isSystem: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    }
    setPermissions(prev => [...prev, newPermission])
    setFilteredPermissions(prev => [...prev, newPermission])
    setIsCreatePermissionDialogOpen(false)
    return true
  }

  const handleEditPermissionSubmit = async (permissionData: any) => {
    if (selectedPermission) {
      setPermissions(prev => prev.map(permission => 
        permission.id === selectedPermission.id 
          ? { ...permission, ...permissionData, updatedAt: new Date().toISOString() }
          : permission
      ))
      setFilteredPermissions(prev => prev.map(permission => 
        permission.id === selectedPermission.id 
          ? { ...permission, ...permissionData, updatedAt: new Date().toISOString() }
          : permission
      ))
      setIsEditPermissionDialogOpen(false)
      setSelectedPermission(null)
      return true
    }
    return false
  }

  const canManageUsers = hasPermission('users', 'manage')
  const canManageUserRoles = hasPermission('roles', 'manage')
  const canManagePermissions = hasPermission('permissions', 'manage')

  return (
    <ProtectedRoute requiredPermission={{ resource: 'users', action: 'read' }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <UserPlus className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Centro de Gestión de Usuarios
                  </h1>
                  <p className="text-sm text-gray-500">
                    Administra usuarios, roles y permisos del sistema
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getVersionString()}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Estadísticas */}
            <UserStats users={users} roles={roles} permissions={permissions} />
            
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="users" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Usuarios ({users.length})</span>
                </TabsTrigger>
                <TabsTrigger value="roles" className="flex items-center space-x-2">
                  <Shield className="h-4 w-4" />
                  <span>UserRoles ({roles.length})</span>
                </TabsTrigger>
                <TabsTrigger value="permissions" className="flex items-center space-x-2">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Permisos ({permissions.length})</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab de Usuarios */}
              <TabsContent value="users" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar usuarios..."
                        value={userSearchTerm}
                        onChange={(e) => setUserSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {canManageUsers && (
                    <Button onClick={handleCreateUser} className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Usuario
                    </Button>
                  )}
                </div>

                {isLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredUsers.map((user) => (
                      <UserCard
                        key={user.id}
                        user={user}
                        onEdit={handleEditUser}
                        onDelete={handleDeleteUser}
                        canManage={canManageUsers}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* Tab de UserRoles */}
              <TabsContent value="roles" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar roles..."
                        value={roleSearchTerm}
                        onChange={(e) => setUserRoleSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {canManageUserRoles && (
                    <Button onClick={handleCreateUserRole} className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Rol
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredUserRoles.map((role) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      onEdit={handleEditUserRole}
                      onDelete={handleDeleteUserRole}
                      canManage={canManageUserRoles}
                    />
                  ))}
                </div>
              </TabsContent>

              {/* Tab de Permisos */}
              <TabsContent value="permissions" className="space-y-6">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar permisos..."
                        value={permissionSearchTerm}
                        onChange={(e) => setPermissionSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="flex gap-2 overflow-x-auto">
                    {categories.map((category) => {
                      const IconComponent = category.icon
                      return (
                        <Button
                          key={category.id}
                          variant={selectedPermissionCategory === category.id ? "default" : "outline"}
                          size="sm"
                          onClick={() => setSelectedPermissionCategory(category.id)}
                          className="flex items-center space-x-2 whitespace-nowrap"
                        >
                          <IconComponent className="h-4 w-4" />
                          <span>{category.name}</span>
                        </Button>
                      )
                    })}
                  </div>
                  {canManagePermissions && (
                    <Button onClick={handleCreatePermission} className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Permiso
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {filteredPermissions.map((permission) => (
                    <PermissionCard
                      key={permission.id}
                      permission={permission}
                      onEdit={handleEditPermission}
                      onDelete={handleDeletePermission}
                      canManage={canManagePermissions}
                    />
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>

        {/* Dialogs */}
        <UserForm
          isOpen={isCreateUserDialogOpen}
          onClose={() => setIsCreateUserDialogOpen(false)}
          onSubmit={handleCreateUserSubmit}
          currentUserRole={currentUser?.role?.name as any}
        />

        <UserForm
          isOpen={isEditUserDialogOpen}
          onClose={() => {
            setIsEditUserDialogOpen(false)
            setSelectedUser(null)
          }}
          onSubmit={handleEditUserSubmit}
          user={selectedUser}
          currentUserRole={currentUser?.role?.name as any}
        />

        <RoleForm
          isOpen={isCreateUserRoleDialogOpen}
          onClose={() => setIsCreateUserRoleDialogOpen(false)}
          onSubmit={handleCreateUserRoleSubmit}
          currentUserUserRole={currentUser?.role?.name as any}
        />

        <RoleForm
          isOpen={isEditUserRoleDialogOpen}
          onClose={() => {
            setIsEditUserRoleDialogOpen(false)
            setSelectedUserRole(null)
          }}
          onSubmit={handleEditUserRoleSubmit}
          role={selectedUserRole}
          currentUserUserRole={currentUser?.role?.name as any}
        />

        <PermissionForm
          isOpen={isCreatePermissionDialogOpen}
          onClose={() => setIsCreatePermissionDialogOpen(false)}
          onSubmit={handleCreatePermissionSubmit}
        />

        <PermissionForm
          isOpen={isEditPermissionDialogOpen}
          onClose={() => {
            setIsEditPermissionDialogOpen(false)
            setSelectedPermission(null)
          }}
          onSubmit={handleEditPermissionSubmit}
          permission={selectedPermission}
        />
      </div>
    </ProtectedRoute>
  )
}

export default UserManagementPage
