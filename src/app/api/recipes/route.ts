import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type Difficulty = 'easy' | 'medium' | 'hard'

interface Recipe {
  title: string
  description: string
  ingredients: string[]
  instructions: string[]
  servings: number
  prep_time: number
  cook_time: number
  difficulty: Difficulty
  cuisine: string
  tags: string[]
  is_favorite: boolean
}

function parseRecipe(recipeText: string): Recipe {
  if (typeof recipeText !== 'string') {
    throw new Error('Recipe text must be a string')
  }

  const lines = recipeText.split('\n')
  const recipe: any = {}

  let currentSection = ''
  let ingredients: string[] = []
  let instructions: string[] = []

  for (const line of lines) {
    const trimmedLine = line.trim()
    if (!trimmedLine) continue

    if (trimmedLine.startsWith('Recipe:')) {
      recipe.title = trimmedLine.replace('Recipe:', '').trim()
    } else if (trimmedLine.startsWith('Servings:')) {
      recipe.servings = parseInt(trimmedLine.replace('Servings:', '').trim()) || 1
    } else if (trimmedLine === 'Ingredients:') {
      currentSection = 'ingredients'
    } else if (trimmedLine === 'Instructions:') {
      currentSection = 'instructions'
    } else if (trimmedLine === 'Tips:') {
      currentSection = 'tips'
    } else if (trimmedLine.startsWith('-') && currentSection === 'ingredients') {
      ingredients.push(trimmedLine.replace('-', '').trim())
    } else if (/^\d+\./.test(trimmedLine) && currentSection === 'instructions') {
      instructions.push(trimmedLine.replace(/^\d+\.\s*/, '').trim())
    }
  }

  // Validate required fields
  if (!recipe.title) {
    throw new Error('Recipe must have a title')
  }

  if (ingredients.length === 0) {
    throw new Error('Recipe must have ingredients')
  }

  if (instructions.length === 0) {
    throw new Error('Recipe must have instructions')
  }

  // Estimate prep and cook time based on number of steps
  const estimatedPrepTime = Math.max(10, Math.min(60, ingredients.length * 5))
  const estimatedCookTime = Math.max(15, Math.min(120, instructions.length * 10))

  // Determine difficulty based on number of ingredients and steps
  const totalSteps = ingredients.length + instructions.length
  let difficulty: Difficulty = 'medium'
  if (totalSteps < 8) difficulty = 'easy'
  if (totalSteps > 15) difficulty = 'hard'

  const parsedRecipe: Recipe = {
    title: recipe.title,
    description: recipeText,
    ingredients: ingredients,
    instructions: instructions,
    servings: recipe.servings || 2,
    prep_time: estimatedPrepTime,
    cook_time: estimatedCookTime,
    difficulty: difficulty,
    cuisine: 'general',
    tags: [],
    is_favorite: false
  }

  return parsedRecipe
}

export async function POST(request: Request) {
  try {
    // Create server-side Supabase client
    const supabase = createClient()

    // Get session data
    const supabaseClient = await supabase
    const { data: { session }, error: sessionError } = await supabaseClient.auth.getSession()
    if (sessionError) {
      console.error('Session error:', sessionError)
      return NextResponse.json({ 
        error: 'Unauthorized',
        status: 401
      })
    }

    if (!session) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        status: 401
      })
    }

    // Parse request body
    const body = await request.json()
    if (!body.recipe) {
      return NextResponse.json({ 
        error: 'Recipe text is required' 
      }, { status: 400 })
    }

    try {
      // Parse and validate recipe
      const parsedRecipe = parseRecipe(body.recipe)
      console.log('Attempting to save recipe:', {
        userId: session.user.id,
        title: parsedRecipe.title,
        ingredients: parsedRecipe.ingredients.length,
        instructions: parsedRecipe.instructions.length
      })

      // Insert recipe into database
      const { data, error } = await supabaseClient
        .from('recipes')
        .insert({
          ...parsedRecipe,
          user_id: session.user.id
        })
        .select()
        .single()

      if (error) throw error

      return NextResponse.json(data)
    } catch (parseError) {
      console.error('Recipe parsing error:', parseError)
      return NextResponse.json({ 
        error: parseError instanceof Error ? parseError.message : 'Failed to parse recipe'
      }, { status: 400 })
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
