import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    // Fetch user's recent recipes and preferences
    const { data: recipes } = await supabase
      .from('recipes')
      .select('*')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .limit(5)

    const { data: preferences } = await supabase
      .from('profiles')
      .select('dietary_preferences, cooking_level')
      .eq('id', session.user.id)
      .single()

    return NextResponse.json({
      recentRecipes: recipes,
      preferences,
    })
  } catch (error) {
    console.error('Context fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch chat context' },
      { status: 500 }
    )
  }
}
