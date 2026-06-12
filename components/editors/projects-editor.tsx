"use client"

import { useRef, useState, type ChangeEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2, Star, Upload, Loader2 } from "lucide-react"
import { usePortfolioStore, type Project, type ProjectsContent } from "@/lib/portfolio-store"
import { fileToResizedDataUrl, validateImageFile } from "@/lib/image-utils"
import { useToast } from "@/hooks/use-toast"

export function ProjectsEditor() {
  const { content, updateProjectsContent, addProject, updateProject, deleteProject } = usePortfolioStore()
  const projectsContent = content.projects
  const { toast } = useToast()
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadingProjectId, setUploadingProjectId] = useState<string | null>(null)
  const pendingProjectIdRef = useRef<string | null>(null)

  const handlePickImage = (projectId: string) => {
    pendingProjectIdRef.current = projectId
    imageInputRef.current?.click()
  }

  const handleImageFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ""
    const projectId = pendingProjectIdRef.current
    pendingProjectIdRef.current = null
    if (!file || !projectId) return

    const validationError = validateImageFile(file)
    if (validationError) {
      toast({ title: "Could not use this image", description: validationError, variant: "destructive" })
      return
    }

    setUploadingProjectId(projectId)
    try {
      const dataUrl = await fileToResizedDataUrl(file)
      updateProject(projectId, { image: dataUrl })
      toast({
        title: "Image added",
        description: "The image is embedded in your portfolio and will be included in exports.",
      })
    } catch (error) {
      toast({
        title: "Could not process image",
        description: error instanceof Error ? error.message : "Something went wrong.",
        variant: "destructive",
      })
    } finally {
      setUploadingProjectId(null)
    }
  }

  const handleHeaderChange = (field: keyof Omit<ProjectsContent, "projects">, value: string) => {
    updateProjectsContent({ [field]: value })
  }

  const handleProjectChange = (id: string, field: keyof Omit<Project, "id">, value: any) => {
    updateProject(id, { [field]: value })
  }

  const handleTagsChange = (id: string, value: string) => {
    const tags = value
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
    updateProject(id, { tags })
  }

  const handleAddProject = () => {
    addProject({
      title: "New Project",
      description: "A short description of what this project does and why it matters.",
      image: "/placeholder.svg?height=300&width=500",
      tags: [],
      liveUrl: "#",
      githubUrl: "#",
      featured: false,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Section Header</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Section Title</Label>
            <Input
              id="title"
              value={projectsContent.title}
              onChange={(e) => handleHeaderChange("title", e.target.value)}
              placeholder="My Work"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Section Subtitle</Label>
            <Input
              id="subtitle"
              value={projectsContent.subtitle}
              onChange={(e) => handleHeaderChange("subtitle", e.target.value)}
              placeholder="Featured Projects"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Section Description</Label>
            <Textarea
              id="description"
              value={projectsContent.description}
              onChange={(e) => handleHeaderChange("description", e.target.value)}
              placeholder="Brief overview of your projects..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projectsContent.projects.map((project, index) => (
            <div key={project.id} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Label>Project {index + 1}</Label>
                  {project.featured && <Star className="h-3 w-3 fill-primary text-primary" />}
                </div>
                <Button type="button" variant="ghost" size="sm" onClick={() => deleteProject(project.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-title-${project.id}`}>Title</Label>
                <Input
                  id={`project-title-${project.id}`}
                  value={project.title}
                  onChange={(e) => handleProjectChange(project.id, "title", e.target.value)}
                  placeholder="E-Commerce Platform"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-description-${project.id}`}>Description</Label>
                <Textarea
                  id={`project-description-${project.id}`}
                  value={project.description}
                  onChange={(e) => handleProjectChange(project.id, "description", e.target.value)}
                  placeholder="What does this project do?"
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-image-${project.id}`}>Image</Label>
                <div className="flex gap-2">
                  <Input
                    id={`project-image-${project.id}`}
                    value={project.image.startsWith("data:") ? "" : project.image}
                    onChange={(e) => handleProjectChange(project.id, "image", e.target.value)}
                    placeholder={
                      project.image.startsWith("data:")
                        ? "Uploaded image in use — paste a URL to replace it"
                        : "https://example.com/screenshot.png"
                    }
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="shrink-0"
                    onClick={() => handlePickImage(project.id)}
                    disabled={uploadingProjectId !== null}
                    aria-label="Upload an image from your device"
                    title="Upload an image from your device"
                  >
                    {uploadingProjectId === project.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Paste an image URL or upload from your device — uploads are embedded in your portfolio.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`project-tags-${project.id}`}>Tags</Label>
                <Input
                  id={`project-tags-${project.id}`}
                  value={project.tags.join(", ")}
                  onChange={(e) => handleTagsChange(project.id, e.target.value)}
                  placeholder="Next.js, TypeScript, Stripe"
                />
                <p className="text-xs text-muted-foreground">Separate tags with commas.</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`project-live-${project.id}`}>Live URL</Label>
                  <Input
                    id={`project-live-${project.id}`}
                    type="url"
                    value={project.liveUrl}
                    onChange={(e) => handleProjectChange(project.id, "liveUrl", e.target.value)}
                    placeholder="https://myproject.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`project-github-${project.id}`}>GitHub URL</Label>
                  <Input
                    id={`project-github-${project.id}`}
                    type="url"
                    value={project.githubUrl}
                    onChange={(e) => handleProjectChange(project.id, "githubUrl", e.target.value)}
                    placeholder="https://github.com/user/repo"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id={`project-featured-${project.id}`}
                  checked={project.featured}
                  onCheckedChange={(checked) => handleProjectChange(project.id, "featured", checked)}
                />
                <Label htmlFor={`project-featured-${project.id}`}>Featured project</Label>
              </div>
            </div>
          ))}

          <Button type="button" variant="outline" onClick={handleAddProject}>
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleImageFile}
          />
        </CardContent>
      </Card>
    </div>
  )
}
