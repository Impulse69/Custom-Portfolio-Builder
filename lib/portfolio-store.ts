import { create } from "zustand"
import { persist } from "zustand/middleware"

export interface HeroContent {
  name: string
  title: string
  subtitle: string
  description: string
  availableForWork: boolean
  ctaPrimary: string
  ctaPrimaryEnabled: boolean
  ctaSecondary: string
  ctaSecondaryEnabled: boolean
  avatar: {
    imageUrl?: string
  }
  socialLinks: {
    github: string
    githubEnabled: boolean
    linkedin: string
    linkedinEnabled: boolean
    email: string
    emailEnabled: boolean
    twitter?: string
    twitterEnabled: boolean
  }
}

export interface JourneyItem {
  id: string
  role: string
  company: string
  period: string
  description: string
}

export interface AboutContent {
  title: string
  subtitle: string
  description: string
  journeyItems: JourneyItem[]
  skills: Array<{
    name: string
    level: number
    category: string
  }>
}

export interface ServicesContent {
  title: string
  subtitle: string
  description: string
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
  layout: "grid" | "list"
  projects: Project[]
}

export interface ContactContent {
  title: string
  subtitle: string
  description: string
  email: string
  emailEnabled: boolean
  phone: string
  phoneEnabled: boolean
  location: string
  locationEnabled: boolean
  socialLinks: {
    github: string
    githubEnabled: boolean
    linkedin: string
    linkedinEnabled: boolean
    twitter: string
    twitterEnabled: boolean
  }
}

export interface PortfolioContent {
  hero: HeroContent
  about: AboutContent
  projects: ProjectsContent
  contact: ContactContent
  services: ServicesContent
}

export interface SavedVersion {
  id: string
  name: string
  date: string
  content: PortfolioContent
  selectedSections: string[]
  themeColor: string
}

interface PortfolioStore {
  content: PortfolioContent
  selectedSections: string[]
  editingSection: string | null
  // Undo/redo state
  themeColor: string
  typography: string
  customCss: string
  previewMode: "desktop" | "tablet" | "mobile"
  savedSnapshots: SavedVersion[]
  past: { content: PortfolioContent; selectedSections: string[]; themeColor: string; typography: string }[]
  future: { content: PortfolioContent; selectedSections: string[]; themeColor: string; typography: string }[]
  undo: () => void
  redo: () => void
  canUndo: boolean
  canRedo: boolean
  // Internal helpers for history
  _setHistoryFlags: () => void
  _saveToHistory: () => void
  updateHeroContent: (content: Partial<HeroContent>) => void
  updateAboutContent: (content: Partial<AboutContent>) => void
  updateProjectsContent: (content: Partial<ProjectsContent>) => void
  updateContactContent: (content: Partial<ContactContent>) => void
  updateServicesContent: (content: Partial<ServicesContent>) => void
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (id: string, project: Partial<Project>) => void
  deleteProject: (id: string) => void
  setSelectedSections: (sections: string[]) => void
  setEditingSection: (section: string | null) => void
  setThemeColor: (color: string) => void
  setTypography: (font: string) => void
  setCustomCss: (css: string) => void
  setPreviewMode: (mode: "desktop" | "tablet" | "mobile") => void
  saveSnapshot: (name: string) => void
  loadSnapshot: (id: string) => void
  deleteSnapshot: (id: string) => void
  resetToDefaults: () => void
  reorderSections: (startIndex: number, endIndex: number) => void
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
    ctaPrimaryEnabled: true,
    ctaSecondary: "Download CV",
    ctaSecondaryEnabled: true,
    avatar: {},
    socialLinks: {
      github: "https://github.com/username",
      linkedin: "https://linkedin.com/in/username",
      email: "john@example.com",
      twitter: "https://twitter.com/username",
      githubEnabled: true,
      linkedinEnabled: true,
      emailEnabled: true,
      twitterEnabled: true,
    },
  },
  about: {
    title: "About Me",
    subtitle: "Passionate About Creating Digital Solutions",
    description:
      "With over 5 years of experience in web development, I specialize in creating modern, scalable applications that solve real-world problems. I'm passionate about clean code, user experience, and staying up-to-date with the latest technologies.",
    journeyItems: [
      {
        id: "1",
        role: "Senior Full-Stack Developer",
        company: "Tech Solutions Inc.",
        period: "2021 - Present",
        description: "Leading the development of scalable enterprise applications using Next.js and Node."
      },
      {
        id: "2",
        role: "Frontend Developer",
        company: "Creative Digital Agency",
        period: "2018 - 2021",
        description: "Built responsive, accessible web interfaces for over 20+ global brands."
      },
      {
        id: "3",
        role: "Freelance Web Developer",
        company: "Self-Employed",
        period: "2016 - 2018",
        description: "Started my journey creating custom WordPress and React sites for local businesses."
      }
    ],
    skills: [
      { name: "React/Next.js", level: 95, category: "Frontend" },
      { name: "TypeScript", level: 90, category: "Frontend" },
      { name: "UI/UX Design", level: 85, category: "Design" },
      { name: "Node.js", level: 80, category: "Backend" },
      { name: "Mobile Development", level: 75, category: "Mobile" },
      { name: "DevOps", level: 70, category: "Infrastructure" },
    ],
  },
  services: {
    title: "What I Do",
    subtitle: "My Services",
    description: "I offer a range of services to help you achieve your digital goals.",
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
    layout: "grid",
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
    email: "contact@example.com",
    emailEnabled: true,
    phone: "+1 (123) 456-7890",
    phoneEnabled: true,
    location: "San Francisco, CA",
    locationEnabled: true,
    socialLinks: {
      github: "https://github.com/username",
      linkedin: "https://linkedin.com/in/username",
      twitter: "https://twitter.com/username",
      githubEnabled: true,
      linkedinEnabled: true,
      twitterEnabled: true,
    },
  },
}

export const usePortfolioStore = create<PortfolioStore>()(
  persist(
    (set, get) => ({
      content: defaultContent,
      selectedSections: ["hero"],
      editingSection: null,
      themeColor: "blue",
      typography: "inter",
      customCss: "",
      previewMode: "desktop",
      savedSnapshots: [],
      past: [],
      future: [],
      canUndo: false,
      canRedo: false,
      _setHistoryFlags() {
        const { past, future } = get()
        set({
          canUndo: past.length > 0,
          canRedo: future.length > 0,
        })
      },
      _saveToHistory() {
        const { content, selectedSections, themeColor, typography, past } = get()
        set({
          past: [...past, { content: JSON.parse(JSON.stringify(content)), selectedSections: [...selectedSections], themeColor, typography }],
          future: [],
        })
        get()._setHistoryFlags()
      },
      undo() {
        const { past, future, content, selectedSections, themeColor, typography } = get()
        if (past.length === 0) return
        const previous = past[past.length - 1]
        set({
          past: past.slice(0, -1),
          future: [{ content, selectedSections, themeColor, typography }, ...future],
          content: previous.content,
          selectedSections: previous.selectedSections,
          themeColor: previous.themeColor,
          typography: previous.typography,
        })
        get()._setHistoryFlags()
      },
      redo() {
        const { past, future, content, selectedSections, themeColor, typography } = get()
        if (future.length === 0) return
        const next = future[0]
        set({
          past: [...past, { content, selectedSections, themeColor, typography }],
          future: future.slice(1),
          content: next.content,
          selectedSections: next.selectedSections,
          themeColor: next.themeColor,
          typography: next.typography,
        })
        get()._setHistoryFlags()
      },

      updateHeroContent: (newContent) => {
        get()._saveToHistory()
        set((state) => ({
          content: {
            ...state.content,
            hero: {
              ...state.content.hero,
              ...newContent,
              avatar: {
                ...state.content.hero.avatar,
                ...(newContent.avatar ?? {}),
              },
            },
          },
        }))
      },

      updateAboutContent: (newContent) => {
        get()._saveToHistory()
        set((state) => ({
          content: {
            ...state.content,
            about: { ...state.content.about, ...newContent },
          },
        }))
      },

      updateProjectsContent: (newContent) => {
        get()._saveToHistory()
        set((state) => ({
          content: {
            ...state.content,
            projects: { ...state.content.projects, ...newContent },
          },
        }))
      },

      updateContactContent: (newContent) => {
        get()._saveToHistory()
        set((state) => ({
          content: {
            ...state.content,
            contact: { ...state.content.contact, ...newContent },
          },
        }))
      },

      updateServicesContent: (newContent) => {
        get()._saveToHistory()
        set((state) => ({
          content: {
            ...state.content,
            services: { ...state.content.services, ...newContent },
          },
        }))
      },

      addProject: (project) => {
        get()._saveToHistory()
        set((state) => ({
          content: {
            ...state.content,
            projects: {
              ...state.content.projects,
              projects: [...state.content.projects.projects, { ...project, id: Date.now().toString() }],
            },
          },
        }))
      },

      updateProject: (id, updatedProject) => {
        get()._saveToHistory()
        set((state) => ({
          content: {
            ...state.content,
            projects: {
              ...state.content.projects,
              projects: state.content.projects.projects.map((p) => (p.id === id ? { ...p, ...updatedProject } : p)),
            },
          },
        }))
      },

      deleteProject: (id) => {
        get()._saveToHistory()
        set((state) => ({
          content: {
            ...state.content,
            projects: {
              ...state.content.projects,
              projects: state.content.projects.projects.filter((p) => p.id !== id),
            },
          },
        }))
      },

      setSelectedSections: (sections) => {
        get()._saveToHistory()
        set({ selectedSections: sections })
      },

      reorderSections: (startIndex, endIndex) => {
        const { selectedSections } = get()
        const newOrder = Array.from(selectedSections)
        const [movedSection] = newOrder.splice(startIndex, 1)
        newOrder.splice(endIndex, 0, movedSection)

        get()._saveToHistory()
        set({ selectedSections: newOrder })
      },

      setEditingSection: (section) => set({ editingSection: section }),

      setThemeColor: (color) => {
        get()._saveToHistory()
        set({ themeColor: color })
      },

      setTypography: (font) => {
        get()._saveToHistory()
        set({ typography: font })
      },

      setCustomCss: (css) => set({ customCss: css }),

      setPreviewMode: (mode) => set({ previewMode: mode }),

      saveSnapshot: (name: string) => {
        const { content, selectedSections, themeColor, savedSnapshots } = get()
        const newSnapshot: SavedVersion = {
          id: Date.now().toString(),
          name,
          date: new Date().toISOString(),
          content: JSON.parse(JSON.stringify(content)),
          selectedSections: [...selectedSections],
          themeColor
        }
        set({ savedSnapshots: [...savedSnapshots, newSnapshot] })
      },

      loadSnapshot: (id: string) => {
        const { savedSnapshots } = get()
        const snapshot = savedSnapshots.find(s => s.id === id)
        if (!snapshot) return
        get()._saveToHistory()
        set({
          content: JSON.parse(JSON.stringify(snapshot.content)),
          selectedSections: [...snapshot.selectedSections],
          themeColor: snapshot.themeColor
        })
      },

      deleteSnapshot: (id: string) => {
        const { savedSnapshots } = get()
        set({ savedSnapshots: savedSnapshots.filter(s => s.id !== id) })
      },

      resetToDefaults: () => {
        get()._saveToHistory()
        set({ content: defaultContent, selectedSections: ["hero"], themeColor: "blue", typography: "inter" })
      },
    }),
    {
      name: "portfolio-content",
      partialize: (state) => ({
        content: state.content,
        selectedSections: state.selectedSections,
        editingSection: state.editingSection,
        themeColor: state.themeColor,
        typography: state.typography,
        customCss: state.customCss,
        savedSnapshots: state.savedSnapshots,
      }),
      merge: (persistedState: any, currentState) => {
        const merged = {
          ...currentState,
          ...persistedState,
          content: {
            ...currentState.content,
            ...(persistedState.content || {}),
          },
        }

        // Migration: If 'services' doesn't exist on the root of 'content' in the old state,
        // pull it from 'about.services' if it exists there, otherwise use the default state.
        if (!persistedState.content?.services) {
          if (persistedState.content?.about?.services) {
            merged.content.services = {
              ...currentState.content.services,
              services: persistedState.content.about.services,
            }
          } else {
            merged.content.services = currentState.content.services
          }
        }

        // Migration: Convert old string[] journey to new JourneyItem[]
        if (persistedState.content?.about?.journey && !persistedState.content?.about?.journeyItems) {
          merged.content.about.journeyItems = persistedState.content.about.journey.map((desc: string, i: number) => ({
            id: `legacy-${i}`,
            role: `Role ${i + 1}`,
            company: "Previous Company",
            period: "Past",
            description: desc
          }))
        }

        // Migration: Add layout to Projects
        if (persistedState.content?.projects && !persistedState.content?.projects?.layout) {
          merged.content.projects.layout = "grid"
        }

        // Migration: Add empty snapshots array if missing
        if (!persistedState.savedSnapshots) {
          (merged as any).savedSnapshots = [];
        }

        // Migration: Add default typography
        if (!persistedState.typography) {
          (merged as any).typography = "inter";
        }

        // Migration: Add empty customCss
        if (persistedState.customCss === undefined) {
          (merged as any).customCss = "";
        }

        return merged as PortfolioStore
      },
    },
  ),
)
