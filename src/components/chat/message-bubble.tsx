'use client'

import { cn } from '@/lib/utils'
import { Message } from '@/types/chat'
import { UserCircle } from 'lucide-react'
import Image from 'next/image'
import { SaveRecipeButton } from '@/components/recipes/save-recipe-button'

interface MessageBubbleProps {
  message: Message
  isLoading?: boolean
}

export function MessageBubble({ message, isLoading }: MessageBubbleProps) {
  const isUser = message.role === 'user'

  // Check if the message contains a recipe by looking for common recipe sections
  const hasRecipe = !isUser && 
    message.content.includes('Ingredients:') && 
    message.content.includes('Instructions:') &&
    message.content.includes('Recipe:')

  // Parse recipe from message content if present
  const parseRecipe = (content: string) => {
    try {
      // Extract title (everything after "Recipe:" until the next newline)
      const titleMatch = content.match(/Recipe:([^\n]+)/i)
      const title = titleMatch ? titleMatch[1].trim() : 'Untitled Recipe'

      // Extract ingredients (everything between "Ingredients:" and "Instructions:" or "Dressing:")
      const ingredientsMatch = content.match(/Ingredients:([\s\S]*?)(?=(Instructions:|Dressing:))/i)
      const ingredients = ingredientsMatch 
        ? ingredientsMatch[1]
            .split('\n')
            .map(i => i.replace(/^-\s*/, '').trim())
            .filter(Boolean)
        : []

      // Extract dressing ingredients if present
      const dressingMatch = content.match(/Dressing:([\s\S]*?)(?=Instructions:)/i)
      const dressingIngredients = dressingMatch
        ? dressingMatch[1]
            .split('\n')
            .map(i => i.replace(/^-\s*/, '').trim())
            .filter(Boolean)
        : []

      // Extract instructions (everything after "Instructions:" until the end or a blank line followed by non-instruction text)
      const instructionsMatch = content.match(/Instructions:([\s\S]*?)(?=(\n\n[^\d]|$))/i)
      const instructions = instructionsMatch
        ? instructionsMatch[1]
            .split('\n')
            .map(i => i.replace(/^\d+\.\s*/, '').trim())
            .filter(Boolean)
        : []

      // Combine regular ingredients with dressing ingredients if present
      const allIngredients = dressingIngredients.length > 0
        ? [...ingredients, 'Dressing:', ...dressingIngredients]
        : ingredients

      return {
        title,
        description: `Recipe shared via ChefChatz`,
        ingredients: allIngredients,
        instructions,
        servings: 4,
        prepTime: 30,
        cookTime: 30,
        difficulty: 'medium' as const,
        cuisine: 'International',
        tags: [],
      }
    } catch (error) {
      console.error('Error parsing recipe:', error)
      return null
    }
  }

  const recipe = hasRecipe ? parseRecipe(message.content) : null

  return (
    <div
      className={cn(
        'flex w-full gap-2 py-2',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      {!isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-orange-400 to-rose-400">
          <Image
            src="/logo.png"
            alt="ChefChatz"
            width={24}
            height={24}
            className="rounded-full"
          />
        </div>
      )}
      <div
        className={cn(
          'relative flex max-w-[80%] flex-col gap-1 rounded-2xl px-4 py-2',
          isUser
            ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
            : 'bg-muted/50'
        )}
      >
        {isLoading ? (
          <div className="flex items-center gap-1 py-1">
            <div className="h-2 w-2 animate-bounce rounded-full bg-current opacity-50" />
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-current opacity-50"
              style={{ animationDelay: '0.2s' }}
            />
            <div
              className="h-2 w-2 animate-bounce rounded-full bg-current opacity-50"
              style={{ animationDelay: '0.4s' }}
            />
          </div>
        ) : (
          <>
            <div className="whitespace-pre-wrap break-words">{message.content}</div>
            {recipe && (
              <div className="mt-4 flex items-center justify-end border-t pt-2">
                <SaveRecipeButton recipe={recipe} />
              </div>
            )}
          </>
        )}
      </div>
      {isUser && (
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-full bg-gradient-to-r from-blue-600 to-blue-700">
          <UserCircle className="h-6 w-6 text-white" />
        </div>
      )}
    </div>
  )
}
