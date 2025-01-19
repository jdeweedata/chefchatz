import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { ChatInterface } from '@/components/chat/chat-interface'

export const metadata: Metadata = {
  title: 'Chat | ChefChatz',
  description: 'Chat with your AI cooking assistant',
}

export default async function ChatPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="container py-6">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-6 text-3xl font-bold">Chat with Chef AI</h1>
        <ChatInterface userId={session.user.id} />
      </div>
    </div>
  )
}
