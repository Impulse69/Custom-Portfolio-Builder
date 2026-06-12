"use client"

import { Button } from "@/components/ui/button"
import { RotateCcw } from "lucide-react"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <h1 className="mb-2 text-2xl font-bold">Something went wrong</h1>
        <p className="mx-auto mb-6 max-w-md text-muted-foreground">
          An unexpected error occurred. Your portfolio content is saved in your browser and is safe — try again, and
          if the problem persists, reload the page.
        </p>
        <Button onClick={reset}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Try again
        </Button>
      </div>
    </div>
  )
}
