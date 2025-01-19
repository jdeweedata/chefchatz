import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function HomePage() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center space-y-4 text-center">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Welcome to{' '}
            <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              ChefChatz
            </span>
          </h1>
          <p className="mx-auto max-w-[700px] text-lg text-muted-foreground md:text-xl">
            Your AI-powered cooking companion. Get personalized recipes, step-by-step guidance,
            and expert cooking tips.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link href="/signup">
              <Button size="lg" className="min-w-[200px]">
                Get Started
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg" className="min-w-[200px]">
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
