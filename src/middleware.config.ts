export const authConfig = {
  providers: {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` || 'http://localhost:3000/auth/callback',
    },
    github: {
      clientId: process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      redirectUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback` || 'http://localhost:3000/auth/callback',
    },
  },
}

export const protectedRoutes = [
  '/dashboard',
  '/chat',
  '/recipes',
  '/settings',
  '/admin',
]

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some(route => pathname.startsWith(route))
}
