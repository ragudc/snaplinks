"use client"

import { motion } from "framer-motion"
import { Globe } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { getCountryName, getCountryFlag } from "@/lib/utils/country-utils"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { ClicksByCountry } from "@/types/analytics"

export function CountryBreakdownSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-32" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-4 w-4 rounded" />
            <Skeleton className="h-3 flex-1 rounded-full" />
            <Skeleton className="h-3 w-8" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.06 } },
}

const rowVariants = {
  hidden:  { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
}

interface CountryBreakdownProps {
  data:       ClicksByCountry[]
  className?: string
}

export function CountryBreakdown({ data, className }: CountryBreakdownProps) {
  const { t } = useTranslation()

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Globe className="h-4 w-4" aria-hidden="true" />
          {t.analytics.topCountries}
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No geographic data yet.
          </p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-3"
          >
            {data.map(({ country, clicks, percentage }) => (
              <motion.div
                key={country}
                variants={rowVariants}
                className="flex items-center gap-3"
                aria-label={`${getCountryName(country)}: ${clicks} clicks, ${percentage}%`}
              >
                <span className="text-base shrink-0" aria-hidden="true">
                  {getCountryFlag(country)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium truncate">
                      {getCountryName(country)}
                    </span>
                    <span className="text-xs text-muted-foreground shrink-0 ml-2">
                      {clicks.toLocaleString("en-US")}
                    </span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: "0%" }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" as const }}
                      aria-hidden="true"
                    />
                  </div>
                </div>
                <span className="text-xs text-muted-foreground shrink-0 w-8 text-right tabular-nums">
                  {percentage}%
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
