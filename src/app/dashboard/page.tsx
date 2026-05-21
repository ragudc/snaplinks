"use client"

import { useState } from "react"
import { Search, Link2, MousePointerClick } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { LinkCard } from "@/components/links/LinkCard"
import { EmptyLinks } from "@/components/links/EmptyLinks"
import { useLinks } from "@/hooks/useLinks"
import { useTranslation } from "@/lib/i18n"
import { useDebounce } from "@/hooks/useDebounce"

// ─── Skeleton de carga para LinkCard ─────────────────────────────

function LinkCardSkeleton() {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Skeleton className="h-5 w-9 rounded-full mt-0.5 shrink-0" />
          <div className="flex-1 flex flex-col gap-2">
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-3 w-64" />
            <Skeleton className="h-3 w-36" />
            <div className="flex gap-2 mt-1">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-12 rounded-full" />
            </div>
          </div>
          <Skeleton className="h-8 w-8 rounded-md shrink-0" />
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Stats Card ───────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  isLoading,
}: {
  icon:      React.ElementType
  label:     string
  value:     number
  isLoading: boolean
}) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
        </div>
        <div className="flex flex-col gap-0.5">
          <p className="text-xs text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="h-6 w-12" />
          ) : (
            <p className="text-xl font-bold leading-tight">
              {value.toLocaleString("en-US")}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

// ─── Dashboard Page ───────────────────────────────────────────────

export default function DashboardPage() {
  const { t }                   = useTranslation()
  const [search, setSearch]     = useState("")
  const debouncedSearch         = useDebounce(search, 300)

  const { links, totalCount, isLoading, error, updateLink, deleteLink, toggleActive } =
    useLinks({ search: debouncedSearch })

  const totalClicks = links.reduce((sum, l) => sum + l.total_clicks, 0)

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header ────────────────────────────────────────────── */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{t.dashboard.title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">{t.dashboard.subtitle}</p>
      </div>

      {/* ── Stats ─────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Link2}
          label={t.dashboard.totalLinks}
          value={totalCount}
          isLoading={isLoading}
        />
        <StatCard
          icon={MousePointerClick}
          label={t.dashboard.totalClicks}
          value={totalClicks}
          isLoading={isLoading}
        />
      </div>

      {/* ── Search ────────────────────────────────────────────── */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none"
          aria-hidden="true"
        />
        <Input
          type="search"
          placeholder={t.dashboard.searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
          aria-label={t.dashboard.searchPlaceholder}
        />
      </div>

      {/* ── Lista de links ─────────────────────────────────────── */}
      {error ? (
        <div
          role="alert"
          className="rounded-md bg-destructive/10 border border-destructive/20 px-4 py-3 text-sm text-destructive"
        >
          {error}
        </div>
      ) : isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <LinkCardSkeleton key={i} />
          ))}
        </div>
      ) : links.length === 0 ? (
        <EmptyLinks />
      ) : (
        <div className="flex flex-col gap-3">
          {links.map((link) => (
            <LinkCard
              key={link.link_id}
              link={link}
              onUpdate={updateLink}
              onDelete={deleteLink}
              onToggle={toggleActive}
            />
          ))}
        </div>
      )}

    </div>
  )
}
