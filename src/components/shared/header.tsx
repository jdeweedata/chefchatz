'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { ThemeToggle } from '@/components/shared/theme-toggle'

export function Header() {
  const pathname = usePathname()
  const supabase = createClientComponentClient()

  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup'

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold">ChefChatz</span>
        </Link>

        <div className="flex items-center gap-4">
          {isPublicRoute ? (
            <div className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/signup">
                <Button>Get Started</Button>
              </Link>
            </div>
          ) : (
            <nav className="flex items-center gap-6">
              <Link href="/dashboard" className="text-sm font-medium hover:text-primary">
                Dashboard
              </Link>
              <Link href="/chat" className="text-sm font-medium hover:text-primary">
                Chat
              </Link>
              <Link href="/recipes" className="text-sm font-medium hover:text-primary">
                Recipes
              </Link>
              <Link href="/settings" className="text-sm font-medium hover:text-primary">
                Settings
              </Link>
              <Button variant="ghost" onClick={handleSignOut}>
                Sign Out
              </Button>
            </nav>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
