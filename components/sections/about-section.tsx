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
    <section id="about" className="py-4 bg-muted/30 scroll-mt-16 overflow-hidden flex flex-col justify-center min-h-full">
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
              const isHighlighted = word.toLowerCase().includes("digital") || word.toLowerCase().includes("solutions")
              return (
                <span key={index} className={isHighlighted ? "text-primary" : ""}>
                  {word}
                  {index < content.subtitle.split(" ").length - 1 && " "}
                </span>
              )
            })}
          </h2>
          <p className="text-xs md:text-sm text-muted-foreground max-w-2xl mx-auto leading-snug line-clamp-2">{content.description}</p>
        </motion.div>

        <div className="grid grid-cols-2 gap-4 pb-2">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-sm font-bold mb-4">My Journey</h3>
            <div className="relative border-l-2 border-primary/20 pl-4 space-y-4 text-xs text-muted-foreground ml-2">
              <div className="line-clamp-6 pr-2">
                {content.journeyItems?.map((item, index) => (
                  <div key={item.id} className="relative mb-4 last:mb-0">
                    <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background" />
                    <div className="flex flex-col gap-0.5">
                      <span className="font-semibold text-foreground text-[11px]">{item.role}</span>
                      <div className="flex items-center gap-1 text-[10px] text-primary/80 font-medium">
                        <span>{item.company}</span>
                        <span className="text-muted-foreground/40">•</span>
                        <span>{item.period}</span>
                      </div>
                      <p className="mt-1 leading-snug line-clamp-2">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="text-sm font-bold mb-2">Skills & Expertise</h3>
            <div className="space-y-2">
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
                    className="space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Icon className="h-3 w-3 text-primary" />
                        <span className="font-medium text-[10px]">{skill.name}</span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{skill.level}%</span>
                    </div>
                    <Progress value={skill.level} className="h-1" />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
