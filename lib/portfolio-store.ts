import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface HeroContent {
  name: string
  title: string
  subtitle: string
  description: string
  availableForWork: boolean
  ctaPrimary: string
  ctaSecondary: string
  avatar: string
  socialLinks: {
    github: string
    linkedin: string
    email: string
    twitter?: string
  }
}

export interface AboutContent {
  title: string
  subtitle: string
  description: string
  journey: string[]
  skills: Array<{
    name: string
    level: number
    category: string
  }>
  services: Array<{
    title: string
    description: string
    icon: string
  }>
}

export interface Project {
  id: string
  title: string
  description: string
  image: string
  tags: string[]
  liveUrl: string
  githubUrl: string
  featured: boolean
}

export interface ProjectsContent {
  title: string
  subtitle: string
  description: string
  projects: Project[]
}

export interface ContactContent {
  title: string
  subtitle: string
  description: string
  email: string
  phone: string
  location: string
  socialLinks: {
    github: string
    linkedin: string
    twitter: string
  }
  formEnabled: boolean
}

export interface PortfolioContent {
  hero: HeroContent
  about: AboutContent
  projects: ProjectsContent
  contact: ContactContent
}

interface PortfolioStore {
  content: PortfolioContent
  selectedSections: string[]
  editingSection: string | null
  updateHeroContent: (content: Partial<HeroContent>) => void
  updateAboutContent: (content: Partial<AboutContent>) => void
  updateProjectsContent: (content: Partial<ProjectsContent>) => void
  updateContactContent: (content: Partial<ContactContent>) => void
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  setSelectedSections: (sections: string[]) => void
  setEditingSection: (section: string | null) => void
  resetToDefaults: () => void
}

const defaultContent: PortfolioContent = {
  hero: {
    name: "John Doe",
    title: "Full-Stack Developer",
    subtitle: "UI/UX Designer",
    description:
      "Full-Stack Developer & UI/UX Designer crafting beautiful, functional digital experiences with modern technologies.",
    availableForWork: true,
    ctaPrimary: "View My Work",
    ctaSecondary: "Download CV",
    avatar: "JD",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      email: "john.doe@example.com",
      twitter: "https://twitter.com",
    },
  },
  about: {
    title: "About Me",
    subtitle: "Passionate About Creating Digital Solutions",
    description:
      "With over 5 years of experience in web development, I specialize in creating modern, scalable applications that solve real-world problems. I'm passionate about clean code, user experience, and staying up-to-date with the latest technologies.",
    journey: [
      "I started my journey in web development during college, where I discovered my passion for creating digital experiences. What began as curiosity about how websites work evolved into a career focused on building exceptional user interfaces and robust backend systems.",
      "Today, I work with startups and established companies to bring their digital visions to life. I believe in the power of technology to solve problems and create meaningful connections between businesses and their users.",
      "When I'm not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community through blog posts and mentoring.",
    ],
    skills: [
      { name: "React/Next.js", level: 95, category: "Frontend" },
      { name: "TypeScript", level: 90, category: "Frontend" },
      { name: "UI/UX Design", level: 85, category: "Design" },
      { name: "Node.js", level: 80, category: "Backend" },
      { name: "Mobile Development", level: 75, category: "Mobile" },
      { name: "DevOps", level: 70, category: "Infrastructure" },
    ],
    services: [
      {
        title: "Frontend Development",
        description: "Building responsive, performant web applications with modern frameworks and best practices.",
        icon: "Code",
      },
      {
        title: "Backend Development",
        description: "Creating robust APIs and server-side solutions with scalable architecture.",
        icon: "Database",
      },
      {
        title: "UI/UX Design",
        description: "Designing intuitive user interfaces and experiences that delight users.",
        icon: "Palette",
      },
      {
        title: "Performance Optimization",
        description: "Optimizing applications for speed, accessibility, and search engine visibility.",
        icon: "Zap",
      },
    ],
  },
  projects: {
    title: "My Work",
    subtitle: "Featured Projects",
    description:
      "Here are some of my recent projects that showcase my skills in full-stack development, UI/UX design, and problem-solving.",
    projects: [
      {
        id: "1",
        title: "E-Commerce Platform",
        description:
          "A full-stack e-commerce solution built with Next.js, featuring user authentication, payment processing, and admin dashboard.",
        image: "/placeholder.svg?height=300&width=500",
        tags: ["Next.js", "TypeScript", "Stripe", "Prisma"],
        liveUrl: "#",
        githubUrl: "#",
        featured: true,
      },
      {
        id: "2",
        title: "Task Management App",
        description:
          "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
        image: "/placeholder.svg?height=300&width=500",
        tags: ["React", "Node.js", "Socket.io", "MongoDB"],
        liveUrl: "#",
        githubUrl: "#",
        featured: true,
      },
      {
        id: "3",
        title: "Weather Dashboard",
        description:
          "A responsive weather dashboard with location-based forecasts, interactive maps, and historical weather data visualization.",
        image: "/placeholder.svg?height=300&width=500",
        tags: ["Vue.js", "Chart.js", "Weather API", "Tailwind"],
        liveUrl: "#",
        githubUrl: "#",
        featured: false,
      },
    ],
  },
  contact: {
    title: "Get In Touch",
    subtitle: "Let's Work Together",
    description:
      "I'm always interested in new opportunities and exciting projects. Whether you have a question or just want to say hi, feel free to reach out!",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    location: "San Francisco, CA",
    socialLinks: {
      github: "https://github.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter.com",
    },
    formEnabled: true,
  },
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      content: defaultContent,
      selectedSections: ["hero"],
      editingSection: null,

      updateHeroContent: (newContent) =>
        set((state) => ({
          content: {
            ...state.content,
            hero: { ...state.content.hero, ...newContent },
          },
        })),

      updateAboutContent: (newContent) =>
        set((state) => ({
          content: {
            ...state.content,
            about: { ...state.content.about, ...newContent },
          },
        })),

      updateProjectsContent: (newContent) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: { ...state.content.projects, ...newContent },
          },
        })),

      updateContactContent: (newContent) =>
        set((state) => ({
          content: {
            ...state.content,
            contact: { ...state.content.contact, ...newContent },
          },
        })),

      addProject: (project) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: {
              ...state.content.projects,
              projects: [...state.content.projects.projects, { ...project, id: Date.now().toString() }],
            },
          },
        })),

      updateProject: (id, updatedProject) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: {
              ...state.content.projects,
              projects: state.content.projects.projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)),
            },
          },
        })),

      deleteProject: (id) =>
        set((state) => ({
          content: {
            ...state.content,
            projects: {
              ...state.content.projects,
              projects: state.content.projects.projects.filter((p) => p.id !== id),
            },
          },
        })),

      setSelectedSections: (sections) => set({ selectedSections: sections }),

      setEditingSection: (section) => set({ editingSection: section }),

      resetToDefaults: () => set({ content: defaultContent }),
    }),
    {
      name: "portfolio-content",
    },
  ),
)
