'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { SaveRecipeParams } from '@/types/recipe'
import { BookmarkPlus, Check } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface SaveRecipeButtonProps {
  recipe: SaveRecipeParams
  onSaved?: () => void
}

export function SaveRecipeButton({ recipe, onSaved }: SaveRecipeButtonProps) {
  const [isSaving, setIsSaving] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const { toast } = useToast()

  const handleSave = async () => {
    if (isSaving || isSaved) return

    setIsSaving(true)
    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.message || 'Failed to save recipe')
      }

      setIsSaved(true)
      toast({
        title: 'Recipe saved!',
        description: 'You can find it in your recipe collection.',
      })
      onSaved?.()
    } catch (error) {
      console.error('Error saving recipe:', error)
      toast({
        title: 'Error saving recipe',
        description: error instanceof Error ? error.message : 'Please try again',
        variant: 'destructive',
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Button
      variant={isSaved ? 'secondary' : 'default'}
      size="sm"
      onClick={handleSave}
      disabled={isSaving || isSaved}
      className="gap-2"
    >
      {isSaved ? (
        <>
          <Check className="h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <BookmarkPlus className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Recipe'}
        </>
      )}
    </Button>
  )
}
