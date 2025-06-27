"use client"
import { PortfolioBuilder } from "@/components/portfolio-builder"
import { GuidedTour } from "@/components/guided-tour"
import { ThemeProvider } from "@/components/theme-provider"

export default function Home() {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <PortfolioBuilder />
      <GuidedTour />
    </ThemeProvider>
  )
}
