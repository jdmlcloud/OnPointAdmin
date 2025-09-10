'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  console.log('🏠 HomePage renderizando...')
  const router = useRouter()
  
  useEffect(() => {
    console.log('🏠 Redirigiendo al login...')
    router.push('/auth/login')
  }, [router])
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Redirigiendo al login...</p>
      </div>
    </div>
  )
}
