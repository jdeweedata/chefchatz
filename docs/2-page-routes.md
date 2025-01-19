# ChefChatz Route Structure

## Prerequisites
- Complete 1-initial-prompt.md
- Verify all dependencies installed
- Environment variables configured
- Supabase connection established

## Route Implementation

### Frontend Routes (App Router)
```typescript
// App directory structure
app/
├── (public)/
│   ├── page.tsx                // Landing
│   ├── login/                  // Login flow
│   ├── signup/                 // Registration
│   ├── pricing/                // Plans
│   └── about/                  // About platform
├── (protected)/
│   ├── dashboard/              // User dashboard
│   ├── chat/                   // AI conversation
│   ├── recipes/                // Recipe management
│   └── settings/               // User settings
└── (admin)/
    └── admin/                  // Admin panel
```

### API Routes
```typescript
// Route definitions
app/api/
├── auth/
│   ├── route.ts               // Auth endpoints
│   └── callback/route.ts      // OAuth callbacks
├── chat/
│   ├── route.ts               // Chat handling
│   └── context/route.ts       // Chat context
├── recipes/
│   ├── route.ts               // Recipe CRUD
│   └── [id]/route.ts          // Single recipe
└── user/
    └── route.ts               // User management
```

## Implementation Requirements

### Middleware Configuration
```typescript
// middleware.ts
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'

export async function middleware(req) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })
  const { data: { session } } = await supabase.auth.getSession()

  // Protected routes
  if (!session && req.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}

export const config = {
  matcher: ['/dashboard/:path*', '/chat/:path*', '/recipes/:path*', '/admin/:path*']
}
```

### Route Handlers
```typescript
// app/api/chat/route.ts
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  // Handle chat logic
}
```

### Error Handling
```typescript
// app/error.tsx
'use client'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-primary-purple">
          Something went wrong!
        </h2>
        <button
          onClick={() => reset()}
          className="mt-4 rounded bg-primary-sage px-4 py-2 text-white"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
```

## Page Components

### Layout Structure
```typescript
// app/layout.tsx
import { Providers } from './providers'
import { Header } from '@/components/shared/Header'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
```

### Protected Page Example
```typescript
// app/(protected)/dashboard/page.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-4xl font-bold text-primary-purple">
        Welcome back, {session.user.email}
      </h1>
      {/* Dashboard content */}
    </div>
  )
}
```

## Verification Steps

### Route Testing
- [ ] All public routes accessible
- [ ] Protected routes require auth
- [ ] Admin routes properly secured
- [ ] API endpoints responding
- [ ] Error handling working

### Navigation Flow
- [ ] Header navigation working
- [ ] Auth redirects functioning
- [ ] Dynamic routes loading
- [ ] Loading states showing
- [ ] Error boundaries catching

### Performance
- [ ] Route pre-fetching
- [ ] Dynamic imports working
- [ ] Image optimization
- [ ] API response times
- [ ] Cache configuration

## Completion Requirements
- All routes implemented and tested
- Navigation flow verified
- Error handling confirmed
- Performance optimized
- Documentation updated

Log completion status before proceeding to authentication implementation.