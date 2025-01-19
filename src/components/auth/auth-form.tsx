'use client'

import { Button } from '@/components/ui/button'
import { GithubIcon } from 'lucide-react'
import { supabase } from '@/lib/supabase/client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { useToast } from '@/components/ui/use-toast'

export function AuthForm() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const redirectTo = searchParams.get('redirectTo') || '/'

  const handleOAuthSignIn = async (provider: 'google' | 'github') => {
    try {
      setIsLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirectTo=${redirectTo}`,
          queryParams: provider === 'google' ? {
            access_type: 'offline',
            prompt: 'consent',
          } : undefined,
        },
      })

      if (error) {
        throw error
      }
    } catch (error) {
      console.error(`Error signing in with ${provider}:`, error)
      toast({
        title: 'Authentication error',
        description: error instanceof Error ? error.message : 'Failed to sign in',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn('github')}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <GithubIcon className="h-5 w-5" />
        Continue with GitHub
      </Button>
      <Button
        variant="outline"
        onClick={() => handleOAuthSignIn('google')}
        disabled={isLoading}
        className="flex items-center gap-2"
      >
        <Image
          src="/google.svg"
          alt="Google"
          width={20}
          height={20}
          className="h-5 w-5"
        />
        Continue with Google
      </Button>
    </div>
  )
}
