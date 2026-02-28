"use client"

import React, { useRef, useState } from "react"
import { usePortfolioStore } from "@/lib/portfolio-store"
import { Button } from "@/components/ui/button"
import { X, Download, FileText, Loader2 } from "lucide-react"

interface ResumePdfExportProps {
    open: boolean
    onClose: () => void
}

function ResumePage() {
    const { content } = usePortfolioStore()
    const { hero, about, projects, services, contact } = content

    const topSkills = (about.skills ?? []).slice(0, 12)
    const topProjects = (projects.projects ?? []).slice(0, 4)
    const topServices = (services.services ?? []).slice(0, 3)

    return (
        <div
            id="resume-pdf-content"
            className="bg-white text-gray-900"
            style={{
                fontFamily: "'Segoe UI', Arial, sans-serif",
                fontSize: "10pt",
                lineHeight: "1.45",
                width: "794px",     // A4 at 96dpi
                minHeight: "1123px",
                padding: "56px 52px",
                boxSizing: "border-box",
                color: "#111",
            }}
        >
            {/* ── HEADER ─────────────────────────── */}
            <header style={{ borderBottom: "2px solid #1d4ed8", paddingBottom: "12px", marginBottom: "18px" }}>
                <h1 style={{ fontSize: "22pt", fontWeight: 700, margin: 0, color: "#1e293b", letterSpacing: "-0.5px" }}>
                    {hero.name || "Your Name"}
                </h1>
                <p style={{ margin: "3px 0 0", fontSize: "11pt", color: "#1d4ed8", fontWeight: 600 }}>
                    {hero.title || "Professional Title"}
                </p>
                {hero.subtitle && (
                    <p style={{ margin: "2px 0 0", fontSize: "9pt", color: "#64748b" }}>{hero.subtitle}</p>
                )}

                {/* Contact row */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", marginTop: "8px", fontSize: "8.5pt", color: "#475569" }}>
                    {contact.emailEnabled && contact.email && (
                        <span>✉ {contact.email}</span>
                    )}
                    {contact.phoneEnabled && contact.phone && (
                        <span>📞 {contact.phone}</span>
                    )}
                    {contact.locationEnabled && contact.location && (
                        <span>📍 {contact.location}</span>
                    )}
                    {hero.socialLinks?.githubEnabled && hero.socialLinks?.github && (
                        <span>⚡ github.com/{hero.socialLinks.github.replace(/.*github\.com\//, "")}</span>
                    )}
                    {hero.socialLinks?.linkedinEnabled && hero.socialLinks?.linkedin && (
                        <span>in {hero.socialLinks.linkedin.replace(/.*linkedin\.com\/in\//, "")}</span>
                    )}
                </div>
            </header>

            {/* ── SUMMARY ───────────────────────── */}
            {hero.description && (
                <section style={{ marginBottom: "16px" }}>
                    <SectionTitle>Professional Summary</SectionTitle>
                    <p style={{ margin: 0, color: "#374151" }}>{hero.description}</p>
                </section>
            )}

            {/* ── SKILLS ────────────────────────── */}
            {topSkills.length > 0 && (
                <section style={{ marginBottom: "16px" }}>
                    <SectionTitle>Key Skills</SectionTitle>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                        {topSkills.map((skill) => (
                            <span
                                key={skill.name}
                                style={{
                                    background: "#eff6ff",
                                    border: "1px solid #bfdbfe",
                                    borderRadius: "4px",
                                    padding: "2px 8px",
                                    fontSize: "8.5pt",
                                    color: "#1e40af",
                                }}
                            >
                                {skill.name}
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* ── ABOUT / JOURNEY ───────────────── */}
            {about.journeyItems && about.journeyItems.length > 0 && (
                <section style={{ marginBottom: "16px" }}>
                    <SectionTitle>Experience</SectionTitle>
                    {about.description && (
                        <p style={{ margin: "0 0 8px", color: "#374151" }}>{about.description}</p>
                    )}
                    {about.journeyItems.map((item, i) => (
                        <div key={i} style={{ marginBottom: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <strong style={{ fontSize: "10.5pt", color: "#1e293b" }}>{item.role}{item.company ? ` @ ${item.company}` : ""}</strong>
                                {item.period && <span style={{ fontSize: "8.5pt", color: "#64748b" }}>{item.period}</span>}
                            </div>
                            {item.description && <p style={{ margin: "2px 0 0", color: "#374151", fontSize: "9pt" }}>{item.description}</p>}
                        </div>
                    ))}
                </section>
            )}
            {/* ── PROJECTS ──────────────────────── */}
            {topProjects.length > 0 && (
                <section style={{ marginBottom: "16px" }}>
                    <SectionTitle>Projects</SectionTitle>
                    {topProjects.map((project) => (
                        <div key={project.id} style={{ marginBottom: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                                <strong style={{ fontSize: "10.5pt", color: "#1e293b" }}>{project.title}</strong>
                                <div style={{ display: "flex", gap: "8px", fontSize: "8pt", color: "#1d4ed8" }}>
                                    {project.liveUrl && <span>{project.liveUrl}</span>}
                                    {project.githubUrl && <span>{project.githubUrl}</span>}
                                </div>
                            </div>
                            <p style={{ margin: "2px 0 4px", color: "#374151", fontSize: "9pt" }}>{project.description}</p>
                            {project.tags && project.tags.length > 0 && (
                                <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                                    {project.tags.map((tag) => (
                                        <span key={tag} style={{ fontSize: "8pt", color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "3px", padding: "1px 5px" }}>
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </section>
            )}

            {/* ── SERVICES ──────────────────────── */}
            {topServices.length > 0 && (
                <section style={{ marginBottom: "16px" }}>
                    <SectionTitle>Services Offered</SectionTitle>
                    {topServices.map((svc, i) => (
                        <div key={i} style={{ marginBottom: "8px" }}>
                            <strong style={{ fontSize: "10pt", color: "#1e293b" }}>{svc.title}</strong>
                            <p style={{ margin: "2px 0 0", color: "#374151", fontSize: "9pt" }}>{svc.description}</p>
                        </div>
                    ))}
                </section>
            )}

            <footer style={{ borderTop: "1px solid #e2e8f0", marginTop: "24px", paddingTop: "8px", fontSize: "8pt", color: "#94a3b8", textAlign: "center" }}>
                Generated by Custom Portfolio Builder
            </footer>
        </div>
    )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
    return (
        <h2
            style={{
                fontSize: "10.5pt",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.8px",
                color: "#1d4ed8",
                margin: "0 0 8px",
                borderBottom: "1px solid #bfdbfe",
                paddingBottom: "3px",
            }}
        >
            {children}
        </h2>
    )
}

export function ResumePdfExport({ open, onClose }: ResumePdfExportProps) {
    const { content } = usePortfolioStore()
    const resumeRef = useRef<HTMLDivElement>(null)
    const [isExporting, setIsExporting] = useState(false)

    const handleDownload = async () => {
        setIsExporting(true)
        try {
            const el = document.getElementById("resume-pdf-content")
            if (!el) return
            const html2canvas = (await import("html2canvas")).default
            const jsPDF = (await import("jspdf")).default
            const canvas = await html2canvas(el, {
                scale: 2,
                useCORS: true,
                backgroundColor: "#ffffff",
                windowWidth: 794,
            })
            const imgData = canvas.toDataURL("image/png")
            const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: [794, 1123] })
            pdf.addImage(imgData, "PNG", 0, 0, 794, canvas.height * (794 / canvas.width))
            const name = content.hero?.name?.toLowerCase().replace(/\s+/g, "-") || "resume"
            pdf.save(`${name}-resume.pdf`)
        } catch (err) {
            console.error("Resume export failed:", err)
        }
        setIsExporting(false)
    }

    if (!open) return null

    return (
        <div
            className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 backdrop-blur-sm overflow-y-auto py-8"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
        >
            <div className="relative w-full max-w-4xl bg-background border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
                {/* Toolbar */}
                <div className="flex items-center justify-between px-5 py-4 border-b bg-muted/30 sticky top-0 z-10">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary" />
                        <h2 className="font-semibold text-base">Resume Preview</h2>
                        <span className="text-xs text-muted-foreground bg-muted rounded px-2 py-0.5">ATS-Friendly</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button size="sm" onClick={handleDownload} disabled={isExporting}>
                            {isExporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
                            {isExporting ? "Exporting…" : "Download PDF"}
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>

                {/* Preview (scrollable) */}
                <div className="overflow-auto bg-gray-100 p-6 flex justify-center">
                    <div ref={resumeRef} className="shadow-xl">
                        <ResumePage />
                    </div>
                </div>
            </div>
        </div>
    )
}
