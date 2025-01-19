import { Metadata } from 'next'
import { Suspense } from 'react'
import { ResetPasswordConfirmForm } from '@/components/auth/reset-password-confirm-form'

export const metadata: Metadata = {
  title: 'Update Password | ChefChatz',
  description: 'Update your ChefChatz account password',
}

export default function ResetPasswordConfirmPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Update Password
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter your new password below
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordConfirmForm />
        </Suspense>
      </div>
    </div>
  )
}
