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
import { AnimatedButton } from "@/components/ui/animated-button"
import { ActionModal } from "@/components/ui/action-modal"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { useCardActions } from "@/hooks/use-card-actions"
import { useUsers } from "@/hooks/use-users"
import { 
  Users, 
  Plus, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  Shield,
  User,
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
  BarChart3
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  phone?: string
  role: 'admin' | 'ejecutivo' | 'cliente'
  status: 'active' | 'inactive' | 'pending' | 'suspended'
  avatar?: string
  department?: string
  position?: string
  lastLogin?: string
  createdAt: string
  updatedAt?: string
  permissions?: {
    canManageUsers: boolean
    canManageProviders: boolean
    canManageProducts: boolean
    canManageQuotations: boolean
    canManageProposals: boolean
    canManageWhatsApp: boolean
    canManageSettings: boolean
    canViewAnalytics: boolean
    canManageSystem: boolean
    canGeneratePDFs: boolean
    canManageTemplates: boolean
    canViewReports: boolean
    canManageIntegrations: boolean
  }
  stats?: {
    quotationsCreated: number
    proposalsGenerated: number
    messagesProcessed: number
    lastActivity: string
  }
}

export default function UsersPage() {
  const { isLoading, simulateAction } = useMicrointeractions()
  const {
    modals,
    handleView,
    handleEdit,
    handleDelete,
    handleSave,
    handleDeleteConfirm,
    handleDownload,
    handleShare,
    closeModal
  } = useCardActions()
  
  // Usar hook de usuarios para datos reales de DynamoDB
  const { users, isLoading: usersLoading, error, refreshUsers } = useUsers()

  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRole, setSelectedRole] = useState("all")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedDepartment, setSelectedDepartment] = useState("all")

  // Recargar datos cuando se regrese de crear un usuario
  useEffect(() => {
    refreshUsers()
  }, [])

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.phone && user.phone.includes(searchTerm))
    const matchesRole = selectedRole === "all" || user.role === selectedRole
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus
    const matchesDepartment = selectedDepartment === "all" || user.department === selectedDepartment
    return matchesSearch && matchesRole && matchesStatus && matchesDepartment
  })

  if (usersLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </MainLayout>
    )
  }

  if (error) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-red-500 mb-4">Error al cargar usuarios: {error}</p>
            <Button onClick={refreshUsers}>Reintentar</Button>
          </div>
        </div>
      </MainLayout>
    )
  }

  const getStatusColor = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
      case 'suspended':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: User['status']) => {
    switch (status) {
      case 'active':
        return 'Activo'
      case 'inactive':
        return 'Inactivo'
      case 'pending':
        return 'Pendiente'
      case 'suspended':
        return 'Suspendido'
      default:
        return 'Desconocido'
    }
  }

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4" />
      case 'inactive':
        return <XCircle className="h-4 w-4" />
      case 'pending':
        return <Clock className="h-4 w-4" />
      case 'suspended':
        return <AlertCircle className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return <Shield className="h-4 w-4" />
      case 'ejecutivo':
        return <User className="h-4 w-4" />
      case 'cliente':
        return <Users className="h-4 w-4" />
      default:
        return <User className="h-4 w-4" />
    }
  }

  const getRoleText = (role: User['role']) => {
    switch (role) {
      case 'admin':
        return 'Administrador'
      case 'ejecutivo':
        return 'Ejecutivo'
      case 'cliente':
        return 'Cliente'
      default:
        return 'Usuario'
    }
  }

  const handleCreateUser = async () => {
    await simulateAction(
      'create-user',
      async () => {
        // Simular creación de usuario
        await new Promise(resolve => setTimeout(resolve, 2000))
      },
      {
        successMessage: "Usuario creado exitosamente",
        notification: {
          type: 'success',
          title: 'Usuario Creado',
          message: 'El nuevo usuario ha sido creado y se ha enviado un email de bienvenida'
        }
      }
    )
  }

  const handleToggleUserStatus = async (userId: string, currentStatus: User['status']) => {
    const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
    await simulateAction(
      `toggle-user-${userId}`,
      async () => {
        // Simular cambio de estado
        await new Promise(resolve => setTimeout(resolve, 1500))
      },
      {
        successMessage: `Usuario ${newStatus === 'active' ? 'activado' : 'desactivado'} exitosamente`,
        notification: {
          type: 'success',
          title: 'Estado Actualizado',
          message: `El usuario ha sido ${newStatus === 'active' ? 'activado' : 'desactivado'}`
        }
      }
    )
  }

  const handleResetPassword = async (userId: string) => {
    await simulateAction(
      `reset-password-${userId}`,
      async () => {
        // Simular reset de contraseña
        await new Promise(resolve => setTimeout(resolve, 1500))
      },
      {
        successMessage: "Contraseña reseteada exitosamente",
        notification: {
          type: 'success',
          title: 'Contraseña Reseteada',
          message: 'Se ha enviado un email con las instrucciones para crear una nueva contraseña'
        }
      }
    )
  }

  const handleExportUsers = async (format: 'csv' | 'excel') => {
    await simulateAction(
      'export-users',
      async () => {
        // Simular exportación
        await new Promise(resolve => setTimeout(resolve, 2000))
      },
      {
        successMessage: `Lista de usuarios exportada como ${format.toUpperCase()}`,
        notification: {
          type: 'success',
          title: 'Exportación Completada',
          message: `El archivo ${format.toUpperCase()} se está descargando`
        }
      }
    )
  }

  return (
    <MainLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Gestión de Usuarios</h1>
            <p className="text-muted-foreground">
              Administra usuarios internos, roles y permisos del sistema
            </p>
          </div>
          <div className="flex gap-2">
            <AnimatedButton 
              variant="outline"
              loading={isLoading('export-users')}
              loadingText="Exportando..."
              onClick={() => handleExportUsers('csv')}
              animation="pulse"
            >
              <Download className="h-4 w-4 mr-2" />
              Exportar
            </AnimatedButton>
            <AnimatedButton 
              loading={isLoading('create-user')}
              loadingText="Creando..."
              onClick={handleCreateUser}
              animation="pulse"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Nuevo Usuario
            </AnimatedButton>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-2xl font-bold">{users.length}</p>
                  <p className="text-sm text-muted-foreground">Total Usuarios</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.status === 'active').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-purple-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.role === 'admin').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Administradores</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3">
                <Clock className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {users.filter(u => u.status === 'pending').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={selectedRole} onValueChange={setSelectedRole}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
              <SelectItem value="ejecutivo">Ejecutivo</SelectItem>
              <SelectItem value="cliente">Cliente</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="active">Activo</SelectItem>
              <SelectItem value="inactive">Inactivo</SelectItem>
              <SelectItem value="pending">Pendiente</SelectItem>
              <SelectItem value="suspended">Suspendido</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Filter className="h-4 w-4 mr-2" />
            Filtros
          </Button>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <Card key={user.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <User className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                      <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          {getRoleIcon(user.role)}
                          {getRoleText(user.role)}
                        </span>
                        {user.department && (
                          <span>{user.department}</span>
                        )}
                        {user.position && (
                          <span>{user.position}</span>
                        )}
                        <span>Último acceso: {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Nunca'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Badge className={getStatusColor(user.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(user.status)}
                        {getStatusText(user.status)}
                      </div>
                    </Badge>
                    
                    <div className="flex gap-2">
                      <AnimatedButton 
                        variant="outline" 
                        size="sm"
                        animation="pulse"
                        onClick={() => handleView(user)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Ver
                      </AnimatedButton>
                      <AnimatedButton 
                        variant="outline" 
                        size="sm"
                        animation="pulse"
                        onClick={() => handleEdit(user)}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </AnimatedButton>
                      {user.status === 'active' ? (
                        <AnimatedButton 
                          variant="outline" 
                          size="sm"
                          loading={isLoading(`toggle-user-${user.id}`)}
                          loadingText="Desactivando..."
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                          animation="pulse"
                        >
                          <UserMinus className="h-4 w-4 mr-2" />
                          Desactivar
                        </AnimatedButton>
                      ) : (
                        <AnimatedButton 
                          size="sm"
                          loading={isLoading(`toggle-user-${user.id}`)}
                          loadingText="Activando..."
                          onClick={() => handleToggleUserStatus(user.id, user.status)}
                          animation="pulse"
                        >
                          <UserPlus className="h-4 w-4 mr-2" />
                          Activar
                        </AnimatedButton>
                      )}
                      <AnimatedButton 
                        variant="outline" 
                        size="sm"
                        loading={isLoading(`reset-password-${user.id}`)}
                        loadingText="Reseteando..."
                        onClick={() => handleResetPassword(user.id)}
                        animation="pulse"
                      >
                        <Key className="h-4 w-4 mr-2" />
                        Reset Password
                      </AnimatedButton>
                      <AnimatedButton 
                        variant="outline" 
                        size="sm"
                        animation="pulse"
                        onClick={() => handleDelete(user)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Modales */}
        <ActionModal
          isOpen={modals.view.isOpen}
          onClose={() => closeModal('view')}
          title="Detalles del Usuario"
          description="Información completa del usuario"
          type="view"
        >
          {modals.view.data && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                  {modals.view.data.avatar ? (
                    <img 
                      src={modals.view.data.avatar} 
                      alt={modals.view.data.name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-primary" />
                  )}
                </div>
                <div>
                  <h3 className="text-xl font-semibold">{modals.view.data.name}</h3>
                  <p className="text-muted-foreground">{modals.view.data.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className={getStatusColor(modals.view.data.status)}>
                      {getStatusText(modals.view.data.status)}
                    </Badge>
                    <Badge variant="outline">
                      {getRoleText(modals.view.data.role)}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Información Personal</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Email</label>
                      <p className="text-sm">{modals.view.data.email}</p>
                    </div>
                    {modals.view.data.phone && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Teléfono</label>
                        <p className="text-sm">{modals.view.data.phone}</p>
                      </div>
                    )}
                    {modals.view.data.department && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Departamento</label>
                        <p className="text-sm">{modals.view.data.department}</p>
                      </div>
                    )}
                    {modals.view.data.position && (
                      <div>
                        <label className="text-sm font-medium text-muted-foreground">Posición</label>
                        <p className="text-sm">{modals.view.data.position}</p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Estadísticas</h4>
                  <div className="space-y-2">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Cotizaciones Creadas</label>
                      <p className="text-sm font-semibold">{modals.view.data.stats?.quotationsCreated || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Propuestas Generadas</label>
                      <p className="text-sm font-semibold">{modals.view.data.stats?.proposalsGenerated || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Mensajes Procesados</label>
                      <p className="text-sm font-semibold">{modals.view.data.stats?.messagesProcessed || 0}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Última Actividad</label>
                      <p className="text-sm">{modals.view.data.stats ? new Date(modals.view.data.stats.lastActivity).toLocaleString() : 'N/A'}</p>
                    </div>
                  </div>
                </div>
              </div>

              {modals.view.data.permissions && (
                <div className="space-y-4">
                  <h4 className="font-medium">Permisos</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(modals.view.data.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center gap-2">
                        {value ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <span className="text-sm">
                          {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ActionModal>

        <ActionModal
          isOpen={modals.edit.isOpen}
          onClose={() => closeModal('edit')}
          title="Editar Usuario"
          description="Modifica la información del usuario"
          type="edit"
          onConfirm={() => handleSave(modals.edit.data)}
        >
          {modals.edit.data && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nombre</Label>
                  <Input 
                    id="name" 
                    defaultValue={modals.edit.data.name}
                    placeholder="Nombre completo"
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email"
                    defaultValue={modals.edit.data.email}
                    placeholder="email@ejemplo.com"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input 
                    id="phone" 
                    defaultValue={modals.edit.data.phone || ''}
                    placeholder="+52 55 1234 5678"
                  />
                </div>
                <div>
                  <Label htmlFor="role">Rol</Label>
                  <Select defaultValue={modals.edit.data.role}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrador</SelectItem>
                      <SelectItem value="ejecutivo">Ejecutivo</SelectItem>
                      <SelectItem value="cliente">Cliente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="department">Departamento</Label>
                  <Input 
                    id="department" 
                    defaultValue={modals.edit.data.department || ''}
                    placeholder="Departamento"
                  />
                </div>
                <div>
                  <Label htmlFor="position">Posición</Label>
                  <Input 
                    id="position" 
                    defaultValue={modals.edit.data.position || ''}
                    placeholder="Posición"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="status">Estado</Label>
                <Select defaultValue={modals.edit.data.status}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Activo</SelectItem>
                    <SelectItem value="inactive">Inactivo</SelectItem>
                    <SelectItem value="pending">Pendiente</SelectItem>
                    <SelectItem value="suspended">Suspendido</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {modals.edit.data.permissions && (
                <div className="space-y-4">
                  <h4 className="font-medium">Permisos</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(modals.edit.data.permissions).map(([key, value]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <Checkbox 
                          id={key}
                          defaultChecked={Boolean(value)}
                        />
                        <Label htmlFor={key} className="text-sm">
                          {key.replace('can', '').replace(/([A-Z])/g, ' $1').trim()}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </ActionModal>

        <ActionModal
          isOpen={modals.delete.isOpen}
          onClose={() => closeModal('delete')}
          title="Eliminar Usuario"
          description="¿Estás seguro de que quieres eliminar este usuario?"
          type="delete"
          onConfirm={() => handleDeleteConfirm(modals.delete.data)}
        >
          {modals.delete.data && (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900 dark:text-red-100">
                    Esta acción no se puede deshacer
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300">
                    Se eliminará permanentemente el usuario <strong>{modals.delete.data.name}</strong> y todos sus datos asociados.
                  </p>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground">
                  <strong>Email:</strong> {modals.delete.data.email}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Rol:</strong> {getRoleText(modals.delete.data.role)}
                </p>
                <p className="text-sm text-muted-foreground">
                  <strong>Estado:</strong> {getStatusText(modals.delete.data.status)}
                </p>
              </div>
            </div>
          )}
        </ActionModal>
      </div>
    </MainLayout>
  )
}
