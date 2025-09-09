'use client'

import React, { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth/auth-context'
import ProtectedRoute from '@/components/auth/protected-route'
import { UserRole, Permission } from '@/types/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Search, Edit, Trash2, Shield, Users, Settings } from 'lucide-react'
import { getVersionString } from '@/lib/version'
import { RoleForm } from '@/components/roles/role-form'
import { RoleCard } from '@/components/roles/role-card'

const UserRolesPage: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuthContext()
  const [roles, setUserRoles] = useState<UserRole[]>([])
  const [filteredUserRoles, setFilteredUserRoles] = useState<UserRole[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUserRole, setSelectedUserRole] = useState<UserRole | null>(null)
  const [error, setError] = useState('')

  // Datos de prueba para desarrollo local
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

  // Cargar roles
  useEffect(() => {
    const loadUserRoles = async () => {
      try {
        setIsLoading(true)
        // Simular carga de roles
        await new Promise(resolve => setTimeout(resolve, 1000))
        setUserRoles(testUserRoles)
        setFilteredUserRoles(testUserRoles)
      } catch (error) {
        setError('Error al cargar roles')
        console.error('Error loading roles:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUserRoles()
  }, [])

  // Filtrar roles
  useEffect(() => {
    const filtered = roles.filter(role =>
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUserRoles(filtered)
  }, [searchTerm, roles])

  const handleCreateUserRole = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEditUserRole = (role: UserRole) => {
    setSelectedUserRole(role)
    setIsEditDialogOpen(true)
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
      level: 4, // Nuevos roles tienen nivel 4 por defecto
      isSystem: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: 'current-user'
    }

    setUserRoles(prev => [...prev, newUserRole])
    setFilteredUserRoles(prev => [...prev, newUserRole])
    setIsCreateDialogOpen(false)
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
      setIsEditDialogOpen(false)
      setSelectedUserRole(null)
      return true
    }
    return false
  }

  const canManageUserRoles = hasPermission('roles', 'manage')

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
                    Gestión de UserRoles
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
                {canManageUserRoles && (
                  <Button onClick={handleCreateUserRole} className="flex items-center">
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

            {/* UserRoles Grid */}
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
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredUserRoles.length === 0 && (
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

        {/* Create UserRole Dialog */}
        <RoleForm
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateUserRoleSubmit}
          currentUserRole={currentUser?.role?.name as any}
        />

        {/* Edit UserRole Dialog */}
        <RoleForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedUserRole(null)
          }}
          onSubmit={handleEditUserRoleSubmit}
          role={selectedUserRole}
          currentUserRole={currentUser?.role?.name as any}
        />
      </div>
    </ProtectedRoute>
  )
}

export default UserRolesPage
