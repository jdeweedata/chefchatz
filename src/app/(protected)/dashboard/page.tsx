import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardShell } from '@/components/dashboard/shell'
import { RecipeList } from '@/components/dashboard/recipe-list'

export const metadata = {
  title: 'Dashboard | ChefChatz',
  description: 'Manage your recipes and cooking sessions',
}

export default async function DashboardPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch user's recipes
  const { data: recipes } = await supabase
    .from('recipes')
    .select('*')
    .eq('user_id', session.user.id)
    .order('created_at', { ascending: false })
    .limit(10)

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Dashboard"
        text="View and manage your recipes and cooking sessions."
      />
      <div className="grid gap-8">
        <RecipeList recipes={recipes || []} />
      </div>
    </DashboardShell>
  )
}
