import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const id = request.nextUrl.pathname.split('/').pop()
    const { data: recipe, error } = await supabase
      .from('recipes')
      .select('*')
      .eq('id', id)
      .single()

    if (error) throw error

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    // Check if user has access to this recipe
    if (recipe.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    return NextResponse.json(recipe)
  } catch (error) {
    console.error('Recipe fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch recipe' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const id = request.nextUrl.pathname.split('/').pop()
    const updates = await request.json()

    // First check if user owns this recipe
    const { data: recipe } = await supabase
      .from('recipes')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    if (recipe.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { data, error } = await supabase
      .from('recipes')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Recipe update error:', error)
    return NextResponse.json(
      { error: 'Failed to update recipe' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const id = request.nextUrl.pathname.split('/').pop()

    // First check if user owns this recipe
    const { data: recipe } = await supabase
      .from('recipes')
      .select('user_id')
      .eq('id', id)
      .single()

    if (!recipe) {
      return NextResponse.json(
        { error: 'Recipe not found' },
        { status: 404 }
      )
    }

    if (recipe.user_id !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      )
    }

    const { error } = await supabase
      .from('recipes')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Recipe delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete recipe' },
      { status: 500 }
    )
  }
}
