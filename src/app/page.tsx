import { redirect } from 'next/navigation'

export default async function HomePage() {
  // Redirigir al selector de dashboard para elegir entre Cognito real y demo
  redirect('/dashboard-selector')
}
