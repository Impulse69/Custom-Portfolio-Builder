"use client"

import { useEffect, useRef } from "react"
import { usePortfolioStore } from "@/lib/portfolio-store"
import { Button } from "@/components/ui/button"
import { X, RotateCcw, Code2 } from "lucide-react"

const CSS_TEMPLATES = [
    {
        label: "Soft pastel bg",
        css: "/* Soft pastel background */\n.portfolio-preview {\n  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%) !important;\n}",
    },
    {
        label: "Glassy cards",
        css: "/* Glass morphism cards */\n.gamma-card {\n  background: rgba(255, 255, 255, 0.15) !important;\n  backdrop-filter: blur(12px) !important;\n  border: 1px solid rgba(255,255,255,0.3) !important;\n}",
    },
    {
        label: "Gradient headings",
        css: "/* Gradient heading text */\nh1, h2, h3 {\n  background: linear-gradient(90deg, hsl(var(--primary)), #ec4899);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}",
    },
]

interface CustomCssEditorProps {
    open: boolean
    onClose: () => void
}

export function CustomCssEditor({ open, onClose }: CustomCssEditorProps) {
    const { customCss, setCustomCss } = usePortfolioStore()
    const styleTagRef = useRef<HTMLStyleElement | null>(null)
    const textareaRef = useRef<HTMLTextAreaElement | null>(null)

    // Inject/update custom styles into the page whenever `customCss` changes
    useEffect(() => {
        if (!styleTagRef.current) {
            styleTagRef.current = document.createElement("style")
            styleTagRef.current.id = "portfolio-custom-css"
            document.head.appendChild(styleTagRef.current)
        }
        styleTagRef.current.textContent = customCss
    }, [customCss])

    // Auto-resize textarea
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setCustomCss(e.target.value)
    }

    const handleInsertTemplate = (css: string) => {
        const current = customCss ? customCss + "\n\n" + css : css
        setCustomCss(current)
        textareaRef.current?.focus()
    }

    const handleClear = () => {
        setCustomCss("")
    }

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose()
            }}
        >
            <div className="relative w-full sm:w-[680px] max-h-[90vh] bg-background border rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30">
                    <div className="flex items-center gap-2">
                        <Code2 className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold text-base">Custom CSS</h2>
                        <span className="text-xs text-muted-foreground bg-muted rounded px-2 py-0.5">Live preview</span>
                    </div>
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>

                {/* Template chips */}
                <div className="px-5 py-3 border-b bg-muted/20 flex flex-wrap gap-2">
                    <span className="text-xs text-muted-foreground self-center">Quick insert:</span>
                    {CSS_TEMPLATES.map((t) => (
                        <button
                            key={t.label}
                            onClick={() => handleInsertTemplate(t.css)}
                            className="text-xs px-3 py-1 rounded-full border bg-background hover:bg-muted transition-colors"
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Editor */}
                <div className="flex-1 relative overflow-hidden">
                    <textarea
                        ref={textareaRef}
                        value={customCss}
                        onChange={handleChange}
                        spellCheck={false}
                        placeholder={`/* Write your custom CSS here */\n.gamma-card {\n  border-radius: 1rem;\n}`}
                        className="w-full h-full min-h-[280px] resize-none p-5 text-sm font-mono bg-transparent outline-none leading-relaxed placeholder:text-muted-foreground/40"
                    />
                </div>

                {/* Footer */}
                <div className="px-5 py-3 border-t flex items-center justify-between bg-muted/20">
                    <p className="text-xs text-muted-foreground">
                        {customCss.length > 0
                            ? `${customCss.split("\n").length} lines · styles applied live`
                            : "No custom styles yet"}
                    </p>
                    <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={handleClear} disabled={!customCss}>
                            <RotateCcw className="h-3.5 w-3.5 mr-1.5" />
                            Clear
                        </Button>
                        <Button size="sm" onClick={onClose}>
                            Done
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
