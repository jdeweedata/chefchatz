import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardShell } from '@/components/dashboard/shell'
import { RecipeList } from '@/components/dashboard/recipe-list'

export const metadata: Metadata = {
  title: 'Recipes | ChefChatz',
  description: 'View and manage your recipes',
}

export default async function RecipesPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch all user's recipes
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="My Recipes"
        text="View and manage all your recipes."
      />
      <div className="mt-8">
        <RecipeList recipes={recipes || []} />
      </div>
    </DashboardShell>
  )
}
