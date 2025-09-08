import { redirect } from 'next/navigation'

export default async function HomePage() {
  // Redirigir directamente al dashboard principal
  redirect('/dashboard')
}
