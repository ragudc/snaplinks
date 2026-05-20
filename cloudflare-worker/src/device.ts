import type { DeviceType } from "./types"

const TABLET_PATTERN  = /tablet|ipad|playbook|silk|(android(?!.*mobile))/i
const MOBILE_PATTERN  = /mobile|android|iphone|ipod|blackberry|opera mini|iemobile|wpdesktop/i
const DESKTOP_PATTERN = /windows nt|macintosh|linux x86_64|cros/i

export function detectDeviceType(userAgent: string): DeviceType {
  if (!userAgent) return "unknown"

  if (TABLET_PATTERN.test(userAgent))  return "tablet"
  if (MOBILE_PATTERN.test(userAgent))  return "mobile"
  if (DESKTOP_PATTERN.test(userAgent)) return "desktop"

  return "unknown"
}

export function extractReferrerDomain(referer: string | null): string | null {
  if (!referer) return null
  try {
    return new URL(referer).hostname
  } catch {
    return null
  }
}
