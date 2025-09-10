'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

type VerifyStatus = 'idle' | 'verifying' | 'success' | 'error'

function decodeJwtPayload(token: string): any | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch {
    return null
  }
}

export default function VerifyEmailLinkPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<VerifyStatus>('idle')
  const [message, setMessage] = useState('Revisa los detalles del enlace y valida para continuar.')
  const token = searchParams?.get('token') || ''

  const payload = useMemo(() => (token ? decodeJwtPayload(token) : null), [token])
  const expDate = useMemo(() => {
    if (!payload?.exp) return null
    const ms = Number(payload.exp)
    // Si viene en segundos convertir a ms
    const asMs = ms < 10_000_000_000 ? ms * 1000 : ms
    return new Date(asMs)
  }, [payload])

  const isExpired = useMemo(() => {
    if (!expDate) return false
    return Date.now() > expDate.getTime()
  }, [expDate])

  const handleValidate = async () => {
    if (!token) {
      setStatus('error')
      setMessage('Token faltante o inválido. Solicita un nuevo enlace.')
      return
    }
    setStatus('verifying')
    setMessage('Verificando enlace de acceso...')
    try {
      const res = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token })
      })
      const data = await res.json()
      if (!res.ok || !data.success) {
        setStatus('error')
        setMessage(data.message || 'No fue posible validar tu enlace. Solicita uno nuevo.')
        return
      }
      setStatus('success')
      setMessage('Email verificado. Redirigiendo a configuración de contraseña...')
      // Redirigir a configuración de contraseña
      setTimeout(() => {
        router.push(`/auth/setup-password?token=${data.data.passwordSetupToken}`)
      }, 2000)
    } catch (err) {
      setStatus('error')
      setMessage('Error de conexión al validar el enlace. Intenta nuevamente.')
    }
  }

  const handleGoLogin = () => router.replace('/auth/login')
  const handleGoDashboard = () => router.replace('/dashboard')
  const handleRequestNew = () => {
    // Placeholder: aquí se podría disparar el flujo para reenviar el enlace por email
    alert('Se solicitará un nuevo enlace a tu correo (pendiente de implementar).')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="max-w-md w-full">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
            {status === 'verifying' && (
              <div className="h-6 w-6 rounded-full border-b-2 border-blue-600 animate-spin" />
            )}
            {status === 'success' && (
              <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            )}
            {status === 'error' && (
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            )}
            {status === 'idle' && (
              <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0-1.657 1.343-3 3-3s3 1.343 3 3-1.343 3-3 3-3-1.343-3-3z" />
              </svg>
            )}
          </div>
          <h1 className="mt-6 text-2xl font-bold text-gray-900 dark:text-gray-100">Acceso por Enlace</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">{message}</p>
        </div>

        <div className="mt-6 space-y-4 rounded-lg border p-4 bg-white dark:bg-gray-800 dark:border-gray-700">
          <h2 className="text-sm font-semibold text-gray-900 dark:text-gray-100">Detalles del enlace</h2>
          <div className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
            <p><span className="font-medium">Token:</span> {token ? token.slice(0, 12) + '…' : 'No proporcionado'}</p>
            <p><span className="font-medium">Expira:</span> {expDate ? expDate.toLocaleString() : 'No especificado'}</p>
            {expDate && (
              <p className={isExpired ? 'text-red-600' : 'text-green-600'}>
                {isExpired ? 'Enlace expirado' : 'Enlace vigente'}
              </p>
            )}
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Nota: Este enlace puede tener una fecha de expiración. Si expiró, solicita uno nuevo para tu correo.
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button
            onClick={handleValidate}
            disabled={!token || status === 'verifying'}
            className="flex-1 px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {status === 'verifying' ? 'Verificando…' : 'Validar enlace'}
          </button>
          {status === 'success' ? (
            <button
              onClick={handleGoDashboard}
              className="flex-1 px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
            >
              Abrir Dashboard
            </button>
          ) : (
            <button
              onClick={handleGoLogin}
              className="flex-1 px-4 py-2 rounded-md bg-gray-200 text-gray-900 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
            >
              Ir al Login
            </button>
          )}
        </div>

        <div className="mt-3 text-center">
          <button
            onClick={handleRequestNew}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Solicitar nuevo enlace
          </button>
        </div>
      </div>
    </div>
  )
}



