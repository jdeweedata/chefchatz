'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { OAuthButton } from './oauth-button'
import type { AuthFormState } from '@/types/auth'

export function SignupForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [formState, setFormState] = useState<AuthFormState>({
    email: '',
    password: '',
    isLoading: false,
    error: null,
    message: null
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormState(prev => ({ ...prev, isLoading: true, error: null }))

    try {
      const { error } = await supabase.auth.signUp({
        email: formState.email,
        password: formState.password,
        options: {
          emailRedirectTo: `${location.origin}/api/auth/callback`,
          data: {
            username: formState.email.split('@')[0],
            cooking_level: 'beginner'
          }
        },
      })

      if (error) throw error

      router.push('/login?message=Check your email to confirm your account')
    } catch (error) {
      setFormState(prev => ({ ...prev, error: 'Error creating account' }))
      console.error('Signup error:', error)
    } finally {
      setFormState(prev => ({ ...prev, isLoading: false }))
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <OAuthButton provider="github" label="Sign up with GitHub" />
        <OAuthButton provider="google" label="Sign up with Google" />
      </div>
      
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or sign up with email
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
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
          <label htmlFor="password" className="text-sm font-medium leading-none">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formState.password}
            onChange={(e) => setFormState(prev => ({ ...prev, password: e.target.value }))}
            className="w-full rounded-md border p-2"
            required
            minLength={8}
          />
          <p className="text-xs text-muted-foreground">
            Password must be at least 8 characters long
          </p>
        </div>
        {formState.error && (
          <div className="text-sm text-red-500">
            {formState.error}
          </div>
        )}
        <Button type="submit" className="w-full" disabled={formState.isLoading}>
          {formState.isLoading ? 'Creating account...' : 'Create account'}
        </Button>
      </form>
    </div>
  )
}
