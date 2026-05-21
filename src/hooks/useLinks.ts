"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import type { LinkStats, UpdateLinkInput, LinksListResponse } from "@/types/link"

interface UseLinksOptions {
  search?:  string
  page?:    number
  perPage?: number
}

interface UseLinksReturn {
  links:        LinkStats[]
  totalCount:   number
  isLoading:    boolean
  error:        string | null
  refetch:      () => Promise<void>
  updateLink:   (id: string, input: UpdateLinkInput) => Promise<void>
  deleteLink:   (id: string) => Promise<void>
  toggleActive: (id: string, currentState: boolean) => Promise<void>
}

export function useLinks(options: UseLinksOptions = {}): UseLinksReturn {
  const { search = "", page = 0, perPage = 20 } = options

  const [links,      setLinks]      = useState<LinkStats[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [isLoading,  setIsLoading]  = useState(true)
  const [error,      setError]      = useState<string | null>(null)

  const abortRef = useRef<AbortController | null>(null)

  const fetchLinks = useCallback(async () => {
    abortRef.current?.abort()
    abortRef.current = new AbortController()

    setIsLoading(true)
    setError(null)

    const params = new URLSearchParams({ page: String(page), limit: String(perPage) })
    if (search) params.set("q", search)

    try {
      const res = await fetch(`/api/links?${params}`, {
        signal: abortRef.current.signal,
      })

      if (!res.ok) {
        const err = await res.json() as { error?: string }
        throw new Error(err.error ?? "Failed to load links.")
      }

      const data: LinksListResponse = await res.json()
      setLinks(data.links)
      setTotalCount(data.count)
    } catch (err) {
      if ((err as Error).name === "AbortError") return
      setError(err instanceof Error ? err.message : "An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }, [search, page, perPage])

  useEffect(() => {
    fetchLinks()
    return () => abortRef.current?.abort()
  }, [fetchLinks])

  // ─── Mutaciones ───────────────────────────────────────────────

  const updateLink = async (id: string, input: UpdateLinkInput): Promise<void> => {
    const res = await fetch(`/api/links/${id}`, {
      method:  "PUT",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(input),
    })
    if (!res.ok) {
      const err = await res.json() as { error?: string }
      throw new Error(err.error ?? "Failed to update link.")
    }
    await fetchLinks()
  }

  const deleteLink = async (id: string): Promise<void> => {
    const res = await fetch(`/api/links/${id}`, { method: "DELETE" })
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as { error?: string }
      throw new Error(err.error ?? "Failed to delete link.")
    }
    setLinks((prev) => prev.filter((l) => l.link_id !== id))
    setTotalCount((c) => c - 1)
    await fetchLinks()
  }

  const toggleActive = async (id: string, currentState: boolean): Promise<void> => {
    setLinks((prev) =>
      prev.map((l) => l.link_id === id ? { ...l, is_active: !currentState } : l)
    )
    try {
      await updateLink(id, { is_active: !currentState })
    } catch (err) {
      setLinks((prev) =>
        prev.map((l) => l.link_id === id ? { ...l, is_active: currentState } : l)
      )
      throw err
    }
  }

  return { links, totalCount, isLoading, error, refetch: fetchLinks, updateLink, deleteLink, toggleActive }
}
