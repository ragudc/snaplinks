import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { AnalyticsOverview } from "@/components/analytics/AnalyticsOverview"
import type { LinkStats } from "@/types/link"

export default async function AnalyticsOverviewPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data } = await supabase
    .from("link_stats")
    .select("*")
    .eq("user_id", user.id)
    .order("total_clicks", { ascending: false })

  return <AnalyticsOverview links={(data ?? []) as LinkStats[]} />
}
