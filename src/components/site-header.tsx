'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/components/auth/auth-provider'
import { ModeToggle } from '@/components/mode-toggle'

export function SiteHeader() {
  const pathname = usePathname()
  const { user, signOut } = useAuth()

  const isPublicRoute = pathname === '/' || pathname === '/login' || pathname === '/signup'

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold">ChefChatz</span>
          </Link>
          {user && (
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                href="/chat"
                className={pathname === '/chat' ? 'text-foreground' : 'text-foreground/60'}
              >
                Chat
              </Link>
              <Link
                href="/recipes"
                className={pathname === '/recipes' ? 'text-foreground' : 'text-foreground/60'}
              >
                Recipes
              </Link>
            </nav>
          )}
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => signOut()}
                >
                  Sign Out
                </Button>
              </>
            ) : !isPublicRoute ? (
              <>
                <Link href="/login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button>Get Started</Button>
                </Link>
              </>
            ) : null}
            <ModeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}
