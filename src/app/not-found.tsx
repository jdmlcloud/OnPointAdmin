'use client'

import Link from 'next/link'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <h1 className="text-3xl font-bold mb-2">Página no encontrada</h1>
      <p className="text-gray-600 mb-6">Lo sentimos, no pudimos encontrar lo que buscas.</p>
      <Link href="/" className="text-blue-600 underline">Volver al inicio</Link>
    </div>
  )
}


