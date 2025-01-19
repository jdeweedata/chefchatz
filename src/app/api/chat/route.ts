import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { generateRecipe } from '@/lib/ai/openai'
import { getCookingGuidance } from '@/lib/ai/anthropic'

export async function POST(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const body = await request.json()
    const { type, params } = body

    let response
    if (type === 'recipe') {
      response = await generateRecipe(params)
    } else if (type === 'guidance') {
      response = await getCookingGuidance(params)
    } else {
      throw new Error('Invalid chat type')
    }

    return NextResponse.json({ response })
  } catch (error) {
    console.error('Chat error:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
