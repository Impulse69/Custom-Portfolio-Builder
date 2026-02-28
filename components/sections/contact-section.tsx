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
    <section id="contact" className="py-4 bg-muted/30 scroll-mt-16 overflow-hidden flex flex-col justify-center min-h-full">
      <div className="container px-4 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-4"
        >
          <Badge variant="outline" className="mb-2 text-[10px] py-0 h-5">
            {content.title}
          </Badge>
          <h2 className="text-lg md:text-xl font-bold mb-1">
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
          <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto line-clamp-1">{content.description}</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <Card>
              <CardHeader className="p-3 pb-1">
                <CardTitle className="text-sm">Send me a message</CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-0">
                <form onSubmit={handleSubmit} className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <Label htmlFor="name" className="text-xs">Name</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Your name"
                        className="h-8 text-xs"
                        required
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email" className="text-xs">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="h-8 text-xs"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="subject" className="text-xs">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="What's this about?"
                      className="h-8 text-xs"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="message" className="text-xs">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder="Tell me about your project..."
                      rows={2}
                      className="text-xs resize-none"
                      required
                    />
                  </div>
                  <Button type="submit" size="sm" className="w-full group h-8 text-xs">
                    <Send className="mr-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
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
            className="space-y-4"
          >
            <div>
              <h3 className="text-sm font-bold mb-2">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
                      <Card className="p-2 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center shrink-0">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-xs">{info.label}</p>
                            <a href={info.href} className="text-[10px] text-muted-foreground hover:text-primary transition-colors truncate block">
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
              <h3 className="text-sm font-bold mb-2">Follow Me</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
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
                      <Card className="p-2 hover:shadow-md transition-shadow">
                        <a
                          href={social.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 group"
                        >
                          <div className="w-8 h-8 bg-primary/10 rounded-md flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium text-xs group-hover:text-primary transition-colors truncate">{social.label}</p>
                            <p className="text-muted-foreground text-[10px] truncate">{social.username}</p>
                          </div>
                        </a>
                      </Card>
                    </motion.div>
                  )
                })}
              </div>
            </div>

            <Card className="p-3 bg-primary/5 border-primary/20 flex items-center justify-between">
              <div className="min-w-0 pr-2">
                <h4 className="font-bold text-xs truncate">Ready to start a project?</h4>
                <p className="text-[10px] text-muted-foreground truncate">I'm available for freelance work.</p>
              </div>
              {content.emailEnabled && (
                <Button size="sm" className="h-7 text-xs px-2 shrink-0" asChild>
                  <a href={`mailto:${content.email}`}>
                    <Mail className="mr-1 h-3 w-3" />
                    Let's Talk
                  </a>
                </Button>
              )}
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
