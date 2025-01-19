'use client'

import { cn } from '@/lib/utils'
import { Message } from '@/types/chat'
import { UserCircle } from 'lucide-react'
import { SaveRecipeButton } from '@/components/recipes/save-recipe-button'
import { Recipe } from '@/types/recipe'

interface MessageBubbleProps {
  message: Message
  isLoading?: boolean
}

function parseRecipeFromContent(content: string): Recipe {
  // Extract title from "Recipe: [Recipe Name]"
  const titleMatch = content.match(/Recipe:\s*([^\n]+)/)
  const title = titleMatch ? titleMatch[1].trim() : 'New Recipe'

  // Extract ingredients between "Ingredients:" and "Instructions:"
  const ingredientsMatch = content.match(/Ingredients:([\s\S]*?)(?=Instructions:)/)
  const ingredients = ingredientsMatch
    ? ingredientsMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => line.startsWith('-'))
        .map(line => line.substring(1).trim())
    : []

  // Extract instructions between "Instructions:" and "Tips:" (if present)
  const instructionsMatch = content.match(/Instructions:([\s\S]*?)(?=Tips:|$)/)
  const instructions = instructionsMatch
    ? instructionsMatch[1]
        .split('\n')
        .map(line => line.trim())
        .filter(line => /^\d+\./.test(line))
        .map(line => line.replace(/^\d+\.\s*/, ''))
    : []

  // Extract servings from "Servings: [Number]"
  const servingsMatch = content.match(/Servings:\s*(\d+)/)
  const servings = servingsMatch ? parseInt(servingsMatch[1], 10) : 4

  return {
    id: '', // Will be set by the database
    userId: '', // Will be set by the database
    title,
    description: content,
    ingredients,
    instructions,
    servings,
    prepTime: 30,
    cookTime: 30,
    difficulty: 'medium',
    cuisine: 'International',
    tags: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isFavorite: false
  }
}

export function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const isUser = message.role === 'user'
  const content = message.content || ''

  // Check if the message contains a recipe by looking for common recipe sections
  const hasRecipe = !isUser && 
    typeof content === 'string' &&
    content.includes('Recipe:') && 
    content.includes('Ingredients:') &&
    content.includes('Instructions:')

  return (
    <div
      className={cn(
        'flex w-full items-start gap-2 py-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div className="flex items-start gap-2">
        {isUser ? (
          <div className="rounded-full bg-muted p-1">
            <UserCircle className="h-6 w-6" />
          </div>
        ) : (
          <div className="rounded-full bg-gradient-to-r from-orange-400 to-rose-400 p-1">
            <img 
              src="/logo.svg" 
              alt="ChefChatz AI" 
              className="h-6 w-6 rounded-full bg-white"
            />
          </div>
        )}
      </div>
      <div
        className={cn(
          'relative flex max-w-[80%] flex-col gap-1 rounded-2xl px-4 py-2',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-50" />
            <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-50" style={{ animationDelay: '0.2s' }} />
            <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-50" style={{ animationDelay: '0.4s' }} />
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap">{content}</div>
            {hasRecipe && (
              <SaveRecipeButton 
                recipe={parseRecipeFromContent(content)} 
              />
            )}
          </>
        )}
      </div>
    </div>
  )
}
