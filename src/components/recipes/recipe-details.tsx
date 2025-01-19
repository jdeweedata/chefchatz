'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Clock, ChefHat, Users, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SaveRecipeButton } from './save-recipe-button'
import { RecipeFeedback } from './recipe-feedback'
import { useRecipeFeedback } from '@/hooks/use-recipe-feedback'
import { cn } from '@/lib/utils'
import type { Recipe } from '@/types/recipe'

interface RecipeDetailsProps {
  recipe: Recipe
  onStartCookingAction: () => void
}

export function RecipeDetails({ recipe, onStartCookingAction }: RecipeDetailsProps) {
  const [showFeedback, setShowFeedback] = useState(false)
  const { mutate: submitFeedback, isPending } = useRecipeFeedback(recipe)

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold">{recipe.title}</h1>
          <p className="mt-2 text-muted-foreground">{recipe.description}</p>
        </div>
        <SaveRecipeButton recipe={recipe} />
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <span>{recipe.prepTime + recipe.cookTime}m</span>
        </div>
        <div className="flex items-center gap-2">
          <ChefHat className="h-5 w-5" />
          <span className="capitalize">{recipe.difficulty}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          <span>{recipe.servings} servings</span>
        </div>
      </div>

      {recipe.imageUrl && (
        <div className="relative aspect-video overflow-hidden rounded-lg">
          <Image
            src={recipe.imageUrl}
            alt={recipe.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div className="space-y-6">
        <section>
          <h2 className="text-xl font-semibold">Ingredients</h2>
          <ul className="mt-4 space-y-2">
            {recipe.ingredients.map((ingredient, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary" />
                <span>{ingredient}</span>
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold">Instructions</h2>
          <div className="mt-4 space-y-4">
            {recipe.instructions.map((instruction, index) => (
              <div
                key={index}
                className="rounded-lg border p-4"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">
                    {index + 1}
                  </div>
                  <p>{instruction}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="flex gap-4">
          <Button onClick={onStartCookingAction} size="lg">
            Start Cooking
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="lg"
            onClick={() => setShowFeedback(!showFeedback)}
            disabled={isPending}
          >
            {showFeedback ? 'Hide Feedback' : 'Leave Feedback'}
          </Button>
        </div>

        {showFeedback && (
          <section className="rounded-lg border p-6">
            <h2 className="mb-6 text-xl font-semibold">Recipe Feedback</h2>
            <RecipeFeedback
              recipe={recipe}
              onSubmit={submitFeedback}
            />
          </section>
        )}
      </div>
    </div>
  )
}
