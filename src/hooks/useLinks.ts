"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { LinkStats, UpdateLinkInput, LinksListResponse } from "@/types/link"

interface UseLinksOptions {
  search?:        string
  page?:          number
  perPage?:       number
  initialLinks?:  LinkStats[]
  initialCount?:  number
}

interface UseLinksReturn {
  links:        LinkStats[]
  totalCount:   number
  isLoading:    boolean
  error:        string | null
  refetch:      () => void
  updateLink:   (id: string, input: UpdateLinkInput) => Promise<void>
  deleteLink:   (id: string) => Promise<void>
  toggleActive: (id: string, currentState: boolean) => Promise<void>
}

export function useLinks(options: UseLinksOptions = {}): UseLinksReturn {
  const { search = "", page = 0, perPage = 20, initialLinks, initialCount } = options

  const hasInitialData = initialLinks !== undefined
  // Skip the first effect run when server already provided data
  const skipFirst = useRef(hasInitialData)

  const [links,      setLinks]      = useState<LinkStats[]>(initialLinks ?? [])
  const [totalCount, setTotalCount] = useState(initialCount ?? 0)
  const [isLoading,  setIsLoading]  = useState(!hasInitialData)
  const [error,      setError]      = useState<string | null>(null)
  const [version,    setVersion]    = useState(0)

  useEffect(() => {
    // First render with server-provided data: skip fetch, no skeleton
    if (skipFirst.current) {
      skipFirst.current = false
      return
    }

    let cancelled = false

    // Safety net: stop skeleton after 3 seconds regardless of network state
    const maxTimer = setTimeout(() => {
      if (!cancelled) setIsLoading(false)
    }, 3000)

    async function loadLinks() {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({ page: String(page), limit: String(perPage) })
      if (search) params.set("q", search)

      try {
        const res = await fetch(`/api/links?${params}`)

        if (!res.ok) {
          const err = await res.json() as { error?: string }
          throw new Error(err.error ?? "Failed to load links.")
        }

        const data: LinksListResponse = await res.json()

        if (!cancelled) {
          setLinks(data.links)
          setTotalCount(data.count)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "An unexpected error occurred.")
        }
      } finally {
        clearTimeout(maxTimer)
        setIsLoading(false)
      }
    }

    loadLinks()

    return () => {
      cancelled = true
      clearTimeout(maxTimer)
    }
  }, [search, page, perPage, version])

  const refetch = useCallback(() => setVersion(v => v + 1), [])

  // --- Mutations ---------------------------------------------------

  const updateLink = useCallback(async (id: string, input: UpdateLinkInput): Promise<void> => {
    const res = await fetch(`/api/links/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(input),
    })
    if (!res.ok) {
      const err = await res.json() as { error?: string }
      throw new Error(err.error ?? "Failed to update link.")
    }
    setVersion(v => v + 1)
  }, [])

  const deleteLink = useCallback(async (id: string): Promise<void> => {
    const res = await fetch(`/api/links/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string }
      throw new Error(err.error ?? "Failed to delete link.")
    }
    setLinks(prev => prev.filter(l => l.link_id !== id))
    setTotalCount(c => c - 1)
    setVersion(v => v + 1)
  }, [])

  const toggleActive = useCallback(async (id: string, currentState: boolean): Promise<void> => {
    setLinks(prev =>
      prev.map(l => l.link_id === id ? { ...l, is_active: !currentState } : l)
    )
    try {
      const res = await fetch(`/api/links/${id}`, {
        method:  "PUT",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ is_active: !currentState }),
      })
      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error ?? "Failed to update link.")
      }
      setVersion(v => v + 1)
    } catch (err) {
      setLinks(prev =>
        prev.map(l => l.link_id === id ? { ...l, is_active: currentState } : l)
      )
      throw err
    }
  }, [])

  return { links, totalCount, isLoading, error, refetch, updateLink, deleteLink, toggleActive }
}
