'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@/components/ui/button'
import { GithubIcon } from 'lucide-react'
import Image from 'next/image'

interface OAuthButtonProps {
  provider: 'github' | 'google'
  label: string
}

export function OAuthButton({ provider, label }: OAuthButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const supabase = createClientComponentClient()

  const handleSignIn = async () => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${location.origin}/api/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error) {
      console.error('OAuth error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Button
      variant="outline"
      type="button"
      disabled={isLoading}
      className="w-full"
      onClick={handleSignIn}
    >
      {isLoading ? (
        <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-current" />
      ) : provider === 'github' ? (
        <GithubIcon className="mr-2 h-4 w-4" />
      ) : (
        <Image
          src="/google.svg"
          alt="Google"
          width={16}
          height={16}
          className="mr-2"
        />
      )}
      {isLoading ? 'Loading...' : label}
    </Button>
  )
}
