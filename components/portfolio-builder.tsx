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
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"
import { ContentEditor } from "@/components/content-editor"
import { usePortfolioStore } from "@/lib/portfolio-store"
import type { SectionType } from "@/types/portfolio"
import Link from "next/link"
import { ClientOnly } from "@/components/client-only"
import { useToast } from "@/hooks/use-toast"
import { useRef } from "react"
import { z } from "zod"
import React from "react"
import html2canvas from "html2canvas"
import jsPDF from "jspdf"

const LucideUser = dynamic(() => import("lucide-react").then((mod) => mod.User), { ssr: false })
const LucideHome = dynamic(() => import("lucide-react").then((mod) => mod.Home), { ssr: false })
const LucideFolderOpen = dynamic(() => import("lucide-react").then((mod) => mod.FolderOpen), { ssr: false })
const LucideMail = dynamic(() => import("lucide-react").then((mod) => mod.Mail), { ssr: false })
const LucideMoon = dynamic(() => import("lucide-react").then((mod) => mod.Moon), { ssr: false })
const LucideSun = dynamic(() => import("lucide-react").then((mod) => mod.Sun), { ssr: false })
const LucidePalette = dynamic(() => import("lucide-react").then((mod) => mod.Palette), { ssr: false })
const LucideEye = dynamic(() => import("lucide-react").then((mod) => mod.Eye), { ssr: false })
const LucideDownload = dynamic(() => import("lucide-react").then((mod) => mod.Download), { ssr: false })
const LucideSettings = dynamic(() => import("lucide-react").then((mod) => mod.Settings), { ssr: false })
const LucideHelpCircle = dynamic(() => import("lucide-react").then((mod) => mod.HelpCircle), { ssr: false })
const LucideRotateCcw = dynamic(() => import("lucide-react").then((mod) => mod.RotateCcw), { ssr: false })
const LucideRotateCw = dynamic(() => import("lucide-react").then((mod) => mod.RotateCw), { ssr: false })

const sections = [
  {
    id: "hero" as SectionType,
    name: "Hero",
    icon: LucideHome,
    description: "Landing section with introduction",
  },
  {
    id: "about" as SectionType,
    name: "About",
    icon: LucideUser,
    description: "Personal information and skills",
  },
  {
    id: "projects" as SectionType,
    name: "Projects",
    icon: LucideFolderOpen,
    description: "Portfolio projects showcase",
  },
  {
    id: "contact" as SectionType,
    name: "Contact",
    icon: LucideMail,
    description: "Contact information and form",
  },
]

// Zod schemas for each section
const heroSchema = z.object({
  name: z.string(),
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  availableForWork: z.boolean(),
  ctaPrimary: z.string(),
  ctaPrimaryEnabled: z.boolean(),
  ctaSecondary: z.string(),
  ctaSecondaryEnabled: z.boolean(),
  avatar: z.object({ imageUrl: z.string().optional() }),
  socialLinks: z.object({
    github: z.string(),
    githubEnabled: z.boolean(),
    linkedin: z.string(),
    linkedinEnabled: z.boolean(),
    email: z.string(),
    emailEnabled: z.boolean(),
    twitter: z.string().optional(),
    twitterEnabled: z.boolean(),
  }),
})
const aboutSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  journey: z.array(z.string()),
  skills: z.array(z.object({
    name: z.string(),
    level: z.number(),
    category: z.string(),
  })),
  services: z.array(z.object({
    title: z.string(),
    description: z.string(),
    icon: z.string(),
  })),
})
const projectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  image: z.string(),
  tags: z.array(z.string()),
  liveUrl: z.string(),
  githubUrl: z.string(),
  featured: z.boolean(),
})
const projectsSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  projects: z.array(projectSchema),
})
const contactSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  description: z.string(),
  email: z.string(),
  emailEnabled: z.boolean(),
  phone: z.string(),
  phoneEnabled: z.boolean(),
  location: z.string(),
  locationEnabled: z.boolean(),
  socialLinks: z.object({
    github: z.string(),
    githubEnabled: z.boolean(),
    linkedin: z.string(),
    linkedinEnabled: z.boolean(),
    twitter: z.string(),
    twitterEnabled: z.boolean(),
  }),
})

// Zod schema for validation
const importSchema = z.object({
  content: z.object({
    hero: heroSchema,
    about: aboutSchema,
    projects: projectsSchema,
    contact: contactSchema,
  }),
  selectedSections: z.array(z.string()),
  theme: z.string().optional(),
})

export function PortfolioBuilder() {
  const { selectedSections, setSelectedSections, editingSection, setEditingSection, content, resetToDefaults, undo, redo, canUndo, canRedo } = usePortfolioStore()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const dialogRef = useRef<HTMLDialogElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [importDialogOpen, setImportDialogOpen] = React.useState(false)
  const [pdfDialogOpen, setPdfDialogOpen] = React.useState(false)
  const [isExportingPdf, setIsExportingPdf] = React.useState(false)
  const previewRef = useRef<HTMLDivElement | null>(null)

  const toggleSection = (sectionId: SectionType) => {
    const wasSelected = selectedSections.includes(sectionId)
    const newSections = wasSelected
      ? selectedSections.filter((id) => id !== sectionId)
      : [...selectedSections, sectionId]

    setSelectedSections(newSections)

    // If the section being removed is currently open for editing, close the editor
    if (!newSections.includes(sectionId) && editingSection === sectionId) {
      setEditingSection(null)
    }

    // Get the section name for the toast message
    const sectionName = sections.find((s) => s.id === sectionId)?.name || sectionId

    toast({
      title: wasSelected ? "Section removed" : "Section added",
      description: `${sectionName} section has been ${wasSelected ? "removed from" : "added to"} the portfolio.`,
    })
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

  // Utility to clear all storage and reset state
  function resetToDefaultState() {
    // Clear Zustand persisted state
    localStorage.removeItem("portfolio-content")
    // Clear all local/session storage (optional: restrict to app keys)
    localStorage.clear()
    sessionStorage.clear()
    // Reset Zustand state
    resetToDefaults()
    // Optionally, force a reload to ensure UI updates everywhere
    window.location.reload()
  }

  function handleResetClick() {
    if (dialogRef.current) dialogRef.current.showModal()
  }

  function handleConfirmReset() {
    if (dialogRef.current) dialogRef.current.close()
    resetToDefaultState()
  }

  function handleCancelReset() {
    if (dialogRef.current) dialogRef.current.close()
  }

  function handleExport() {
    const exportData = {
      content,
      selectedSections,
      theme,
    }
    const json = JSON.stringify(exportData, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'my-portfolio.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleImportClick() {
    setImportDialogOpen(true)
  }

  function handleImportConfirm() {
    setImportDialogOpen(false)
    if (fileInputRef.current) fileInputRef.current.value = ""
    fileInputRef.current?.click()
  }

  function handleImportCancel() {
    setImportDialogOpen(false)
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string)
        const parsed = importSchema.safeParse(json)
        if (!parsed.success) {
          toast({ title: "Import failed", description: "Invalid portfolio JSON structure.", variant: "destructive" })
          return
        }
        // Overwrite Zustand state
        setSelectedSections(parsed.data.selectedSections)
        resetToDefaults() // clear editingSection, etc.
        setTimeout(() => {
          // Set content after reset
          usePortfolioStore.setState({
            content: parsed.data.content as import("@/lib/portfolio-store").PortfolioContent,
            selectedSections: parsed.data.selectedSections as string[],
          })
        }, 0)
        // Set theme
        if (parsed.data.theme) setTheme(parsed.data.theme)
        // Persist to localStorage
        localStorage.setItem("portfolio-content", JSON.stringify({ state: { content: parsed.data.content, selectedSections: parsed.data.selectedSections } }))
        toast({ title: "Portfolio restored", description: "Portfolio restored from import successfully." })
      } catch (err) {
        toast({ title: "Import failed", description: "Could not parse JSON file.", variant: "destructive" })
      }
    }
    reader.readAsText(file)
  }

  // Replace handleExportPdfClick and handlePdfExportConfirm with a simple export
  function handleExportPdfClick() {
    // Select the main preview container (should contain all sections)
    const previewNode = document.querySelector("#tour-step-3-preview > div") as HTMLElement
    if (!previewNode) {
      toast({ title: "Export failed", description: "Could not find preview to export." })
      return
    }
    html2canvas(previewNode, { scale: 2, useCORS: true, windowWidth: previewNode.scrollWidth, windowHeight: previewNode.scrollHeight }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png")
      const pdf = new jsPDF({ orientation: "portrait", unit: "pt", format: "a4" })
      const pageWidth = pdf.internal.pageSize.getWidth()
      const pageHeight = pdf.internal.pageSize.getHeight()
      const imgWidth = pageWidth
      const imgHeight = (canvas.height * pageWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0
      // Add first page
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
      position -= pageHeight
      // Add more pages if needed
      while (heightLeft > 0) {
        pdf.addPage()
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
        position -= pageHeight
      }
      const userName = content.hero?.name?.toLowerCase().replace(/\s+/g, "-") || "portfolio"
      pdf.save(`${userName}-portfolio.pdf`)
      toast({ title: "PDF exported", description: "Your portfolio PDF has been downloaded." })
    })
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar className="border-r">
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <LucidePalette className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">Portfolio Builder</h2>
                <p className="text-sm text-muted-foreground">Create your portfolio</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <div className="space-y-4">
              <div id="tour-step-1-sections">
                <h3 className="mb-3 text-sm font-medium text-muted-foreground">SECTIONS</h3>
                <SidebarMenu className="space-y-2">
                  {sections.map((section) => {
                    const Icon = section.icon
                    const isSelected = selectedSections.includes(section.id)
                    const isEditing = editingSection === section.id

                    return (
                      <SidebarMenuItem key={section.id}>
                        <div className="flex items-center gap-2">
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
                              id={`tour-step-4-settings-${section.id}`}
                              variant={isEditing ? "default" : "ghost"}
                              size="icon"
                              className="h-8 w-8 shrink-0"
                              onClick={() => handleEditSection(section.id)}
                            >
                              <LucideSettings className="h-3 w-3" />
                            </Button>
                          )}
                        </div>
                      </SidebarMenuItem>
                    )
                  })}
                </SidebarMenu>
              </div>

              <Separator />

              <div className="space-y-2" id="tour-step-2-actions">
                <h3 className="text-sm font-medium text-muted-foreground">ACTIONS</h3>
                <div className="space-y-2">
                  <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                    <Link href="/preview">
                      <LucideEye className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleExport}>
                    <LucideDownload className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleExportPdfClick}>
                    <LucideDownload className="h-4 w-4 mr-2" />
                    Export as PDF
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleImportClick}>
                    <LucideDownload className="h-4 w-4 mr-2 rotate-180" />
                    Import
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="application/json"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {importDialogOpen && (
                    <dialog open className="rounded-lg p-6 shadow-xl border bg-background z-50">
                      <div className="mb-4 text-lg font-semibold">Import Portfolio?</div>
                      <div className="mb-6 text-sm text-muted-foreground">
                        This will replace your current layout and content. Continue?
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button variant="ghost" size="sm" onClick={handleImportCancel}>Cancel</Button>
                        <Button variant="destructive" size="sm" onClick={handleImportConfirm}>Import</Button>
                      </div>
                    </dialog>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start"
                    onClick={() => window.dispatchEvent(new CustomEvent("restart-tour"))}
                  >
                    <LucideHelpCircle className="h-4 w-4 mr-2" />
                    Tour
                  </Button>
                  <div className="flex gap-2 w-full">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 justify-center text-muted-foreground"
                      onClick={undo}
                      disabled={!canUndo}
                      title="Undo"
                    >
                      <LucideRotateCcw className="h-4 w-4 mr-2" /> Undo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 justify-center text-muted-foreground"
                      onClick={redo}
                      disabled={!canRedo}
                      title="Redo"
                    >
                      <LucideRotateCw className="h-4 w-4 mr-2" /> Redo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="flex-1 justify-center text-muted-foreground hover:text-destructive"
                      onClick={handleResetClick}
                      style={{ opacity: 0.85 }}
                      title="Reset"
                    >
                      <span className="mr-2">↺</span> Reset
                    </Button>
                  </div>
                  <dialog ref={dialogRef} className="rounded-lg p-6 shadow-xl border bg-background z-50">
                    <div className="mb-4 text-lg font-semibold">Reset Portfolio?</div>
                    <div className="mb-6 text-sm text-muted-foreground">
                      Are you sure you want to reset your portfolio? This will erase all your changes.
                    </div>
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={handleCancelReset}>Cancel</Button>
                      <Button variant="destructive" size="sm" onClick={handleConfirmReset}>Reset</Button>
                    </div>
                  </dialog>
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
                  <ClientOnly>
                    {theme === "dark" ? <LucideSun className="h-4 w-4 mr-2" /> : <LucideMoon className="h-4 w-4 mr-2" />}
                    {theme === "dark" ? "Light Mode" : "Dark Mode"}
                  </ClientOnly>
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

          <main className="flex-1 overflow-y-auto p-4 md:p-8" id="tour-step-3-preview">
            <div className="mx-auto max-w-5xl space-y-8">
                {selectedSections.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted bg-muted/20 p-12 text-center min-h-[calc(100vh-4rem)]">
                    <div className="text-center">
                      <LucidePalette className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <h2 className="text-2xl font-bold mb-2">Your Portfolio is Empty</h2>
                    <p className="text-muted-foreground">
                      Select a section from the left sidebar to start building your portfolio.
                      </p>
                    </div>
                </div>
                ) : (
                  <motion.div
                  key={selectedSections.join("-")}
                  initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                      >
                  {selectedSections.map((sectionId) => renderSection(sectionId as SectionType))}
                  </motion.div>
                )}
            </div>
          </main>
        </SidebarInset>

        <ContentEditor />

        {/* Hidden PDF preview root for export */}
        <div id="pdf-preview-root" style={{ display: "none" }}>
          <SidebarInset className="bg-white text-black">
            <main className="flex-1 p-8">
              <div className="mx-auto max-w-5xl space-y-8">
                {selectedSections.map((sectionId) => {
                  return renderSection(sectionId as SectionType)
                })}
                <div className="text-center text-xs text-muted-foreground mt-8">Built with CPB</div>
              </div>
            </main>
          </SidebarInset>
        </div>
      </div>
    </SidebarProvider>
  )
}
