# ⚡ Custom Portfolio Builder

A web-based, no-code portfolio builder built with **React**, **Next.js**, **TypeScript**, and **Tailwind CSS**. This app allows users to assemble a professional single-page portfolio by selecting and customizing modular sections such as Hero, About, Projects, and Contact. 

---

## 🚀 Features

- ⚙️ Drag-and-drop layout (manual placement for now)
- ✍️ Live content editing with section forms
- 🖼️ Real-time preview in builder and full preview mode (`/preview`)
- 🌙 Dark mode support
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

\`\`\`bash
git clone https://github.com/Impulse69/Custom-Portfolio-Builder.git
cd portfolio-builder
\`\`\`

2. **Install dependencies**

\`\`\`bash
pnpm install
\`\`\`

3. **Set up environment variables** (optional for avatar uploads)

Create a `.env.local` file in the root directory:

\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_AVATAR_BUCKET=avatars
\`\`\`

4. **Run the development server**

\`\`\`bash
pnpm run dev
\`\`\`

5. **Build for production**

\`\`\`bash
pnpm run build
\`\`\`

---

## 📁 Folder Structure

\`\`\`
/app                 -> Next.js 13+ app directory
  /api               -> API routes (upload-avatar)
  /globals.css       -> Global styles and Tailwind config
  /layout.tsx        -> Root layout
  /page.tsx          -> Main builder page
  /preview           -> Portfolio preview page
/components          -> Reusable UI components
  /sections          -> Portfolio section components
  /editors           -> Content editing forms
  /ui                -> shadcn/ui components
/lib                 -> Utilities and store
  /portfolio-store.ts -> Zustand state management
  /utils.ts          -> Utility functions
/types               -> TypeScript type definitions
/public              -> Static assets
\`\`\`

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
