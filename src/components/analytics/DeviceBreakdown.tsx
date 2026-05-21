"use client"

import { motion } from "framer-motion"
import { Smartphone, Monitor, Tablet, HelpCircle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"
import type { ClicksByDevice } from "@/types/analytics"
import type { DeviceType } from "@/types/link"

export function DeviceBreakdownSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-24" />
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <div className="flex-1 flex flex-col gap-1">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-1.5 w-full rounded-full" />
            </div>
            <Skeleton className="h-3 w-10" />
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const DEVICE_CONFIG: Record<DeviceType, {
  Icon:  React.ElementType
  color: string
  bg:    string
}> = {
  mobile:  { Icon: Smartphone, color: "text-blue-500",         bg: "bg-blue-500/10"   },
  desktop: { Icon: Monitor,    color: "text-violet-500",        bg: "bg-violet-500/10" },
  tablet:  { Icon: Tablet,     color: "text-emerald-500",       bg: "bg-emerald-500/10"},
  unknown: { Icon: HelpCircle, color: "text-muted-foreground",  bg: "bg-muted"         },
}

const containerVariants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.08 } },
}

const rowVariants = {
  hidden:  { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
}

interface DeviceBreakdownProps {
  data:       ClicksByDevice[]
  className?: string
}

export function DeviceBreakdown({ data, className }: DeviceBreakdownProps) {
  const { t } = useTranslation()

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{t.analytics.byDevice}</CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4">
            No device data yet.
          </p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-4"
          >
            {data.map(({ device, clicks, percentage }) => {
              const { Icon, color, bg } = DEVICE_CONFIG[device]
              const label = t.analytics.devices[device]

              return (
                <motion.div
                  key={device}
                  variants={rowVariants}
                  className="flex items-center gap-3"
                  aria-label={`${label}: ${clicks} clicks, ${percentage}%`}
                >
                  <div className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-lg",
                    bg
                  )}>
                    <Icon className={cn("h-4 w-4", color)} aria-hidden="true" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-medium capitalize">{label}</span>
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {clicks.toLocaleString("en-US")} clicks
                      </span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                      <motion.div
                        className={cn("h-full rounded-full", {
                          "bg-blue-500":         device === "mobile",
                          "bg-violet-500":       device === "desktop",
                          "bg-emerald-500":      device === "tablet",
                          "bg-muted-foreground": device === "unknown",
                        })}
                        initial={{ width: "0%" }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" as const }}
                        aria-hidden="true"
                      />
                    </div>
                  </div>

                  <span className="text-sm font-semibold shrink-0 w-10 text-right tabular-nums">
                    {percentage}%
                  </span>
                </motion.div>
              )
            })}
          </motion.div>
        )}
      </CardContent>
    </Card>
  )
}
