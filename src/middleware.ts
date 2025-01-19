import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { rateLimitMiddleware } from '@/middleware/rate-limit'

export async function middleware(req: NextRequest) {
  // Check rate limits first
  if (req.nextUrl.pathname.startsWith('/api/auth')) {
    const rateLimitResponse = await rateLimitMiddleware(req, 'auth')
    if (rateLimitResponse) return rateLimitResponse
  } else if (req.nextUrl.pathname.startsWith('/api')) {
    const rateLimitResponse = await rateLimitMiddleware(req, 'api')
    if (rateLimitResponse) return rateLimitResponse
  }

  // Continue with auth checks
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  
  // Use getUser instead of getSession for better security
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  // Protected routes check
  if (!user && isProtectedRoute(req.nextUrl.pathname)) {
    const redirectUrl = new URL('/login', req.url)
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Admin routes check
  if (
    req.nextUrl.pathname.startsWith('/admin') &&
    user?.email !== process.env.ADMIN_EMAIL
  ) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  return res
}

// Protected route patterns
const protectedPatterns = [
  '/dashboard',
  '/chat',
  '/recipes',
  '/settings',
  '/admin',
]

function isProtectedRoute(pathname: string): boolean {
  return protectedPatterns.some(pattern => pathname.startsWith(pattern))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
