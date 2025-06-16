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

---

## 🧱 Tech Stack

- **Framework:** Next.js 14+
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **State Management:** React Context (or Zustand)
- **Deployment:** Ready for Vercel

---

## 🧪 Getting Started

1. **Clone the repository**

```bash
git clone https://github.com/your-username/portfolio-builder.git
cd portfolio-builder
```

2. **Install dependencies**

```bash
npm install
```

3. **Run the development server**

```bash
npm run dev
```

4. **Build for production**

```bash
npm run build
```

---

## 📁 Folder Structure

```
/components         -> Reusable UI components (HeroSection, AboutSection, etc.)
/pages              -> Next.js page routes (index.tsx, preview.tsx)
/styles             -> Global styles (if needed)
/public             -> Static assets (e.g., placeholder images)
```

---

## 💡 Customization Guide

- Modify content inside `/components/sections/*.tsx`
- Add props and types to make sections editable
- Bind section form data to global state for live previewing

---

## 📜 License

MIT License © 2025 Isaac Asamoah

---

## 🙌 Acknowledgements

- Inspired by tools like Webflow, Framer, and Notion
- Built with ❤️ using modern frontend tools
