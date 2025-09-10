"use client"

import { useState, useCallback } from 'react'
import { useToast } from '@/hooks/use-toast'
import { useNotifications } from '@/hooks/use-notifications'

export function useMicrointeractions() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({})
  const { toast } = useToast()
  const { addNotification } = useNotifications()

  const setLoading = useCallback((key: string, loading: boolean) => {
    setLoadingStates(prev => ({ ...prev, [key]: loading }))
  }, [])

  const isLoading = useCallback((key: string) => {
    return loadingStates[key] || false
  }, [loadingStates])

  const simulateAction = useCallback(async (
    key: string,
    action: () => Promise<void> | void,
    options?: {
      successMessage?: string
      errorMessage?: string
      notification?: {
        type: 'info' | 'success' | 'warning' | 'error'
        title: string
        message: string
      }
    }
  ) => {
    setLoading(key, true)
    
    try {
      await action()
      
      if (options?.successMessage) {
        toast({
          title: "Éxito",
          description: options.successMessage,
        })
      }
      
      if (options?.notification) {
        addNotification({
          ...options.notification,
          description: options.notification.message,
          status: 'new',
          priority: 'medium',
          read: false
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: options?.errorMessage || "Algo salió mal",
        variant: "destructive",
      })
    } finally {
      setLoading(key, false)
    }
  }, [toast, addNotification])

  // Acciones específicas para diferentes módulos
  const createQuotation = useCallback(async () => {
    await simulateAction(
      'create-quotation',
      async () => {
        // Simular creación de cotización
        await new Promise(resolve => setTimeout(resolve, 1500))
      },
      {
        successMessage: "Cotización creada exitosamente",
        notification: {
          type: 'success',
          title: 'Nueva Cotización Creada',
          message: 'La cotización ha sido generada y está lista para enviar'
        }
      }
    )
  }, [simulateAction])

  const createProposal = useCallback(async () => {
    await simulateAction(
      'create-proposal',
      async () => {
        // Simular creación de propuesta
        await new Promise(resolve => setTimeout(resolve, 2000))
      },
      {
        successMessage: "Propuesta generada exitosamente",
        notification: {
          type: 'success',
          title: 'Nueva Propuesta Creada',
          message: 'La propuesta con mockups 3D está lista para revisar'
        }
      }
    )
  }, [simulateAction])

  const sendMessage = useCallback(async (message: string) => {
    await simulateAction(
      'send-message',
      async () => {
        // Simular envío de mensaje
        await new Promise(resolve => setTimeout(resolve, 1000))
      },
      {
        successMessage: "Mensaje enviado exitosamente",
        notification: {
          type: 'info',
          title: 'Mensaje Enviado',
          message: 'El mensaje ha sido enviado por WhatsApp'
        }
      }
    )
  }, [simulateAction])

  const processWhatsAppMessage = useCallback(async (messageId: string) => {
    await simulateAction(
      `process-message-${messageId}`,
      async () => {
        // Simular procesamiento de mensaje
        await new Promise(resolve => setTimeout(resolve, 800))
      },
      {
        successMessage: "Mensaje procesado por IA",
        notification: {
          type: 'info',
          title: 'Mensaje Procesado',
          message: 'El mensaje ha sido analizado y se ha generado una respuesta automática'
        }
      }
    )
  }, [simulateAction])

  const approveQuotation = useCallback(async (quotationId: string) => {
    await simulateAction(
      `approve-quotation-${quotationId}`,
      async () => {
        // Simular aprobación de cotización
        await new Promise(resolve => setTimeout(resolve, 1200))
      },
      {
        successMessage: "Cotización aprobada exitosamente",
        notification: {
          type: 'success',
          title: 'Cotización Aprobada',
          message: `La cotización ${quotationId} ha sido aprobada por el cliente`
        }
      }
    )
  }, [simulateAction])

  const generateMockup = useCallback(async (proposalId: string) => {
    await simulateAction(
      `generate-mockup-${proposalId}`,
      async () => {
        // Simular generación de mockup
        await new Promise(resolve => setTimeout(resolve, 3000))
      },
      {
        successMessage: "Mockup 3D generado exitosamente",
        notification: {
          type: 'success',
          title: 'Mockup Generado',
          message: 'El mockup 3D ha sido creado y está listo para revisar'
        }
      }
    )
  }, [simulateAction])

  return {
    isLoading,
    setLoading,
    simulateAction,
    createQuotation,
    createProposal,
    sendMessage,
    processWhatsAppMessage,
    approveQuotation,
    generateMockup
  }
}
