"use client"
// @ts-nocheck

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Shield, Smartphone } from "lucide-react"

export default function Verify2FAPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [code, setCode] = useState('')
  const [userId, setUserId] = useState('')
  const [timeLeft, setTimeLeft] = useState(600) // 10 minutos en segundos

  useEffect(() => {
    const id = searchParams.get('userId')
    if (id) {
      setUserId(id)
    } else {
      setError('ID de usuario no válido')
    }
  }, [searchParams])

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          twoFACode: code
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        // Guardar token y usuario en localStorage
        localStorage.setItem('auth_token', data.data.token)
        localStorage.setItem('user_data', JSON.stringify(data.data.user))
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)
      } else {
        setError(data.message)
      }
    } catch (error) {
      setError('Error de conexión. Intenta nuevamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleResendCode = async () => {
    setLoading(true)
    setError('')
    
    try {
      // En producción, aquí se reenviaría el código
      setTimeLeft(600) // Resetear timer
      setError('Código reenviado. Revisa tu email/SMS.')
    } catch (error) {
      setError('Error reenviando código.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Verificación Exitosa!</CardTitle>
            <CardDescription>
              Tu cuenta ha sido verificada correctamente. 
              Te redirigiremos al dashboard...
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Smartphone className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Verificación 2FA</CardTitle>
          <CardDescription>
            Ingresa el código de verificación que enviamos a tu email/SMS
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Label htmlFor="code">Código de Verificación</Label>
              <Input
                id="code"
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="123456"
                maxLength={6}
                className="text-center text-2xl tracking-widest"
                required
              />
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Tiempo restante: <span className="font-mono font-bold text-orange-600">
                  {formatTime(timeLeft)}
                </span>
              </p>
              {timeLeft === 0 && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleResendCode}
                  disabled={loading}
                >
                  Reenviar Código
                </Button>
              )}
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Información importante:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>El código es de 6 dígitos</li>
                    <li>Expira en 10 minutos</li>
                    <li>Si no lo recibiste, verifica tu spam</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !code || code.length !== 6 || timeLeft === 0}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Verificando...
                </>
              ) : (
                'Verificar Código'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
