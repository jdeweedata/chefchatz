import { createClient } from '@/lib/supabase/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  try {
    const { supabase, response } = createClient(request)

    // Get authenticated user
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    // Handle auth routes
    if (request.nextUrl.pathname.startsWith('/login') || request.nextUrl.pathname.startsWith('/signup')) {
      if (user) {
        return NextResponse.redirect(new URL('/chat', request.url))
      }
      return response
    }

    // Protected routes
    if (request.nextUrl.pathname.startsWith('/chat') || request.nextUrl.pathname.startsWith('/recipes')) {
      if (!user || error) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
      return response
    }

    return response
  } catch (error) {
    console.error('Middleware error:', error)
    return NextResponse.redirect(new URL('/login', request.url))
  }
}

export const config = {
  matcher: ['/chat/:path*', '/recipes/:path*', '/login', '/signup'],
}
