"use client"

import { motion } from "framer-motion"
import { MousePointerClick, Clock, TrendingUp, Globe } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function StatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4 flex flex-col gap-2">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-7 w-20" />
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden:  { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
}

interface StatCardProps {
  icon:       React.ReactNode
  label:      string
  value:      number | string
  highlight?: boolean
}

function StatCard({ icon, label, value, highlight = false }: StatCardProps) {
  return (
    <motion.div variants={cardVariants}>
      <Card className={cn(
        "h-full transition-colors hover:bg-accent/30",
        highlight && "border-primary/40"
      )}>
        <CardContent className="flex flex-col gap-2 p-4">
          <div className={cn(
            "text-muted-foreground",
            highlight && "text-primary"
          )} aria-hidden="true">
            {icon}
          </div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">
            {label}
          </p>
          <p className={cn(
            "text-2xl font-bold tabular-nums leading-tight",
            highlight && "text-primary"
          )}>
            {typeof value === "number"
              ? value.toLocaleString("en-US")
              : value}
          </p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

interface StatsCardsProps {
  totalClicks:     number
  clicks24h:       number
  clicks7d:        number
  clicks30d:       number
  uniqueCountries: number
  className?:      string
}

export function StatsCards({
  totalClicks,
  clicks24h,
  clicks7d,
  uniqueCountries,
  className,
}: StatsCardsProps) {
  const { t } = useTranslation()

  const stats: StatCardProps[] = [
    {
      icon:      <MousePointerClick className="h-5 w-5" />,
      label:     t.analytics.totalClicks,
      value:     totalClicks,
      highlight: true,
    },
    {
      icon:  <Clock className="h-5 w-5" />,
      label: t.analytics.last24h,
      value: clicks24h,
    },
    {
      icon:  <TrendingUp className="h-5 w-5" />,
      label: t.analytics.last7d,
      value: clicks7d,
    },
    {
      icon:  <Globe className="h-5 w-5" />,
      label: "Unique Countries",
      value: uniqueCountries,
    },
  ]

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn("grid grid-cols-2 gap-3 sm:grid-cols-4", className)}
      role="region"
      aria-label="Link statistics summary"
    >
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </motion.div>
  )
}
