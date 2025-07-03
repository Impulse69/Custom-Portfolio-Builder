"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { usePortfolioStore, type HeroContent } from "@/lib/portfolio-store"

export function HeroEditor() {
  const { content, updateHeroContent } = usePortfolioStore()
  const [formData, setFormData] = useState<HeroContent>(content.hero)

  const handleChange = (field: keyof HeroContent, value: any) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    updateHeroContent({ [field]: value })
  }

  const handleAvatarChange = (avatar: { imageUrl?: string }) => {
    setFormData({ ...formData, avatar })
    updateHeroContent({ avatar })
  }

  const handleSocialChange = (platform: keyof HeroContent["socialLinks"], value: string) => {
    const newSocialLinks = { ...formData.socialLinks, [platform]: value }
    setFormData({ ...formData, socialLinks: newSocialLinks })
    updateHeroContent({ socialLinks: newSocialLinks })
  }

  const handleToggleChange = (field: keyof HeroContent | `socialLinks.${keyof HeroContent["socialLinks"]}` , checked: boolean) => {
    if (field.startsWith("socialLinks.")) {
      const platform = field.split(".")[1] as keyof HeroContent["socialLinks"]
      const newSocialLinks = { ...formData.socialLinks, [`${platform}Enabled`]: checked }
      setFormData({ ...formData, socialLinks: newSocialLinks })
      updateHeroContent({ socialLinks: newSocialLinks })
    } else {
      const newData = { ...formData, [`${field}Enabled`]: checked }
      setFormData(newData)
      updateHeroContent({ [`${field}Enabled`]: checked })
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleChange("name", e.target.value)}
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">Primary Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Full-Stack Developer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subtitle">Secondary Title</Label>
            <Input
              id="subtitle"
              value={formData.subtitle}
              onChange={(e) => handleChange("subtitle", e.target.value)}
              placeholder="UI/UX Designer"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Brief description about yourself..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="avatar">Avatar</Label>
            <AvatarUpload
              value={formData.avatar}
              onChange={(value) => handleAvatarChange(value)}
              name={formData.name}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="available"
              checked={formData.availableForWork}
              onCheckedChange={(checked) => handleChange("availableForWork", checked)}
            />
            <Label htmlFor="available">Available for work</Label>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Call-to-Action Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ctaPrimary">Primary Button Text</Label>
            <Input
              id="ctaPrimary"
              value={formData.ctaPrimary}
              onChange={(e) => handleChange("ctaPrimary", e.target.value)}
              placeholder="View My Work"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="ctaPrimaryEnabled"
                checked={formData.ctaPrimaryEnabled}
                onCheckedChange={(checked) => handleToggleChange("ctaPrimary", checked)}
              />
              <Label htmlFor="ctaPrimaryEnabled">Enable Primary Button</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ctaSecondary">Secondary Button Text</Label>
            <Input
              id="ctaSecondary"
              value={formData.ctaSecondary}
              onChange={(e) => handleChange("ctaSecondary", e.target.value)}
              placeholder="Download CV"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="ctaSecondaryEnabled"
                checked={formData.ctaSecondaryEnabled}
                onCheckedChange={(checked) => handleToggleChange("ctaSecondary", checked)}
              />
              <Label htmlFor="ctaSecondaryEnabled">Enable Secondary Button</Label>
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
                id="githubEnabled"
                checked={formData.socialLinks.githubEnabled}
                onCheckedChange={(checked) => handleToggleChange("socialLinks.github", checked)}
              />
              <Label htmlFor="githubEnabled">Enable GitHub Link</Label>
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
                id="linkedinEnabled"
                checked={formData.socialLinks.linkedinEnabled}
                onCheckedChange={(checked) => handleToggleChange("socialLinks.linkedin", checked)}
              />
              <Label htmlFor="linkedinEnabled">Enable LinkedIn Link</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              value={formData.socialLinks.email}
              onChange={(e) => handleSocialChange("email", e.target.value)}
              placeholder="john@example.com"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="emailEnabled"
                checked={formData.socialLinks.emailEnabled}
                onCheckedChange={(checked) => handleToggleChange("socialLinks.email", checked)}
              />
              <Label htmlFor="emailEnabled">Enable Email Link</Label>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="twitter">Twitter URL (Optional)</Label>
            <Input
              id="twitter"
              type="url"
              value={formData.socialLinks.twitter || ""}
              onChange={(e) => handleSocialChange("twitter", e.target.value)}
              placeholder="https://twitter.com/username"
            />
            <div className="flex items-center space-x-2 mt-2">
              <Switch
                id="twitterEnabled"
                checked={formData.socialLinks.twitterEnabled}
                onCheckedChange={(checked) => handleToggleChange("socialLinks.twitter", checked)}
              />
              <Label htmlFor="twitterEnabled">Enable Twitter Link</Label>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
