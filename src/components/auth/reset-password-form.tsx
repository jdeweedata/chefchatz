'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import type { PasswordResetRequest } from '@/types/auth'

export function ResetPasswordForm() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setMessage(null)
    setError(null)

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${location.origin}/reset-password/confirm`,
      })

      if (error) throw error

      setMessage('Check your email for the password reset link')
    } catch (error) {
      setError('Failed to send reset password email')
      console.error('Reset password error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium leading-none">
          Email
        </label>
        <input
          id="email"
          type="email"
          placeholder="name@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full rounded-md border p-2"
          required
        />
      </div>
      {message && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-800">
          {message}
        </div>
      )}
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Sending...' : 'Send Reset Link'}
      </Button>
    </form>
  )
}
