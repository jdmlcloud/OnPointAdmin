"use client"

import { forwardRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface AnimatedCardProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'fadeIn' | 'slideIn' | 'scaleIn' | 'none'
  delay?: number
}

const AnimatedCard = forwardRef<HTMLDivElement, AnimatedCardProps>(
  ({ className, animation = 'fadeIn', delay = 0, children, ...props }, ref) => {
    const getAnimationClass = () => {
      switch (animation) {
        case 'fadeIn':
          return 'animate-in fade-in-0 duration-500'
        case 'slideIn':
          return 'animate-in slide-in-from-bottom-4 duration-500'
        case 'scaleIn':
          return 'animate-in zoom-in-95 duration-300'
        case 'none':
        default:
          return ''
      }
    }

    return (
      <Card
        ref={ref}
        className={cn(
          "transition-all duration-200 hover:shadow-lg hover:scale-[1.02]",
          getAnimationClass(),
          className
        )}
        style={{ animationDelay: `${delay}ms` }}
        {...props}
      >
        {children}
      </Card>
    )
  }
)

AnimatedCard.displayName = "AnimatedCard"

export { AnimatedCard }
