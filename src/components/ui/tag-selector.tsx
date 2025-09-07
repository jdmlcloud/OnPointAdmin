"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface TagSelectorProps {
  selectedTags: string[]
  onTagsChange: (tags: string[]) => void
  availableTags?: string[]
  placeholder?: string
  className?: string
}

export function TagSelector({
  selectedTags,
  onTagsChange,
  availableTags = [],
  placeholder = "Buscar o crear etiqueta...",
  className
}: TagSelectorProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const [filteredTags, setFilteredTags] = useState<string[]>([])

  // Filtrar etiquetas disponibles
  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = availableTags.filter(tag =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !selectedTags.includes(tag)
      )
      setFilteredTags(filtered)
    } else {
      setFilteredTags(availableTags.filter(tag => !selectedTags.includes(tag)))
    }
  }, [searchTerm, availableTags, selectedTags])

  const normalizeTag = (tag: string) => {
    return tag.trim().toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
  }

  const addTag = (tag: string) => {
    if (tag.trim()) {
      const normalizedTag = normalizeTag(tag)
      const normalizedSelected = selectedTags.map(t => normalizeTag(t))
      const normalizedAvailable = availableTags.map(t => normalizeTag(t))
      
      // Verificar si ya existe (normalizado) en seleccionados
      if (!normalizedSelected.includes(normalizedTag)) {
        // Verificar si ya existe en disponibles (normalizado)
        const existingTag = availableTags.find(t => normalizeTag(t) === normalizedTag)
        if (existingTag) {
          // Usar la versión existente (con mayúsculas/tildes originales)
          onTagsChange([...selectedTags, existingTag])
        } else {
          // Crear nueva etiqueta
          onTagsChange([...selectedTags, tag.trim()])
        }
        setSearchTerm("")
      }
    }
  }

  const removeTag = (tagToRemove: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagToRemove))
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (searchTerm.trim()) {
        addTag(searchTerm)
      }
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setIsOpen(true)
  }

  const handleInputFocus = () => {
    setIsOpen(true)
  }

  const handleInputBlur = () => {
    // Delay para permitir clicks en las opciones
    setTimeout(() => setIsOpen(false), 200)
  }

  return (
    <div className={cn("relative", className)}>
      {/* Etiquetas seleccionadas */}
      {selectedTags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {selectedTags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {tag}
              <button 
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}

      {/* Input de búsqueda */}
      <div className="relative">
        <Input
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          className="pr-10"
        />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 p-0"
          onClick={() => searchTerm.trim() && addTag(searchTerm)}
          disabled={!searchTerm.trim()}
        >
          <Plus className="h-3 w-3" />
        </Button>
      </div>

      {/* Dropdown de opciones */}
      {isOpen && (filteredTags.length > 0 || searchTerm.trim()) && (
        <div className="absolute z-50 w-full mt-1 bg-background border rounded-md shadow-lg max-h-48 overflow-y-auto">
          {filteredTags.map((tag, index) => (
            <button
              key={index}
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center justify-between"
              onClick={() => addTag(tag)}
            >
              <span>{tag}</span>
              <Check className="h-3 w-3 text-muted-foreground" />
            </button>
          ))}
          
          {searchTerm.trim() && !availableTags.includes(searchTerm.trim()) && (
            <button
              type="button"
              className="w-full px-3 py-2 text-left text-sm hover:bg-muted flex items-center justify-between text-primary"
              onClick={() => addTag(searchTerm)}
            >
              <span>Crear "{searchTerm.trim()}"</span>
              <Plus className="h-3 w-3" />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
