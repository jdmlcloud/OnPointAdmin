"use client"

import { useState, useEffect } from "react"
import { MainLayout } from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AnimatedButton } from "@/components/ui/animated-button"
import { ActionModal } from "@/components/ui/action-modal"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { useCardActions } from "@/hooks/use-card-actions"
import { useAuthContext } from "@/lib/auth/auth-context"
import { useUsersApi } from "@/hooks/use-users-api"
import { useRolesApi } from "@/hooks/use-roles-api"
import { usePermissionsApi } from "@/hooks/use-permissions-api"
import { User, UserRole, Permission, UserRoleType } from "@/types/users"
import { UserForm } from "@/components/users/user-form"
import { RoleForm } from "@/components/roles/role-form"
import { PermissionForm } from "@/components/permissions/permission-form"
import { UserCard } from "@/components/users/user-card"
import { RoleCard } from "@/components/roles/role-card"
import { PermissionCard } from "@/components/permissions/permission-card"
import { UserStats } from "@/components/users/user-stats"
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Shield,
  User as UserIcon,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  MoreHorizontal,
  Download,
  Upload,
  RefreshCw,
  Settings,
  Key,
  Lock,
  Unlock,
  UserPlus,
  UserMinus,
  Activity,
  BarChart3,
  ShieldCheck
} from "lucide-react"

export default function UsersPage() {
  const { isLoading, simulateAction } = useMicrointeractions()
  const { user: currentUser, hasPermission } = useAuthContext()
  const [activeTab, setActiveTab] = useState('users')
  
  // API hooks
  const usersApi = useUsersApi()
  const rolesApi = useRolesApi()
  const permissionsApi = usePermissionsApi()
  
  // Estados para usuarios
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [userSearchTerm, setUserSearchTerm] = useState('')
  const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = useState(false)
  const [isEditUserDialogOpen, setIsEditUserDialogOpen] = useState(false)
  const [isDeleteUserDialogOpen, setIsDeleteUserDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  
  // Estados para roles
  const [roles, setRoles] = useState<UserRole[]>([])
  const [filteredRoles, setFilteredRoles] = useState<UserRole[]>([])
  const [roleSearchTerm, setRoleSearchTerm] = useState('')
  const [isCreateRoleDialogOpen, setIsCreateRoleDialogOpen] = useState(false)
  const [isEditRoleDialogOpen, setIsEditRoleDialogOpen] = useState(false)
  const [isDeleteRoleDialogOpen, setIsDeleteRoleDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null)
  
  // Estados para permisos
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([])
  const [permissionSearchTerm, setPermissionSearchTerm] = useState('')
  const [selectedPermissionCategory, setSelectedPermissionCategory] = useState<string>('all')
  const [isCreatePermissionDialogOpen, setIsCreatePermissionDialogOpen] = useState(false)
  const [isEditPermissionDialogOpen, setIsEditPermissionDialogOpen] = useState(false)
  const [isDeletePermissionDialogOpen, setIsDeletePermissionDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Solo datos de AWS - no más datos de prueba

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
        setLoading(true)
        setError('')
        
        // Cargar usuarios desde API
        const usersData = await usersApi.fetchUsers()
        setUsers(usersData)
        setFilteredUsers(usersData)
        console.log('✅ Usuarios cargados desde API:', usersData.length)
        
        // Cargar roles desde API
        const rolesData = await rolesApi.fetchRoles()
        setRoles(rolesData)
        setFilteredRoles(rolesData)
        console.log('✅ Roles cargados desde API:', rolesData.length)
        console.log('📋 Roles cargados:', rolesData.map(r => ({ id: r.id, name: r.name })))
        
        // Cargar permissions desde API
        const permissionsData = await permissionsApi.fetchPermissions()
        setPermissions(permissionsData)
        setFilteredPermissions(permissionsData)
        console.log('✅ Permissions cargados desde API:', permissionsData.length)
        console.log('📋 Permissions cargados:', permissionsData.map(p => ({ id: p.id, name: p.name })))
      } catch (error) {
        setError('Error al cargar datos')
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Filtrar usuarios
  useEffect(() => {
    const filtered = users.filter(user => {
      const searchTerm = userSearchTerm.toLowerCase()
      return (
        (user.firstName || '').toLowerCase().includes(searchTerm) ||
        (user.lastName || '').toLowerCase().includes(searchTerm) ||
        (user.firstName || '').toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        (user.department || '').toLowerCase().includes(searchTerm)
      )
    })
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
    setSelectedUser(user)
    setIsDeleteUserDialogOpen(true)
  }

  const handleCreateUserSubmit = async (userData: any) => {
    try {
      const newUser = await usersApi.createUser({
        ...userData,
        status: 'active',
        createdBy: currentUser?.id || 'current-user'
      })
      
      setUsers(prev => [...prev, newUser])
      setFilteredUsers(prev => [...prev, newUser])
      setIsCreateUserDialogOpen(false)
      return true
    } catch (error) {
      console.error('Error creating user:', error)
      
      // Mostrar mensaje de error específico
      if (error instanceof Error) {
        if (error.message.includes('El usuario ya existe')) {
          alert('Error: Ya existe un usuario con este email. Por favor, usa un email diferente.')
        } else if (error.message.includes('Todos los campos son requeridos')) {
          alert('Error: Por favor, completa todos los campos requeridos.')
        } else {
          alert(`Error al crear usuario: ${error.message}`)
        }
      } else {
        alert('Error inesperado al crear usuario. Por favor, intenta de nuevo.')
      }
      
      return false
    }
  }

  const handleEditUserSubmit = async (userData: any) => {
    if (selectedUser) {
      try {
        const updatedUser = await usersApi.updateUser(selectedUser.id, userData)
        
        setUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ))
        setFilteredUsers(prev => prev.map(user => 
          user.id === selectedUser.id ? updatedUser : user
        ))
        setIsEditUserDialogOpen(false)
        setSelectedUser(null)
        return true
      } catch (error) {
        console.error('Error updating user:', error)
        
        // Mostrar mensaje de error específico
        if (error instanceof Error) {
          if (error.message.includes('El usuario ya existe')) {
            alert('Error: Ya existe un usuario con este email. Por favor, usa un email diferente.')
          } else if (error.message.includes('Todos los campos son requeridos')) {
            alert('Error: Por favor, completa todos los campos requeridos.')
          } else {
            alert(`Error al actualizar usuario: ${error.message}`)
          }
        } else {
          alert('Error inesperado al actualizar usuario. Por favor, intenta de nuevo.')
        }
        
        return false
      }
    }
    return false
  }

  const handleDeleteUserConfirm = async () => {
    if (selectedUser) {
      try {
        await usersApi.deleteUser(selectedUser.id)
        
        setUsers(prev => prev.filter(u => u.id !== selectedUser.id))
        setFilteredUsers(prev => prev.filter(u => u.id !== selectedUser.id))
        setIsDeleteUserDialogOpen(false)
        setSelectedUser(null)
      } catch (error) {
        console.error('Error deleting user:', error)
      }
    }
  }

  // Handlers para roles
  const handleCreateRole = () => setIsCreateRoleDialogOpen(true)
  const handleEditRole = (role: UserRole) => {
    setSelectedRole(role)
    setIsEditRoleDialogOpen(true)
  }
  const handleDeleteRole = (role: UserRole) => {
    // Los roles del sistema se identifican por level 1
    if (role.level === 1) {
      alert('No se pueden eliminar roles del sistema')
      return
    }
    setSelectedRole(role)
    setIsDeleteRoleDialogOpen(true)
  }

  const handleCreateRoleSubmit = async (roleData: any) => {
    try {
      const newRole = await rolesApi.createRole({
        name: roleData.name,
        description: roleData.description,
        level: 4,
        permissions: roleData.permissions || []
      })
      
      setRoles(prev => [...prev, newRole])
      setFilteredRoles(prev => [...prev, newRole])
      setIsCreateRoleDialogOpen(false)
      return true
    } catch (error) {
      console.error('Error creating role:', error)
      alert('Error al crear el rol. Verifica los datos e intenta nuevamente.')
      return false
    }
  }

  const handleEditRoleSubmit = async (roleData: any) => {
    if (selectedRole) {
      try {
        const updatedRole = await rolesApi.updateRole(selectedRole.id, roleData)
        
        setRoles(prev => prev.map(role => 
          role.id === selectedRole.id ? updatedRole : role
        ))
        setFilteredRoles(prev => prev.map(role => 
          role.id === selectedRole.id ? updatedRole : role
        ))
        setIsEditRoleDialogOpen(false)
        setSelectedRole(null)
        return true
      } catch (error) {
        console.error('Error updating role:', error)
        alert('Error al actualizar el rol. Verifica los datos e intenta nuevamente.')
        return false
      }
    }
    return false
  }

  const handleDeleteRoleConfirm = async () => {
    if (selectedRole) {
      try {
        await rolesApi.deleteRole(selectedRole.id)
        
        setRoles(prev => prev.filter(r => r.id !== selectedRole.id))
        setFilteredRoles(prev => prev.filter(r => r.id !== selectedRole.id))
        setIsDeleteRoleDialogOpen(false)
        setSelectedRole(null)
      } catch (error) {
        console.error('Error deleting role:', error)
        alert('Error al eliminar el rol. Intenta nuevamente.')
      }
    }
  }

  // Handlers para permisos
  const handleCreatePermission = () => setIsCreatePermissionDialogOpen(true)
  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsEditPermissionDialogOpen(true)
  }
  const handleDeletePermission = (permission: Permission) => {
    // Los permisos del sistema se identifican por ser básicos
    if (permission.resource === 'users' && permission.action === 'read') {
      alert('No se pueden eliminar permisos del sistema')
      return
    }
    setSelectedPermission(permission)
    setIsDeletePermissionDialogOpen(true)
  }

  const handleCreatePermissionSubmit = async (permissionData: any) => {
    try {
      const newPermission = await permissionsApi.createPermission({
        name: permissionData.name,
        resource: permissionData.resource,
        action: permissionData.action,
        description: permissionData.description
      })
      
      setPermissions(prev => [...prev, newPermission])
      setFilteredPermissions(prev => [...prev, newPermission])
      setIsCreatePermissionDialogOpen(false)
      return true
    } catch (error) {
      console.error('Error creating permission:', error)
      alert('Error al crear el permiso. Verifica los datos e intenta nuevamente.')
      return false
    }
  }

  const handleEditPermissionSubmit = async (permissionData: any) => {
    if (selectedPermission) {
      try {
        const updatedPermission = await permissionsApi.updatePermission(selectedPermission.id, permissionData)
        
        setPermissions(prev => prev.map(permission => 
          permission.id === selectedPermission.id ? updatedPermission : permission
        ))
        setFilteredPermissions(prev => prev.map(permission => 
          permission.id === selectedPermission.id ? updatedPermission : permission
        ))
        setIsEditPermissionDialogOpen(false)
        setSelectedPermission(null)
        return true
      } catch (error) {
        console.error('Error updating permission:', error)
        alert('Error al actualizar el permiso. Verifica los datos e intenta nuevamente.')
        return false
      }
    }
    return false
  }

  const handleDeletePermissionConfirm = async () => {
    if (selectedPermission) {
      try {
        await permissionsApi.deletePermission(selectedPermission.id)
        
        setPermissions(prev => prev.filter(p => p.id !== selectedPermission.id))
        setFilteredPermissions(prev => prev.filter(p => p.id !== selectedPermission.id))
        setIsDeletePermissionDialogOpen(false)
        setSelectedPermission(null)
      } catch (error) {
        console.error('Error deleting permission:', error)
        alert('Error al eliminar el permiso. Intenta nuevamente.')
      }
    }
  }

  const canManageUsers = hasPermission('users', 'manage')
  const canManageRoles = hasPermission('roles', 'manage')
  const canManagePermissions = hasPermission('permissions', 'manage')

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
              Administra usuarios, roles y permisos del sistema
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <AnimatedButton
              onClick={() => setActiveTab('users')}
              variant={activeTab === 'users' ? 'default' : 'outline'}
              size="sm"
            >
              <Users className="h-4 w-4 mr-2" />
              Usuarios ({users.length})
            </AnimatedButton>
            <AnimatedButton
              onClick={() => setActiveTab('roles')}
              variant={activeTab === 'roles' ? 'default' : 'outline'}
              size="sm"
            >
              <Shield className="h-4 w-4 mr-2" />
              Roles ({roles.length})
            </AnimatedButton>
            <AnimatedButton
              onClick={() => setActiveTab('permissions')}
              variant={activeTab === 'permissions' ? 'default' : 'outline'}
              size="sm"
            >
              <ShieldCheck className="h-4 w-4 mr-2" />
              Permisos ({permissions.length})
            </AnimatedButton>
          </div>
        </div>

        {/* Estadísticas */}
        <UserStats users={users} roles={roles} permissions={permissions} />

        {/* Contenido principal */}
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
                <AnimatedButton onClick={handleCreateUser}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Usuario
                </AnimatedButton>
              )}
            </div>

            {loading ? (
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
                <AnimatedButton onClick={handleCreateRole}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Rol
                </AnimatedButton>
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
              <div className="flex gap-2 flex-wrap">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <AnimatedButton
                      key={category.id}
                      variant={selectedPermissionCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedPermissionCategory(category.id)}
                      className="flex items-center space-x-2 whitespace-nowrap"
                    >
                      <IconComponent className="h-4 w-4" />
                      <span>{category.name}</span>
                    </AnimatedButton>
                  )
                })}
              </div>
              {canManagePermissions && (
                <AnimatedButton onClick={handleCreatePermission}>
                  <Plus className="h-4 w-4 mr-2" />
                  Nuevo Permiso
                </AnimatedButton>
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

        {/* Dialogs */}
        <UserForm
          isOpen={isCreateUserDialogOpen}
          onClose={() => setIsCreateUserDialogOpen(false)}
          onSubmit={handleCreateUserSubmit}
          currentUserRole={currentUser?.role?.name as UserRoleType}
        />

        <UserForm
          isOpen={isEditUserDialogOpen}
          onClose={() => {
            setIsEditUserDialogOpen(false)
            setSelectedUser(null)
          }}
          onSubmit={handleEditUserSubmit}
          user={selectedUser}
          currentUserRole={currentUser?.role?.name as UserRoleType}
        />

        <RoleForm
          isOpen={isCreateRoleDialogOpen}
          onClose={() => setIsCreateRoleDialogOpen(false)}
          onSubmit={handleCreateRoleSubmit}
          currentUserUserRole={currentUser?.role?.name as UserRoleType}
        />

        <RoleForm
          isOpen={isEditRoleDialogOpen}
          onClose={() => {
            setIsEditRoleDialogOpen(false)
            setSelectedRole(null)
          }}
          onSubmit={handleEditRoleSubmit}
          role={selectedRole}
          currentUserUserRole={currentUser?.role?.name as UserRoleType}
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

        {/* Delete Modals */}
        <ActionModal
          isOpen={isDeleteUserDialogOpen}
          onClose={() => {
            setIsDeleteUserDialogOpen(false)
            setSelectedUser(null)
          }}
          title="Eliminar Usuario"
          type="delete"
          onConfirm={handleDeleteUserConfirm}
          destructive
        >
          {selectedUser && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <Users className="h-8 w-8 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {selectedUser.email} - {selectedUser.department}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Al eliminar este usuario:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Se perderá acceso al sistema</li>
                  <li>Se eliminarán todas las asignaciones</li>
                  <li>Esta acción no se puede deshacer</li>
                </ul>
              </div>
            </div>
          )}
        </ActionModal>

        <ActionModal
          isOpen={isDeleteRoleDialogOpen}
          onClose={() => {
            setIsDeleteRoleDialogOpen(false)
            setSelectedRole(null)
          }}
          title="Eliminar Rol"
          type="delete"
          onConfirm={handleDeleteRoleConfirm}
          destructive
        >
          {selectedRole && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <Shield className="h-8 w-8 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    {selectedRole.name}
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {selectedRole.description}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Al eliminar este rol:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Los usuarios con este rol perderán permisos</li>
                  <li>Se eliminarán todas las asignaciones</li>
                  <li>Esta acción no se puede deshacer</li>
                </ul>
              </div>
            </div>
          )}
        </ActionModal>

        <ActionModal
          isOpen={isDeletePermissionDialogOpen}
          onClose={() => {
            setIsDeletePermissionDialogOpen(false)
            setSelectedPermission(null)
          }}
          title="Eliminar Permiso"
          type="delete"
          onConfirm={handleDeletePermissionConfirm}
          destructive
        >
          {selectedPermission && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <ShieldCheck className="h-8 w-8 text-red-600" />
                <div>
                  <h4 className="font-medium text-red-900 dark:text-red-100">
                    {selectedPermission.name}
                  </h4>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    {selectedPermission.description} - {selectedPermission.resource}
                  </p>
                </div>
              </div>
              
              <div className="text-sm text-muted-foreground">
                <p>Al eliminar este permiso:</p>
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Los roles que lo tengan perderán este acceso</li>
                  <li>Se eliminarán todas las asignaciones</li>
                  <li>Esta acción no se puede deshacer</li>
                </ul>
              </div>
            </div>
          )}
        </ActionModal>
      </div>
    </MainLayout>
  )
}