"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function WhatsAppPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/development")
  }, [router])

  return null
}
