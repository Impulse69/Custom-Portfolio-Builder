"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Plus, Trash2, GripVertical, LayoutGrid, List } from "lucide-react"
import { usePortfolioStore, type ProjectsContent } from "@/lib/portfolio-store"

export function ProjectsEditor() {
    const { content, updateProjectsContent, addProject, updateProject, deleteProject } = usePortfolioStore()
    const [formData, setFormData] = useState<ProjectsContent>(content.projects)

    const handleChange = (field: keyof ProjectsContent, value: any) => {
        const newData = { ...formData, [field]: value }
        setFormData(newData)
        updateProjectsContent({ [field]: value })
    }

    const handleProjectChange = (id: string, field: string, value: any) => {
        updateProject(id, { [field]: value })
        // Local state sync
        setFormData((prev) => ({
            ...prev,
            projects: prev.projects.map((p) => (p.id === id ? { ...p, [field]: value } : p)),
        }))
    }

    const handleAddProject = () => {
        if (formData.projects.length >= 6) return // Sensible limit
        addProject({
            title: "New Project",
            description: "Describe your project here.",
            image: "/placeholder.svg?height=300&width=500",
            tags: ["New", "Tag"],
            liveUrl: "#",
            githubUrl: "#",
            featured: false,
        })
        // State will update via store subscription next cycle normally, but since we are mirroring:
        // A better approach is pulling from the store directly, but we'll let the user see it next render
    }

    const handleRemoveProject = (id: string) => {
        deleteProject(id)
        setFormData((prev) => ({
            ...prev,
            projects: prev.projects.filter((p) => p.id !== id),
        }))
    }

    // Always use fresh from store for the list to ensure sync
    const currentProjects = content.projects.projects

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
                            value={formData.title}
                            onChange={(e) => handleChange("title", e.target.value)}
                            placeholder="My Work"
                            maxLength={20}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Section Subtitle</Label>
                        <Input
                            id="subtitle"
                            value={formData.subtitle}
                            onChange={(e) => handleChange("subtitle", e.target.value)}
                            placeholder="Featured Projects"
                            maxLength={40}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Section Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="Here are some of my recent projects..."
                            rows={3}
                            maxLength={120}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Projects Layout</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex bg-muted/50 p-1 rounded-lg">
                        <Button
                            variant={formData.layout === "grid" ? "secondary" : "ghost"}
                            className="flex-1 rounded-md"
                            onClick={() => handleChange("layout", "grid")}
                        >
                            <LayoutGrid className="w-4 h-4 mr-2" />
                            Grid
                        </Button>
                        <Button
                            variant={formData.layout === "list" ? "secondary" : "ghost"}
                            className="flex-1 rounded-md"
                            onClick={() => handleChange("layout", "list")}
                        >
                            <List className="w-4 h-4 mr-2" />
                            List
                        </Button>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Projects List</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {currentProjects.map((project, index) => (
                        <div key={project.id} className="space-y-4 p-4 border rounded-lg bg-card">
                            <div className="flex items-center justify-between">
                                <Label className="flex items-center gap-2">
                                    <GripVertical className="h-4 w-4 text-muted-foreground" />
                                    Project {index + 1}
                                </Label>
                                <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveProject(project.id)}>
                                    <Trash2 className="h-4 w-4 text-destructive" />
                                </Button>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`project-title-${project.id}`}>Project Title</Label>
                                <Input
                                    id={`project-title-${project.id}`}
                                    value={project.title}
                                    onChange={(e) => handleProjectChange(project.id, "title", e.target.value)}
                                    placeholder="E-Commerce Platform"
                                    maxLength={40}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`project-desc-${project.id}`}>Description</Label>
                                <Textarea
                                    id={`project-desc-${project.id}`}
                                    value={project.description}
                                    onChange={(e) => handleProjectChange(project.id, "description", e.target.value)}
                                    placeholder="A full-stack solution..."
                                    rows={2}
                                    maxLength={150}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor={`project-image-${project.id}`}>Image URL</Label>
                                <Input
                                    id={`project-image-${project.id}`}
                                    value={project.image}
                                    onChange={(e) => handleProjectChange(project.id, "image", e.target.value)}
                                    placeholder="/placeholder.svg"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor={`project-live-${project.id}`}>Live URL</Label>
                                    <Input
                                        id={`project-live-${project.id}`}
                                        value={project.liveUrl}
                                        onChange={(e) => handleProjectChange(project.id, "liveUrl", e.target.value)}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor={`project-github-${project.id}`}>GitHub URL</Label>
                                    <Input
                                        id={`project-github-${project.id}`}
                                        value={project.githubUrl}
                                        onChange={(e) => handleProjectChange(project.id, "githubUrl", e.target.value)}
                                        placeholder="https://github.com/..."
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <Label htmlFor={`project-featured-${project.id}`}>Featured</Label>
                                <Switch
                                    id={`project-featured-${project.id}`}
                                    checked={project.featured}
                                    onCheckedChange={(checked) => handleProjectChange(project.id, "featured", checked)}
                                />
                            </div>
                        </div>
                    ))}

                    <Button
                        type="button"
                        variant="outline"
                        className="w-full"
                        onClick={handleAddProject}
                        disabled={currentProjects.length >= 6}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Project
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
