import { describe, expect, it } from "vitest"
import { safeProjectHrefs, safeWebHref } from "@/lib/safe-href"

describe("safeWebHref", () => {
  it.each(["javascript:alert(1)", "JaVaScRiPt:alert(1)", "data:text/html,<script>alert(1)</script>", "vbscript:msgbox(1)", "mailto:user@example.com", "#", "   "])(
    "rejects non-web link %s",
    (value) => {
      expect(safeWebHref(value)).toBeNull()
    },
  )

  it.each([
    ["https://example.com/path", "https://example.com/path"],
    ["http://localhost:3000", "http://localhost:3000"],
    ["/resume.pdf", "/resume.pdf"],
    [" projects/demo ", "projects/demo"],
  ])("allows web link %s", (value, expected) => {
    expect(safeWebHref(value)).toBe(expected)
  })
})

describe("safeProjectHrefs", () => {
  it("returns no actions when both project links are rejected", () => {
    expect(safeProjectHrefs({ liveUrl: "#", githubUrl: "javascript:alert(1)" })).toEqual({
      liveUrl: null,
      githubUrl: null,
    })
  })

  it("keeps each valid project action independently", () => {
    expect(safeProjectHrefs({ liveUrl: "https://example.com", githubUrl: "#" })).toEqual({
      liveUrl: "https://example.com",
      githubUrl: null,
    })
  })
})
