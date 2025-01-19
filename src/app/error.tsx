'use client'

import { Button } from '@/components/ui/button'
import { AlertCircle } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-[400px] items-center justify-center">
      <div className="text-center">
        <div className="flex justify-center">
          <AlertCircle className="h-12 w-12 text-destructive" />
        </div>
        <h2 className="mt-4 text-2xl font-bold text-foreground">
          Something went wrong!
        </h2>
        <p className="mt-2 text-muted-foreground">
          {error.message || 'An unexpected error occurred'}
        </p>
        <Button
          onClick={() => reset()}
          className="mt-4"
          variant="default"
        >
          Try again
        </Button>
      </div>
    </div>
  )
}
