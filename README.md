# ⚡ Custom Portfolio Builder

[![CI](https://github.com/Impulse69/Custom-Portfolio-Builder/actions/workflows/ci.yml/badge.svg)](https://github.com/Impulse69/Custom-Portfolio-Builder/actions/workflows/ci.yml)

A web-based, no-code portfolio builder built with **React**, **Next.js**, **TypeScript**, and **Tailwind CSS**. Assemble a professional single-page portfolio from modular sections — Hero, About, Projects, and Contact — edit everything live, and export a self-contained website you can host anywhere.

---

## 🚀 Features

- 🧱 **Page structure panel** — add and remove sections, reorder them with **drag-and-drop**, click any section to edit it
- 🖼️ **Project image uploads** — upload screenshots from your device; they're embedded in your portfolio and exports (or paste an image URL)
- ✍️ **Live content editing** for all four sections, with changes saved automatically to your browser
- 🖼️ **Real-time preview** in the builder, plus a full-screen preview mode (`/preview`)
- 📦 **One-click export** — download your portfolio as a single self-contained HTML file (inline styles and icons, dark-mode toggle, working contact form) ready for GitHub Pages, Netlify, Vercel, or any static host
- 💾 **Backup & restore** — save all your content and layout as JSON and import it later
- 📨 **Working contact form** (composes an email to your address) and configurable CV download link
- 💡 **Hover hints everywhere** — every control explains itself
- ☀️ **Light mode by default**, with a dark mode toggle in the builder, preview, and exported site
- 📱 Fully responsive, including the content editor
- 🖼️ **Avatar photo upload with crop, zoom and rotation** — works with zero setup (the image is embedded in your portfolio); optionally hosted via Supabase storage if configured

---

## 🧱 Tech Stack

- **Framework:** Next.js 14
- **Language:** TypeScript 5
- **Styling:** Tailwind CSS 3
- **State:** Zustand (persisted to localStorage)
- **UI:** Radix UI + shadcn/ui, Framer Motion, Lucide icons
- **Storage (optional):** Supabase, for avatar uploads
- **Package manager:** pnpm

---

## 🧪 Getting Started

```bash
git clone https://github.com/Impulse69/Custom-Portfolio-Builder.git
cd Custom-Portfolio-Builder
pnpm install
pnpm dev
```

Open http://localhost:3000 and start building.

**Optional — hosted avatar uploads:** copy `.env.example` to `.env.local` and fill in your Supabase project values to store avatar photos in Supabase. Without them, uploaded photos are simply embedded in your portfolio — everything still works.

### Scripts

| Command | What it does |
| --- | --- |
| `pnpm dev` | Start the development server |
| `pnpm build` | Production build (includes type checking and linting) |
| `pnpm start` | Serve the production build |
| `pnpm lint` | Run ESLint (`next/core-web-vitals`) |
| `pnpm test` | Run the unit tests (Vitest) |

---

## 🧭 How It Works

The sidebar is your control center:

| Panel | What it does |
| --- | --- |
| **Page Structure** | The sections on your page, in visitor order. Click a section to edit it; drag the grip handle to reorder, ✏️ to edit, ✕ to remove (content is kept). |
| **Add Sections** | Sections not yet on your page — one click adds them at the bottom. |
| **Actions** | **Preview** full-screen, **Export** your site or backups, **Reset** to the example content (with confirmation). |

Every icon control has a hover hint, and the content editor closes with `Esc`.

---

## 📦 Exporting Your Portfolio

From **Export** in the sidebar:

- **Download website (HTML):** a single `your-name.html` file with no external dependencies — inline styles, inline icons, light/dark toggle, smooth-scroll navigation, and a contact form that opens the visitor's email client. Drop it on any static host and it just works.
- **Save backup (JSON):** everything you've entered, plus the section layout.
- **Restore backup (JSON):** load a previously saved backup (replaces current work).

---

## 📁 Project Structure

```
/app                    -> Next.js App Router
  /api/upload-avatar    -> Avatar upload endpoint (Supabase)
  /preview              -> Full-screen portfolio preview
  layout.tsx            -> Root layout (theme provider, metadata, toaster)
  page.tsx              -> The builder
/components
  portfolio-builder.tsx -> Builder shell and sidebar
  content-editor.tsx    -> Slide-in editor panel
  /sections             -> The four portfolio sections (render preview + export source of truth)
  /editors              -> Editing forms for each section
  /ui                   -> shadcn/ui primitives (only the ones in use)
/lib
  portfolio-store.ts    -> Zustand store (content, layout, persistence)
  export-portfolio.ts   -> Standalone HTML export + JSON backup/restore
/types                  -> Shared TypeScript types
```

---

## 🚀 Deployment

The builder deploys to Vercel out of the box:

1. Push to GitHub and import the repo in Vercel
2. (Optional) Add the Supabase environment variables from `.env.example` for avatar uploads

Exported portfolios are static files and host anywhere — they don't need this app to run.

---

## 📜 License

MIT License © 2025 Isaac Asamoah — see [LICENSE](LICENSE).

---

## 🙌 Acknowledgements

- Inspired by tools like Webflow, Framer, and Notion
- UI components from [shadcn/ui](https://ui.shadcn.com/), icons from [Lucide](https://lucide.dev/)
