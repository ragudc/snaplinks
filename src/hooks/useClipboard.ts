"use client"

import { useState, useCallback } from "react"

interface UseClipboardReturn {
  copy:   (text: string) => Promise<void>
  copied: boolean
  error:  string | null
}

/**
 * Hook for copying text to the clipboard.
 * `copied` resets to false automatically after `resetMs` milliseconds.
 * Includes a textarea fallback for Safari and non-HTTPS environments.
 */
export function useClipboard(resetMs = 2000): UseClipboardReturn {
  const [copied, setCopied] = useState(false)
  const [error,  setError]  = useState<string | null>(null)

  const copy = useCallback(async (text: string) => {
    setError(null)
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
      } else {
        // Fallback for old Safari and non-HTTPS contexts
        const el = document.createElement("textarea")
        el.value = text
        el.setAttribute("readonly", "")
        el.style.position = "absolute"
        el.style.left     = "-9999px"
        document.body.appendChild(el)
        el.select()
        document.execCommand("copy")
        document.body.removeChild(el)
      }
      setCopied(true)
      setTimeout(() => setCopied(false), resetMs)
    } catch (err) {
      setError("Failed to copy. Please copy manually.")
      console.error("Clipboard error:", err)
    }
  }, [resetMs])

  return { copy, copied, error }
}
