'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from '@/types/chat'
import { MessageBubble } from './message-bubble'
import { ChatInput } from './chat-input'
import { cn } from '@/lib/utils'
import { SendHorizontal } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface ChatInterfaceProps {
  userId: string
}

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role, content }])
  }

  const handleError = (error: unknown) => {
    const errorMessage = error instanceof Error ? error.message : 'An error occurred'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
    })
  }

  const sendMessageToAPI = async (message: string): Promise<string> => {
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        message,
        type: 'recipe'
      }),
    })

    const data = await response.json()
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to send message')
    }

    if (typeof data.response !== 'string') {
      throw new Error('Invalid response format from server')
    }

    return data.response
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    try {
      setIsLoading(true)
      const userMessage = input.trim()
      addMessage('user', userMessage)
      setInput('')

      const response = await sendMessageToAPI(userMessage)
      addMessage('assistant', response)
    } catch (err) {
      handleError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-background shadow-sm" data-testid="chat-interface">
      <div className="flex items-center justify-between border-b px-4 py-2">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gradient-to-r from-orange-400 to-rose-400" />
          <div>
            <h2 className="text-lg font-semibold">ChefChatz Assistant</h2>
            <p className="text-sm text-muted-foreground">Your personal cooking guide</p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <div className="mx-auto max-w-3xl">
          {messages.map((message, index) => (
            <MessageBubble key={index} message={message} isLoading={false} />
          ))}
          {isLoading && (
            <MessageBubble 
              message={{ role: 'assistant', content: '' }} 
              isLoading={true}
            />
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl">
          <form 
            className="flex items-end gap-2 p-4"
            onSubmit={handleSubmit}
            data-testid="chat-form"
          >
            <div className="relative flex-1">
              <textarea
                className="flex border-input text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 min-h-[52px] w-full resize-none rounded-xl border bg-background px-4 py-3 pr-12 focus-visible:ring-1 focus-visible:ring-offset-0"
                placeholder="Ask about recipes or cooking techniques..."
                rows={1}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isLoading}
              />
              <button
                className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 px-4 py-2 absolute bottom-1.5 right-1.5 h-8 w-8"
                type="submit"
                disabled={isLoading || !input.trim()}
                aria-label="Send message"
              >
                <SendHorizontal className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
