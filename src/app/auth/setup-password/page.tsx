"use client"
// @ts-nocheck

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, CheckCircle, XCircle, Shield, Key } from "lucide-react"

export default function SetupPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [passwordSetupToken, setPasswordSetupToken] = useState('')
  const [userInfo, setUserInfo] = useState(null)

  useEffect(() => {
    const token = searchParams.get('token')
    if (token) {
      setPasswordSetupToken(token)
    } else {
      setError('Token de configuración no válido')
    }
  }, [searchParams])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/auth/setup-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          passwordSetupToken,
          password,
          confirmPassword
        }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setUserInfo(data.data)
        // Redirigir a verificación 2FA después de 2 segundos
        setTimeout(() => {
          router.push(`/auth/verify-2fa?userId=${data.data.userId}`)
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

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <CardTitle className="text-2xl">¡Contraseña Configurada!</CardTitle>
            <CardDescription>
              Tu contraseña ha sido configurada exitosamente. 
              Te redirigiremos a la verificación 2FA...
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
            <Key className="h-6 w-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Configurar Contraseña</CardTitle>
          <CardDescription>
            Configura una contraseña segura para tu cuenta
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
              <Label htmlFor="password">Nueva Contraseña</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repite tu contraseña"
                required
              />
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-start">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                <div className="text-sm text-blue-800">
                  <p className="font-medium mb-1">Requisitos de seguridad:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Mínimo 8 caracteres</li>
                    <li>Después de configurar, recibirás un código de verificación</li>
                    <li>El código expira en 10 minutos</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading || !password || !confirmPassword}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Configurando...
                </>
              ) : (
                'Configurar Contraseña'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
