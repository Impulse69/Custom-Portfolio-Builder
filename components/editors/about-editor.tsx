"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Plus, Trash2 } from "lucide-react"
import { usePortfolioStore, type AboutContent } from "@/lib/portfolio-store"

export function AboutEditor() {
  const { content, updateAboutContent } = usePortfolioStore()
  const [formData, setFormData] = useState<AboutContent>(content.about)

  const handleChange = (field: keyof AboutContent, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    updateAboutContent({ [field]: value })
  }

  const handleJourneyChange = (index: number, value: string) => {
    const newJourney = [...formData.journey]
    newJourney[index] = value
    handleChange("journey", newJourney)
  }

  const addJourneyParagraph = () => {
    const newJourney = [...formData.journey, ""]
    handleChange("journey", newJourney)
  }

  const removeJourneyParagraph = (index: number) => {
    const newJourney = formData.journey.filter((_, i) => i !== index)
    handleChange("journey", newJourney)
  }

  const handleSkillChange = (index: number, field: string, value: any) => {
    const newSkills = [...formData.skills]
    newSkills[index] = { ...newSkills[index], [field]: value }
    handleChange("skills", newSkills)
  }

  const addSkill = () => {
    const newSkills = [...formData.skills, { name: "", level: 50, category: "Frontend" }]
    handleChange("skills", newSkills)
  }

  const removeSkill = (index: number) => {
    const newSkills = formData.skills.filter((_, i) => i !== index)
    handleChange("skills", newSkills)
  }

  const handleServiceChange = (index: number, field: string, value: any) => {
    const newServices = [...formData.services]
    newServices[index] = { ...newServices[index], [field]: value }
    handleChange("services", newServices)
  }

  const addService = () => {
    const newServices = [...formData.services, { title: "", description: "", icon: "Code" }]
    handleChange("services", newServices)
  }

  const removeService = (index: number) => {
    const newServices = formData.services.filter((_, i) => i !== index)
    handleChange("services", newServices)
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
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="About Me"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Section Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Passionate About Creating Digital Solutions"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Section Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief overview of your experience..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Journey Story</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.journey.map((paragraph, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`journey-${index}`}>Paragraph {index + 1}</Label>
                {formData.journey.length > 1 && (
                  <Button type="button" variant="ghost" size="sm" onClick={() => removeJourneyParagraph(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>
              <Textarea
                id={`journey-${index}`}
                value={paragraph}
                onChange={(e) => handleJourneyChange(index, e.target.value)}
                placeholder="Tell your story..."
                rows={3}
              />
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addJourneyParagraph}>
            <Plus className="h-4 w-4 mr-2" />
            Add Paragraph
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.skills.map((skill, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label>Skill {index + 1}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeSkill(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`skill-name-${index}`}>Skill Name</Label>
                  <Input
                    id={`skill-name-${index}`}
                    value={skill.name}
                    onChange={(e) => handleSkillChange(index, "name", e.target.value)}
                    placeholder="React/Next.js"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`skill-category-${index}`}>Category</Label>
                  <Input
                    id={`skill-category-${index}`}
                    value={skill.category}
                    onChange={(e) => handleSkillChange(index, "category", e.target.value)}
                    placeholder="Frontend"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`skill-level-${index}`}>Proficiency Level: {skill.level}%</Label>
                <Slider
                  id={`skill-level-${index}`}
                  min={0}
                  max={100}
                  step={5}
                  value={[skill.level]}
                  onValueChange={(value) => handleSkillChange(index, "level", value[0])}
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addSkill}>
            <Plus className="h-4 w-4 mr-2" />
            Add Skill
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {formData.services.map((service, index) => (
            <div key={index} className="space-y-3 p-4 border rounded-lg">
              <div className="flex items-center justify-between">
                <Label>Service {index + 1}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeService(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`service-title-${index}`}>Service Title</Label>
                <Input
                  id={`service-title-${index}`}
                  value={service.title}
                  onChange={(e) => handleServiceChange(index, "title", e.target.value)}
                  placeholder="Frontend Development"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`service-description-${index}`}>Description</Label>
                <Textarea
                  id={`service-description-${index}`}
                  value={service.description}
                  onChange={(e) => handleServiceChange(index, "description", e.target.value)}
                  placeholder="Describe what you offer..."
                  rows={2}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`service-icon-${index}`}>Icon</Label>
                <Input
                  id={`service-icon-${index}`}
                  value={service.icon}
                  onChange={(e) => handleServiceChange(index, "icon", e.target.value)}
                  placeholder="Code"
                />
                <p className="text-xs text-muted-foreground">
                  Available icons: Code, Database, Palette, Zap, Globe, Smartphone
                </p>
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addService}>
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
