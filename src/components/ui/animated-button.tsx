"use client"

import { forwardRef } from "react"
import { Loader2 } from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface AnimatedButtonProps extends ButtonProps {
  loading?: boolean
  loadingText?: string
  success?: boolean
  successText?: string
  error?: boolean
  errorText?: string
  animation?: 'pulse' | 'bounce' | 'shake' | 'none'
}

const AnimatedButton = forwardRef<HTMLButtonElement, AnimatedButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    loading = false,
    loadingText,
    success = false,
    successText,
    error = false,
    errorText,
    animation = 'none',
    children,
    disabled,
    ...props 
  }, ref) => {
    const getAnimationClass = () => {
      if (loading) return 'animate-pulse'
      if (success) return 'animate-bounce'
      if (error) return 'animate-pulse'
      if (animation === 'pulse') return 'hover:animate-pulse'
      if (animation === 'bounce') return 'hover:animate-bounce'
      if (animation === 'shake') return 'hover:animate-pulse'
      return ''
    }

    const getVariant = () => {
      if (success) return 'default'
      if (error) return 'destructive'
      return variant
    }

    const getContent = () => {
      if (loading) {
        return (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        )
      }
      if (success) {
        return successText || children
      }
      if (error) {
        return errorText || children
      }
      return children
    }

    return (
      <Button
        className={cn(
          "transition-all duration-200 hover:scale-105 active:scale-95",
          getAnimationClass(),
          className
        )}
        variant={getVariant()}
        size={size}
        disabled={disabled || loading}
        ref={ref}
        {...props}
      >
        {getContent()}
      </Button>
    )
  }
)

AnimatedButton.displayName = "AnimatedButton"

export { AnimatedButton }
