"use client"

import { useState } from "react"
import { ActionModal } from "./action-modal"
import { Input } from "./input"
import { Button } from "./button"
import { Label } from "./label"
import { Textarea } from "./textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./select"

interface Client {
  id: string
  name: string
  description?: string
  industry?: string
  contactEmail?: string
  logos: any[]
  primaryLogoId?: string
  createdAt: string
  updatedAt?: string
}

interface ClientModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (clientData: Omit<Client, 'id' | 'createdAt' | 'logos'>) => void
  client?: Client | null
  title: string
}

const INDUSTRIES = [
  'Entertainment',
  'Technology',
  'Healthcare',
  'Finance',
  'Retail',
  'Education',
  'Manufacturing',
  'Consulting',
  'Media',
  'Other'
]

export function ClientModal({ isOpen, onClose, onSave, client, title }: ClientModalProps) {
  const [formData, setFormData] = useState({
    name: client?.name || '',
    description: client?.description || '',
    industry: client?.industry || '',
    contactEmail: client?.contactEmail || ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name.trim()) {
      alert('El nombre del cliente es requerido')
      return
    }

    setIsLoading(true)
    try {
      await onSave(formData)
      onClose()
    } catch (error) {
      console.error('Error saving client:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <ActionModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="md"
      showFooter={false}
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label htmlFor="name">Nombre del Cliente *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Ej: Netflix, HBO, Disney"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="industry">Industria</Label>
            <Select value={formData.industry} onValueChange={(value) => handleChange('industry', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar industria" />
              </SelectTrigger>
              <SelectContent>
                {INDUSTRIES.map((industry) => (
                  <SelectItem key={industry} value={industry}>
                    {industry}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="contactEmail">Email de Contacto</Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange('contactEmail', e.target.value)}
              placeholder="cliente@empresa.com"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Descripción</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Descripción del cliente y sus necesidades de branding..."
              rows={3}
            />
          </div>
        </div>
        
        <div className="flex justify-end gap-3">
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
            disabled={isLoading || !formData.name.trim()}
          >
            {isLoading ? 'Guardando...' : 'Guardar Cliente'}
          </Button>
        </div>
      </form>
    </ActionModal>
  )
}
