'use client'

import React, { useState, useEffect } from 'react'
import { Role, UserRoleType } from '@/types/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Users, Shield, Settings, FileText, BarChart3 } from 'lucide-react'

interface RoleFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (roleData: any) => Promise<boolean>
  role?: Role | null
  currentUserRole?: UserRoleType
  isLoading?: boolean
}

// Permisos disponibles organizados por categorías
const availablePermissions = {
  'Usuarios': [
    { id: 'users:read', name: 'Ver usuarios', description: 'Puede ver la lista de usuarios' },
    { id: 'users:write', name: 'Editar usuarios', description: 'Puede modificar información de usuarios' },
    { id: 'users:manage', name: 'Gestionar usuarios', description: 'Puede crear, editar y eliminar usuarios' }
  ],
  'Roles': [
    { id: 'roles:read', name: 'Ver roles', description: 'Puede ver la lista de roles' },
    { id: 'roles:manage', name: 'Gestionar roles', description: 'Puede crear, editar y eliminar roles' }
  ],
  'Permisos': [
    { id: 'permissions:read', name: 'Ver permisos', description: 'Puede ver la lista de permisos' },
    { id: 'permissions:manage', name: 'Gestionar permisos', description: 'Puede crear, editar y eliminar permisos' }
  ],
  'Proveedores': [
    { id: 'providers:read', name: 'Ver proveedores', description: 'Puede ver la lista de proveedores' },
    { id: 'providers:write', name: 'Editar proveedores', description: 'Puede modificar información de proveedores' },
    { id: 'providers:manage', name: 'Gestionar proveedores', description: 'Puede crear, editar y eliminar proveedores' }
  ],
  'Productos': [
    { id: 'products:read', name: 'Ver productos', description: 'Puede ver la lista de productos' },
    { id: 'products:write', name: 'Editar productos', description: 'Puede modificar información de productos' },
    { id: 'products:manage', name: 'Gestionar productos', description: 'Puede crear, editar y eliminar productos' }
  ],
  'Reportes': [
    { id: 'reports:view', name: 'Ver reportes', description: 'Puede acceder a reportes y estadísticas' }
  ],
  'Configuración': [
    { id: 'settings:manage', name: 'Gestionar configuración', description: 'Puede modificar configuraciones del sistema' }
  ]
}

export const RoleForm: React.FC<RoleFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  role,
  currentUserRole,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    permissions: [] as string[]
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Inicializar formulario
  useEffect(() => {
    if (role) {
      setFormData({
        name: role.name,
        description: role.description,
        permissions: role.permissions
      })
    } else {
      setFormData({
        name: '',
        description: '',
        permissions: []
      })
    }
    setErrors({})
  }, [role, isOpen])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del rol es requerido'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    if (formData.permissions.length === 0) {
      newErrors.permissions = 'Debe seleccionar al menos un permiso'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    const success = await onSubmit(formData)
    if (success) {
      onClose()
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handlePermissionChange = (permissionId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...prev.permissions, permissionId]
        : prev.permissions.filter(p => p !== permissionId)
    }))
    if (errors.permissions) {
      setErrors(prev => ({ ...prev, permissions: '' }))
    }
  }

  const handleSelectAll = (category: string, checked: boolean) => {
    const categoryPermissions = availablePermissions[category as keyof typeof availablePermissions]
    const permissionIds = categoryPermissions.map(p => p.id)
    
    setFormData(prev => ({
      ...prev,
      permissions: checked
        ? [...new Set([...prev.permissions, ...permissionIds])]
        : prev.permissions.filter(p => !permissionIds.includes(p))
    }))
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Usuarios':
        return <Users className="h-4 w-4" />
      case 'Roles':
      case 'Permisos':
        return <Shield className="h-4 w-4" />
      case 'Configuración':
        return <Settings className="h-4 w-4" />
      case 'Reportes':
        return <BarChart3 className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const isCategorySelected = (category: string) => {
    const categoryPermissions = availablePermissions[category as keyof typeof availablePermissions]
    return categoryPermissions.every(p => formData.permissions.includes(p.id))
  }

  const isCategoryPartiallySelected = (category: string) => {
    const categoryPermissions = availablePermissions[category as keyof typeof availablePermissions]
    const selectedCount = categoryPermissions.filter(p => formData.permissions.includes(p.id)).length
    return selectedCount > 0 && selectedCount < categoryPermissions.length
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {role ? 'Editar Rol' : 'Crear Nuevo Rol'}
          </DialogTitle>
          <DialogDescription>
            {role 
              ? 'Modifica la información del rol seleccionado.'
              : 'Completa la información para crear un nuevo rol en el sistema.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre del Rol *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ej: Administrador de Ventas"
                className={errors.name ? 'border-red-500' : ''}
              />
              {errors.name && (
                <p className="text-sm text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            <div>
              <Label htmlFor="description">Descripción *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe las responsabilidades de este rol"
                className={errors.description ? 'border-red-500' : ''}
                rows={3}
              />
              {errors.description && (
                <p className="text-sm text-red-500 mt-1">{errors.description}</p>
              )}
            </div>
          </div>

          {/* Permisos */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <Label className="text-base font-medium">Permisos *</Label>
              <Badge variant="outline">
                {formData.permissions.length} permisos seleccionados
              </Badge>
            </div>
            
            {errors.permissions && (
              <p className="text-sm text-red-500 mb-4">{errors.permissions}</p>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(availablePermissions).map(([category, permissions]) => (
                <Card key={category}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {getCategoryIcon(category)}
                        <CardTitle className="text-sm">{category}</CardTitle>
                      </div>
                      <Checkbox
                        checked={isCategorySelected(category)}
                        onCheckedChange={(checked) => handleSelectAll(category, checked as boolean)}
                        className={isCategoryPartiallySelected(category) ? 'data-[state=checked]:bg-blue-600' : ''}
                      />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {permissions.map((permission) => (
                      <div key={permission.id} className="flex items-start space-x-2">
                        <Checkbox
                          id={permission.id}
                          checked={formData.permissions.includes(permission.id)}
                          onCheckedChange={(checked) => handlePermissionChange(permission.id, checked as boolean)}
                        />
                        <div className="flex-1">
                          <Label 
                            htmlFor={permission.id} 
                            className="text-sm font-medium cursor-pointer"
                          >
                            {permission.name}
                          </Label>
                          <p className="text-xs text-gray-500">
                            {permission.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading}
            >
              {isLoading ? 'Guardando...' : (role ? 'Guardar Cambios' : 'Crear Rol')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
