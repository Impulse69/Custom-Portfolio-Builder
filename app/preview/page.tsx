"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { PreviewNavigation } from "@/components/preview-navigation"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"
import { ThemeProvider } from "@/components/theme-provider"
import { usePortfolioStore } from "@/lib/portfolio-store"
import type { SectionType } from "@/types/portfolio"

export default function PreviewPage() {
  const { selectedSections, content } = usePortfolioStore()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(false)
  }, [])

  const renderSection = (sectionId: SectionType) => {
    switch (sectionId) {
      case "hero":
        return <HeroSection key="hero" content={content.hero} />
      case "about":
        return <AboutSection key="about" content={content.about} />
      case "projects":
        return <ProjectsSection key="projects" content={content.projects} />
      case "contact":
        return <ContactSection key="contact" content={content.contact} />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </ThemeProvider>
    )
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      <div className="min-h-screen bg-background">
        <PreviewNavigation sections={selectedSections as SectionType[]} />

        <main className="relative">
          {selectedSections.length === 0 ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="text-center">
                <h1 className="text-2xl font-bold mb-4">No Sections Selected</h1>
                <p className="text-muted-foreground mb-6">
                  Go back to the builder to select sections for your portfolio.
                </p>
                <a
                  href="/"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                >
                  Back to Builder
                </a>
              </div>
            </div>
          ) : (
            selectedSections.map((sectionId, index) => (
              <motion.div
                key={sectionId}
                id={sectionId}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="scroll-mt-20"
              >
                {renderSection(sectionId as SectionType)}
              </motion.div>
            ))
          )}
        </main>
      </div>
    </ThemeProvider>
  )
}
