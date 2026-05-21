import type { DailyClicks, ClicksByHour, ClicksByCountry, ClicksByDevice } from "@/types/analytics"
import type { LinkClick, DeviceType } from "@/types/link"

export const buildDailyTimeline = (
  clicks: Pick<LinkClick, "clicked_at">[],
  days = 30
): DailyClicks[] => {
  const map = new Map<string, number>()

  clicks.forEach(({ clicked_at }) => {
    const date = clicked_at.split("T")[0]
    map.set(date, (map.get(date) ?? 0) + 1)
  })

  const result: DailyClicks[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date()
    d.setUTCDate(d.getUTCDate() - i)
    const dateStr = d.toISOString().split("T")[0]
    result.push({ date: dateStr, clicks: map.get(dateStr) ?? 0 })
  }

  return result
}

export const buildHourlyBreakdown = (
  clicks: Pick<LinkClick, "clicked_at">[]
): ClicksByHour[] => {
  const buckets = Array.from({ length: 24 }, (_, hour) => ({
    hour,
    clicks: 0,
  }))

  clicks.forEach(({ clicked_at }) => {
    const hour = new Date(clicked_at).getUTCHours()
    buckets[hour].clicks++
  })

  return buckets
}

export const buildCountryBreakdown = (
  clicks: Pick<LinkClick, "country">[],
  topN = 5
): ClicksByCountry[] => {
  const map = new Map<string, number>()

  clicks.forEach(({ country }) => {
    if (!country) return
    map.set(country, (map.get(country) ?? 0) + 1)
  })

  const totalWithCountry = [...map.values()].reduce((a, b) => a + b, 0)
  if (totalWithCountry === 0) return []

  return [...map.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, topN)
    .map(([country, count]) => ({
      country,
      clicks:     count,
      percentage: Math.round((count / totalWithCountry) * 100),
    }))
}

const DEVICE_ORDER: DeviceType[] = ["mobile", "desktop", "tablet", "unknown"]

export const buildDeviceBreakdown = (
  clicks: Pick<LinkClick, "device_type">[]
): ClicksByDevice[] => {
  const map = new Map<DeviceType, number>()

  clicks.forEach(({ device_type }) => {
    const dt = (device_type ?? "unknown") as DeviceType
    map.set(dt, (map.get(dt) ?? 0) + 1)
  })

  const total = clicks.length
  if (total === 0) return []

  return DEVICE_ORDER
    .filter(d => (map.get(d) ?? 0) > 0)
    .map(device => ({
      device,
      clicks:     map.get(device) ?? 0,
      percentage: Math.round(((map.get(device) ?? 0) / total) * 100),
    }))
    .sort((a, b) => b.clicks - a.clicks)
}

export const formatChartDate = (dateStr: string): string =>
  new Date(dateStr + "T00:00:00Z").toLocaleDateString("en-US", {
    month: "short",
    day:   "numeric",
    timeZone: "UTC",
  })

export const formatChartHour = (hour: number): string => {
  if (hour === 0)  return "12 AM"
  if (hour === 12) return "12 PM"
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`
}
