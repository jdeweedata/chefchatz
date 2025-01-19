import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { ChefHat } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

interface Recipe {
  id: string
  title: string
  created_at: string
  ingredients: any[]
  instructions: any[]
}

interface RecipeListProps {
  recipes: Recipe[]
}

export function RecipeList({ recipes }: RecipeListProps) {
  if (recipes.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-md border border-dashed p-8 text-center animate-in fade-in-50">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
            <ChefHat className="h-10 w-10" />
          </div>
          <h2 className="mt-6 text-xl font-semibold">No recipes created</h2>
          <p className="mt-2 text-center text-sm font-normal leading-6 text-muted-foreground">
            You haven&apos;t created any recipes yet. Start a chat to create your first recipe.
          </p>
          <Link href="/chat" className="mt-6">
            <Button>Create a Recipe</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {recipes.map((recipe) => (
        <Link key={recipe.id} href={`/recipes/${recipe.id}`}>
          <Card className="h-full overflow-hidden transition-colors hover:bg-muted/50">
            <div className="p-6">
              <h3 className="font-semibold">{recipe.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Created {formatDistanceToNow(new Date(recipe.created_at), { addSuffix: true })}
              </p>
              <div className="mt-4">
                <p className="text-sm text-muted-foreground">
                  {recipe.ingredients.length} ingredients • {recipe.instructions.length} steps
                </p>
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  )
}
