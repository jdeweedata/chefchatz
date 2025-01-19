'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { OAuthButton } from './oauth-button'
import type { AuthFormState } from '@/types/auth'

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClientComponentClient()
  const [formState, setFormState] = useState<AuthFormState>({
    email: '',
    password: '',
    isLoading: false,
    error: null,
    message: searchParams.get('message')
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formState.email,
        password: formState.password,
      })

      if (error) throw error

      const redirectTo = searchParams.get('redirectTo') || '/dashboard'
      router.push(redirectTo)
      router.refresh()
    } catch (error) {
      setFormState(prev => ({ ...prev, error: 'Invalid login credentials' }))
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <OAuthButton provider="github" label="Continue with GitHub" />
        <OAuthButton provider="google" label="Continue with Google" />
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {formState.message && (
          <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
            {formState.message}
          </div>
        )}
        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium leading-none">
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="name@example.com"
            value={formState.email}
            onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
            className="w-full rounded-md border p-2"
            required
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium leading-none">
              Password
            </label>
            <Link
              href="/reset-password"
              className="text-sm text-blue-600 hover:text-blue-500"
            >
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            value={formState.password}
            onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-md border p-2"
            required
          />
        </div>
        {formState.error && (
          <div className="text-sm text-red-500">
            {formState.error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={formState.isLoading}>
          {formState.isLoading ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}
