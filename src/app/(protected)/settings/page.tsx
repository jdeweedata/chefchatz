import { Metadata } from 'next'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardHeader } from '@/components/dashboard/header'
import { DashboardShell } from '@/components/dashboard/shell'
import { SettingsForm } from '@/components/settings/settings-form'

export const metadata: Metadata = {
  title: 'Settings | ChefChatz',
  description: 'Manage your account settings',
}

export default async function SettingsPage() {
  const supabase = createServerComponentClient({ cookies })
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    redirect('/login')
  }

  // Fetch user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single()

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Settings"
        text="Manage your account settings and preferences."
      />
      <div className="grid gap-10">
        <SettingsForm
          user={{
            id: session.user.id,
            email: session.user.email!,
            ...profile,
          }}
        />
      </div>
    </DashboardShell>
  )
}
