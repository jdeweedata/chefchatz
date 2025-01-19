import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { SaveRecipeParams } from '@/types/recipe'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })

  // Check authentication
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const recipe: SaveRecipeParams = await request.json()

    // Insert recipe into database
    const { data, error } = await supabase
      .from('recipes')
      .insert({
        user_id: user.id,
        title: recipe.title,
        description: recipe.description,
        ingredients: recipe.ingredients,
        instructions: recipe.instructions,
        servings: recipe.servings,
        prep_time: recipe.prepTime,
        cook_time: recipe.cookTime,
        difficulty: recipe.difficulty,
        cuisine: recipe.cuisine,
        tags: recipe.tags,
        image_url: recipe.imageUrl,
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error saving recipe:', error)
    return NextResponse.json(
      { error: 'Failed to save recipe' },
      { status: 500 }
    )
  }
}
