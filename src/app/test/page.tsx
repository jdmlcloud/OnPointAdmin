export default function TestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-green-600 mb-4">¡CloudFront funciona!</h1>
        <p className="text-gray-600 mb-4">Esta página se carga correctamente desde CloudFront</p>
        <a href="/auth/login" className="text-blue-600 underline">Ir al login</a>
      </div>
    </div>
  )
}
