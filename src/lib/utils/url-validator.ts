const MAX_URL_LENGTH = 2000

const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0", "::1"]

/**
 * Returns an error message string, or null if the URL is valid.
 * Blocks localhost addresses as an anti-abuse measure.
 */
export const validateUrl = (url: string): string | null => {
  const trimmed = url.trim()

  if (!trimmed) return "URL is required."

  if (trimmed.length > MAX_URL_LENGTH) {
    return `URL is too long. Please use a URL under ${MAX_URL_LENGTH} characters.`
  }

  try {
    const parsed = new URL(trimmed)

    if (!["http:", "https:"].includes(parsed.protocol)) {
      return "URL must start with https:// or http://"
    }

    const hostname = parsed.hostname.toLowerCase()
    if (BLOCKED_HOSTS.some((h) => hostname === h || hostname.endsWith(`.${h}`))) {
      return "Shortening local URLs is not allowed."
    }

    return null
  } catch {
    return "Please enter a valid URL (e.g., https://example.com)"
  }
}

/** Trims whitespace from a URL before persisting it. */
export const normalizeUrl = (url: string): string => url.trim()
