"use client"
import { motion, AnimatePresence } from "framer-motion"
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import dynamic from "next/dynamic"
import { useTheme } from "next-themes"
import { HeroSection } from "@/components/sections/hero-section"
import { AboutSection } from "@/components/sections/about-section"
import { ProjectsSection } from "@/components/sections/projects-section"
import { ContactSection } from "@/components/sections/contact-section"
import { ContentEditor } from "@/components/content-editor"
import { usePortfolioStore } from "@/lib/portfolio-store"
import {
  generatePortfolioHtml,
  buildPortfolioExport,
  parsePortfolioJson,
  downloadFile,
} from "@/lib/export-portfolio"
import type { SectionType } from "@/types/portfolio"
import Link from "next/link"
import { ClientOnly } from "@/components/client-only"
import { useToast } from "@/hooks/use-toast"
import { useEffect, useRef, useState, type ChangeEvent } from "react"

const LucideUser = dynamic(() => import("lucide-react").then((mod) => mod.User), { ssr: false })
const LucideHome = dynamic(() => import("lucide-react").then((mod) => mod.Home), { ssr: false })
const LucideFolderOpen = dynamic(() => import("lucide-react").then((mod) => mod.FolderOpen), { ssr: false })
const LucideMail = dynamic(() => import("lucide-react").then((mod) => mod.Mail), { ssr: false })
const LucideMoon = dynamic(() => import("lucide-react").then((mod) => mod.Moon), { ssr: false })
const LucideSun = dynamic(() => import("lucide-react").then((mod) => mod.Sun), { ssr: false })
const LucidePalette = dynamic(() => import("lucide-react").then((mod) => mod.Palette), { ssr: false })
const LucideEye = dynamic(() => import("lucide-react").then((mod) => mod.Eye), { ssr: false })
const LucideDownload = dynamic(() => import("lucide-react").then((mod) => mod.Download), { ssr: false })
const LucidePencil = dynamic(() => import("lucide-react").then((mod) => mod.Pencil), { ssr: false })
const LucideUpload = dynamic(() => import("lucide-react").then((mod) => mod.Upload), { ssr: false })
const LucideFileCode = dynamic(() => import("lucide-react").then((mod) => mod.FileCode), { ssr: false })
const LucideFileJson = dynamic(() => import("lucide-react").then((mod) => mod.FileJson), { ssr: false })
const LucideChevronUp = dynamic(() => import("lucide-react").then((mod) => mod.ChevronUp), { ssr: false })
const LucideChevronDown = dynamic(() => import("lucide-react").then((mod) => mod.ChevronDown), { ssr: false })
const LucidePlus = dynamic(() => import("lucide-react").then((mod) => mod.Plus), { ssr: false })
const LucideX = dynamic(() => import("lucide-react").then((mod) => mod.X), { ssr: false })
const LucideRotateCcw = dynamic(() => import("lucide-react").then((mod) => mod.RotateCcw), { ssr: false })
const LucideHelpCircle = dynamic(() => import("lucide-react").then((mod) => mod.HelpCircle), { ssr: false })

const sections = [
  {
    id: "hero" as SectionType,
    name: "Hero",
    icon: LucideHome,
    description: "Landing section with your name, photo and intro",
  },
  {
    id: "about" as SectionType,
    name: "About",
    icon: LucideUser,
    description: "Your story, skills and services",
  },
  {
    id: "projects" as SectionType,
    name: "Projects",
    icon: LucideFolderOpen,
    description: "Showcase of your best work",
  },
  {
    id: "contact" as SectionType,
    name: "Contact",
    icon: LucideMail,
    description: "Contact details and message form",
  },
]

function SidebarGroupLabel({ label, hint }: { label: string; hint: string }) {
  return (
    <div className="mb-3 flex items-center gap-1.5">
      <h3 className="text-xs font-semibold tracking-wider text-muted-foreground">{label}</h3>
      <Tooltip>
        <TooltipTrigger asChild>
          <span className="cursor-help text-muted-foreground/70" tabIndex={-1}>
            <LucideHelpCircle className="h-3 w-3" />
          </span>
        </TooltipTrigger>
        <TooltipContent side="right" className="max-w-56">
          {hint}
        </TooltipContent>
      </Tooltip>
    </div>
  )
}

export function PortfolioBuilder() {
  const { selectedSections, setSelectedSections, editingSection, setEditingSection, content, importContent, resetToDefaults } = usePortfolioStore()
  const { resolvedTheme, setTheme } = useTheme()
  const { toast } = useToast()
  const importInputRef = useRef<HTMLInputElement | null>(null)

  // The store is persisted in localStorage, so the server-rendered defaults
  // can differ from the user's saved state. Render after mount to avoid a
  // hydration mismatch and a flash of example content.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const isDark = resolvedTheme === "dark"

  const addSection = (sectionId: SectionType) => {
    if (selectedSections.includes(sectionId)) return
    setSelectedSections([...selectedSections, sectionId])
    const sectionName = sections.find((s) => s.id === sectionId)?.name || sectionId
    toast({
      title: `${sectionName} added`,
      description: "The section is now on your page. Click it to edit its content.",
    })
  }

  const removeSection = (sectionId: SectionType) => {
    setSelectedSections(selectedSections.filter((id) => id !== sectionId))
    if (editingSection === sectionId) {
      setEditingSection(null)
    }
    const sectionName = sections.find((s) => s.id === sectionId)?.name || sectionId
    toast({
      title: `${sectionName} removed`,
      description: "Your content is kept — add the section back anytime.",
    })
  }

  const handleEditSection = (sectionId: SectionType) => {
    setEditingSection(editingSection === sectionId ? null : sectionId)
  }

  const moveSection = (sectionId: string, direction: -1 | 1) => {
    const index = selectedSections.indexOf(sectionId)
    const target = index + direction
    if (index === -1 || target < 0 || target >= selectedSections.length) return
    const newSections = [...selectedSections]
    newSections[index] = newSections[target]
    newSections[target] = sectionId
    setSelectedSections(newSections)
  }

  const handleExportHtml = () => {
    if (selectedSections.length === 0) {
      toast({
        title: "Nothing to export",
        description: "Add at least one section to your portfolio first.",
        variant: "destructive",
      })
      return
    }
    const html = generatePortfolioHtml(content, selectedSections)
    const filename = `${content.hero.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "portfolio"}.html`
    downloadFile(filename, html, "text/html")
    toast({
      title: "Portfolio exported",
      description: `${filename} is ready — open it in a browser or host it anywhere.`,
    })
  }

  const handleExportJson = () => {
    const data = buildPortfolioExport(content, selectedSections)
    downloadFile("portfolio-backup.json", JSON.stringify(data, null, 2), "application/json")
    toast({
      title: "Backup saved",
      description: "Your portfolio data was downloaded as portfolio-backup.json.",
    })
  }

  const handleImportFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    if (!file) return
    try {
      const data = parsePortfolioJson(await file.text())
      importContent(data.content)
      setSelectedSections(data.selectedSections)
      setEditingSection(null)
      toast({
        title: "Portfolio imported",
        description: "Your portfolio was restored from the backup file.",
      })
    } catch (error) {
      toast({
        title: "Import failed",
        description: error instanceof Error ? error.message : "The file could not be read.",
        variant: "destructive",
      })
    }
  }

  const handleConfirmReset = () => {
    localStorage.removeItem("portfolio-content")
    resetToDefaults()
    window.location.reload()
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

  const availableSections = sections.filter((section) => !selectedSections.includes(section.id))

  if (!mounted) {
    return (
      <div className="flex min-h-screen w-full items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
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
                <h2 className="text-lg font-semibold leading-tight">Portfolio Builder</h2>
                <p className="text-xs text-muted-foreground">Design, preview and export your site</p>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-4">
            <div className="space-y-5">
              <div>
                <SidebarGroupLabel
                  label="PAGE STRUCTURE"
                  hint="The sections currently on your page, in the order visitors will see them. Click a section to edit its content."
                />
                {selectedSections.length === 0 ? (
                  <div className="rounded-lg border border-dashed p-4 text-center text-sm text-muted-foreground">
                    Your page is empty.
                    <br />
                    Add your first section below.
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {selectedSections.map((sectionId, index) => {
                      const section = sections.find((s) => s.id === sectionId)
                      if (!section) return null
                      const Icon = section.icon
                      const isEditing = editingSection === section.id

                      return (
                        <div
                          key={section.id}
                          className={`group flex items-center gap-0.5 rounded-lg border bg-card py-1 pl-1 pr-1.5 transition-colors ${
                            isEditing ? "border-primary ring-1 ring-primary" : "hover:border-muted-foreground/40"
                          }`}
                        >
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <button
                                onClick={() => handleEditSection(section.id)}
                                className="flex min-w-0 flex-1 items-center gap-2 rounded-md p-1.5 text-left text-sm font-medium hover:bg-muted"
                              >
                                <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
                                <span className="truncate">{section.name}</span>
                              </button>
                            </TooltipTrigger>
                            <TooltipContent side="right">
                              {isEditing ? "Close the content editor" : "Edit this section's content"}
                            </TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground"
                                disabled={index === 0}
                                onClick={() => moveSection(section.id, -1)}
                                aria-label={`Move ${section.name} up`}
                              >
                                <LucideChevronUp className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Move up</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground"
                                disabled={index === selectedSections.length - 1}
                                onClick={() => moveSection(section.id, 1)}
                                aria-label={`Move ${section.name} down`}
                              >
                                <LucideChevronDown className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Move down</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant={isEditing ? "default" : "ghost"}
                                size="icon"
                                className={`h-7 w-7 ${isEditing ? "" : "text-muted-foreground"}`}
                                onClick={() => handleEditSection(section.id)}
                                aria-label={`Edit ${section.name} content`}
                              >
                                <LucidePencil className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Edit content</TooltipContent>
                          </Tooltip>

                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                onClick={() => removeSection(section.id)}
                                aria-label={`Remove ${section.name} from page`}
                              >
                                <LucideX className="h-3.5 w-3.5" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent side="top">Remove from page (content is kept)</TooltipContent>
                          </Tooltip>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <SidebarGroupLabel
                  label="ADD SECTIONS"
                  hint="Sections you can add to your page. New sections appear at the bottom — reorder them with the arrows above."
                />
                {availableSections.length === 0 ? (
                  <p className="rounded-lg bg-muted/50 p-3 text-center text-xs text-muted-foreground">
                    All sections are on your page.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {availableSections.map((section) => {
                      const Icon = section.icon
                      return (
                        <Tooltip key={section.id}>
                          <TooltipTrigger asChild>
                            <button
                              onClick={() => addSection(section.id)}
                              className="flex w-full items-center gap-2 rounded-lg border border-dashed p-2 text-left transition-colors hover:border-primary hover:bg-muted/50"
                            >
                              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                                <Icon className="h-4 w-4" />
                              </span>
                              <span className="min-w-0 flex-1">
                                <span className="block text-sm font-medium">{section.name}</span>
                                <span className="block truncate text-xs text-muted-foreground">
                                  {section.description}
                                </span>
                              </span>
                              <LucidePlus className="h-4 w-4 shrink-0 text-muted-foreground" />
                            </button>
                          </TooltipTrigger>
                          <TooltipContent side="right" className="max-w-56">
                            Add the {section.name} section to your page
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </div>
                )}
              </div>

              <Separator />

              <div>
                <SidebarGroupLabel
                  label="ACTIONS"
                  hint="Preview your portfolio full-screen, download it as a website, or back up your work."
                />
                <div className="space-y-1.5">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                        <Link href="/preview">
                          <LucideEye className="h-4 w-4 mr-2" />
                          Preview
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="right">See your portfolio exactly as visitors will</TooltipContent>
                  </Tooltip>

                  <DropdownMenu>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="w-full justify-start">
                            <LucideDownload className="h-4 w-4 mr-2" />
                            Export
                          </Button>
                        </DropdownMenuTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right">Download your site or back up your data</TooltipContent>
                    </Tooltip>
                    <DropdownMenuContent align="start" className="w-64">
                      <DropdownMenuLabel>Publish</DropdownMenuLabel>
                      <DropdownMenuItem onClick={handleExportHtml}>
                        <LucideFileCode className="h-4 w-4 mr-2" />
                        <span>
                          Download website (HTML)
                          <span className="block text-xs text-muted-foreground">
                            A single file you can host anywhere
                          </span>
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel>Backup</DropdownMenuLabel>
                      <DropdownMenuItem onClick={handleExportJson}>
                        <LucideFileJson className="h-4 w-4 mr-2" />
                        <span>
                          Save backup (JSON)
                          <span className="block text-xs text-muted-foreground">All your content and layout</span>
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => importInputRef.current?.click()}>
                        <LucideUpload className="h-4 w-4 mr-2" />
                        <span>
                          Restore backup (JSON)
                          <span className="block text-xs text-muted-foreground">Replaces your current work</span>
                        </span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <input
                    ref={importInputRef}
                    type="file"
                    accept="application/json,.json"
                    className="hidden"
                    onChange={handleImportFile}
                  />

                  <AlertDialog>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-muted-foreground hover:text-destructive"
                          >
                            <LucideRotateCcw className="h-4 w-4 mr-2" />
                            Reset
                          </Button>
                        </AlertDialogTrigger>
                      </TooltipTrigger>
                      <TooltipContent side="right">Start over with the default example content</TooltipContent>
                    </Tooltip>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset your portfolio?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This erases everything you&apos;ve entered and restores the default example content. Consider
                          saving a backup (Export → Save backup) first — this cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleConfirmReset}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Reset everything
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </div>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center justify-between">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setTheme(isDark ? "light" : "dark")}
                    className="justify-start"
                  >
                    <ClientOnly>
                      {isDark ? <LucideSun className="h-4 w-4 mr-2" /> : <LucideMoon className="h-4 w-4 mr-2" />}
                      {isDark ? "Light mode" : "Dark mode"}
                    </ClientOnly>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">Switch the builder&apos;s appearance</TooltipContent>
              </Tooltip>
              <span className="text-xs text-muted-foreground">v1.0.0</span>
            </div>
          </SidebarFooter>
        </Sidebar>

        <SidebarInset className={`flex-1 ${editingSection ? "md:mr-96" : ""} transition-all duration-300`}>
          <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <SidebarTrigger className="-ml-1" />
              </TooltipTrigger>
              <TooltipContent side="bottom">Show or hide the sidebar</TooltipContent>
            </Tooltip>
            <Separator orientation="vertical" className="mr-2 h-4" />
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-semibold">Live Preview</h1>
              <span className="text-sm text-muted-foreground">
                ({selectedSections.length} section{selectedSections.length !== 1 ? "s" : ""})
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
                      <LucidePalette className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Start Building Your Portfolio</h3>
                      <p className="text-muted-foreground max-w-md">
                        Add sections from the sidebar to start building your portfolio. Everything you see here updates
                        in real time as you edit.
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
                        {renderSection(sectionId as SectionType)}
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
