import { describe, it, expect } from "vitest"
import {
  generatePortfolioHtml,
  buildPortfolioExport,
  parsePortfolioJson,
} from "@/lib/export-portfolio"
import type { PortfolioContent } from "@/lib/portfolio-store"

const content: PortfolioContent = {
  hero: {
    name: "Isaac Asamoah",
    title: "Full-Stack Developer",
    subtitle: "UI/UX Designer",
    description: 'Crafting <beautiful> & "functional" experiences.',
    availableForWork: true,
    ctaPrimary: "View My Work",
    ctaPrimaryEnabled: true,
    ctaSecondary: "Download CV",
    ctaSecondaryEnabled: true,
    ctaSecondaryHref: "https://example.com/cv.pdf",
    avatar: { type: "initials", initials: "IA" },
    socialLinks: {
      github: "https://github.com/x",
      githubEnabled: true,
      linkedin: "https://linkedin.com/in/x",
      linkedinEnabled: true,
      email: "a@b.com",
      emailEnabled: true,
      twitter: "",
      twitterEnabled: false,
    },
  },
  about: {
    title: "About Me",
    subtitle: "Passionate About Creating",
    description: "desc",
    journey: ["p1", "p2"],
    skills: [
      { name: "React/Next.js", level: 95, category: "Frontend" },
      { name: "UI/UX Design", level: 85, category: "Design" },
    ],
    services: [
      { title: "Frontend", description: "d", icon: "Code" },
      { title: "Design", description: "d", icon: "Palette" },
    ],
  },
  projects: {
    title: "My Work",
    subtitle: "Featured Projects",
    description: "desc",
    projects: [
      {
        id: "1",
        title: "Shop",
        description: "d",
        image: "/placeholder.svg?h=300",
        tags: ["Next.js", "Stripe"],
        liveUrl: "https://a.com",
        githubUrl: "https://github.com/a",
        featured: true,
      },
      {
        id: "2",
        title: "Tasks",
        description: "d",
        image: "https://example.com/img.png",
        tags: [],
        liveUrl: "#",
        githubUrl: "#",
        featured: false,
      },
    ],
  },
  contact: {
    title: "Get In Touch",
    subtitle: "Let's Work Together",
    description: "desc",
    email: "a@b.com",
    emailEnabled: true,
    phone: "+1 (123) 456-7890",
    phoneEnabled: true,
    location: "Accra, Ghana",
    locationEnabled: true,
    socialLinks: {
      github: "https://github.com/x",
      githubEnabled: true,
      linkedin: "",
      linkedinEnabled: false,
      twitter: "",
      twitterEnabled: false,
    },
  },
}

const allSections = ["hero", "about", "projects", "contact"]

describe("generatePortfolioHtml", () => {
  const html = generatePortfolioHtml(content, allSections)

  it("escapes user-provided HTML in content", () => {
    expect(html).toContain("Crafting &lt;beautiful&gt; &amp; &quot;functional&quot;")
    expect(html).not.toContain("Crafting <beautiful>")
  })

  it("renders navigation links for each selected section", () => {
    expect(html).toContain('<a href="#hero">Home</a>')
    expect(html).toContain('<a href="#about">About</a>')
    expect(html).toContain('<a href="#projects">Projects</a>')
    expect(html).toContain('<a href="#contact">Contact</a>')
  })

  it("renders sections in the selected order", () => {
    const reordered = generatePortfolioHtml(content, ["contact", "hero"])
    expect(reordered.indexOf('id="contact"')).toBeLessThan(reordered.indexOf('id="hero"'))
    expect(reordered).not.toContain('id="about"')
  })

  it("renders initials avatar and the CV link", () => {
    expect(html).toContain(">IA</div>")
    expect(html).toContain("https://example.com/cv.pdf")
  })

  it("derives initials from the name when none are set", () => {
    const noInitials = {
      ...content,
      hero: { ...content.hero, avatar: { type: "initials" as const, initials: "" } },
    }
    expect(generatePortfolioHtml(noInitials, ["hero"])).toContain(">IA</div>")
  })

  it("shows initials when the avatar type is initials, even if a photo is stored", () => {
    const photoKept = {
      ...content,
      hero: {
        ...content.hero,
        avatar: { type: "initials" as const, initials: "IA", imageUrl: "https://example.com/me.jpg" },
      },
    }
    const result = generatePortfolioHtml(photoKept, ["hero"])
    expect(result).toContain(">IA</div>")
    expect(result).not.toContain("https://example.com/me.jpg")
  })

  it("replaces local placeholder images and keeps external ones", () => {
    expect(html).toContain("project-image-placeholder")
    expect(html).toContain("https://example.com/img.png")
  })

  it("omits dead '#' project links", () => {
    expect(html).not.toContain('href="#"')
  })

  it("wires the contact form to the configured email", () => {
    expect(html).toContain('data-email="a@b.com"')
  })

  it("omits disabled items", () => {
    expect(html).not.toContain("twitter.com")
  })

  it("defaults to light theme (no automatic dark mode)", () => {
    expect(html).not.toContain("prefers-color-scheme")
  })

  it("ignores unknown section ids", () => {
    const result = generatePortfolioHtml(content, ["hero", "bogus"])
    expect(result).toContain('id="hero"')
    expect(result).not.toContain("bogus")
  })
})

describe("JSON backup", () => {
  it("round-trips content and layout", () => {
    const exported = buildPortfolioExport(content, ["hero", "contact"])
    const parsed = parsePortfolioJson(JSON.stringify(exported))
    expect(parsed.content.hero.name).toBe("Isaac Asamoah")
    expect(parsed.selectedSections).toEqual(["hero", "contact"])
    expect(parsed.version).toBe(1)
  })

  it("rejects files without portfolio content", () => {
    expect(() => parsePortfolioJson('{"foo": 1}')).toThrow()
  })

  it("rejects files without a section layout", () => {
    const exported = buildPortfolioExport(content, ["hero"])
    const broken = { ...exported, selectedSections: undefined }
    expect(() => parsePortfolioJson(JSON.stringify(broken))).toThrow()
  })

  it("rejects non-JSON input", () => {
    expect(() => parsePortfolioJson("not json")).toThrow()
  })
})
