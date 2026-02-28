"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { motion } from "framer-motion"
import { ExternalLink, Github, ArrowRight } from "lucide-react"
import Image from "next/image"
import type { ProjectsContent } from "@/lib/portfolio-store"

interface ProjectsSectionProps {
  content: ProjectsContent
}

export function ProjectsSection({ content }: ProjectsSectionProps) {
  const featuredProjects = content.projects.filter((p) => p.featured)
  const otherProjects = content.projects.filter((p) => !p.featured)

  return (
    <section id="projects" className="py-4 flex flex-col justify-center min-h-full scroll-mt-16 overflow-hidden">
      <div className="container px-4 mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-2"
        >
          <Badge variant="outline" className="mb-1 text-[10px] py-0 h-4">
            {content.title}
          </Badge>
          <h2 className="text-base md:text-lg font-bold mb-1">
            {content.subtitle.split(" ").map((word, index) => {
              const isHighlighted = word.toLowerCase().includes("featured") || word.toLowerCase().includes("projects")
              return (
                <span key={index} className={isHighlighted ? "text-primary" : ""}>
                  {word}
                  {index < content.subtitle.split(" ").length - 1 && " "}
                </span>
              )
            })}
          </h2>
          <p className="text-[10px] md:text-xs text-muted-foreground max-w-2xl mx-auto line-clamp-2 leading-tight">{content.description}</p>
        </motion.div>

        {/* Featured Projects */}
        {featuredProjects.length > 0 && (
          <div className={content.layout === "list" ? "flex flex-col gap-2 relative z-10" : "grid md:grid-cols-2 gap-2 relative z-10"}>
            {featuredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2, duration: 0.8 }}
              >
                <Card className={`group overflow-hidden hover:shadow-xl transition-all duration-300 ${content.layout === "list" ? "flex flex-row h-24 sm:h-28" : ""}`}>
                  {content.layout === "grid" ? (
                    <div className="relative overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={400}
                        height={200}
                        className="w-full h-20 sm:h-24 object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                        <Button size="sm" variant="secondary" className="h-6 text-[10px] px-2" asChild>
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            Live Demo
                          </a>
                        </Button>
                        <Button size="sm" variant="secondary" className="h-6 text-[10px] px-2" asChild>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                            <Github className="h-3 w-3 mr-1" />
                            Code
                          </a>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="w-1/3 relative overflow-hidden shrink-0">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        width={400}
                        height={200}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                  )}
                  <CardContent className={`p-2 flex flex-col justify-center ${content.layout === "list" ? "w-2/3" : ""}`}>
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xs font-bold mb-1 line-clamp-1">{project.title}</h3>
                        <p className="text-[10px] text-muted-foreground mb-1 line-clamp-2 leading-tight">{project.description}</p>
                      </div>
                      {content.layout === "list" && (
                        <div className="flex gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity shrink-0">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="p-1 bg-secondary rounded-md text-secondary-foreground hover:bg-secondary/80">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="p-1 bg-secondary rounded-md text-secondary-foreground hover:bg-secondary/80">
                            <Github className="h-3 w-3" />
                          </a>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-auto">
                      {project.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-[8px] px-1 py-0 h-3">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}

        {/* Other Projects Compact Grid */}
        {otherProjects.length > 0 && (
          <div className="mt-2">
            {featuredProjects.length > 0 && (
              <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider mb-2 px-1">More Projects</p>
            )}
            <div className="grid grid-cols-3 gap-2">
              {otherProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                >
                  <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
                    <CardContent className="p-2">
                      <h3 className="text-[10px] font-bold mb-1 line-clamp-1">{project.title}</h3>
                      <p className="text-[9px] text-muted-foreground mb-1 line-clamp-2 leading-tight">{project.description}</p>
                      <div className="flex items-center justify-between mt-1">
                        <div className="flex flex-wrap gap-1">
                          {project.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-[8px] px-1 py-0 h-3">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {project.githubUrl && (
                            <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                              <Github className="h-3 w-3" />
                            </a>
                          )}
                          {project.liveUrl && (
                            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                              <ExternalLink className="h-3 w-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
