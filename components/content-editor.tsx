"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { X, Settings } from "lucide-react"
import { usePortfolioStore } from "@/lib/portfolio-store"
import { HeroEditor } from "@/components/editors/hero-editor"
import { AboutEditor } from "@/components/editors/about-editor"
import { ProjectsEditor } from "@/components/editors/projects-editor"
import { ContactEditor } from "@/components/editors/contact-editor"

const sectionNames = {
  hero: "Hero Section",
  about: "About Section",
  projects: "Projects Section",
  contact: "Contact Section",
}

export function ContentEditor() {
  const { editingSection, setEditingSection } = usePortfolioStore()

  // Close with Escape for keyboard users
  useEffect(() => {
    if (!editingSection) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setEditingSection(null)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [editingSection, setEditingSection])

  if (!editingSection) return null

  const renderEditor = () => {
    switch (editingSection) {
      case "hero":
        return <HeroEditor />
      case "about":
        return <AboutEditor />
      case "projects":
        return <ProjectsEditor />
      case "contact":
        return <ContactEditor />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md border-l bg-background shadow-lg md:w-96">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <div>
                <CardTitle className="text-lg">
                  {sectionNames[editingSection as keyof typeof sectionNames]}
                </CardTitle>
                <p className="text-xs text-muted-foreground">Changes are saved automatically</p>
              </div>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" onClick={() => setEditingSection(null)} aria-label="Close editor">
                  <X className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent side="left">Close editor (Esc)</TooltipContent>
            </Tooltip>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-92px)]">
            <div className="p-6">{renderEditor()}</div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
