# ChefChatz Authentication System

## Prerequisites
- Complete 2-page-routes.md
- Supabase project configured
- Database tables created
- API routes implemented

## Authentication Requirements

### User Management
```typescript
// types/auth.ts
interface UserProfile {
  id: string;
  email: string;
  username?: string;
  dietary_preferences?: {
    restrictions: string[];
    allergies: string[];
    preferences: string[];
  };
  cooking_level?: 'beginner' | 'intermediate' | 'advanced';
  created_at: string;
}
```

### Implementation Details

1. Supabase Auth Setup
```typescript
// lib/supabase/server.ts
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Database } from '@/types/supabase'

export const createClient = () => {
  const cookieStore = cookies()
  return createServerComponentClient<Database>({ cookies: () => cookieStore })
}
```

2. Authentication Flows
```typescript
// app/auth/actions.ts
'use server'

import { createClient } from '@/lib/supabase/server'
import { cookies } from 'next/headers'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
      data: {
        username: email.split('@')[0],
        cooking_level: 'beginner'
      }
    }
  })
  
  return { data, error }
}

export async function signIn(formData: FormData) {
  // Similar implementation for sign in
}
```

3. Protected Routes
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}
```

### Security Implementation

1. Row Level Security
```sql
-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can read own profile"
  ON public.profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);
```

2. OAuth Configuration
```typescript
// OAuth providers setup in Supabase dashboard
const oAuthConfig = {
  providers: ['google', 'github'],
  redirectUrl: `${origin}/auth/callback`,
  scopes: {
    google: ['email', 'profile'],
    github: ['user:email']
  }
}
```

3. Session Management
```typescript
// hooks/useAuth.ts
import { createBrowserClient } from '@supabase/ssr'
import { useEffect, useState } from 'react'

export function useAuth() {
  const [session, setSession] = useState(null)
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  return session
}
```

## Error Handling

### Authentication Errors
```typescript
interface AuthError {
  code: string;
  message: string;
  status: number;
}

const handleAuthError = (error: AuthError) => {
  switch (error.code) {
    case 'auth/invalid-email':
      return 'Please enter a valid email address'
    case 'auth/weak-password':
      return 'Password should be at least 8 characters'
    default:
      return 'An error occurred during authentication'
  }
}
```

## Verification Checklist

### Authentication Flows
- [ ] Sign up with email
- [ ] Email verification
- [ ] Sign in with email
- [ ] OAuth providers
- [ ] Password reset
- [ ] Session management

### Security Measures
- [ ] RLS policies
- [ ] CORS configuration
- [ ] XSS protection
- [ ] CSRF prevention
- [ ] Rate limiting

### User Management
- [ ] Profile creation
- [ ] Profile updates
- [ ] Preference management
- [ ] Session handling
- [ ] Token rotation

## Integration Points
- Frontend authentication state
- API route protection
- Database access control
- User profile management

Complete full implementation before proceeding to user flows.