"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
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

const getInitials = (name: string) => {
  const [firstName, lastName] = name.split(' ')
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`
  }
  return name.slice(0, 2)
}

export function HeroSection({ content }: HeroSectionProps) {
  return (
    <section
      id="hero"
      className="relative w-full h-full flex flex-col justify-center items-center bg-gradient-to-br from-background via-background to-muted/20 scroll-mt-16 overflow-hidden py-4"
    >
      <div className="absolute inset-0 bg-grid-pattern opacity-5" />

      <div className="container px-4 mx-auto max-w-4xl relative z-10 flex flex-col h-full justify-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center space-y-2"
        >
          <div className="flex flex-col items-center space-y-2">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="relative flex justify-center items-center rounded-full"
            >
              <Avatar className="w-16 h-16 sm:w-20 sm:h-20 shadow-md">
                {content.avatar.imageUrl ? (
                  <AvatarImage src={content.avatar.imageUrl} alt={content.name} className="object-cover" />
                ) : null}
                <AvatarFallback className="text-xl sm:text-2xl font-bold bg-gradient-to-br from-primary to-primary/60 text-primary-foreground flex items-center justify-center">
                  {getInitials(content.name)}
                </AvatarFallback>
              </Avatar>
            </motion.div>
            {content.availableForWork && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Badge variant="secondary" className="text-[10px] py-0 h-4">
                  Available for work
                </Badge>
              </motion.div>
            )}
          </div>

          <div className="space-y-1">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
            >
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold tracking-tight line-clamp-1">
                {content.name.split(" ").map((word, index) => (
                  <span key={index}>
                    {index === 0 ? word : <span className="text-primary">{word}</span>}
                    {index < content.name.split(" ").length - 1 && " "}
                  </span>
                ))}
              </h1>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-muted-foreground line-clamp-1">
                {content.title} {content.subtitle && `& ${content.subtitle}`}
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="text-[10px] sm:text-xs md:text-sm text-muted-foreground max-w-xl mx-auto leading-snug line-clamp-2"
            >
              {content.description}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-row gap-2 sm:gap-4 justify-center items-center"
          >
            {content.ctaPrimaryEnabled && (
              <Button size="sm" className="group text-[10px] sm:text-xs h-6 sm:h-8 px-2">
                {content.ctaPrimary}
                <LucideArrowRight className="ml-1 sm:ml-2 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Button>
            )}
            {content.ctaSecondaryEnabled && (
              <Button variant="outline" size="sm" className="text-[10px] sm:text-xs h-6 sm:h-8 px-2">
                <LucideDownload className="mr-1 sm:mr-2 h-3 w-3" />
                {content.ctaSecondary}
              </Button>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.6 }}
            className="flex justify-center gap-2 sm:gap-4 pt-2"
          >
            {[
              content.socialLinks.githubEnabled ? { icon: LucideGithub, href: content.socialLinks.github, label: "GitHub" } : null,
              content.socialLinks.linkedinEnabled ? { icon: LucideLinkedin, href: content.socialLinks.linkedin, label: "LinkedIn" } : null,
              content.socialLinks.emailEnabled ? { icon: LucideMail, href: `mailto:${content.socialLinks.email}`, label: "Email" } : null,
              content.socialLinks.twitterEnabled && content.socialLinks.twitter ? { icon: LucideTwitter, href: content.socialLinks.twitter, label: "Twitter" } : null,
            ].filter((item): item is { icon: React.ComponentType<any>, href: string, label: string } => item !== null).map(({ icon: Icon, href, label }) => (
              <Button
                key={label}
                variant="ghost"
                size="icon"
                className="h-6 w-6 sm:h-8 sm:w-8 rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
                asChild
              >
                <a href={href} aria-label={label} target="_blank" rel="noopener noreferrer">
                  <Icon className="h-3 w-3 sm:h-4 sm:w-4" />
                </a>
              </Button>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
