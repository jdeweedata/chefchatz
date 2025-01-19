import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { generateRecipe } from '@/lib/ai/openai'
import { getCookingGuidance } from '@/lib/ai/anthropic'

export async function POST(request: Request) {
  try {
    // Create server-side Supabase client with proper cookie handling
    const cookieStore = cookies()
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore })
    
    // Verify authentication
    const { data: { session }, error: authError } = await supabase.auth.getSession()
    if (authError) {
      console.error('Auth error:', authError)
      return NextResponse.json({ 
        error: `Authentication error: ${authError.message}` 
      }, { status: 401 })
    }

    if (!session) {
      return NextResponse.json({ 
        error: 'User not authenticated' 
      }, { status: 401 })
    }

    const { message, type = 'recipe' } = await request.json()

    if (!message) {
      return NextResponse.json({ 
        error: 'Message is required' 
      }, { status: 400 })
    }

    let response
    try {
      if (type === 'recipe') {
        response = await generateRecipe(message)
        console.log('Generated recipe response:', response)
      } else if (type === 'guidance') {
        const params = {
          recipe: message.recipe,
          currentStep: message.currentStep,
          question: message.question
        }
        response = await getCookingGuidance(params)
      } else {
        return NextResponse.json({ 
          error: 'Invalid chat type. Must be "recipe" or "guidance"' 
        }, { status: 400 })
      }

      if (typeof response !== 'string') {
        console.error('Invalid response type:', typeof response, response)
        return NextResponse.json({ 
          error: 'Invalid response format from AI' 
        }, { status: 500 })
      }

      return NextResponse.json({ response })
    } catch (aiError) {
      console.error('AI generation error:', aiError)
      return NextResponse.json({ 
        error: aiError instanceof Error ? aiError.message : 'Failed to generate response'
      }, { status: 500 })
    }
  } catch (error) {
    console.error('Server error:', error)
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Internal server error'
    }, { status: 500 })
  }
}
