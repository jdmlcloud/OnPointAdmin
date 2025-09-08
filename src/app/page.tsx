import { redirect } from 'next/navigation'

export default async function HomePage() {
  // Redirigir al login para el sistema de usuarios
  redirect('/auth/login')
}
