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

import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import JSZip from "jszip";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

export function PortfolioBuilder() {
  const { selectedSections, setSelectedSections, editingSection, setEditingSection, content, resetToDefaults, undo, redo, canUndo, canRedo } = usePortfolioStore()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const dialogRef = useRef<HTMLDialogElement | null>(null)

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

  const handleExport = () => {
    const portfolioData = {
      version: 1,
      content,
      selectedSections,
    }

    const jsonString = JSON.stringify(portfolioData, null, 2)
    const blob = new Blob([jsonString], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "my-portfolio.json"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Portfolio Exported",
      description: "Your portfolio has been successfully downloaded as my-portfolio.json.",
    })
  }

  const handleExportZip = async () => {
    const zip = new JSZip();

    // 1. Generate HTML
    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${content.hero.name}'s Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-background text-foreground">
    <div class="container mx-auto p-4 md:p-8">
        ${selectedSections.map(sectionId => {
            switch (sectionId) {
                case 'hero':
                    return `<section id="hero" class="text-center py-20">
                        <h1 class="text-5xl font-bold">${content.hero.name}</h1>
                        <p class="text-2xl mt-2">${content.hero.title}</p>
                        <p class="mt-4">${content.hero.description}</p>
                    </section>`;
                case 'about':
                    return `<section id="about" class="py-20">
                        <h2 class="text-4xl font-bold text-center">${content.about.title}</h2>
                        <p class="text-center mt-2">${content.about.subtitle}</p>
                        <p class="mt-8">${content.about.description}</p>
                    </section>`;
                case 'projects':
                    return `<section id="projects" class="py-20">
                        <h2 class="text-4xl font-bold text-center">${content.projects.title}</h2>
                        <p class="text-center mt-2">${content.projects.subtitle}</p>
                        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
                            ${content.projects.projects.map(p => `
                                <div class="border rounded-lg overflow-hidden">
                                    <img src="./assets/${p.id}.jpg" alt="${p.title}" class="w-full h-48 object-cover">
                                    <div class="p-4">
                                        <h3 class="font-bold">${p.title}</h3>
                                        <p class="text-sm">${p.description}</p>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    </section>`;
                case 'contact':
                    return `<section id="contact" class="py-20 text-center">
                        <h2 class="text-4xl font-bold">${content.contact.title}</h2>
                        <p class="mt-2">${content.contact.subtitle}</p>
                        <p class="mt-8">${content.contact.description}</p>
                        <p class="mt-4">Email: ${content.contact.email}</p>
                    </section>`;
                default:
                    return '';
            }
        }).join('')}
    </div>
</body>
</html>
    `;
    zip.file("index.html", htmlContent);

    // 2. Add Assets
    const assets = zip.folder("assets");
    if (content.hero.avatar.imageUrl) {
        const response = await fetch(content.hero.avatar.imageUrl);
        const blob = await response.blob();
        assets.file("avatar.jpg", blob);
    }

    for (const project of content.projects.projects) {
        if (project.image) {
            try {
                const response = await fetch(project.image);
                if (response.ok) {
                    const blob = await response.blob();
                    assets.file(`${project.id}.jpg`, blob);
                } else {
                    console.warn(`Could not fetch image for project ${project.title}: ${response.statusText}`);
                }
            } catch (error) {
                console.error(`Error fetching image for project ${project.title}:`, error);
            }
        }
    }

    // 3. Generate and Download ZIP
    zip.generateAsync({ type: "blob" }).then(blob => {
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "portfolio.zip";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        toast({
            title: "Portfolio ZIP Exported",
            description: "Your portfolio has been successfully downloaded as portfolio.zip.",
        });
    });
};

const handleExportPdf = () => {
    const input = document.getElementById('tour-step-3-preview');
    if (input) {
        html2canvas(input, { scale: 2 }).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
            const ratio = canvasWidth / canvasHeight;
            const width = pdfWidth;
            const height = width / ratio;

            let position = 0;
            let heightLeft = height;

            pdf.addImage(imgData, 'PNG', 0, position, width, height);
            heightLeft -= pdfHeight;

            while (heightLeft > 0) {
                position = heightLeft - height;
                pdf.addPage();
                pdf.addImage(imgData, 'PNG', 0, position, width, height);
                heightLeft -= pdfHeight;
            }

            pdf.save(`${content.hero.name.toLowerCase().replace(/ /g, '-')}-portfolio.pdf`);

            toast({
                title: "Portfolio PDF Exported",
                description: "Your portfolio has been successfully downloaded as a PDF.",
            });
        });
    }
};

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
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start">
                        <LucideDownload className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={handleExport}>
                        <LucideDownload className="h-4 w-4 mr-2" />
                        Export as JSON
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportZip}>
                        <LucideDownload className="h-4 w-4 mr-2" />
                        Export as ZIP
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportPdf}>
                        <LucideDownload className="h-4 w-4 mr-2" />
                        Export as PDF
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
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
      </div>
    </SidebarProvider>
  )
}
