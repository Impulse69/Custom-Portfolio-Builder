# Custom Portfolio Builder - Product Requirements Document (PRD)

## 1. Product Overview

### Purpose
The Custom Portfolio Builder is a no-code, web-based application designed to empower professionals (developers, designers, freelancers, and creatives) to quickly generate, customize, and export beautiful, responsive, and highly professional portfolios. It eliminates the need for manual coding while providing a premium, modern aesthetic out of the box.

### Target Audience
- **Software Engineers & Developers:** Needing a quick way to showcase projects with GitHub and Live demo links.
- **UI/UX Designers:** Looking for a highly visual, aesthetically pleasing layout to present design case studies.
- **Freelancers & Consultants:** Requiring a digital presence with a clear breakdown of services and a functional contact medium.

### Value Proposition
- **Instant Gratification:** Real-time WYSIWYG (What You See Is What You Get) live preview.
- **Zero Lock-in:** Users can export their portfolio data to JSON, export visually as a PDF, or run it entirely client-side.
- **Frictionless Experience:** No forced sign-ups or complex onboarding. State is persisted securely in local storage.

---

## 2. How It Works (User Workflow)

1. **Initialization:** The user arrives at the web app. The application loads a default template with placeholder data stored securely in their browser's local storage.
2. **Section Management:** Using a collapsible left-hand sidebar, the user can toggle the visibility of different portfolio sections (Hero, About, Projects, Services, Contact). 
3. **Ordering:** The user can Drag & Drop sections in the sidebar to reorder how they appear in the live preview.
4. **Editing:** Clicking the settings icon on any active section opens a dedicated content editor modal/panel. The user inputs their text, uploads images (via Supabase storage or URLs), and updates links. 
5. **Theming:** The user selects a primary accent color (e.g., Rose, Blue, Violet, Orange) and toggles between Light/Dark mode. The live preview updates instantly.
6. **Exportation:** Once satisfied, the user can:
   - Export to **PDF** (useful for job applications).
   - Export to **JSON** (useful for backing up data, moving to another browser, or sharing the configuration).
   - Export to **PPTX** (useful for presentations).

---

## 3. Core Architecture & Tech Stack

The project is built on a modern, fast, and scalable React framework.

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript (Strict typing for robust component contracts)
- **Styling:** Tailwind CSS + CSS Variables for flexible theming
- **UI Components:** `shadcn/ui` (Radix Primitives)
- **State Management:** Zustand (with `persist` middleware and temporal history for Undo/Redo)
- **Animations:** Framer Motion (Smooth page loading and component mounting)
- **Drag & Drop:** `@dnd-kit/core` & `@dnd-kit/sortable`
- **Asset/Image Storage:** Supabase Storage (for user-uploaded avatars and project images)

---

## 4. Current Feature Set (v1.0)

### 4.1 Interface & Navigation
- **Split-Pane Layout:** Left sidebar for controls, right pane for live preview.
- **Collapsible Sidebar:** Minimizes to an icon-only toolbar to maximize preview real estate.
- **Responsive Preview:** The right pane acts as a true representation of the final deployed site.

### 4.2 Content Sections
- **Hero:** Avatar, Name, Title, availability badge, short bio, and primary/secondary CTA buttons.
- **About:** "My Journey" text split into paragraphs, and a visual "Skills & Expertise" list with progress bars and dynamic icons.
- **Projects:** Grid display of portfolio pieces with images, descriptions, tags, and links to Code (GitHub) and Live Demos. Non-featured projects display in a compact grid below.
- **Services:** Cards detailing specific offerings with icons.
- **Contact:** Actionable links to Email, Phone, Location, and Social Media (GitHub, LinkedIn, Twitter). 

### 4.3 App Utilities
- **State History:** Full Undo/Redo support via UI buttons and `Ctrl+Z` / `Ctrl+Y` keyboard shortcuts.
- **Data Persistence:** Complete auto-save functionality to `localStorage`.
- **Export Engine:** Uses `html2canvas` and `jsPDF` for pixel-perfect PDF rendering.

---

## 5. Desired Features & Roadmap

Based on the strategic vision (from `IDEAS.md` and technical audits), the following features define the future state of the product:

### 5.1 High Priority (Next Iteration)
- **Functional Contact Form:** Connect the contact section to an email service (e.g., Resend, EmailJS, Formspree) so visitors can send messages directly.
- **Image Upload Optimization:** Improve Supabase integration with proper loading states, cropping UI (using `react-easy-crop`), and error handling when images fail to upload.
- **Error Boundaries:** Implement React Error Boundaries to catch sub-component crashes gracefully without white-screening the whole app.
- **Mobile Responsiveness Polish:** Ensure the sidebar transforms correctly into a bottom-sheet or hamburger menu on mobile devices.

### 5.2 Medium Priority (Enhancement Phase)
- **Custom Domains & Hosting:** Allow users to hit "Publish" and deploy their JSON state directly to a Vercel-hosted sub-domain (e.g., `johndoe.portfolio-builder.com`).
- **SEO & Meta Tag Management:** Let users define custom Open Graph images, Meta descriptions, and Titles for their exported/published sites.
- **Typography Engine:** A font-picker integrating Google Fonts to deeply customize the aesthetic.
- **Dynamic Icons Engine:** Move away from hardcoded keyword-matching for skill icons to a dedicated icon picker modal for Services and Skills.

### 5.3 Long-Term Vision (SaaS Features)
- **Authentication & Cloud Sync:** Let users create accounts to save and manage multiple portfolios across devices.
- **Analytics Dashboard:** Integration with a lightweight analytics provider to track visitor counts and outbound clicks on projects.
- **Blog & Testimonial Sections:** Introduce new drag-and-drop modules for richer content density.
- **AI Portfolio Generation:** "Enter your LinkedIn URL and we will build your portfolio instantly."

---

## 6. Design Philosophy & Guidelines
1. **Never Block the User:** No forced logins to play with the builder.
2. **Instant Visual Feedback:** Modals should be minimal. Edits in side-panels must reflect instantaneously in the preview.
3. **Premium Defaults:** The core themes, padding, and typography must look like they were designed by an agency.
4. **Resiliency:** If an image link breaks, it falls back to a skeleton/placeholder. If the user makes a mistake, `Undo` is always a keystroke away.
