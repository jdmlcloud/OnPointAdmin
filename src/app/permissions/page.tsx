'use client'

import React, { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth/auth-context'
import ProtectedRoute from '@/components/auth/protected-route'
import { Permission } from '@/types/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, Shield, Users, Settings, FileText, BarChart3, Package, Building } from 'lucide-react'
import { getVersionString } from '@/lib/version'
import { PermissionForm } from '@/components/permissions/permission-form'
import { PermissionCard } from '@/components/permissions/permission-card'

const PermissionsPage: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuthContext()
  const [permissions, setPermissions] = useState<Permission[]>([])
  const [filteredPermissions, setFilteredPermissions] = useState<Permission[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedPermission, setSelectedPermission] = useState<Permission | null>(null)
  const [error, setError] = useState('')

  // Datos de prueba para desarrollo local
  const testPermissions: Permission[] = [
    // Usuarios
    {
      id: 'permission-users-read',
      name: 'users:read',
      description: 'Ver usuarios',
      resource: 'users',
      action: 'read',
      category: 'Usuarios',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'permission-users-write',
      name: 'users:write',
      description: 'Editar usuarios',
      resource: 'users',
      action: 'write',
      category: 'Usuarios',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'permission-users-manage',
      name: 'users:manage',
      description: 'Gestionar usuarios',
      resource: 'users',
      action: 'manage',
      category: 'Usuarios',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    // Roles
    {
      id: 'permission-roles-read',
      name: 'roles:read',
      description: 'Ver roles',
      resource: 'roles',
      action: 'read',
      category: 'Roles',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'permission-roles-manage',
      name: 'roles:manage',
      description: 'Gestionar roles',
      resource: 'roles',
      action: 'manage',
      category: 'Roles',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    // Permisos
    {
      id: 'permission-permissions-read',
      name: 'permissions:read',
      description: 'Ver permisos',
      resource: 'permissions',
      action: 'read',
      category: 'Permisos',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'permission-permissions-manage',
      name: 'permissions:manage',
      description: 'Gestionar permisos',
      resource: 'permissions',
      action: 'manage',
      category: 'Permisos',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    // Proveedores
    {
      id: 'permission-providers-read',
      name: 'providers:read',
      description: 'Ver proveedores',
      resource: 'providers',
      action: 'read',
      category: 'Proveedores',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'permission-providers-write',
      name: 'providers:write',
      description: 'Editar proveedores',
      resource: 'providers',
      action: 'write',
      category: 'Proveedores',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'permission-providers-manage',
      name: 'providers:manage',
      description: 'Gestionar proveedores',
      resource: 'providers',
      action: 'manage',
      category: 'Proveedores',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    // Productos
    {
      id: 'permission-products-read',
      name: 'products:read',
      description: 'Ver productos',
      resource: 'products',
      action: 'read',
      category: 'Productos',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'permission-products-write',
      name: 'products:write',
      description: 'Editar productos',
      resource: 'products',
      action: 'write',
      category: 'Productos',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    {
      id: 'permission-products-manage',
      name: 'products:manage',
      description: 'Gestionar productos',
      resource: 'products',
      action: 'manage',
      category: 'Productos',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    // Reportes
    {
      id: 'permission-reports-view',
      name: 'reports:view',
      description: 'Ver reportes',
      resource: 'reports',
      action: 'view',
      category: 'Reportes',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    },
    // Configuración
    {
      id: 'permission-settings-manage',
      name: 'settings:manage',
      description: 'Gestionar configuración',
      resource: 'settings',
      action: 'manage',
      category: 'Configuración',
      isSystem: true,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    }
  ]

  const categories = [
    { id: 'all', name: 'Todas', icon: Shield },
    { id: 'Usuarios', name: 'Usuarios', icon: Users },
    { id: 'Roles', name: 'Roles', icon: Shield },
    { id: 'Permisos', name: 'Permisos', icon: Settings },
    { id: 'Proveedores', name: 'Proveedores', icon: Building },
    { id: 'Productos', name: 'Productos', icon: Package },
    { id: 'Reportes', name: 'Reportes', icon: BarChart3 },
    { id: 'Configuración', name: 'Configuración', icon: Settings }
  ]

  // Cargar permisos
  useEffect(() => {
    const loadPermissions = async () => {
      try {
        setIsLoading(true)
        // Simular carga de permisos
        await new Promise(resolve => setTimeout(resolve, 1000))
        setPermissions(testPermissions)
        setFilteredPermissions(testPermissions)
      } catch (error) {
        setError('Error al cargar permisos')
        console.error('Error loading permissions:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadPermissions()
  }, [])

  // Filtrar permisos
  useEffect(() => {
    let filtered = permissions.filter(permission =>
      permission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      permission.resource.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(permission => permission.category === selectedCategory)
    }

    setFilteredPermissions(filtered)
  }, [searchTerm, selectedCategory, permissions])

  const handleCreatePermission = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEditPermission = (permission: Permission) => {
    setSelectedPermission(permission)
    setIsEditDialogOpen(true)
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
    setIsCreateDialogOpen(false)
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
      setIsEditDialogOpen(false)
      setSelectedPermission(null)
      return true
    }
    return false
  }

  const canManagePermissions = hasPermission('permissions', 'manage')

  return (
    <ProtectedRoute requiredPermission={{ resource: 'permissions', action: 'read' }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Settings className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Permisos
                  </h1>
                  <p className="text-sm text-gray-500">
                    Administra permisos y accesos del sistema
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getVersionString()}
                </span>
                {canManagePermissions && (
                  <Button onClick={handleCreatePermission} className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Permiso
                  </Button>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Search and Filters */}
            <div className="mb-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar permisos por nombre, descripción o recurso..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
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
                        variant={selectedCategory === category.id ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCategory(category.id)}
                        className="flex items-center space-x-2 whitespace-nowrap"
                      >
                        <IconComponent className="h-4 w-4" />
                        <span>{category.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Permissions Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando permisos...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600">
                  <p className="text-lg font-medium">Error al cargar permisos</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : (
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
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredPermissions.length === 0 && (
              <div className="text-center py-12">
                <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron permisos
                </h3>
                <p className="text-gray-500">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Intenta con otros términos de búsqueda o filtros' 
                    : 'No hay permisos registrados'
                  }
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Create Permission Dialog */}
        <PermissionForm
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreatePermissionSubmit}
        />

        {/* Edit Permission Dialog */}
        <PermissionForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedPermission(null)
          }}
          onSubmit={handleEditPermissionSubmit}
          permission={selectedPermission}
        />
      </div>
    </ProtectedRoute>
  )
}

export default PermissionsPage
