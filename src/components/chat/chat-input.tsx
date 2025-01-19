import { SendHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useRef, useEffect } from 'react'

interface ChatInputProps {
  input: string
  setInput: (value: string) => void
  onSubmit: (e: React.FormEvent) => void
  isLoading: boolean
}

export function ChatInput({ input, setInput, onSubmit, isLoading }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`
    }
  }, [input])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!isLoading && input.trim()) {
        onSubmit(e)
      }
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex items-end gap-2 p-4">
      <div className="relative flex-1">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask about recipes or cooking techniques..."
          className="min-h-[52px] w-full resize-none rounded-xl border bg-background px-4 py-3 pr-12 focus-visible:ring-1 focus-visible:ring-offset-0"
          disabled={isLoading}
          rows={1}
        />
        <Button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="absolute bottom-1.5 right-1.5 h-8 w-8"
        >
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </form>
  )
}
