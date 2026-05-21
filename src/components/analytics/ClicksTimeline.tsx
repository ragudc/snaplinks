"use client"

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useTranslation } from "@/lib/i18n"
import { formatChartDate } from "@/lib/utils/analytics-utils"
import { cn } from "@/lib/utils"
import type { DailyClicks } from "@/types/analytics"

export function ClicksTimelineSkeleton() {
  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <Skeleton className="h-5 w-44" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-[200px] md:h-[240px] w-full rounded-lg" />
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
      <p className="text-xs text-muted-foreground">{formatChartDate(label as string)}</p>
      <p className="text-base font-bold">
        {payload[0]?.value?.toLocaleString("en-US")}{" "}
        <span className="text-sm font-normal text-muted-foreground">
          {Number(payload[0]?.value) === 1 ? "click" : "clicks"}
        </span>
      </p>
    </div>
  )
}

interface ClicksTimelineProps {
  data:       DailyClicks[]
  className?: string
}

export function ClicksTimeline({ data, className }: ClicksTimelineProps) {
  const { t } = useTranslation()

  const tickInterval = data.length > 20 ? 6 : 3

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between text-base">
          {t.analytics.clicksByDay}
          <span className="text-xs font-normal text-muted-foreground">
            Last 30 days
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pb-5">
        <div className="h-[200px] md:h-[240px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 8, right: 12, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}   />
                </linearGradient>
              </defs>

              <CartesianGrid
                strokeDasharray="3 3"
                stroke="hsl(var(--border))"
                vertical={false}
              />

              <XAxis
                dataKey="date"
                tickFormatter={formatChartDate}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                interval={tickInterval}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11 }}
                tickLine={false}
                axisLine={false}
                width={32}
              />

              <Tooltip
                content={<CustomTooltip />}
                cursor={{ stroke: "hsl(var(--border))", strokeDasharray: "4 2" }}
              />

              <Area
                type="monotone"
                dataKey="clicks"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#clicksGradient)"
                dot={false}
                activeDot={{
                  r: 4,
                  fill: "hsl(var(--primary))",
                  stroke: "hsl(var(--background))",
                  strokeWidth: 2,
                }}
                isAnimationActive
                animationDuration={600}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
