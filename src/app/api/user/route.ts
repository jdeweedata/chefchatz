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
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single()

    return NextResponse.json(profile)
  } catch (error) {
    console.error('Profile fetch error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch user profile' },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  const supabase = createRouteHandlerClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json(
      { error: 'Unauthorized' },
      { status: 401 }
    )
  }

  try {
    const updates = await request.json()
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', session.user.id)
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Profile update error:', error)
    return NextResponse.json(
      { error: 'Failed to update user profile' },
      { status: 500 }
    )
  }
}
