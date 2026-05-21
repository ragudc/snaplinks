"use client"

import { useState, useEffect } from "react"
import type { DailyClicks, ClicksByHour, ClicksByCountry, ClicksByDevice } from "@/types/analytics"

export interface AnalyticsData {
  linkId:          string
  slug:            string
  url:             string
  title:           string | null
  is_active:       boolean
  totalClicks:     number
  clicks24h:       number
  clicks7d:        number
  clicks30d:       number
  uniqueCountries: number
  clicksByDay:     DailyClicks[]
  clicksByHour:    ClicksByHour[]
  topCountries:    ClicksByCountry[]
  byDevice:        ClicksByDevice[]
}

interface UseAnalyticsReturn {
  data:      AnalyticsData | null
  isLoading: boolean
  error:     string | null
  refetch:   () => void
}

export function useAnalytics(linkId: string): UseAnalyticsReturn {
  const [data,      setData]      = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error,     setError]     = useState<string | null>(null)
  const [version,   setVersion]   = useState(0)

  useEffect(() => {
    if (!linkId) return

    let cancelled = false

    // Safety net: stop skeleton after 3 seconds regardless of network state
    const maxTimer = setTimeout(() => {
      if (!cancelled) setIsLoading(false)
    }, 3000)

    async function loadAnalytics() {
      setIsLoading(true)
      setError(null)

      try {
        const res = await fetch(`/api/analytics/${linkId}`)

        if (!res.ok) {
          const err = await res.json() as { error?: string }
          throw new Error(err.error ?? "Failed to load analytics.")
        }

        const json = await res.json() as AnalyticsData

        if (!cancelled) setData(json)
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "An unexpected error occurred.")
        }
      } finally {
        clearTimeout(maxTimer)
        setIsLoading(false)
      }
    }

    loadAnalytics()

    return () => {
      cancelled = true
      clearTimeout(maxTimer)
    }
  }, [linkId, version])

  const refetch = () => setVersion((v) => v + 1)

  return { data, isLoading, error, refetch }
}
