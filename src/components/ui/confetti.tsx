"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ConfettiProps {
  trigger: boolean
  onComplete?: () => void
}

export function Confetti({ trigger, onComplete }: ConfettiProps) {
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    if (trigger) {
      setIsActive(true)
      const timer = setTimeout(() => {
        setIsActive(false)
        onComplete?.()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [trigger, onComplete])

  if (!isActive) return null

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {Array.from({ length: 50 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "absolute w-2 h-2 rounded-full animate-bounce",
            i % 5 === 0 && "bg-green-500",
            i % 5 === 1 && "bg-blue-500",
            i % 5 === 2 && "bg-yellow-500",
            i % 5 === 3 && "bg-red-500",
            i % 5 === 4 && "bg-purple-500"
          )}
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 2}s`,
            animationDuration: `${2 + Math.random() * 2}s`
          }}
        />
      ))}
    </div>
  )
}
