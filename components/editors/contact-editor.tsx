"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { usePortfolioStore, type ContactContent } from "@/lib/portfolio-store"

export function ContactEditor() {
  const { content, updateContactContent } = usePortfolioStore()
  const [formData, setFormData] = useState<ContactContent>(content.contact)

  const handleChange = (field: keyof ContactContent, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    updateContactContent({ [field]: value })
  }

  const handleSocialChange = (platform: keyof ContactContent["socialLinks"], value: string) => {
    const newSocialLinks = { ...formData.socialLinks, [platform]: value }
    setFormData({ ...formData, socialLinks: newSocialLinks })
    updateContactContent({ socialLinks: newSocialLinks })
  }

  const handleToggleChange = (field: keyof ContactContent | `socialLinks.${keyof ContactContent["socialLinks"]}` | 'formEnabled', checked: boolean) => {
    if (field.startsWith("socialLinks.")) {
      const platform = field.split(".")[1] as keyof ContactContent["socialLinks"]
      const newSocialLinks = { ...formData.socialLinks, [`${platform}Enabled`]: checked }
      setFormData({ ...formData, socialLinks: newSocialLinks })
      updateContactContent({ socialLinks: newSocialLinks })
    } else {
      const newData = { ...formData, [`${field}Enabled`]: checked }
      setFormData(newData)
      updateContactContent({ [`${field}Enabled`]: checked })
    }
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
              placeholder="Get In Touch"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Section Subtitle</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="Let's Work Together"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Section Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief overview of how to contact you..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              placeholder="john@example.com"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="emailEnabled"
                checked={formData.emailEnabled}
                onCheckedChange={(checked) => handleToggleChange("email", checked)}
              />
              <Label htmlFor="emailEnabled">Enable Email</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              placeholder="+1 (123) 456-7890"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="phoneEnabled"
                checked={formData.phoneEnabled}
                onCheckedChange={(checked) => handleToggleChange("phone", checked)}
              />
              <Label htmlFor="phoneEnabled">Enable Phone</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => handleChange("location", e.target.value)}
              placeholder="San Francisco, CA"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="locationEnabled"
                checked={formData.locationEnabled}
                onCheckedChange={(checked) => handleToggleChange("location", checked)}
              />
              <Label htmlFor="locationEnabled">Enable Location</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Social Links</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="github">GitHub URL</Label>
            <Input
              id="github"
              type="url"
              value={formData.socialLinks.github}
              onChange={(e) => handleSocialChange("github", e.target.value)}
              placeholder="https://github.com/username"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="githubSocialEnabled"
                checked={formData.socialLinks.githubEnabled}
                onCheckedChange={(checked) => handleToggleChange("socialLinks.github", checked)}
              />
              <Label htmlFor="githubSocialEnabled">Enable GitHub Link</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="linkedin">LinkedIn URL</Label>
            <Input
              id="linkedin"
              type="url"
              value={formData.socialLinks.linkedin}
              onChange={(e) => handleSocialChange("linkedin", e.target.value)}
              placeholder="https://linkedin.com/in/username"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="linkedinSocialEnabled"
                checked={formData.socialLinks.linkedinEnabled}
                onCheckedChange={(checked) => handleToggleChange("socialLinks.linkedin", checked)}
              />
              <Label htmlFor="linkedinSocialEnabled">Enable LinkedIn Link</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter URL</Label>
            <Input
              id="twitter"
              type="url"
              value={formData.socialLinks.twitter}
              onChange={(e) => handleSocialChange("twitter", e.target.value)}
              placeholder="https://twitter.com/username"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="twitterSocialEnabled"
                checked={formData.socialLinks.twitterEnabled}
                onCheckedChange={(checked) => handleToggleChange("socialLinks.twitter", checked)}
              />
              <Label htmlFor="twitterSocialEnabled">Enable Twitter Link</Label>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Contact Form</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="formEnabled"
              checked={formData.formEnabled}
              onCheckedChange={(checked) => handleToggleChange("formEnabled", checked)}
            />
            <Label htmlFor="formEnabled">Enable Contact Form</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 