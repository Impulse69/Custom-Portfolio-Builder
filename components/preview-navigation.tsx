"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Home, User, FolderOpen, Mail, ArrowLeft, Menu, X, Moon, Sun, ChevronUp } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import type { SectionType } from "@/types/portfolio"

interface PreviewNavigationProps {
  sections: SectionType[]
}

const sectionConfig = {
  hero: { name: "Home", icon: Home },
  about: { name: "About", icon: User },
  projects: { name: "Projects", icon: FolderOpen },
  contact: { name: "Contact", icon: Mail },
}

export function PreviewNavigation({ sections }: PreviewNavigationProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      // Show scroll to top button
      setShowScrollTop(window.scrollY > 300)

      // Update active section based on scroll position
      const sectionElements = sections.map((id) => document.getElementById(id)).filter(Boolean)

      for (let i = sectionElements.length - 1; i >= 0; i--) {
        const element = sectionElements[i]
        if (element) {
          const rect = element.getBoundingClientRect()
          if (rect.top <= 100) {
            setActiveSection(element.id)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once to set initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offsetTop = element.offsetTop - 80
      window.scrollTo({
        top: offsetTop,
        behavior: "smooth",
      })
    }
    setIsMenuOpen(false)
  }

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <>
      {/* Desktop Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b"
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Builder
              </Link>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-1">
              {sections.map((sectionId) => {
                const config = sectionConfig[sectionId]
                const Icon = config.icon
                return (
                  <Button
                    key={sectionId}
                    variant={activeSection === sectionId ? "default" : "ghost"}
                    size="sm"
                    onClick={() => scrollToSection(sectionId)}
                    className="gap-2"
                  >
                    <Icon className="h-4 w-4" />
                    {config.name}
                  </Button>
                )
              })}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:flex"
              >
                {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>

              {/* Mobile Menu Button */}
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)} className="md:hidden">
                {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-16 left-0 right-0 z-40 md:hidden"
          >
            <Card className="m-4 p-4 bg-background/95 backdrop-blur-md">
              <div className="space-y-2">
                {sections.map((sectionId) => {
                  const config = sectionConfig[sectionId]
                  const Icon = config.icon
                  return (
                    <Button
                      key={sectionId}
                      variant={activeSection === sectionId ? "default" : "ghost"}
                      className="w-full justify-start gap-2"
                      onClick={() => scrollToSection(sectionId)}
                    >
                      <Icon className="h-4 w-4" />
                      {config.name}
                    </Button>
                  )
                })}
                <div className="pt-2 border-t">
                  <Button
                    variant="ghost"
                    className="w-full justify-start gap-2"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Navigation Dots */}
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:block"
      >
        <Card className="p-2 bg-background/80 backdrop-blur-md">
          <div className="space-y-2">
            {sections.map((sectionId) => {
              const config = sectionConfig[sectionId]
              return (
                <Button
                  key={sectionId}
                  variant={activeSection === sectionId ? "default" : "ghost"}
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => scrollToSection(sectionId)}
                  title={config.name}
                >
                  <config.icon className="h-3 w-3" />
                </Button>
              )
            })}
          </div>
        </Card>
      </motion.div>

      {/* Scroll to Top Button */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Button size="icon" onClick={scrollToTop} className="h-12 w-12 rounded-full shadow-lg">
              <ChevronUp className="h-5 w-5" />
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
