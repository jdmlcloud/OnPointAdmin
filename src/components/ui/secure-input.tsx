import { forwardRef } from "react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

export interface SecureInputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  secure?: boolean
}

const SecureInput = forwardRef<HTMLInputElement, SecureInputProps>(
  ({ className, type, secure = true, ...props }, ref) => {
    const secureProps = secure ? {
      autoComplete: "off" as const,
      autoCorrect: "off" as const,
      autoCapitalize: "off" as const,
      spellCheck: false,
      ...props
    } : props

    return (
      <Input
        type={type}
        className={cn(className)}
        ref={ref}
        {...secureProps}
      />
    )
  }
)
SecureInput.displayName = "SecureInput"

export { SecureInput }
