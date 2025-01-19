'use client'

import dynamic from 'next/dynamic'
import { Skeleton } from '@/components/ui/skeleton'

const ChatInterface = dynamic(
  () => import('./chat-interface').then(mod => mod.ChatInterface),
  {
    loading: () => (
      <div className="flex h-[calc(100vh-4rem)] flex-col gap-8 py-8">
        <Skeleton className="h-[calc(100vh-8rem)]" />
      </div>
    ),
    ssr: false
  }
)

interface ChatWrapperProps {
  userId: string
}

export function ChatWrapper({ userId }: ChatWrapperProps) {
  return <ChatInterface userId={userId} />
} 