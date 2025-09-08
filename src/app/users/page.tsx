'use client'

import React, { useState, useEffect } from 'react'
import { useAuthContext } from '@/lib/auth/auth-context'
import ProtectedRoute from '@/components/auth/protected-route'
import { User, UserRoleType } from '@/types/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Search, Edit, Trash2, Eye, Users } from 'lucide-react'
import { getVersionString } from '@/lib/version'
import { UserForm } from '@/components/users/user-form'

const UsersPage: React.FC = () => {
  const { user: currentUser, hasPermission } = useAuthContext()
  const [users, setUsers] = useState<User[]>([])
  const [filteredUsers, setFilteredUsers] = useState<User[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [error, setError] = useState('')

  // Datos de prueba para desarrollo local
  const testUsers: User[] = [
    {
      id: 'user-super-admin',
      email: 'superadmin@onpoint.com',
      firstName: 'Super',
      lastName: 'Administrador',
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
      firstName: 'Admin',
      lastName: 'Usuario',
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
      firstName: 'Ejecutivo',
      lastName: 'Usuario',
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

  // Cargar usuarios
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setIsLoading(true)
        // Simular carga de usuarios
        await new Promise(resolve => setTimeout(resolve, 1000))
        setUsers(testUsers)
        setFilteredUsers(testUsers)
      } catch (error) {
        setError('Error al cargar usuarios')
        console.error('Error loading users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Filtrar usuarios
  useEffect(() => {
    const filtered = users.filter(user =>
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredUsers(filtered)
  }, [searchTerm, users])

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

  const handleCreateUser = () => {
    setIsCreateDialogOpen(true)
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setIsEditDialogOpen(true)
  }

  const handleDeleteUser = (user: User) => {
    if (confirm(`¿Estás seguro de que quieres eliminar a ${user.firstName} ${user.lastName}?`)) {
      // Implementar eliminación
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
    setIsCreateDialogOpen(false)
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
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      return true
    }
    return false
  }

  const canManageUsers = hasPermission('users', 'manage')

  return (
    <ProtectedRoute requiredPermission={{ resource: 'users', action: 'read' }}>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h1 className="text-2xl font-bold text-gray-900">
                    Gestión de Usuarios
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
                {canManageUsers && (
                  <Button onClick={handleCreateUser} className="flex items-center">
                    <Plus className="h-4 w-4 mr-2" />
                    Nuevo Usuario
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
                      placeholder="Buscar usuarios por nombre, email o departamento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Users Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-4 text-gray-600">Cargando usuarios...</p>
                </div>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="text-red-600">
                  <p className="text-lg font-medium">Error al cargar usuarios</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-sm">
                              {user.firstName[0]}{user.lastName[0]}
                            </span>
                          </div>
                          <div>
                            <CardTitle className="text-lg">
                              {user.firstName} {user.lastName}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {user.email}
                            </CardDescription>
                          </div>
                        </div>
                        <div className="flex space-x-1">
                          {canManageUsers && (
                            <>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                className="text-red-600 hover:text-red-700"
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
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleDisplayName(user.role)}
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
                ))}
              </div>
            )}

            {/* Empty State */}
            {!isLoading && !error && filteredUsers.length === 0 && (
              <div className="text-center py-12">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron usuarios
                </h3>
                <p className="text-gray-500">
                  {searchTerm ? 'Intenta con otros términos de búsqueda' : 'No hay usuarios registrados'}
                </p>
              </div>
            )}
          </div>
        </main>

        {/* Create User Dialog */}
        <UserForm
          isOpen={isCreateDialogOpen}
          onClose={() => setIsCreateDialogOpen(false)}
          onSubmit={handleCreateUserSubmit}
          currentUserRole={currentUser?.role}
        />

        {/* Edit User Dialog */}
        <UserForm
          isOpen={isEditDialogOpen}
          onClose={() => {
            setIsEditDialogOpen(false)
            setSelectedUser(null)
          }}
          onSubmit={handleEditUserSubmit}
          user={selectedUser}
          currentUserRole={currentUser?.role}
        />
      </div>
    </ProtectedRoute>
  )
}

export default UsersPage