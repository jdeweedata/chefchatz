import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ChefHat, MessageCircle, Book, ArrowRight } from 'lucide-react'

export default function Home() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col">
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Your AI-Powered{" "}
              <span className="bg-gradient-to-r from-green-500 to-emerald-700 bg-clip-text text-transparent">
                Cooking Companion
              </span>
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Chat with AI to discover new recipes, get cooking tips, and learn new techniques. Let ChefChatz be your personal sous chef.
            </p>
            <div className="space-x-4">
              <Link href="/chat">
                <Button size="lg">
                  Get Started <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/recipes">
                <Button variant="outline" size="lg">
                  Browse Recipes
                </Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="container space-y-6 py-8 dark:bg-transparent md:py-12 lg:py-24">
          <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <ChefHat className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">AI Chef</h3>
                  <p className="text-sm text-muted-foreground">
                    Get personalized recipe recommendations based on your preferences and dietary needs.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <MessageCircle className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Interactive Chat</h3>
                  <p className="text-sm text-muted-foreground">
                    Ask questions, get tips, and learn new cooking techniques through natural conversation.
                  </p>
                </div>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-lg border bg-background p-2">
              <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                <Book className="h-12 w-12 text-primary" />
                <div className="space-y-2">
                  <h3 className="font-bold">Recipe Library</h3>
                  <p className="text-sm text-muted-foreground">
                    Save your favorite recipes and create your own digital cookbook.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
