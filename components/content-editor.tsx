"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, Settings } from "lucide-react"
import { usePortfolioStore } from "@/lib/portfolio-store"
import { HeroEditor } from "@/components/editors/hero-editor"
import { AboutEditor } from "@/components/editors/about-editor"
// import { ProjectsEditor } from "@/components/editors/projects-editor"
import { ContactEditor } from "@/components/editors/contact-editor"
// import { ContactEditor } from "@/components/editors/contact-editor"

const sectionNames = {
  hero: "Hero Section",
  about: "About Section",
  projects: "Projects Section",
  contact: "Contact Section",
}

export function ContentEditor() {
  const { editingSection, setEditingSection } = usePortfolioStore()

  if (!editingSection) return null

  const renderEditor = () => {
    switch (editingSection) {
      case "hero":
        return <HeroEditor />
      case "about":
        return <AboutEditor />
      case "projects":
        return <div className="p-4 text-center text-muted-foreground">Projects editor coming soon...</div>
      case "contact":
        return <ContactEditor />
      default:
        return null
    }
  }

  return (
    <div id="tour-step-5-editor" className="fixed inset-y-0 right-0 z-50 w-96 bg-background border-l shadow-lg">
      <Card className="h-full rounded-none border-0">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              <CardTitle className="text-lg">{sectionNames[editingSection as keyof typeof sectionNames]}</CardTitle>
            </div>
            <Button variant="ghost" size="icon" onClick={() => setEditingSection(null)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ScrollArea className="h-[calc(100vh-80px)]">
            <div className="p-6">{renderEditor()}</div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}
