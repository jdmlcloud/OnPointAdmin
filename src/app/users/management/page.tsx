'use client'

import React, { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth/auth-context'
import ProtectedRoute from '@/components/auth/protected-route'
import { User, Role, Permission, UserRoleType } from '@/types/users'
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
  const [roles, setRoles] = useState<Role[]>([])
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([])
  const [roleSearchTerm, setRoleSearchTerm] = useState('')
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  
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
      password: 'hashed_password_123',
      firstName: 'Super',
      lastName: 'Administrador',
      name: 'Super Administrador',
      phone: '+525512345678',
      role: 'SUPER_ADMIN',
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
      password: 'hashed_password_123',
      firstName: 'Admin',
      lastName: 'Usuario',
      name: 'Admin Usuario',
      phone: '+525512345679',
      role: 'ADMIN',
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
      password: 'hashed_password_123',
      firstName: 'Ejecutivo',
      lastName: 'Usuario',
      name: 'Ejecutivo Usuario',
      phone: '+525512345680',
      role: 'EXECUTIVE',
      department: 'Ventas',
      position: 'Ejecutivo',
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    }
  ]

  const testRoles: Role[] = [
    {
      id: 'role-super-admin',
      name: 'Super Administrador',
      description: 'Acceso total al sistema, puede gestionar todo incluyendo otros administradores',
      permissions: [
        { id: 'perm-1', name: 'users:manage', resource: 'users', action: 'manage', description: 'Gestionar usuarios', category: 'users' },
        { id: 'perm-2', name: 'roles:manage', resource: 'roles', action: 'manage', description: 'Gestionar roles', category: 'roles' },
        { id: 'perm-3', name: 'permissions:manage', resource: 'permissions', action: 'manage', description: 'Gestionar permisos', category: 'permissions' },
        { id: 'perm-4', name: 'providers:manage', resource: 'providers', action: 'manage', description: 'Gestionar proveedores', category: 'providers' },
        { id: 'perm-5', name: 'products:manage', resource: 'products', action: 'manage', description: 'Gestionar productos', category: 'products' },
        { id: 'perm-6', name: 'reports:view', resource: 'reports', action: 'view', description: 'Ver reportes', category: 'reports' },
        { id: 'perm-7', name: 'settings:manage', resource: 'settings', action: 'manage', description: 'Gestionar configuración', category: 'settings' }
      ],
      level: 1,
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'role-admin',
      name: 'Administrador',
      description: 'Puede gestionar usuarios, proveedores y productos del sistema',
      permissions: [
        { id: 'perm-8', name: 'users:manage', resource: 'users', action: 'manage', description: 'Gestionar usuarios', category: 'users' },
        { id: 'perm-9', name: 'providers:manage', resource: 'providers', action: 'manage', description: 'Gestionar proveedores', category: 'providers' },
        { id: 'perm-10', name: 'products:manage', resource: 'products', action: 'manage', description: 'Gestionar productos', category: 'products' },
        { id: 'perm-11', name: 'reports:view', resource: 'reports', action: 'view', description: 'Ver reportes', category: 'reports' }
      ],
      level: 2,
      isSystem: false,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'role-executive',
      name: 'Ejecutivo',
      description: 'Puede ver y gestionar proveedores y productos asignados',
      permissions: [
        { id: 'perm-12', name: 'providers:read', resource: 'providers', action: 'read', description: 'Leer proveedores', category: 'providers' },
        { id: 'perm-13', name: 'products:read', resource: 'products', action: 'read', description: 'Leer productos', category: 'products' },
        { id: 'perm-14', name: 'reports:view', resource: 'reports', action: 'view', description: 'Ver reportes', category: 'reports' }
      ],
      level: 3,
      isSystem: false,
      status: 'active',
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
      category: 'Usuarios',
      isSystem: true,
      status: 'active'
    },
    {
      id: 'permission-users-manage',
      name: 'users:manage',
      description: 'Gestionar usuarios',
      resource: 'users',
      action: 'manage',
      category: 'Usuarios',
      isSystem: true,
      status: 'active'
    },
    {
      id: 'permission-roles-manage',
      name: 'roles:manage',
      description: 'Gestionar roles',
      resource: 'roles',
      action: 'manage',
      category: 'Roles',
      isSystem: true,
      status: 'active'
    }
  ]

  const categories = [
    { id: 'all', name: 'Todas', icon: Shield },
    { id: 'Usuarios', name: 'Usuarios', icon: Users },
    { id: 'Roles', name: 'Roles', icon: Shield },
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
        setRoles(testRoles)
        setFilteredRoles(testRoles)
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
    setFilteredRoles(filtered)
  }, [roleSearchTerm, roles])

  // Filtrar permisos
  useEffect(() => {
    let filtered = permissions.filter(permission =>
      permission.name.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(permissionSearchTerm.toLowerCase()) ||
      permission.resource.toLowerCase().includes(permissionSearchTerm.toLowerCase())
    )

    if (selectedPermissionCategory !== 'all') {
      filtered = filtered.filter(permission => permission.category === selectedPermissionCategory)
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
  const handleCreateRole = () => setIsCreateRoleDialogOpen(true)
  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setIsEditRoleDialogOpen(true)
  }
  const handleDeleteRole = (role: Role) => {
    if (role.isSystem) {
      alert('No se pueden eliminar roles del sistema')
      return
    }
    if (confirm(`¿Estás seguro de que quieres eliminar el rol "${role.name}"?`)) {
      setRoles(prev => prev.filter(r => r.id !== role.id))
      setFilteredRoles(prev => prev.filter(r => r.id !== role.id))
    }
  }

  const handleCreateRoleSubmit = async (roleData: any) => {
    const newRole: Role = {
      id: `role-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      ...roleData,
      level: 4,
      isSystem: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    }
    setRoles(prev => [...prev, newRole])
    setFilteredRoles(prev => [...prev, newRole])
    setIsCreateRoleDialogOpen(false)
    return true
  }

  const handleEditRoleSubmit = async (roleData: any) => {
    if (selectedRole) {
      setRoles(prev => prev.map(role => 
        role.id === selectedRole.id 
          ? { ...role, ...roleData, updatedAt: new Date().toISOString() }
          : role
      ))
      setFilteredRoles(prev => prev.map(role => 
        role.id === selectedRole.id 
          ? { ...role, ...roleData, updatedAt: new Date().toISOString() }
          : role
      ))
      setIsEditRoleDialogOpen(false)
      setSelectedRole(null)
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
    if (permission.isSystem) {
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
  const canManageRoles = hasPermission('roles', 'manage')
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
                  <span>Roles ({roles.length})</span>
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

              {/* Tab de Roles */}
              <TabsContent value="roles" className="space-y-6">
                <div className="flex justify-between items-center">
                  <div className="flex-1 max-w-md">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        placeholder="Buscar roles..."
                        value={roleSearchTerm}
                        onChange={(e) => setRoleSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  {canManageRoles && (
                    <Button onClick={handleCreateRole} className="flex items-center">
                      <Plus className="h-4 w-4 mr-2" />
                      Nuevo Rol
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRoles.map((role) => (
                    <RoleCard
                      key={role.id}
                      role={role}
                      onEdit={handleEditRole}
                      onDelete={handleDeleteRole}
                      canManage={canManageRoles}
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
          currentUserRole={typeof currentUser?.role === 'string' ? currentUser.role as UserRoleType : currentUser?.role?.name as UserRoleType}
        />

        <UserForm
          isOpen={isEditUserDialogOpen}
          onClose={() => {
            setIsEditUserDialogOpen(false)
            setSelectedUser(null)
          }}
          onSubmit={handleEditUserSubmit}
          user={selectedUser}
          currentUserRole={typeof currentUser?.role === 'string' ? currentUser.role as UserRoleType : currentUser?.role?.name as UserRoleType}
        />

        <RoleForm
          isOpen={isCreateRoleDialogOpen}
          onClose={() => setIsCreateRoleDialogOpen(false)}
          onSubmit={handleCreateRoleSubmit}
          currentUserRole={typeof currentUser?.role === 'string' ? currentUser.role as UserRoleType : currentUser?.role?.name as UserRoleType}
        />

        <RoleForm
          isOpen={isEditRoleDialogOpen}
          onClose={() => {
            setIsEditRoleDialogOpen(false)
            setSelectedRole(null)
          }}
          onSubmit={handleEditRoleSubmit}
          role={selectedRole}
          currentUserRole={typeof currentUser?.role === 'string' ? currentUser.role as UserRoleType : currentUser?.role?.name as UserRoleType}
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
