import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardShell } from '@/components/dashboard/shell'

export const metadata: Metadata = {
  title: 'Admin | ChefChatz',
  description: 'Admin dashboard for ChefChatz',
}

export default async function AdminPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session || session.user.email !== process.env.ADMIN_EMAIL) {
    redirect('/')
  }

  // Fetch admin stats
  const { count: userCount } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const { count: recipeCount } = await supabase
    .from('recipes')
    .select('*', { count: 'exact', head: true })

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Admin Dashboard"
        text="Monitor and manage ChefChatz platform."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium">Total Users</h3>
          <p className="mt-2 text-3xl font-bold">{userCount || 0}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium">Total Recipes</h3>
          <p className="mt-2 text-3xl font-bold">{recipeCount || 0}</p>
        </div>
        <div className="rounded-lg border p-6">
          <h3 className="text-lg font-medium">API Status</h3>
          <p className="mt-2 text-lg font-medium text-green-500">Operational</p>
        </div>
      </div>
    </DashboardShell>
  )
}
