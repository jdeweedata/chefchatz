'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, ChefHat, Users } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { SaveRecipeButton } from './save-recipe-button'
import { Button } from '@/components/ui/button'
import { Recipe } from '@/types/recipe'
import { cn } from '@/lib/utils'

interface RecipeCardProps {
  recipe: Recipe
  onSave?: (recipe: Recipe) => void
  onStart?: (recipe: Recipe) => void
  priority?: boolean
}

function BlurImage({ src, alt }: { src: string, alt: string }) {
  const [isLoading, setLoading] = useState(true)

  return (
    <div className="aspect-square overflow-hidden rounded-lg bg-muted">
      <Image
        src={src}
        alt={alt}
        width={300}
        height={300}
        className={cn(
          'h-full w-full object-cover duration-700 ease-in-out',
          isLoading
            ? 'scale-110 blur-lg grayscale'
            : 'scale-100 blur-0 grayscale-0'
        )}
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  )
}

export function RecipeCard({ recipe, onSave, onStart, priority = false }: RecipeCardProps) {
  return (
    <Card className="overflow-hidden">
      <Link href={`/recipes/${recipe.id}`}>
        <div className="relative">
          {recipe.image_url ? (
            <BlurImage
              src={recipe.image_url}
              alt={recipe.title}
            />
          ) : (
            <div className="aspect-square flex items-center justify-center bg-muted">
              <ChefHat className="h-12 w-12 text-muted-foreground" />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-0 p-4">
            <h3 className="text-lg font-semibold text-white">{recipe.title}</h3>
            <div className="mt-2 flex items-center gap-4 text-sm text-white/80">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{recipe.prep_time + recipe.cook_time}m</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{recipe.servings} servings</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
      <CardFooter className="grid grid-cols-2 gap-2 p-4">
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onStart?.(recipe)}
        >
          Start Cooking
        </Button>
        <SaveRecipeButton recipe={recipe} onSave={onSave} />
      </CardFooter>
    </Card>
  )
}
