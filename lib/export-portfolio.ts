import type { PortfolioContent, HeroContent, AboutContent, ProjectsContent, ContactContent } from "@/lib/portfolio-store"

export interface PortfolioExport {
  version: 1
  exportedAt: string
  selectedSections: string[]
  content: PortfolioContent
}

const SECTION_ORDER = ["hero", "about", "projects", "contact"] as const
type ExportSection = (typeof SECTION_ORDER)[number]

function esc(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
}

// Lucide-style inline SVG icons so the exported file has no external dependencies
const ICON_PATHS: Record<string, string> = {
  github:
    '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
  linkedin:
    '<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/>',
  mail: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
  twitter:
    '<path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/>',
  phone:
    '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
  mappin: '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/>',
  external: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
  arrowright: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  download:
    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
  send: '<path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>',
  moon: '<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>',
  Code: '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
  Database: '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5V19A9 3 0 0 0 21 19V5"/><path d="M3 12A9 3 0 0 0 21 12"/>',
  Palette:
    '<circle cx="13.5" cy="6.5" r=".5"/><circle cx="17.5" cy="10.5" r=".5"/><circle cx="8.5" cy="7.5" r=".5"/><circle cx="6.5" cy="12.5" r=".5"/><path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>',
  Zap: '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  Globe: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
  Smartphone: '<rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/>',
}

function icon(name: string, size = 18): string {
  const paths = ICON_PATHS[name] || ICON_PATHS.Code
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`
}

function skillIconName(skillName: string): string {
  if (skillName.includes("Design")) return "Palette"
  if (skillName.includes("Mobile")) return "Smartphone"
  if (skillName.includes("Node")) return "Database"
  if (skillName.includes("DevOps")) return "Globe"
  return "Code"
}

function highlightLastWords(text: string): string {
  const words = text.split(" ")
  if (words.length < 2) return esc(text)
  return words
    .map((word, index) => (index === 0 ? esc(word) : `<span class="accent">${esc(word)}</span>`))
    .join(" ")
}

function projectImage(image: string, title: string): string {
  const isLocalPlaceholder = !image || image.startsWith("/")
  if (isLocalPlaceholder) {
    return `<div class="project-image project-image-placeholder"><span>${esc(title.charAt(0).toUpperCase() || "P")}</span></div>`
  }
  return `<img class="project-image" src="${esc(image)}" alt="${esc(title)}" loading="lazy" />`
}

function initialsFromName(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

function renderHero(hero: HeroContent, hasProjects: boolean, hasContact: boolean): string {
  const avatar =
    hero.avatar.type === "image" && hero.avatar.imageUrl
      ? `<img class="avatar" src="${esc(hero.avatar.imageUrl)}" alt="${esc(hero.name)}" />`
      : `<div class="avatar avatar-initials">${esc(hero.avatar.initials || initialsFromName(hero.name))}</div>`

  const primaryTarget = hasProjects ? "#projects" : hasContact ? "#contact" : "#hero"
  const ctas: string[] = []
  if (hero.ctaPrimaryEnabled) {
    ctas.push(`<a class="btn btn-primary" href="${primaryTarget}">${esc(hero.ctaPrimary)} ${icon("arrowright", 16)}</a>`)
  }
  if (hero.ctaSecondaryEnabled) {
    const href = hero.ctaSecondaryHref?.trim()
    ctas.push(
      href
        ? `<a class="btn btn-outline" href="${esc(href)}" target="_blank" rel="noopener noreferrer">${icon("download", 16)} ${esc(hero.ctaSecondary)}</a>`
        : `<span class="btn btn-outline">${icon("download", 16)} ${esc(hero.ctaSecondary)}</span>`,
    )
  }

  const socials: string[] = []
  if (hero.socialLinks.githubEnabled && hero.socialLinks.github)
    socials.push(`<a class="social-btn" href="${esc(hero.socialLinks.github)}" target="_blank" rel="noopener noreferrer" aria-label="GitHub">${icon("github")}</a>`)
  if (hero.socialLinks.linkedinEnabled && hero.socialLinks.linkedin)
    socials.push(`<a class="social-btn" href="${esc(hero.socialLinks.linkedin)}" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">${icon("linkedin")}</a>`)
  if (hero.socialLinks.emailEnabled && hero.socialLinks.email)
    socials.push(`<a class="social-btn" href="mailto:${esc(hero.socialLinks.email)}" aria-label="Email">${icon("mail")}</a>`)
  if (hero.socialLinks.twitterEnabled && hero.socialLinks.twitter)
    socials.push(`<a class="social-btn" href="${esc(hero.socialLinks.twitter)}" target="_blank" rel="noopener noreferrer" aria-label="Twitter">${icon("twitter")}</a>`)

  return `
  <section id="hero" class="hero">
    <div class="container hero-inner">
      ${avatar}
      ${hero.availableForWork ? '<span class="badge badge-secondary">Available for work</span>' : ""}
      <h1>${highlightLastWords(hero.name)}</h1>
      <p class="hero-title">${esc(hero.title)}${hero.subtitle ? ` &amp; ${esc(hero.subtitle)}` : ""}</p>
      <p class="hero-description">${esc(hero.description)}</p>
      ${ctas.length ? `<div class="hero-ctas">${ctas.join("\n      ")}</div>` : ""}
      ${socials.length ? `<div class="hero-socials">${socials.join("\n      ")}</div>` : ""}
    </div>
  </section>`
}

function renderAbout(about: AboutContent): string {
  const journey = about.journey.map((p) => `<p>${esc(p)}</p>`).join("\n          ")
  const skills = about.skills
    .map(
      (skill) => `
          <div class="skill">
            <div class="skill-header">
              <span class="skill-name">${icon(skillIconName(skill.name), 14)} ${esc(skill.name)}</span>
              <span class="skill-level">${skill.level}%</span>
            </div>
            <div class="progress"><div class="progress-bar" style="width:${Math.max(0, Math.min(100, skill.level))}%"></div></div>
          </div>`,
    )
    .join("")
  const services = about.services
    .map(
      (service) => `
          <div class="card service-card">
            <div class="service-icon">${icon(service.icon, 22)}</div>
            <h4>${esc(service.title)}</h4>
            <p>${esc(service.description)}</p>
          </div>`,
    )
    .join("")

  return `
  <section id="about" class="section section-muted">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-outline">${esc(about.title)}</span>
        <h2>${esc(about.subtitle)}</h2>
        <p>${esc(about.description)}</p>
      </div>
      <div class="about-grid">
        <div>
          <h3>My Journey</h3>
          <div class="journey">${journey}</div>
        </div>
        <div>
          <h3>Skills &amp; Expertise</h3>
          ${skills}
        </div>
      </div>
      ${
        about.services.length
          ? `<h3 class="centered-heading">What I Do</h3>
      <div class="services-grid">${services}</div>`
          : ""
      }
    </div>
  </section>`
}

function renderProjects(projects: ProjectsContent): string {
  const renderLinks = (liveUrl: string, githubUrl: string) => {
    const links: string[] = []
    if (liveUrl && liveUrl !== "#")
      links.push(`<a class="btn btn-outline btn-sm" href="${esc(liveUrl)}" target="_blank" rel="noopener noreferrer">${icon("external", 14)} Live Demo</a>`)
    if (githubUrl && githubUrl !== "#")
      links.push(`<a class="btn btn-outline btn-sm" href="${esc(githubUrl)}" target="_blank" rel="noopener noreferrer">${icon("github", 14)} Code</a>`)
    return links.join("\n            ")
  }

  const renderCard = (project: ProjectsContent["projects"][number]) => `
        <div class="card project-card">
          ${projectImage(project.image, project.title)}
          <div class="project-body">
            <h3>${esc(project.title)}</h3>
            <p>${esc(project.description)}</p>
            ${project.tags.length ? `<div class="tags">${project.tags.map((tag) => `<span class="badge badge-secondary">${esc(tag)}</span>`).join("")}</div>` : ""}
            ${renderLinks(project.liveUrl, project.githubUrl) ? `<div class="project-links">${renderLinks(project.liveUrl, project.githubUrl)}</div>` : ""}
          </div>
        </div>`

  const featured = projects.projects.filter((p) => p.featured)
  const others = projects.projects.filter((p) => !p.featured)

  return `
  <section id="projects" class="section">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-outline">${esc(projects.title)}</span>
        <h2>${esc(projects.subtitle)}</h2>
        <p>${esc(projects.description)}</p>
      </div>
      ${featured.length ? `<div class="projects-grid projects-grid-featured">${featured.map(renderCard).join("")}</div>` : ""}
      ${
        others.length
          ? `<h3 class="centered-heading">Other Notable Projects</h3>
      <div class="projects-grid">${others.map(renderCard).join("")}</div>`
          : ""
      }
    </div>
  </section>`
}

function renderContact(contact: ContactContent): string {
  const infoItems: string[] = []
  if (contact.emailEnabled && contact.email)
    infoItems.push(`
          <a class="card info-card" href="mailto:${esc(contact.email)}">
            <span class="info-icon">${icon("mail")}</span>
            <span><strong>Email</strong><br />${esc(contact.email)}</span>
          </a>`)
  if (contact.phoneEnabled && contact.phone)
    infoItems.push(`
          <a class="card info-card" href="tel:${esc(contact.phone.replace(/[^+\d]/g, ""))}">
            <span class="info-icon">${icon("phone")}</span>
            <span><strong>Phone</strong><br />${esc(contact.phone)}</span>
          </a>`)
  if (contact.locationEnabled && contact.location)
    infoItems.push(`
          <div class="card info-card">
            <span class="info-icon">${icon("mappin")}</span>
            <span><strong>Location</strong><br />${esc(contact.location)}</span>
          </div>`)

  const socialItems: string[] = []
  if (contact.socialLinks.githubEnabled && contact.socialLinks.github)
    socialItems.push(`
          <a class="card info-card" href="${esc(contact.socialLinks.github)}" target="_blank" rel="noopener noreferrer">
            <span class="info-icon">${icon("github")}</span>
            <span><strong>GitHub</strong></span>
          </a>`)
  if (contact.socialLinks.linkedinEnabled && contact.socialLinks.linkedin)
    socialItems.push(`
          <a class="card info-card" href="${esc(contact.socialLinks.linkedin)}" target="_blank" rel="noopener noreferrer">
            <span class="info-icon">${icon("linkedin")}</span>
            <span><strong>LinkedIn</strong></span>
          </a>`)
  if (contact.socialLinks.twitterEnabled && contact.socialLinks.twitter)
    socialItems.push(`
          <a class="card info-card" href="${esc(contact.socialLinks.twitter)}" target="_blank" rel="noopener noreferrer">
            <span class="info-icon">${icon("twitter")}</span>
            <span><strong>Twitter</strong></span>
          </a>`)

  const form =
    contact.emailEnabled && contact.email
      ? `
        <div class="card form-card">
          <h3>Send me a message</h3>
          <form id="contact-form" data-email="${esc(contact.email)}">
            <div class="form-row">
              <label>Name<input name="name" type="text" required placeholder="Your name" /></label>
              <label>Email<input name="email" type="email" required placeholder="your.email@example.com" /></label>
            </div>
            <label>Subject<input name="subject" type="text" required placeholder="What's this about?" /></label>
            <label>Message<textarea name="message" rows="6" required placeholder="Tell me about your project..."></textarea></label>
            <button type="submit" class="btn btn-primary btn-block">${icon("send", 16)} Send Message</button>
          </form>
        </div>`
      : ""

  return `
  <section id="contact" class="section section-muted">
    <div class="container">
      <div class="section-header">
        <span class="badge badge-outline">${esc(contact.title)}</span>
        <h2>${esc(contact.subtitle)}</h2>
        <p>${esc(contact.description)}</p>
      </div>
      <div class="contact-grid${form ? "" : " contact-grid-single"}">
        ${form}
        <div class="contact-info">
          ${infoItems.length ? `<h3>Contact Information</h3>${infoItems.join("")}` : ""}
          ${socialItems.length ? `<h3>Follow Me</h3>${socialItems.join("")}` : ""}
        </div>
      </div>
    </div>
  </section>`
}

const NAV_LABELS: Record<ExportSection, string> = {
  hero: "Home",
  about: "About",
  projects: "Projects",
  contact: "Contact",
}

const STYLES = `
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{--bg:hsl(0 0% 100%);--fg:hsl(222 84% 4.9%);--card:hsl(0 0% 100%);--muted:hsl(210 40% 96%);--muted-fg:hsl(215 16% 47%);--primary:hsl(221 83% 53%);--primary-fg:hsl(210 40% 98%);--border:hsl(214 32% 91%);--radius:0.75rem;--shadow:0 4px 16px rgb(0 0 0 / 0.08)}
[data-theme="dark"]{--bg:hsl(222 84% 4.9%);--fg:hsl(210 40% 98%);--card:hsl(222 47% 8%);--muted:hsl(217 33% 17.5%);--muted-fg:hsl(215 20% 65%);--primary:hsl(217 91% 60%);--primary-fg:hsl(222 84% 4.9%);--border:hsl(217 33% 17.5%);--shadow:0 4px 16px rgb(0 0 0 / 0.4)}
html{scroll-behavior:smooth}
body{font-family:system-ui,-apple-system,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background:var(--bg);color:var(--fg);line-height:1.6;transition:background-color .3s,color .3s}
svg{vertical-align:middle;flex-shrink:0}
.container{max-width:72rem;margin:0 auto;padding:0 1.5rem}
nav{position:fixed;top:0;left:0;right:0;z-index:50;background:color-mix(in srgb,var(--bg) 85%,transparent);backdrop-filter:blur(8px);border-bottom:1px solid var(--border)}
.nav-inner{display:flex;align-items:center;justify-content:space-between;height:4rem}
.nav-brand{font-weight:700;text-decoration:none;color:var(--fg)}
.nav-links{display:flex;gap:.25rem;align-items:center}
.nav-links a{color:var(--muted-fg);text-decoration:none;padding:.5rem .75rem;border-radius:.5rem;font-size:.9rem;transition:color .2s,background-color .2s}
.nav-links a:hover,.nav-links a.active{color:var(--fg);background:var(--muted)}
.theme-toggle{background:none;border:none;color:var(--fg);cursor:pointer;padding:.5rem;border-radius:.5rem;display:flex}
.theme-toggle:hover{background:var(--muted)}
.theme-toggle .icon-sun{display:none}
[data-theme="dark"] .theme-toggle .icon-sun{display:block}
[data-theme="dark"] .theme-toggle .icon-moon{display:none}
.menu-btn{display:none;background:none;border:none;color:var(--fg);cursor:pointer;font-size:1.5rem;padding:.25rem .5rem}
.section{padding:5rem 0;scroll-margin-top:4rem}
.section-muted{background:color-mix(in srgb,var(--muted) 40%,var(--bg))}
.section-header{text-align:center;max-width:48rem;margin:0 auto 4rem}
.section-header h2{font-size:clamp(1.875rem,4vw,2.5rem);margin:1rem 0}
.section-header p{color:var(--muted-fg);font-size:1.1rem}
.badge{display:inline-flex;align-items:center;padding:.2rem .8rem;border-radius:9999px;font-size:.78rem;font-weight:600}
.badge-outline{border:1px solid var(--border);color:var(--fg)}
.badge-secondary{background:var(--muted);color:var(--fg)}
.accent{color:var(--primary)}
.btn{display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.5rem;border-radius:.5rem;font-weight:600;font-size:.95rem;text-decoration:none;cursor:pointer;border:1px solid transparent;transition:opacity .2s,background-color .2s}
.btn-primary{background:var(--primary);color:var(--primary-fg)}
.btn-primary:hover{opacity:.9}
.btn-outline{border-color:var(--border);color:var(--fg);background:transparent}
.btn-outline:hover{background:var(--muted)}
.btn-sm{padding:.4rem .8rem;font-size:.82rem}
.btn-block{width:100%;justify-content:center;border:none;font-family:inherit}
.hero{min-height:100vh;display:flex;align-items:center;justify-content:center;background:radial-gradient(circle at 50% 40%,color-mix(in srgb,var(--primary) 6%,transparent),transparent 60%)}
.hero-inner{text-align:center;display:flex;flex-direction:column;align-items:center;gap:1.25rem;padding:6rem 1.5rem 4rem}
.avatar{width:12rem;height:12rem;border-radius:9999px;object-fit:cover}
.avatar-initials{display:flex;align-items:center;justify-content:center;font-size:3.5rem;font-weight:700;background:linear-gradient(135deg,var(--primary),color-mix(in srgb,var(--primary) 60%,transparent));color:var(--primary-fg)}
.hero h1{font-size:clamp(2.5rem,7vw,4.5rem);letter-spacing:-.02em;line-height:1.1}
.hero-title{font-size:clamp(1.25rem,3vw,1.875rem);font-weight:600;color:var(--muted-fg)}
.hero-description{font-size:1.15rem;color:var(--muted-fg);max-width:46rem}
.hero-ctas{display:flex;gap:1rem;flex-wrap:wrap;justify-content:center}
.hero-socials{display:flex;gap:.75rem;padding-top:1rem}
.social-btn{display:flex;align-items:center;justify-content:center;width:3rem;height:3rem;border-radius:9999px;color:var(--fg);transition:background-color .2s,color .2s}
.social-btn:hover{background:var(--primary);color:var(--primary-fg)}
.about-grid{display:grid;gap:3rem;margin-bottom:4rem}
.about-grid h3,.contact-info h3,.form-card h3{font-size:1.5rem;margin-bottom:1.5rem}
.journey p{color:var(--muted-fg);margin-bottom:1rem}
.skill{margin-bottom:1.1rem}
.skill-header{display:flex;justify-content:space-between;margin-bottom:.4rem}
.skill-name{display:inline-flex;align-items:center;gap:.5rem;font-weight:500}
.skill-name svg{color:var(--primary)}
.skill-level{color:var(--muted-fg);font-size:.9rem}
.progress{height:.5rem;background:var(--muted);border-radius:9999px;overflow:hidden}
.progress-bar{height:100%;background:var(--primary);border-radius:9999px}
.centered-heading{text-align:center;font-size:1.5rem;margin:3rem 0}
.card{background:var(--card);border:1px solid var(--border);border-radius:var(--radius);transition:box-shadow .2s}
.card:hover{box-shadow:var(--shadow)}
.services-grid{display:grid;gap:1.5rem}
.service-card{padding:1.5rem;text-align:center}
.service-icon{display:flex;align-items:center;justify-content:center;width:3rem;height:3rem;margin:0 auto 1rem;border-radius:.5rem;background:color-mix(in srgb,var(--primary) 10%,transparent);color:var(--primary)}
.service-card h4{margin-bottom:.5rem}
.service-card p{font-size:.9rem;color:var(--muted-fg)}
.projects-grid{display:grid;gap:1.5rem;margin-bottom:2rem}
.project-card{overflow:hidden;display:flex;flex-direction:column}
.project-image{width:100%;height:14rem;object-fit:cover;display:block}
.project-image-placeholder{display:flex;align-items:center;justify-content:center;font-size:3rem;font-weight:700;background:linear-gradient(135deg,color-mix(in srgb,var(--primary) 25%,transparent),color-mix(in srgb,var(--primary) 8%,transparent));color:var(--primary)}
.project-body{padding:1.5rem;display:flex;flex-direction:column;gap:.75rem;flex:1}
.project-body p{color:var(--muted-fg);flex:1}
.tags{display:flex;flex-wrap:wrap;gap:.4rem}
.project-links{display:flex;gap:.5rem}
.contact-grid{display:grid;gap:3rem}
.contact-grid-single{max-width:36rem;margin:0 auto}
.form-card{padding:1.75rem}
.form-card label{display:block;font-weight:500;font-size:.9rem;margin-bottom:1rem}
.form-card input,.form-card textarea{display:block;width:100%;margin-top:.4rem;padding:.6rem .8rem;border:1px solid var(--border);border-radius:.5rem;background:var(--bg);color:var(--fg);font-family:inherit;font-size:.95rem}
.form-card input:focus,.form-card textarea:focus{outline:2px solid var(--primary);outline-offset:1px}
.form-row{display:grid;gap:0 1rem}
.info-card{display:flex;align-items:center;gap:1rem;padding:1rem 1.25rem;margin-bottom:1rem;text-decoration:none;color:var(--fg)}
.info-card strong{font-size:.95rem}
.info-card span:last-child{color:var(--muted-fg);font-size:.9rem}
.info-card span:last-child strong{color:var(--fg)}
.info-icon{display:flex;align-items:center;justify-content:center;width:3rem;height:3rem;border-radius:.5rem;background:color-mix(in srgb,var(--primary) 10%,transparent);color:var(--primary)}
.contact-info h3:not(:first-child){margin-top:2rem}
footer{border-top:1px solid var(--border);padding:2rem 0;text-align:center;color:var(--muted-fg);font-size:.9rem}
.scroll-top{position:fixed;bottom:1.5rem;right:1.5rem;z-index:40;width:3rem;height:3rem;border-radius:9999px;border:none;background:var(--primary);color:var(--primary-fg);cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:var(--shadow)}
.scroll-top.visible{display:flex}
@media (min-width:768px){
.form-row{grid-template-columns:1fr 1fr}
.services-grid{grid-template-columns:repeat(2,1fr)}
.projects-grid{grid-template-columns:repeat(3,1fr)}
.projects-grid-featured{grid-template-columns:repeat(2,1fr)}
.about-grid{grid-template-columns:1fr 1fr}
.contact-grid{grid-template-columns:1fr 1fr}
.contact-grid-single{grid-template-columns:1fr}
}
@media (min-width:1024px){
.services-grid{grid-template-columns:repeat(4,1fr)}
}
@media (max-width:767px){
.nav-links{display:none;position:absolute;top:4rem;left:0;right:0;flex-direction:column;align-items:stretch;background:var(--bg);border-bottom:1px solid var(--border);padding:1rem}
.nav-links.open{display:flex}
.menu-btn{display:block}
}
`

const SCRIPT = `
(function(){
  var root=document.documentElement;
  var stored=null;
  try{stored=localStorage.getItem('portfolio-theme')}catch(e){}
  if(stored==='dark'){root.setAttribute('data-theme','dark')}
  var toggle=document.getElementById('theme-toggle');
  if(toggle){toggle.addEventListener('click',function(){
    var dark=root.getAttribute('data-theme')==='dark';
    if(dark){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme','dark')}
    try{localStorage.setItem('portfolio-theme',dark?'light':'dark')}catch(e){}
  })}
  var menuBtn=document.getElementById('menu-btn');
  var navLinks=document.getElementById('nav-links');
  if(menuBtn&&navLinks){
    menuBtn.addEventListener('click',function(){navLinks.classList.toggle('open')});
    navLinks.addEventListener('click',function(){navLinks.classList.remove('open')});
  }
  var scrollTop=document.getElementById('scroll-top');
  var links=document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll',function(){
    if(scrollTop){scrollTop.classList.toggle('visible',window.scrollY>300)}
    var current='';
    document.querySelectorAll('section[id]').forEach(function(s){
      if(s.getBoundingClientRect().top<=100){current=s.id}
    });
    links.forEach(function(l){l.classList.toggle('active',l.getAttribute('href')==='#'+current)});
  });
  if(scrollTop){scrollTop.addEventListener('click',function(){window.scrollTo({top:0,behavior:'smooth'})})}
  var form=document.getElementById('contact-form');
  if(form){form.addEventListener('submit',function(e){
    e.preventDefault();
    var data=new FormData(form);
    var subject=encodeURIComponent(data.get('subject')||'');
    var body=encodeURIComponent('Name: '+(data.get('name')||'')+'\\nEmail: '+(data.get('email')||'')+'\\n\\n'+(data.get('message')||''));
    window.location.href='mailto:'+form.getAttribute('data-email')+'?subject='+subject+'&body='+body;
  })}
})();
`

export function generatePortfolioHtml(content: PortfolioContent, selectedSections: string[]): string {
  const sections = selectedSections.filter((s): s is ExportSection => (SECTION_ORDER as readonly string[]).includes(s))
  const hasProjects = sections.includes("projects")
  const hasContact = sections.includes("contact")

  const body = sections
    .map((section) => {
      switch (section) {
        case "hero":
          return renderHero(content.hero, hasProjects, hasContact)
        case "about":
          return renderAbout(content.about)
        case "projects":
          return renderProjects(content.projects)
        case "contact":
          return renderContact(content.contact)
      }
    })
    .join("\n")

  const navLinks = sections
    .map((section) => `<a href="#${section}">${NAV_LABELS[section]}</a>`)
    .join("\n        ")

  const title = `${content.hero.name} — ${content.hero.title}`

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(content.hero.description)}" />
  <meta property="og:title" content="${esc(title)}" />
  <meta property="og:description" content="${esc(content.hero.description)}" />
  <meta property="og:type" content="website" />
  <meta name="theme-color" content="#ffffff" />
  <style>${STYLES}</style>
</head>
<body>
  <nav>
    <div class="container nav-inner">
      <a class="nav-brand" href="#${sections[0] ?? "hero"}">${esc(content.hero.avatar.initials || initialsFromName(content.hero.name) || content.hero.name)}</a>
      <div class="nav-links" id="nav-links">
        ${navLinks}
      </div>
      <div style="display:flex;align-items:center;gap:.25rem">
        <button class="theme-toggle" id="theme-toggle" aria-label="Toggle theme">
          <span class="icon-sun">${icon("sun")}</span>
          <span class="icon-moon">${icon("moon")}</span>
        </button>
        <button class="menu-btn" id="menu-btn" aria-label="Toggle menu">&#9776;</button>
      </div>
    </div>
  </nav>
${body}
  <footer>
    <div class="container">© ${new Date().getFullYear()} ${esc(content.hero.name)} · Built with Custom Portfolio Builder</div>
  </footer>
  <button class="scroll-top" id="scroll-top" aria-label="Scroll to top">↑</button>
  <script>${SCRIPT}</script>
</body>
</html>
`
}

export function buildPortfolioExport(content: PortfolioContent, selectedSections: string[]): PortfolioExport {
  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    selectedSections,
    content,
  }
}

export function parsePortfolioJson(text: string): PortfolioExport {
  const data = JSON.parse(text)
  if (!data || typeof data !== "object") throw new Error("Invalid file format")
  const { content, selectedSections } = data as Partial<PortfolioExport>
  if (!content || !content.hero || !content.about || !content.projects || !content.contact) {
    throw new Error("File is missing portfolio content")
  }
  if (!Array.isArray(selectedSections)) {
    throw new Error("File is missing the section layout")
  }
  return data as PortfolioExport
}

export function downloadFile(filename: string, contents: string, mimeType: string) {
  const blob = new Blob([contents], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  URL.revokeObjectURL(url)
}
