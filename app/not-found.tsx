import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center p-8">
      <div className="text-center">
        <p className="mb-2 text-sm font-semibold text-primary">404</p>
        <h1 className="mb-2 text-2xl font-bold">Page not found</h1>
        <p className="mx-auto mb-6 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist. The builder lives on the home page.
        </p>
        <Button asChild>
          <Link href="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to the builder
          </Link>
        </Button>
      </div>
    </div>
  )
}
