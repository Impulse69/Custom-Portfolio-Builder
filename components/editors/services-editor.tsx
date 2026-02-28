"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Trash2 } from "lucide-react"
import { usePortfolioStore, type ServicesContent } from "@/lib/portfolio-store"

export function ServicesEditor() {
    const { content, updateServicesContent } = usePortfolioStore()
    const [formData, setFormData] = useState<ServicesContent>(content.services)

    const handleChange = (field: keyof ServicesContent, value: any) => {
        const newData = { ...formData, [field]: value }
        setFormData(newData)
        updateServicesContent({ [field]: value })
    }

    const handleServiceChange = (index: number, field: string, value: any) => {
        const newServices = [...formData.services]
        newServices[index] = { ...newServices[index], [field]: value }
        handleChange("services", newServices)
    }

    const addService = () => {
        if (formData.services.length >= 4) return // Max 4 to fit in grid
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
                            placeholder="What I Do"
                            maxLength={20}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="subtitle">Section Subtitle</Label>
                        <Input
                            id="subtitle"
                            value={formData.subtitle}
                            onChange={(e) => handleChange("subtitle", e.target.value)}
                            placeholder="My Services"
                            maxLength={40}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Section Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleChange("description", e.target.value)}
                            placeholder="I offer a range of services..."
                            rows={3}
                            maxLength={120}
                        />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Services List (Max 4)</CardTitle>
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
                                    maxLength={25}
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
                                    maxLength={100}
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
                    <Button
                        type="button"
                        variant="outline"
                        onClick={addService}
                        disabled={formData.services.length >= 4}
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        Add Service
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
