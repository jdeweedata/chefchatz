import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')
    const redirectTo = requestUrl.searchParams.get('redirectTo') || '/'

    if (!code) {
      return NextResponse.redirect(new URL('/login', requestUrl.origin))
    }

    const supabase = await createClient()

    // Exchange the code for a session
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, requestUrl.origin)
      )
    }

    // Verify the session was created
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      console.error('Session verification error:', userError)
      return NextResponse.redirect(
        new URL(`/login?error=Session verification failed`, requestUrl.origin)
      )
    }

    // URL to redirect to after sign in process completes
    return NextResponse.redirect(new URL(redirectTo, requestUrl.origin))
  } catch (error) {
    console.error('Auth callback error:', error)
    return NextResponse.redirect(
      new URL('/login?error=Authentication failed', request.url)
    )
  }
}
