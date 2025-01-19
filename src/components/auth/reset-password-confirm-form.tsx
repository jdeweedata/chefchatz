'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import type { PasswordResetConfirm } from '@/types/auth'

export function ResetPasswordConfirmForm() {
  const router = useRouter()
  const supabase = createClientComponentClient()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      setIsLoading(false)
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({ password })

      if (error) throw error

      // Password updated successfully
      router.push('/login?message=Password updated successfully')
    } catch (error) {
      setError('Failed to update password')
      console.error('Password update error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm font-medium leading-none">
          New Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border p-2"
          required
          minLength={8}
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-md border p-2"
          required
          minLength={8}
        />
      </div>
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? 'Updating...' : 'Update Password'}
      </Button>
    </form>
  )
}
