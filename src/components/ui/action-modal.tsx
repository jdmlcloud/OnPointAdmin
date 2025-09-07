"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AnimatedButton } from "@/components/ui/animated-button"
import { useMicrointeractions } from "@/hooks/use-microinteractions"
import { X, AlertTriangle, CheckCircle, Info } from "lucide-react"

interface ActionModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  description?: string
  type?: 'view' | 'edit' | 'delete' | 'confirm'
  children?: React.ReactNode
  onConfirm?: () => void | Promise<void>
  confirmText?: string
  cancelText?: string
  loadingKey?: string
  destructive?: boolean
}

export function ActionModal({
  isOpen,
  onClose,
  title,
  description,
  type = 'view',
  children,
  onConfirm,
  confirmText,
  cancelText = 'Cancelar',
  loadingKey,
  destructive = false
}: ActionModalProps) {
  const { isLoading } = useMicrointeractions()

  const getIcon = () => {
    switch (type) {
      case 'delete':
        return <AlertTriangle className="h-5 w-5 text-red-600" />
      case 'confirm':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'edit':
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return null
    }
  }

  const getConfirmText = () => {
    if (confirmText) return confirmText
    switch (type) {
      case 'delete':
        return 'Eliminar'
      case 'edit':
        return 'Guardar'
      case 'confirm':
        return 'Confirmar'
      default:
        return 'Aceptar'
    }
  }

  const getConfirmVariant = () => {
    if (destructive || type === 'delete') return 'destructive'
    return 'default'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center gap-3">
            {getIcon()}
            <div>
              <DialogTitle>{title}</DialogTitle>
              {description && (
                <DialogDescription className="mt-1">
                  {description}
                </DialogDescription>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 scrollbar-hide">
          {children}
        </div>

        <DialogFooter className="flex-shrink-0 gap-2 border-t pt-4">
          <Button variant="outline" onClick={onClose}>
            {cancelText}
          </Button>
          {onConfirm && (
            <AnimatedButton
              variant={getConfirmVariant()}
              loading={loadingKey ? isLoading(loadingKey) : false}
              loadingText="Procesando..."
              onClick={onConfirm}
              animation="pulse"
            >
              {getConfirmText()}
            </AnimatedButton>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
