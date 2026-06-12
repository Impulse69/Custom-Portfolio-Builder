# ⚡ Custom Portfolio Builder

A web-based, no-code portfolio builder built with **React**, **Next.js**, **TypeScript**, and **Tailwind CSS**. This app allows users to assemble a professional single-page portfolio by selecting and customizing modular sections such as Hero, About, Projects, and Contact. 

---

## 🚀 Features

- ⚙️ Section toggling with **page order controls** (move sections up/down)
- ✍️ Live content editing with section forms for **all four sections** (Hero, About, Projects, Contact)
- 🖼️ Real-time preview in builder and full preview mode (`/preview`)
- 📦 **Export your portfolio as a standalone HTML file** — a single self-contained file (no dependencies) ready to host anywhere (GitHub Pages, Netlify, any static host)
- 💾 **Backup & restore** your portfolio data as JSON
- 📨 Working contact form (composes an email to your address) and CV download link
- 🌙 Dark mode support (in the builder *and* in the exported site)
- 📱 Fully responsive design
- 💨 Tailwind CSS for modern styling
- 🧩 Modular components: easy to extend or style
- ⚡ Built with Next.js for performance and routing
- 🖼️ **Avatar upload with Supabase storage**
- 🔧 **Robust error handling and environment variable management**

---

## 🧱 Tech Stack

- **Framework:** Next.js 14.2.16
- **Language:** TypeScript 5.8.3
- **Styling:** Tailwind CSS 3.4.17
- **State Management:** Zustand 5.0.5
- **UI Components:** Radix UI + shadcn/ui
- **Storage:** Supabase (for avatar uploads)
- **Package Manager:** pnpm
- **Deployment:** Ready for Vercel

---

## 🧪 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/Impulse69/Custom-Portfolio-Builder.git
cd portfolio-builder
```

2. **Install dependencies**

```bash
pnpm install
```

3. **Set up environment variables** (optional for avatar uploads)

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_AVATAR_BUCKET=avatars
```

4. **Run the development server**

```bash
pnpm run dev
```

5. **Build for production**

```bash
pnpm run build
```

---

## 📁 Folder Structure

```
/app                 -> Next.js 13+ app directory
  /api               -> API routes (upload-avatar)
  /globals.css       -> Global styles and Tailwind config
  /layout.tsx        -> Root layout
  /page.tsx          -> Main builder page
  /preview           -> Portfolio preview page
/components          -> Reusable UI components
  /sections          -> Portfolio section components
  /editors           -> Content editing forms (hero, about, projects, contact)
  /ui                -> shadcn/ui components
/lib                 -> Utilities and store
  /portfolio-store.ts   -> Zustand state management
  /export-portfolio.ts  -> Standalone HTML export + JSON backup/restore
  /utils.ts             -> Utility functions
/types               -> TypeScript type definitions
/public              -> Static assets
```

---

## 📦 Exporting Your Portfolio

When you're happy with your portfolio, use the **Export** menu in the sidebar:

- **Download website (HTML):** generates a single, fully self-contained `your-name.html` file — inline styles, inline icons, dark-mode toggle, working contact form (opens the visitor's email client), and smooth-scroll navigation. Drop it on GitHub Pages, Netlify, Vercel, or any static host and it just works.
- **Backup data (JSON):** downloads everything you've entered (content + section layout) as `portfolio-backup.json`.
- **Import backup (JSON):** restores a previously saved backup, including the section order.

---

## 🚀 Deployment

### Vercel Deployment

1. **Push your code to GitHub**
2. **Connect your repository to Vercel**
3. **Add environment variables in Vercel dashboard:**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_AVATAR_BUCKET` (optional, defaults to 'avatars')

### Environment Variables

The app gracefully handles missing Supabase environment variables:
- **Development:** Uses `.env.local` if available
- **Production:** Requires environment variables in Vercel dashboard
- **Fallback:** API returns proper error responses if not configured

---

## 🔧 Recent Fixes & Improvements

### ✅ **Resolved Issues:**
- **Package Manager Conflicts:** Fixed mixed npm/pnpm installations
- **CSS Structure:** Consolidated `@layer` blocks and removed custom utilities
- **Build Errors:** Resolved Supabase environment variable checks at build time
- **API Robustness:** Added proper error handling for missing configurations

### 🛠️ **Technical Improvements:**
- **Clean Dependencies:** Resolved all package manager conflicts
- **Optimized CSS:** Removed duplicate styles and improved structure
- **Error Handling:** Graceful fallbacks for missing environment variables
- **Build Process:** Streamlined and optimized for production

---

## 💡 Customization Guide

- **Content:** Modify sections in `/components/sections/*.tsx`
- **Styling:** Update `/app/globals.css` for theme customization
- **State:** Extend `/lib/portfolio-store.ts` for additional features
- **API:** Add new routes in `/app/api/` for backend functionality

---

## 🐛 Troubleshooting

### Common Issues:

1. **Build fails with Supabase errors:**
   - Add environment variables to Vercel dashboard
   - Or remove Supabase integration if not needed

2. **Package manager conflicts:**
   - Use `pnpm install --no-frozen-lockfile` to resolve
   - Clear `node_modules` and reinstall if needed

3. **CSS not updating:**
   - Ensure you're editing `/app/globals.css` (not `/styles/globals.css`)
   - Restart development server after changes

---

## 📜 License

MIT License © 2025 Isaac Asamoah

---

## 🙌 Acknowledgements

- Inspired by tools like Webflow, Framer, and Notion
- Built with ❤️ using modern frontend tools
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)
