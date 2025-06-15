"use client"
import { PortfolioBuilder } from "@/components/portfolio-builder"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <PortfolioBuilder />
    </ThemeProvider>
  )
}
