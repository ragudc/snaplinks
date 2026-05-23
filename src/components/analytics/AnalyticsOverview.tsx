"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart2, MousePointerClick, TrendingUp, Link2, ExternalLink } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { LinkStats } from "@/types/link"

const containerVariants = {
  hidden:   {},
  visible:  { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden:   { opacity: 0, y: 16 },
  visible:  { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
}

interface AggregateCardProps {
  icon:       React.ReactNode
  label:      string
  value:      number
  highlight?: boolean
}

function AggregateCard({ icon, label, value, highlight = false }: AggregateCardProps) {
  return (
    <motion.div variants={cardVariants}>
      <Card className={cn("h-full transition-colors hover:bg-accent/30", highlight && "border-primary/40")}>
        <CardContent className="flex flex-col gap-2 p-4">
          <div className={cn("text-muted-foreground", highlight && "text-primary")} aria-hidden="true">
            {icon}
          </div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
          <p className={cn("text-2xl font-bold tabular-nums leading-tight", highlight && "text-primary")}>
            {value.toLocaleString("en-US")}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface AnalyticsOverviewProps {
  links: LinkStats[]
}

export function AnalyticsOverview({ links }: AnalyticsOverviewProps) {
  const { t } = useTranslation()

  const totalClicks    = links.reduce((acc, l) => acc + (l.total_clicks ?? 0), 0)
  const totalClicks24h = links.reduce((acc, l) => acc + (l.clicks_24h  ?? 0), 0)
  const totalClicks7d  = links.reduce((acc, l) => acc + (l.clicks_7d   ?? 0), 0)

  return (
    <div className="flex flex-col gap-6 max-w-5xl">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{t.analytics.overview.title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t.analytics.overview.subtitle}</p>
      </div>

      {/* Aggregate stats */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 gap-3 sm:grid-cols-4"
        role="region"
        aria-label="Overall statistics"
      >
        <AggregateCard
          icon={<Link2 className="h-5 w-5" />}
          label={t.analytics.overview.totalLinks}
          value={links.length}
        />
        <AggregateCard
          icon={<MousePointerClick className="h-5 w-5" />}
          label={t.analytics.totalClicks}
          value={totalClicks}
          highlight
        />
        <AggregateCard
          icon={<TrendingUp className="h-5 w-5" />}
          label={t.analytics.last24h}
          value={totalClicks24h}
        />
        <AggregateCard
          icon={<BarChart2 className="h-5 w-5" />}
          label={t.analytics.last7d}
          value={totalClicks7d}
        />
      </motion.div>

      {/* Top links table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <BarChart2 className="h-4 w-4" aria-hidden="true" />
            {t.analytics.overview.topLinks}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {links.length === 0 ? (
            <div className="flex flex-col items-center gap-2 py-12 text-center px-4">
              <BarChart2 className="h-8 w-8 text-muted-foreground/40" aria-hidden="true" />
              <p className="text-sm font-medium">{t.analytics.overview.noLinks}</p>
              <p className="text-xs text-muted-foreground">{t.analytics.overview.noLinksHint}</p>
              <Button asChild size="sm" className="mt-2">
                <Link href="/dashboard">{t.dashboard.createButton}</Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table
                className="w-full text-sm"
                role="table"
                aria-label={t.analytics.overview.topLinks}
              >
                <thead>
                  <tr className="border-b border-border">
                    <th
                      scope="col"
                      className="px-4 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {t.analytics.overview.linkColumn}
                    </th>
                    <th
                      scope="col"
                      className="px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {t.analytics.overview.clicksColumn}
                    </th>
                    <th
                      scope="col"
                      className="hidden sm:table-cell px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {t.analytics.last7d}
                    </th>
                    <th
                      scope="col"
                      className="hidden md:table-cell px-4 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider"
                    >
                      {t.analytics.last30d}
                    </th>
                    <th scope="col" className="px-4 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {links.map((link, idx) => (
                    <motion.tr
                      key={link.link_id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.04, duration: 0.3 }}
                      className="border-b border-border last:border-0 hover:bg-accent/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex flex-col gap-0.5 min-w-0">
                          {link.title && (
                            <span className="font-medium truncate max-w-xs">{link.title}</span>
                          )}
                          <div className="flex items-center gap-2 flex-wrap">
                            <code className="text-xs font-mono text-primary shrink-0">
                              /{link.slug}
                            </code>
                            <Badge
                              variant={link.is_active ? "default" : "secondary"}
                              className="text-xs shrink-0"
                            >
                              {link.is_active ? t.common.active : t.common.inactive}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground truncate max-w-xs">
                            {link.url}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right tabular-nums font-semibold text-primary">
                        {(link.total_clicks ?? 0).toLocaleString("en-US")}
                      </td>
                      <td className="hidden sm:table-cell px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {(link.clicks_7d ?? 0).toLocaleString("en-US")}
                      </td>
                      <td className="hidden md:table-cell px-4 py-3 text-right tabular-nums text-muted-foreground">
                        {(link.clicks_30d ?? 0).toLocaleString("en-US")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="gap-1.5 text-xs"
                        >
                          <Link href={`/dashboard/analytics/${link.link_id}`}>
                            <ExternalLink className="h-3 w-3" aria-hidden="true" />
                            {t.analytics.overview.viewDetails}
                          </Link>
                        </Button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

    </div>
  )
}
