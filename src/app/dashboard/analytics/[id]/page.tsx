"use client"

import { use } from "react"
import { ArrowLeft, ExternalLink, Copy } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { StatsCards, StatsCardsSkeleton } from "@/components/analytics/StatsCards"
import { ClicksTimeline, ClicksTimelineSkeleton } from "@/components/analytics/ClicksTimeline"
import { ClicksChart, ClicksChartSkeleton } from "@/components/analytics/ClicksChart"
import { CountryBreakdown, CountryBreakdownSkeleton } from "@/components/analytics/CountryBreakdown"
import { DeviceBreakdown, DeviceBreakdownSkeleton } from "@/components/analytics/DeviceBreakdown"
import { useAnalytics } from "@/hooks/useAnalytics"
import { useClipboard } from "@/hooks/useClipboard"
import { useTranslation } from "@/lib/i18n"

const SHORT_URL_BASE = process.env.NEXT_PUBLIC_SHORT_URL_BASE ?? "http://localhost:3000"

export default function AnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id }           = use(params)
  const { t }            = useTranslation()
  const { copy, copied } = useClipboard()
  const { data, isLoading, error } = useAnalytics(id)

  const shortUrl = data ? `${SHORT_URL_BASE}/${data.slug}` : null

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      {/* Back button */}
      <Button variant="ghost" size="sm" asChild className="-ml-2 w-fit gap-2">
        <Link href="/dashboard">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to My Links
        </Link>
      </Button>

      {/* Link info header */}
      {isLoading ? (
        <div className="h-16 w-full animate-pulse rounded-xl bg-muted" />
      ) : error ? (
        <Card className="border-destructive/40">
          <CardContent className="p-4">
            <p role="alert" className="text-sm text-destructive">{error}</p>
          </CardContent>
        </Card>
      ) : data ? (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardContent className="flex flex-col gap-3 p-4 md:p-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col gap-1 min-w-0">
                {data.title && (
                  <p className="text-base font-semibold truncate">{data.title}</p>
                )}
                <div className="flex items-center gap-2 flex-wrap">
                  <code className="text-sm font-mono text-primary">
                    /{data.slug}
                  </code>
                  <Badge variant={data.is_active ? "default" : "secondary"} className="text-xs">
                    {data.is_active ? t.common.active : t.common.inactive}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground truncate max-w-sm">
                  → {data.url}
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => shortUrl && copy(shortUrl)}
                  className="gap-2"
                >
                  <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                  {copied ? t.common.copied : t.common.copy}
                </Button>
                {shortUrl && (
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={shortUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${shortUrl}`}
                    >
                      <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ) : null}

      {/* StatsCards */}
      {isLoading ? (
        <StatsCardsSkeleton />
      ) : data ? (
        <StatsCards
          totalClicks={data.totalClicks}
          clicks24h={data.clicks24h}
          clicks7d={data.clicks7d}
          clicks30d={data.clicks30d}
          uniqueCountries={data.uniqueCountries}
        />
      ) : null}

      {/* Clicks Timeline */}
      {isLoading ? (
        <ClicksTimelineSkeleton />
      ) : data ? (
        <ClicksTimeline data={data.clicksByDay} />
      ) : null}

      {/* Bottom grid: BarChart (2/3) + Breakdowns (1/3) */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {isLoading ? (
            <ClicksChartSkeleton />
          ) : data ? (
            <ClicksChart data={data.clicksByHour} />
          ) : null}
        </div>

        <div className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <CountryBreakdownSkeleton />
              <DeviceBreakdownSkeleton />
            </>
          ) : data ? (
            <>
              <CountryBreakdown data={data.topCountries} />
              <DeviceBreakdown data={data.byDevice} />
            </>
          ) : null}
        </div>
      </div>

    </div>
  )
}
