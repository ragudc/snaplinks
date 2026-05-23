"use client"

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/lib/i18n"
import { useChartColors } from "@/hooks/useChartColors"
import { formatChartHour } from "@/lib/utils/analytics-utils"
import { cn } from "@/lib/utils"
import type { ClicksByHour } from "@/types/analytics"

export function ClicksChartSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-45 md:h-55 w-full rounded-lg" />
      </CardContent>
    </Card>
  )
}

interface CustomTooltipProps {
  active?:  boolean
  payload?: Array<{ value?: number }>
  label?:   string | number
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-popover px-3 py-2 shadow-lg">
      <p className="text-xs text-muted-foreground">{formatChartHour(Number(label))}</p>
      <p className="text-base font-bold">
        {payload[0]?.value?.toLocaleString("en-US")}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          {Number(payload[0]?.value) === 1 ? "click" : "clicks"}
        </span>
      </p>
    </div>
  )
}

interface ClicksChartProps {
  data:       ClicksByHour[]
  className?: string
}

export function ClicksChart({ data, className }: ClicksChartProps) {
  const { t }  = useTranslation()
  const colors = useChartColors()

  const maxClicks = Math.max(...data.map(d => d.clicks), 0)

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          {t.analytics.clicksByHour}
          <span className="text-xs font-normal text-muted-foreground">UTC</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="h-45 md:h-55 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={colors.border}
                vertical={false}
              />

              <XAxis
                dataKey="hour"
                tickFormatter={formatChartHour}
                tick={{ fill: colors.mutedForeground, fontSize: 10 }}
                tickLine={false}
                axisLine={false}
                interval={5}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: colors.mutedForeground, fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={32}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: colors.accent, opacity: 0.5 }}
              />

              <Bar dataKey="clicks" radius={[3, 3, 0, 0]}>
                {data.map((entry) => (
                  <Cell
                    key={`cell-${entry.hour}`}
                    fill={
                      entry.clicks === maxClicks && maxClicks > 0
                        ? colors.primary
                        : colors.primarySubtle
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
