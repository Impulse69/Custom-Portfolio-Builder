export type SectionType = "hero" | "about" | "projects" | "contact"

export interface Project {
  id: number
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

export interface Skill {
  name: string
  level: number
  icon: any
}

export interface Service {
  icon: any
  title: string
  description: string
}

export interface ContactInfo {
  icon: any
  label: string
  value: string
  href: string
}

export interface SocialLink {
  icon: any
  label: string
  href: string
  username: string
}
