'use client'

import { useState, useRef, useEffect } from 'react'
import { Message } from '@/types/chat'
import { MessageBubble } from './message-bubble'
import { ChatInput } from './chat-input'
import { cn } from '@/lib/utils'

interface ChatInterfaceProps {
  userId: string
}

export function ChatInterface({ userId }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    setIsLoading(true)
    setError(null)

    const userMessage = {
      role: 'user' as const,
      content: input,
    }

    try {
      setMessages(prev => [...prev, userMessage])
      setInput('')

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'guidance',
          params: {
            recipe: 'Current recipe context',
            currentStep: 1,
            question: input,
          },
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to get response')
      }

      const data = await response.json()
      const assistantMessage = {
        role: 'assistant' as const,
        content: data.response,
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Chat error:', error)
      setError(error instanceof Error ? error.message : 'Failed to send message')
      // Remove the user message if we couldn't get a response
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex h-full flex-col overflow-hidden rounded-lg border bg-background shadow-sm">
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
            <MessageBubble key={index} message={message} />
          ))}
          {isLoading && (
            <MessageBubble
              message={{ role: 'assistant', content: '' }}
              isLoading={true}
            />
          )}
          {error && (
            <div className="my-2 rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">
              {error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto max-w-3xl">
          <ChatInput
            input={input}
            setInput={setInput}
            onSubmit={handleSubmit}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  )
}
