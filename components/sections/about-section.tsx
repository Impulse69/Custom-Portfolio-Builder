"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { motion } from "framer-motion"
import { Code, Palette, Smartphone, Database, Globe, Zap } from "lucide-react"
import type { AboutContent } from "@/lib/portfolio-store"

interface AboutSectionProps {
  content: AboutContent
}

const iconMap = {
  Code,
  Palette,
  Smartphone,
  Database,
  Globe,
  Zap,
}

export function AboutSection({ content }: AboutSectionProps) {
  return (
    <section id="about" className="py-20 bg-muted/30 scroll-mt-16">
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
              const isHighlighted = word.toLowerCase().includes("digital") || word.toLowerCase().includes("solutions")
              return (
                <span key={index} className={isHighlighted ? "text-primary" : ""}>
                  {word}
                  {index < content.subtitle.split(" ").length - 1 && " "}
                </span>
              )
            })}
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">{content.description}</p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-6">My Journey</h3>
            <div className="space-y-4 text-muted-foreground">
              {content.journey.map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-2xl font-bold mb-6">Skills & Expertise</h3>
            <div className="space-y-4">
              {content.skills.map((skill, index) => {
                const Icon =
                  iconMap[
                    skill.name.includes("React") || skill.name.includes("TypeScript")
                      ? "Code"
                      : skill.name.includes("Design")
                        ? "Palette"
                        : skill.name.includes("Mobile")
                          ? "Smartphone"
                          : skill.name.includes("Node")
                            ? "Database"
                            : skill.name.includes("DevOps")
                              ? "Globe"
                              : "Code"
                  ]
                return (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.6 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="font-medium">{skill.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-2" />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-2xl font-bold text-center mb-12">What I Do</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.services.map((service, index) => {
              const Icon = iconMap[service.icon as keyof typeof iconMap] || Code
              return (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-6 text-center">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h4 className="font-semibold mb-2">{service.title}</h4>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
