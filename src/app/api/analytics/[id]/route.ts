import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import {
  buildDailyTimeline,
  buildHourlyBreakdown,
  buildCountryBreakdown,
  buildDeviceBreakdown,
} from "@/lib/utils/analytics-utils"
import type { AnalyticsData } from "@/hooks/useAnalytics"
import type { LinkClick } from "@/types/link"

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(_req: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const { id } = await params

  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { data: linkStats, error: statsError } = await supabase
    .from("link_stats")
    .select("*")
    .eq("link_id", id)
    .eq("user_id", user.id)
    .maybeSingle()

  if (statsError || !linkStats) {
    return NextResponse.json(
      { error: "Link not found or you do not have permission to view it." },
      { status: 404 }
    )
  }

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setUTCDate(thirtyDaysAgo.getUTCDate() - 30)

  const { data: clicks, error: clicksError } = await supabase
    .from("link_clicks")
    .select("clicked_at, country, device_type, referrer")
    .eq("link_id", id)
    .gte("clicked_at", thirtyDaysAgo.toISOString())
    .order("clicked_at", { ascending: true })

  if (clicksError) {
    console.error("Analytics clicks fetch error:", clicksError)
    return NextResponse.json({ error: "Failed to load click data." }, { status: 500 })
  }

  const { data: allClicks } = await supabase
    .from("link_clicks")
    .select("country")
    .eq("link_id", id)
    .not("country", "is", null)

  const uniqueCountries = new Set(
    (allClicks ?? []).map((c) => c.country).filter(Boolean)
  ).size

  const safeClicks = (clicks ?? []) as Pick<
    LinkClick,
    "clicked_at" | "country" | "device_type"
  >[]

  const response: AnalyticsData = {
    linkId:          id,
    slug:            linkStats.slug,
    url:             linkStats.url,
    title:           linkStats.title,
    is_active:       linkStats.is_active,
    totalClicks:     linkStats.total_clicks,
    clicks24h:       linkStats.clicks_24h,
    clicks7d:        linkStats.clicks_7d,
    clicks30d:       linkStats.clicks_30d,
    uniqueCountries,
    clicksByDay:     buildDailyTimeline(safeClicks, 30),
    clicksByHour:    buildHourlyBreakdown(safeClicks),
    topCountries:    buildCountryBreakdown(safeClicks, 5),
    byDevice:        buildDeviceBreakdown(safeClicks),
  }

  return NextResponse.json(response)
}
