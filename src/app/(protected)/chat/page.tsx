import { Metadata } from 'next'
import { createClient } from '@/lib/supabase/server'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { ChatWrapper } from '@/components/chat/chat-wrapper'

export const metadata: Metadata = {
  title: 'Chat | ChefChatz',
  description: 'Chat with our AI cooking assistant',
}

export default async function ChatPage() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()

  if (!user || error) {
    throw new Error('Authentication required')
  }

  return (
    <div className="container flex h-[calc(100vh-4rem)] flex-col gap-8 py-8">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold">Chat with ChefChatz</h1>
        <p className="text-muted-foreground">
          Ask questions about recipes, cooking techniques, or get help with your current recipe.
        </p>
      </div>
      <Suspense fallback={
        <div className="flex h-[calc(100vh-8rem)] flex-col gap-8 py-8">
          <Skeleton className="h-full" />
        </div>
      }>
        <ChatWrapper userId={user.id} />
      </Suspense>
    </div>
  )
}
