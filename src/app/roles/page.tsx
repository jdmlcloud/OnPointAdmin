'use client'

import React, { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth/auth-context'
import ProtectedRoute from '@/components/auth/protected-route'
import { Role, Permission } from '@/types/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, Shield, Users, Settings } from 'lucide-react'
import { getVersionString } from '@/lib/version'
import { RoleForm } from '@/components/roles/role-form'
import { RoleCard } from '@/components/roles/role-card'

const RolesPage: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuthContext()
  const [roles, setRoles] = useState<Role[]>([])
  const [filteredRoles, setFilteredRoles] = useState<Role[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [error, setError] = useState('')

  // Datos de prueba para desarrollo local
  const testRoles: Role[] = [
    {
      id: 'role-super-admin',
      name: 'Super Administrador',
      description: 'Acceso total al sistema, puede gestionar todo incluyendo otros administradores',
      permissions: ['users:manage', 'roles:manage', 'permissions:manage', 'providers:manage', 'products:manage', 'reports:view', 'settings:manage'],
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
      permissions: ['users:manage', 'providers:manage', 'products:manage', 'reports:view'],
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
      permissions: ['providers:read', 'products:read', 'reports:view'],
      level: 3,
      isSystem: false,
      status: 'active',
      createdAt: '2024-12-19T00:00:00.000Z',
      updatedAt: '2024-12-19T00:00:00.000Z',
      createdBy: 'system'
    }
  ]

  // Cargar roles
  useEffect(() => {
    const loadRoles = async () => {
      try {
        setIsLoading(true)
        // Simular carga de roles
        await new Promise(resolve => setTimeout(resolve, 1000))
        setRoles(testRoles)
        setFilteredRoles(testRoles)
      } catch (error) {
        setError('Error al cargar roles')
        console.error('Error loading roles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRoles()
  }, [])

  // Filtrar roles
  useEffect(() => {
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredRoles(filtered)
  }, [searchTerm, roles])

  const handleCreateRole = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEditRole = (role: Role) => {
    setSelectedRole(role)
    setIsEditDialogOpen(true)
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
      level: 4, // Nuevos roles tienen nivel 4 por defecto
      isSystem: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    }

    setRoles(prev => [...prev, newRole])
    setFilteredRoles(prev => [...prev, newRole])
    setIsCreateDialogOpen(false)
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
      setIsEditDialogOpen(false)
      setSelectedRole(null)
      return true
    }
    return false
  }

  const canManageRoles = hasPermission('roles', 'manage')

  return (
    <ProtectedRoute requiredPermission={{ resource: 'roles', action: 'read' }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Roles
                  </h1>
                  <p className="text-sm text-gray-500">
                    Administra roles y permisos del sistema
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getVersionString()}
                </span>
                {canManageRoles && (
                  <Button onClick={handleCreateRole} className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Rol
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
              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Buscar roles por nombre o descripción..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Roles Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando roles...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600">
                  <p className="text-lg font-medium">Error al cargar roles</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : (
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
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredRoles.length === 0 && (
              <div className="text-center py-12">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron roles
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay roles registrados'}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Create Role Dialog */}
        <RoleForm
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateRoleSubmit}
          currentUserRole={currentUser?.role}
        />

        {/* Edit Role Dialog */}
        <RoleForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedRole(null)
          }}
          onSubmit={handleEditRoleSubmit}
          role={selectedRole}
          currentUserRole={currentUser?.role}
        />
      </div>
    </ProtectedRoute>
  )
}

export default RolesPage
