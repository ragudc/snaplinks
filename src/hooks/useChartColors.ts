"use client"

import { useState, useEffect } from "react"

function readVar(name: string): string {
  if (typeof window === "undefined") return ""
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// Appends a CSS alpha channel to any color function: oklch(...) → oklch(... / 0.35)
function withAlpha(color: string, alpha: number): string {
  return color.replace(/\)$/, ` / ${alpha})`)
}

export interface ChartColors {
  primary:         string
  primarySubtle:   string
  border:          string
  mutedForeground: string
  background:      string
  accent:          string
}

function compute(): ChartColors {
  const primary = readVar("--primary")
  return {
    primary:         primary,
    primarySubtle:   primary ? withAlpha(primary, 0.35) : "",
    border:          readVar("--border"),
    mutedForeground: readVar("--muted-foreground"),
    background:      readVar("--background"),
    accent:          readVar("--accent"),
  }
}

export function useChartColors(): ChartColors {
  const [colors, setColors] = useState<ChartColors>({
    primary:         "",
    primarySubtle:   "",
    border:          "",
    mutedForeground: "",
    background:      "",
    accent:          "",
  })

  useEffect(() => {
    setColors(compute())

    const observer = new MutationObserver(() => setColors(compute()))
    observer.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ["class"],
    })
    return () => observer.disconnect()
  }, [])

  return colors
}
