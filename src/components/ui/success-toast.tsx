"use client"

import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SuccessToastProps {
  type: 'success' | 'error' | 'warning' | 'info'
  title: string
  message: string
  onClose?: () => void
  duration?: number
}

const getIcon = (type: SuccessToastProps['type']) => {
  switch (type) {
    case 'success':
      return <CheckCircle className="h-5 w-5 text-green-600" />
    case 'error':
      return <XCircle className="h-5 w-5 text-red-600" />
    case 'warning':
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />
    case 'info':
    default:
      return <Info className="h-5 w-5 text-blue-600" />
  }
}

const getBackgroundColor = (type: SuccessToastProps['type']) => {
  switch (type) {
    case 'success':
      return 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800'
    case 'error':
      return 'bg-red-50 dark:bg-red-950/50 border-red-200 dark:border-red-800'
    case 'warning':
      return 'bg-yellow-50 dark:bg-yellow-950/50 border-yellow-200 dark:border-yellow-800'
    case 'info':
    default:
      return 'bg-blue-50 dark:bg-blue-950/50 border-blue-200 dark:border-blue-800'
  }
}

export function SuccessToast({ type, title, message, onClose }: SuccessToastProps) {
  return (
    <div
      className={cn(
        "fixed top-4 right-4 z-50 w-96 p-4 rounded-lg border shadow-lg animate-in slide-in-from-right-full duration-300",
        getBackgroundColor(type)
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          {getIcon(type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-foreground">
            {title}
          </h4>
          <p className="text-sm text-muted-foreground mt-1">
            {message}
          </p>
        </div>
        
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1 hover:bg-muted rounded-full transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  )
}
