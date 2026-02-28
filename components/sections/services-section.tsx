"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Code, Palette, Smartphone, Database, Globe, Zap } from "lucide-react"
import type { ServicesContent } from "@/lib/portfolio-store"

interface ServicesSectionProps {
    content: ServicesContent
}

const iconMap = {
    Code,
    Palette,
    Smartphone,
    Database,
    Globe,
    Zap,
}

export function ServicesSection({ content }: ServicesSectionProps) {
    return (
        <section id="services" className="py-8 bg-muted/30 scroll-mt-16 overflow-hidden flex flex-col justify-center min-h-full">
            <div className="container px-4 mx-auto max-w-4xl">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-6"
                >
                    <Badge variant="outline" className="mb-2 text-[10px] py-0 h-5">
                        {content.title}
                    </Badge>
                    <h2 className="text-xl md:text-2xl font-bold mb-2">
                        {content.subtitle}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-2xl mx-auto line-clamp-2">{content.description}</p>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
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
                                    <CardContent className="p-4 text-center">
                                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-3">
                                            <Icon className="h-5 w-5 text-primary" />
                                        </div>
                                        <h4 className="font-semibold text-sm mb-1">{service.title}</h4>
                                        <p className="text-xs text-muted-foreground line-clamp-3">{service.description}</p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )
                    })}
                </div>
            </div>
        </section>
    )
}
