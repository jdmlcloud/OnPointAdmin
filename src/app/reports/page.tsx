"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function DevelopmentPage() {
  const router = useRouter()

  useEffect(() => {
    router.push("/development")
  }, [router])

  return null
}
