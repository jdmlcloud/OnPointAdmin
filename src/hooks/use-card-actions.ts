"use client"

import { useState, useCallback } from 'react'
import { useMicrointeractions } from './use-microinteractions'

export interface CardActionOptions {
  onSuccess?: (data?: any) => void
  onError?: (error: string) => void
  showNotification?: boolean
}

export function useCardActions(refreshData?: () => void) {
  const [modals, setModals] = useState<{
    view: { isOpen: boolean; data: any }
    edit: { isOpen: boolean; data: any }
    delete: { isOpen: boolean; data: any }
  }>({
    view: { isOpen: false, data: null },
    edit: { isOpen: false, data: null },
    delete: { isOpen: false, data: null }
  })

  const { simulateAction } = useMicrointeractions()

  const openModal = useCallback((type: 'view' | 'edit' | 'delete', data: any) => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: true, data }
    }))
  }, [])

  const closeModal = useCallback((type: 'view' | 'edit' | 'delete') => {
    setModals(prev => ({
      ...prev,
      [type]: { isOpen: false, data: null }
    }))
  }, [])

  const handleView = useCallback((data: any) => {
    openModal('view', data)
  }, [openModal])

  const handleEdit = useCallback((data: any) => {
    openModal('edit', data)
  }, [openModal])

  const handleDelete = useCallback((data: any) => {
    openModal('delete', data)
  }, [openModal])

  const handleSave = useCallback(async (
    data: any,
    options: CardActionOptions = {}
  ) => {
    await simulateAction(
      'save-item',
      async () => {
        // Integrar con la API real del backend
        const response = await fetch(`/api/logos/${data.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error al actualizar logo')
        }
        
        return await response.json()
      },
      {
        successMessage: "Logo actualizado exitosamente",
        notification: {
          type: 'success',
          title: 'Actualización Exitosa',
          message: 'Los cambios han sido guardados correctamente'
        }
      }
    )
    
    closeModal('edit')
    refreshData?.() // Refrescar datos después de actualizar
    options.onSuccess?.()
  }, [simulateAction, closeModal, refreshData])

  const handleDeleteConfirm = useCallback(async (
    data: any,
    options: CardActionOptions = {}
  ) => {
    await simulateAction(
      'delete-item',
      async () => {
        // Integrar con la API real del backend
        const response = await fetch(`/api/logos/${data.id}`, {
          method: 'DELETE'
        })
        
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Error al eliminar logo')
        }
        
        return await response.json()
      },
      {
        successMessage: "Logo eliminado exitosamente",
        notification: {
          type: 'success',
          title: 'Eliminación Exitosa',
          message: 'El logo ha sido eliminado correctamente'
        }
      }
    )
    
    closeModal('delete')
    refreshData?.() // Refrescar datos después de eliminar
    options.onSuccess?.()
  }, [simulateAction, closeModal, refreshData])

  const handleDownload = useCallback(async (data: any) => {
    await simulateAction(
      'download-item',
      async () => {
        // Simular descarga
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // En el backend real, esto generará el PDF/archivo
        console.log('Descargando:', data)
      },
      {
        successMessage: "Descarga iniciada",
        notification: {
          type: 'info',
          title: 'Descarga Iniciada',
          message: 'El archivo se está generando y descargará automáticamente'
        }
      }
    )
  }, [simulateAction])

  const handleShare = useCallback(async (data: any) => {
    await simulateAction(
      'share-item',
      async () => {
        // Simular compartir
        await new Promise(resolve => setTimeout(resolve, 300))
        
        // En el backend real, esto generará un enlace de compartir
        const shareUrl = `${window.location.origin}/share/${data.id}`
        await navigator.clipboard.writeText(shareUrl)
      },
      {
        successMessage: "Enlace copiado al portapapeles",
        notification: {
          type: 'success',
          title: 'Enlace Copiado',
          message: 'El enlace de compartir ha sido copiado al portapapeles'
        }
      }
    )
  }, [simulateAction])

  return {
    modals,
    setModals,
    handleView,
    handleEdit,
    handleDelete,
    handleSave,
    handleDeleteConfirm,
    handleDownload,
    handleShare,
    closeModal
  }
}
