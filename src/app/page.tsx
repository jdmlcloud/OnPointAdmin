import { redirect } from 'next/navigation'

export default async function HomePage() {
  // Redirigir directamente al dashboard con DynamoDB (flujo real)
  redirect('/dashboard-dynamodb')
}
