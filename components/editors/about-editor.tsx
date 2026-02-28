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

  const handleJourneyChange = (index: number, field: keyof AboutContent["journeyItems"][0], value: string) => {
    const newJourney = [...(formData.journeyItems || [])]
    if (newJourney[index]) {
      newJourney[index] = { ...newJourney[index], [field]: value }
    }
    handleChange("journeyItems", newJourney)
  }

  const addJourneyItem = () => {
    const newJourney = [
      ...(formData.journeyItems || []),
      {
        id: Date.now().toString(),
        role: "New Role",
        company: "Company Name",
        period: "Year - Year",
        description: "Describe what you did..."
      }
    ]
    handleChange("journeyItems", newJourney)
  }

  const removeJourneyItem = (index: number) => {
    const newJourney = (formData.journeyItems || []).filter((_, i) => i !== index)
    handleChange("journeyItems", newJourney)
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
              maxLength={20}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Section Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Passionate About Creating Digital Solutions"
              maxLength={50}
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
              maxLength={250}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Work History / Journey</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {(formData.journeyItems || []).map((item, index) => (
            <div key={item.id} className="space-y-3 p-4 border rounded-lg bg-muted/20">
              <div className="flex items-center justify-between">
                <Label className="font-semibold text-primary">Role {index + 1}</Label>
                <Button type="button" variant="ghost" size="sm" onClick={() => removeJourneyItem(index)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor={`journey-role-${index}`}>Role</Label>
                  <Input
                    id={`journey-role-${index}`}
                    value={item.role}
                    onChange={(e) => handleJourneyChange(index, "role", e.target.value)}
                    placeholder="Senior Developer"
                    maxLength={40}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`journey-company-${index}`}>Company</Label>
                  <Input
                    id={`journey-company-${index}`}
                    value={item.company}
                    onChange={(e) => handleJourneyChange(index, "company", e.target.value)}
                    placeholder="Tech Corp"
                    maxLength={40}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor={`journey-period-${index}`}>Period</Label>
                <Input
                  id={`journey-period-${index}`}
                  value={item.period}
                  onChange={(e) => handleJourneyChange(index, "period", e.target.value)}
                  placeholder="2020 - Present"
                  maxLength={30}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`journey-desc-${index}`}>Description</Label>
                <Textarea
                  id={`journey-desc-${index}`}
                  value={item.description}
                  onChange={(e) => handleJourneyChange(index, "description", e.target.value)}
                  placeholder="Describe your responsibilities and achievements..."
                  rows={2}
                  maxLength={150}
                />
              </div>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={addJourneyItem} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Add Timeline Item
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
                    maxLength={20}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`skill-category-${index}`}>Category</Label>
                  <Input
                    id={`skill-category-${index}`}
                    value={skill.category}
                    onChange={(e) => handleSkillChange(index, "category", e.target.value)}
                    placeholder="Frontend"
                    maxLength={20}
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
    </div>
  )
}
