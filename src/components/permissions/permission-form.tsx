'use client'

import React, { useState, useEffect } from 'react'
import { Permission } from '@/types/users'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface PermissionFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (permissionData: any) => Promise<boolean>
  permission?: Permission | null
  isLoading?: boolean
}

const availableCategories = [
  'Usuarios',
  'Roles',
  'Permisos',
  'Proveedores',
  'Productos',
  'Reportes',
  'Configuración'
]

const availableActions = [
  { value: 'read', label: 'Leer', description: 'Puede ver/leer información' },
  { value: 'write', label: 'Escribir', description: 'Puede modificar información' },
  { value: 'manage', label: 'Gestionar', description: 'Puede crear, editar y eliminar' },
  { value: 'view', label: 'Ver', description: 'Puede visualizar contenido' }
]

const availableResources = [
  'users',
  'roles',
  'permissions',
  'providers',
  'products',
  'reports',
  'settings'
]

export const PermissionForm: React.FC<PermissionFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  permission,
  isLoading = false
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    resource: '',
    action: '',
    category: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  // Inicializar formulario
  useEffect(() => {
    if (permission) {
      setFormData({
        name: permission.name,
        description: permission.description,
        resource: permission.resource,
        action: permission.action,
        category: permission.category
      })
    } else {
      setFormData({
        name: '',
        description: '',
        resource: '',
        action: '',
        category: ''
      })
    }
    setErrors({})
  }, [permission, isOpen])

  // Generar nombre automáticamente cuando cambian resource y action
  useEffect(() => {
    if (formData.resource && formData.action && !permission) {
      setFormData(prev => ({
        ...prev,
        name: `${formData.resource}:${formData.action}`
      }))
    }
  }, [formData.resource, formData.action, permission])

  // Generar categoría automáticamente cuando cambia el resource
  useEffect(() => {
    if (formData.resource && !permission) {
      const resourceToCategory: Record<string, string> = {
        'users': 'Usuarios',
        'roles': 'Roles',
        'permissions': 'Permisos',
        'providers': 'Proveedores',
        'products': 'Productos',
        'reports': 'Reportes',
        'settings': 'Configuración'
      }
      
      setFormData(prev => ({
        ...prev,
        category: resourceToCategory[formData.resource] || ''
      }))
    }
  }, [formData.resource, permission])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre del permiso es requerido'
    } else if (!/^[a-z]+:[a-z]+$/.test(formData.name)) {
      newErrors.name = 'El nombre debe tener formato "recurso:acción" (ej: users:read)'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es requerida'
    }

    if (!formData.resource.trim()) {
      newErrors.resource = 'El recurso es requerido'
    }

    if (!formData.action.trim()) {
      newErrors.action = 'La acción es requerida'
    }

    if (!formData.category.trim()) {
      newErrors.category = 'La categoría es requerida'
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {permission ? 'Editar Permiso' : 'Crear Nuevo Permiso'}
          </DialogTitle>
          <DialogDescription>
            {permission 
              ? 'Modifica la información del permiso seleccionado.'
              : 'Completa la información para crear un nuevo permiso en el sistema.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Nombre del Permiso *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="users:read"
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-sm text-red-500 mt-1">{errors.name}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Formato: recurso:acción (ej: users:read, providers:manage)
            </p>
          </div>

          <div>
            <Label htmlFor="description">Descripción *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe qué permite este permiso"
              className={errors.description ? 'border-red-500' : ''}
              rows={3}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="resource">Recurso *</Label>
              <Select
                value={formData.resource}
                onValueChange={(value) => handleInputChange('resource', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar recurso" />
                </SelectTrigger>
                <SelectContent>
                  {availableResources.map(resource => (
                    <SelectItem key={resource} value={resource}>
                      {resource}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.resource && (
                <p className="text-sm text-red-500 mt-1">{errors.resource}</p>
              )}
            </div>

            <div>
              <Label htmlFor="action">Acción *</Label>
              <Select
                value={formData.action}
                onValueChange={(value) => handleInputChange('action', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar acción" />
                </SelectTrigger>
                <SelectContent>
                  {availableActions.map(action => (
                    <SelectItem key={action.value} value={action.value}>
                      <div>
                        <div className="font-medium">{action.label}</div>
                        <div className="text-xs text-gray-500">{action.description}</div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.action && (
                <p className="text-sm text-red-500 mt-1">{errors.action}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="category">Categoría *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {availableCategories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div className="flex justify-end space-x-2 pt-4">
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
              {isLoading ? 'Guardando...' : (permission ? 'Guardar Cambios' : 'Crear Permiso')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
