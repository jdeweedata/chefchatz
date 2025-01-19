import { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'

export const metadata: Metadata = {
  title: 'Reset Password | ChefChatz',
  description: 'Reset your ChefChatz account password',
}

export default function ResetPasswordPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Reset Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordForm />
        </Suspense>
        <p className="px-8 text-center text-sm text-muted-foreground">
          Remember your password?{' '}
          <Link href="/login" className="hover:text-brand underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
