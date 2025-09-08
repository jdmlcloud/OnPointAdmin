import { NextResponse } from "next/server"

export function middleware(req: any) {
  const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
  const isApiRoute = req.nextUrl.pathname.startsWith('/api')

  // Allow API routes and auth pages
  if (isApiRoute || isAuthPage) {
    return NextResponse.next()
  }

  // For all other routes, allow access (no authentication required)
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ]
}
