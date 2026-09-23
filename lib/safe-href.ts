/**
 * Return a trimmed web URL only when it is safe to place in a clickable link.
 * Backup files can bypass the browser's `type="url"` editor validation, so
 * every rendering path must enforce the protocol allow-list itself.
 */
export function safeWebHref(value?: string): string | null {
  const candidate = value?.trim()
  if (!candidate || candidate === "#") return null

  try {
    const parsed = new URL(candidate, "https://portfolio.invalid")
    return parsed.protocol === "http:" || parsed.protocol === "https:" ? candidate : null
  } catch {
    return null
  }
}
