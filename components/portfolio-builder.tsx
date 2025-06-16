"use client"
import { motion, AnimatePresence } from "framer-motion"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { User, Home, FolderOpen, Mail, Moon, Sun, Palette, Eye, Download, Settings } from "lucide-react"
import { useTheme } from "next-themes"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"
import { ContentEditor } from "@/components/content-editor"
import { usePortfolioStore } from "@/lib/portfolio-store"
import type { SectionType } from "@/types/portfolio"
import Link from "next/link"

const sections = [
  {
    id: "hero" as SectionType,
    name: "Hero",
    icon: Home,
    description: "Landing section with introduction",
  },
  {
    id: "about" as SectionType,
    name: "About",
    icon: User,
    description: "Personal information and skills",
  },
  {
    id: "projects" as SectionType,
    name: "Projects",
    icon: FolderOpen,
    description: "Portfolio projects showcase",
  },
  {
    id: "contact" as SectionType,
    name: "Contact",
    icon: Mail,
    description: "Contact information and form",
  },
]

export function PortfolioBuilder() {
  const { selectedSections, setSelectedSections, editingSection, setEditingSection, content } = usePortfolioStore()
  const { theme, setTheme } = useTheme()

  const toggleSection = (sectionId: SectionType) => {
    const newSections = selectedSections.includes(sectionId)
      ? selectedSections.filter((id) => id !== sectionId)
      : [...selectedSections, sectionId]

    setSelectedSections(newSections)
  }

  const handleEditSection = (sectionId: SectionType) => {
    setEditingSection(editingSection === sectionId ? null : sectionId)
  }

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

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Palette className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Portfolio Builder</h2>
                <p className="text-sm text-muted-foreground">Create your portfolio</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <div className="space-y-4">
              <div>
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">SECTIONS</h3>
                <SidebarMenu>
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isSelected = selectedSections.includes(section.id)
                    const isEditing = editingSection === section.id

                    return (
                      <SidebarMenuItem key={section.id}>
                        <div className="flex items-center gap-1">
                          <SidebarMenuButton
                            onClick={() => toggleSection(section.id)}
                            className={`flex-1 justify-start ${isSelected ? "bg-primary text-primary-foreground" : ""}`}
                          >
                            <Icon className="h-4 w-4" />
                            <div className="flex flex-col items-start">
                              <span className="font-medium">{section.name}</span>
                              <span className="text-xs opacity-70">{section.description}</span>
                            </div>
                          </SidebarMenuButton>
                          {isSelected && (
                            <Button
                              variant={isEditing ? "default" : "ghost"}
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => handleEditSection(section.id)}
                            >
                              <Settings className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </div>

              <Separator />

              <div className="space-y-2">
                <h3 className="text-sm font-medium text-muted-foreground">ACTIONS</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="mb-2 text-sm font-medium text-muted-foreground">THEME</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className="w-full justify-start"
                >
                  {theme === "dark" ? <Sun className="h-4 w-4 mr-2" /> : <Moon className="h-4 w-4 mr-2" />}
                  {theme === "dark" ? "Light Mode" : "Dark Mode"}
                </Button>
              </div>
            </div>
          </SidebarContent>
        </Sidebar>

        <SidebarInset className={`flex-1 ${editingSection ? "mr-96" : ""} transition-all duration-300`}>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Portfolio Preview</h1>
              <span className="text-sm text-muted-foreground">
                ({selectedSections.length} section{selectedSections.length !== 1 ? "s" : ""} selected)
              </span>
            </div>
            {editingSection && (
              <div className="ml-auto flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  Editing: {sections.find((s) => s.id === editingSection)?.name}
                </span>
              </div>
            )}
          </header>

          <main className="flex-1 overflow-auto">
            <div className="min-h-full">
              <AnimatePresence mode="wait">
                {selectedSections.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="flex h-full items-center justify-center p-8"
                  >
                    <div className="text-center">
                      <Palette className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Start Building Your Portfolio</h3>
                      <p className="text-muted-foreground max-w-md">
                        Select sections from the sidebar to start building your portfolio. You can add multiple sections
                        and see them rendered in real-time.
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="sections"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="space-y-0"
                  >
                    {selectedSections.map((sectionId, index) => (
                      <motion.div
                        key={sectionId}
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ delay: index * 0.1 }}
                        className={`${editingSection === sectionId ? "ring-2 ring-primary ring-offset-2" : ""}`}
                      >
                        {renderSection(sectionId)}
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </main>
        </SidebarInset>

        <ContentEditor />
      </div>
    </SidebarProvider>
  )
}
