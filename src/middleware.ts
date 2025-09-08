import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
    const isDashboardPage = req.nextUrl.pathname.startsWith('/dashboard')
    const isApiRoute = req.nextUrl.pathname.startsWith('/api')

    // Redirect authenticated users away from auth pages
    if (isAuth && isAuthPage) {
      return NextResponse.redirect(new URL('/dashboard', 'https://sandbox-deploy.d3ts6pwgn7uyyh.amplifyapp.com'))
    }

    // Redirect unauthenticated users to sign in
    if (!isAuth && !isAuthPage && !isApiRoute) {
      return NextResponse.redirect(new URL('/auth/signin', 'https://sandbox-deploy.d3ts6pwgn7uyyh.amplifyapp.com'))
    }

    // Role-based access control
    if (isAuth && token?.role) {
      const userRole = token.role
      const path = req.nextUrl.pathname

      // Admin only routes
      if (path.startsWith('/admin') && userRole !== 'admin') {
        return NextResponse.redirect(new URL('/dashboard', 'https://sandbox-deploy.d3ts6pwgn7uyyh.amplifyapp.com'))
      }

      // Executivo and Admin only routes
      if ((path.startsWith('/providers') || path.startsWith('/products')) && 
          !['admin', 'ejecutivo'].includes(userRole)) {
        return NextResponse.redirect(new URL('/dashboard', 'https://sandbox-deploy.d3ts6pwgn7uyyh.amplifyapp.com'))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const isApiRoute = req.nextUrl.pathname.startsWith('/api')
        const isAuthPage = req.nextUrl.pathname.startsWith('/auth')
        
        // Allow API routes and auth pages
        if (isApiRoute || isAuthPage) {
          return true
        }

        // Require authentication for all other routes
        return !!token
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/providers/:path*',
    '/products/:path*',
    '/whatsapp/:path*',
    '/quotations/:path*',
    '/proposals/:path*',
    '/settings/:path*',
    '/admin/:path*',
  ]
}
