"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { motion } from "framer-motion"
import { Mail, Phone, MapPin, Send, Github, Linkedin, Twitter } from "lucide-react"
import type { ContactContent } from "@/lib/portfolio-store"
import { Switch } from "@/components/ui/switch"

interface ContactSectionProps {
  content: ContactContent
}

export function ContactSection({ content }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted:", formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const contactInfo = [
    {
      icon: Mail,
      label: "Email",
      value: content.email,
      href: `mailto:${content.email}`,
      enabled: content.emailEnabled,
    },
    {
      icon: Phone,
      label: "Phone",
      value: content.phone,
      href: `tel:${content.phone.replace(/\D/g, "")}`,
      enabled: content.phoneEnabled,
    },
    {
      icon: MapPin,
      label: "Location",
      value: content.location,
      href: "#",
      enabled: content.locationEnabled,
    },
  ]

  const socialLinks = [
    {
      icon: Github,
      label: "GitHub",
      href: content.socialLinks.github,
      username: "@johndoe",
      enabled: content.socialLinks.githubEnabled,
    },
    {
      icon: Linkedin,
      label: "LinkedIn",
      href: content.socialLinks.linkedin,
      username: "John Doe",
      enabled: content.socialLinks.linkedinEnabled,
    },
    {
      icon: Twitter,
      label: "Twitter",
      href: content.socialLinks.twitter,
      username: "@johndoe",
      enabled: content.socialLinks.twitterEnabled,
    },
  ]

  return (
    <section id="contact" className="py-20 bg-muted/30 scroll-mt-16">
      <div className="container px-4 mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <Badge variant="outline" className="mb-4">
            {content.title}
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            {content.subtitle.split(" ").map((word, index) => {
              const isHighlighted = word.toLowerCase().includes("work") || word.toLowerCase().includes("together")
              return (
                <span key={index} className={isHighlighted ? "text-primary" : ""}>
                  {word}
                  {index < content.subtitle.split(" ").length - 1 && " "}
                </span>
              )
            })}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{content.description}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Send me a message</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      rows={6}
                      required
                    />
                  </div>
                  <Button type="submit" className="w-full group">
                    <Send className="mr-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    Send Message
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-bold mb-6">Contact Information</h3>
              <div className="space-y-4">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon
                  return info.enabled && (
                    <motion.div
                      key={info.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{info.label}</p>
                            <a href={info.href} className="text-muted-foreground hover:text-primary transition-colors">
                              {info.value}
                            </a>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-bold mb-6">Follow Me</h3>
              <div className="space-y-4">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon
                  return social.enabled && (
                    <motion.div
                      key={social.label}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.6 }}
                    >
                      <Card className="p-4 hover:shadow-md transition-shadow">
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-4 group"
                        >
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium group-hover:text-primary transition-colors">{social.label}</p>
                            <p className="text-muted-foreground text-sm">{social.username}</p>
                          </div>
                        </a>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <Card className="p-6 bg-primary/5 border-primary/20">
              <div className="text-center">
                <h4 className="font-bold mb-2">Ready to start a project?</h4>
                <p className="text-muted-foreground mb-4">I'm available for freelance work and new opportunities.</p>
                {content.emailEnabled && (
                  <Button asChild>
                    <a href={`mailto:${content.email}`}>
                      <Mail className="mr-2 h-4 w-4" />
                      Let's Talk
                    </a>
                  </Button>
                )}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
