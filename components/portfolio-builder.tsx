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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import JSZip from "jszip"

const LucideUser = dynamic(() => import("lucide-react").then((m) => ({ default: m.User })), { ssr: false })
const LucideHome = dynamic(() => import("lucide-react").then((m) => ({ default: m.Home })), { ssr: false })
const LucideFolderOpen = dynamic(() => import("lucide-react").then((m) => ({ default: m.FolderOpen })), { ssr: false })
const LucideMail = dynamic(() => import("lucide-react").then((m) => ({ default: m.Mail })), { ssr: false })
const LucideMoon = dynamic(() => import("lucide-react").then((m) => ({ default: m.Moon })), { ssr: false })
const LucideSun = dynamic(() => import("lucide-react").then((m) => ({ default: m.Sun })), { ssr: false })
const LucidePalette = dynamic(() => import("lucide-react").then((m) => ({ default: m.Palette })), { ssr: false })
const LucideEye = dynamic(() => import("lucide-react").then((m) => ({ default: m.Eye })), { ssr: false })
const LucideDownload = dynamic(() => import("lucide-react").then((m) => ({ default: m.Download })), { ssr: false })
const LucideChevronDown = dynamic(() => import("lucide-react").then((m) => ({ default: m.ChevronDown })), { ssr: false })
const LucideFileText = dynamic(() => import("lucide-react").then((m) => ({ default: m.FileText })), { ssr: false })
const LucideGlobe = dynamic(() => import("lucide-react").then((m) => ({ default: m.Globe })), { ssr: false })
const LucideFileJson = dynamic(() => import("lucide-react").then((m) => ({ default: m.FileJson })), { ssr: false })
const LucideSettings = dynamic(() => import("lucide-react").then((m) => ({ default: m.Settings })), { ssr: false })
const LucideHelpCircle = dynamic(() => import("lucide-react").then((m) => ({ default: m.HelpCircle })), { ssr: false })
const LucideRotateCcw = dynamic(() => import("lucide-react").then((m) => ({ default: m.RotateCcw })), { ssr: false })
const LucideRotateCw = dynamic(() => import("lucide-react").then((m) => ({ default: m.RotateCw })), { ssr: false })

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
  const [isExportingStatic, setIsExportingStatic] = React.useState(false)
  const [isExportingJson, setIsExportingJson] = React.useState(false)
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

  // Export as PDF
  function handleExportPdf() {
    setIsExportingPdf(true)
    // Select the main preview container (should contain all sections)
    const previewNode = document.querySelector("#tour-step-3-preview > div") as HTMLElement
    if (!previewNode) {
      toast({ title: "Export failed", description: "Could not find preview to export." })
      setIsExportingPdf(false)
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
      setIsExportingPdf(false)
    }).catch(() => {
      toast({ title: "Export failed", description: "Failed to generate PDF." })
      setIsExportingPdf(false)
    })
  }

  // Export as static site
  function handleExportStatic() {
    setIsExportingStatic(true)
    
    try {
      // Get the preview container
      const previewNode = document.querySelector("#tour-step-3-preview > div") as HTMLElement
      if (!previewNode) {
        toast({ title: "Export failed", description: "Could not find preview to export." })
        setIsExportingStatic(false)
        return
      }

      // Create a new zip instance
      const zip = new JSZip()
      
      // Generate HTML content
      const htmlContent = generateStaticHTML(previewNode)
      
      // Generate CSS content
      const cssContent = generateStaticCSS()
      
      // Generate JavaScript content
      const jsContent = generateStaticJS()
      
      // Add files to zip
      zip.file("index.html", htmlContent)
      zip.file("styles.css", cssContent)
      zip.file("script.js", jsContent)
      
      // Add README
      const readmeContent = generateReadme()
      zip.file("README.md", readmeContent)
      
      // Generate and download zip
      zip.generateAsync({ type: "blob" }).then((zipContent) => {
        const url = URL.createObjectURL(zipContent)
        const a = document.createElement("a")
        a.href = url
        a.download = `${content.hero?.name?.toLowerCase().replace(/\s+/g, "-") || "portfolio"}-static-site.zip`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
        
        toast({ 
          title: "Static site exported", 
          description: "Your portfolio has been exported as a static site. Extract the ZIP file and upload to any web hosting service." 
        })
        setIsExportingStatic(false)
      }).catch((error) => {
        console.error("Export error:", error)
        toast({ title: "Export failed", description: "Failed to generate static site." })
        setIsExportingStatic(false)
      })
      
    } catch (error) {
      console.error("Export error:", error)
      toast({ title: "Export failed", description: "An error occurred during export." })
      setIsExportingStatic(false)
    }
  }

  // Generate static HTML
  function generateStaticHTML(previewNode: HTMLElement) {
    const userName = content.hero?.name || "Portfolio"
    const userTitle = content.hero?.title || "Professional"
    
    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${userName} - ${userTitle}</title>
    <meta name="description" content="${content.hero?.description || 'Professional portfolio'}" />
    <link rel="stylesheet" href="styles.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
</head>
<body>
    ${previewNode.innerHTML}
    <script src="script.js"></script>
</body>
</html>`
  }

  // Generate static CSS
  function generateStaticCSS() {
    return `/* Portfolio Static Site Styles */
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    line-height: 1.6;
    color: #1a1a1a;
    background-color: #ffffff;
}

/* Dark mode styles */
@media (prefers-color-scheme: dark) {
    body {
        color: #ffffff;
        background-color: #0a0a0a;
    }
}

/* Container */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* Sections */
section {
    padding: 4rem 0;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
}

/* Hero section */
#hero {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    text-align: center;
}

@media (prefers-color-scheme: dark) {
    #hero {
        background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    }
}

/* Avatar */
.avatar {
    width: 12rem;
    height: 12rem;
    border-radius: 50%;
    margin: 0 auto 2rem;
    overflow: hidden;
    border: 4px solid #ffffff;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
}

.avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* Typography */
h1 {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 1rem;
    background: linear-gradient(135deg, #3b82f6, #8b5cf6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

h2 {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: #64748b;
}

p {
    font-size: 1.125rem;
    color: #64748b;
    max-width: 600px;
    margin: 0 auto 2rem;
}

/* Buttons */
.btn {
    display: inline-flex;
    align-items: center;
    padding: 0.75rem 1.5rem;
    border-radius: 0.5rem;
    text-decoration: none;
    font-weight: 500;
    transition: all 0.2s;
    margin: 0.5rem;
}

.btn-primary {
    background: #3b82f6;
    color: white;
}

.btn-primary:hover {
    background: #2563eb;
    transform: translateY(-2px);
}

.btn-secondary {
    background: transparent;
    color: #3b82f6;
    border: 2px solid #3b82f6;
}

.btn-secondary:hover {
    background: #3b82f6;
    color: white;
}

/* Social links */
.social-links {
    display: flex;
    justify-content: center;
    gap: 1rem;
    margin-top: 2rem;
}

.social-link {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
    background: #f1f5f9;
    color: #64748b;
    text-decoration: none;
    transition: all 0.2s;
}

.social-link:hover {
    background: #3b82f6;
    color: white;
    transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
    h1 {
        font-size: 2rem;
    }
    
    .avatar {
        width: 8rem;
        height: 8rem;
    }
    
    section {
        padding: 2rem 0;
    }
}

/* Animations */
@keyframes fadeInUp {
    from {
        opacity: 0;
        transform: translateY(30px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in-up {
    animation: fadeInUp 0.8s ease-out;
}

/* Badge */
.badge {
    display: inline-block;
    padding: 0.5rem 1rem;
    background: #f1f5f9;
    color: #64748b;
    border-radius: 9999px;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 2rem;
}

@media (prefers-color-scheme: dark) {
    .badge {
        background: #1e293b;
        color: #94a3b8;
    }
}`
  }

  // Generate static JavaScript
  function generateStaticJS() {
    return `// Portfolio Static Site JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Add fade-in animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe all sections
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        observer.observe(section);
    });

    // Add click handlers for buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Add ripple effect
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;
            
            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
});

// Add ripple effect styles
const style = document.createElement('style');
style.textContent = \`
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
\`;
document.head.appendChild(style);`
  }

  // Generate README
  function generateReadme() {
    const userName = content.hero?.name || "Portfolio"
    return `# ${userName}'s Portfolio

This is a static portfolio website generated by the Portfolio Builder.

## Files Included

- \`index.html\` - Main HTML file
- \`styles.css\` - All CSS styles
- \`script.js\` - JavaScript functionality
- \`README.md\` - This file

## How to Deploy

### Option 1: GitHub Pages
1. Create a new repository on GitHub
2. Upload these files to the repository
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose "main"
5. Your site will be available at \`https://yourusername.github.io/repository-name\`

### Option 2: Netlify
1. Go to [netlify.com](https://netlify.com)
2. Drag and drop the \`index.html\` file
3. Your site will be deployed instantly

### Option 3: Vercel
1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repository
3. Deploy with zero configuration

### Option 4: Any Web Host
Upload all files to your web hosting service's public folder.

## Customization

You can edit the HTML, CSS, and JavaScript files to further customize your portfolio.

## Support

Generated by Portfolio Builder - A modern, no-code portfolio creation tool.`
  }

  // Export as JSON
  function handleExportJson() {
    setIsExportingJson(true)
    
    try {
      // Create export data
      const exportData = {
        content,
        selectedSections,
        theme,
        metadata: {
          exportedAt: new Date().toISOString(),
          version: "1.0.0",
          tool: "Portfolio Builder"
        }
      }
      
      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2)
      
      // Create and download file
      const blob = new Blob([jsonString], { type: "application/json" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${content.hero?.name?.toLowerCase().replace(/\s+/g, "-") || "portfolio"}-data.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      toast({ 
        title: "JSON exported", 
        description: "Your portfolio data has been exported as JSON. You can import this file later to restore your portfolio." 
      })
      setIsExportingJson(false)
      
    } catch (error) {
      console.error("JSON export error:", error)
      toast({ title: "Export failed", description: "Failed to export portfolio data." })
      setIsExportingJson(false)
    }
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
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                    <Link href="/preview">
                      <LucideEye className="h-4 w-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="sm" className="w-full justify-start bg-transparent">
                        <LucideDownload className="h-4 w-4 mr-2" />
                        Export Options
                        <LucideChevronDown className="h-4 w-4 ml-auto" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-56">
                      <DropdownMenuItem onClick={handleExportPdf} disabled={isExportingPdf}>
                        <LucideFileText className="h-4 w-4 mr-2" />
                        {isExportingPdf ? "Exporting PDF..." : "Export as PDF"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportStatic} disabled={isExportingStatic}>
                        <LucideGlobe className="h-4 w-4 mr-2" />
                        {isExportingStatic ? "Exporting Static Site..." : "Export as Static Site"}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleExportJson} disabled={isExportingJson}>
                        <LucideFileJson className="h-4 w-4 mr-2" />
                        {isExportingJson ? "Exporting JSON..." : "Export as JSON"}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" onClick={handleImportClick}>
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
                    className="w-full justify-start bg-transparent"
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
