"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Mail, Download, ArrowRight, Twitter } from "lucide-react"
import { motion } from "framer-motion"
import type { HeroContent } from "@/lib/portfolio-store"
import dynamic from "next/dynamic"

// Dynamically import Lucide icons with ssr: false
const LucideGithub = dynamic(() => import("lucide-react").then((mod) => mod.Github), { ssr: false })
const LucideLinkedin = dynamic(() => import("lucide-react").then((mod) => mod.Linkedin), { ssr: false })
const LucideMail = dynamic(() => import("lucide-react").then((mod) => mod.Mail), { ssr: false })
const LucideDownload = dynamic(() => import("lucide-react").then((mod) => mod.Download), { ssr: false })
const LucideArrowRight = dynamic(() => import("lucide-react").then((mod) => mod.ArrowRight), { ssr: false })
const LucideTwitter = dynamic(() => import("lucide-react").then((mod) => mod.Twitter), { ssr: false })

interface HeroSectionProps {
  content: HeroContent
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-muted/20 scroll-mt-16"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container px-4 py-16 mx-auto max-w-6xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-8"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="relative mx-auto w-32 h-32 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-4xl font-bold text-primary-foreground"
          >
            {content.avatar}
          </motion.div>

          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              {content.availableForWork && (
                <Badge variant="secondary" className="mb-4">
                  Available for work
                </Badge>
              )}
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                {content.name.split(" ").map((word, index) => (
                  <span key={index}>
                    {index === 0 ? word : <span className="text-primary">{word}</span>}
                    {index < content.name.split(" ").length - 1 && " "}
                  </span>
                ))}
              </h1>
              <p className="text-2xl md:text-3xl font-semibold text-muted-foreground mt-2">
                {content.title} {content.subtitle && `& ${content.subtitle}`}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            >
              {content.description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            {content.ctaPrimaryEnabled && (
              <Button size="lg" className="group">
                {content.ctaPrimary}
                <LucideArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
            {content.ctaSecondaryEnabled && (
              <Button variant="outline" size="lg">
                <LucideDownload className="mr-2 h-4 w-4" />
                {content.ctaSecondary}
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex justify-center gap-6 pt-8"
          >
            {[
              content.socialLinks.githubEnabled && { icon: LucideGithub, href: content.socialLinks.github, label: "GitHub" },
              content.socialLinks.linkedinEnabled && { icon: LucideLinkedin, href: content.socialLinks.linkedin, label: "LinkedIn" },
              content.socialLinks.emailEnabled && { icon: LucideMail, href: `mailto:${content.socialLinks.email}`, label: "Email" },
              content.socialLinks.twitterEnabled && content.socialLinks.twitter && { icon: LucideTwitter, href: content.socialLinks.twitter, label: "Twitter" },
            ].filter((item): item is { icon: React.ComponentType<any>, href: string, label: string } => item !== false && item !== null && item !== undefined).map(({ icon: Icon, href, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                className="h-12 w-12 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                asChild
              >
                <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-5 w-5" />
                </a>
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
