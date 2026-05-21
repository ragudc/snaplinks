import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { LinksSection } from "@/components/dashboard/LinksSection"
import type { LinkStats } from "@/types/link"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const { data, count } = await supabase
    .from("link_stats")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(0, 19)

  return (
    <LinksSection
      initialLinks={(data ?? []) as LinkStats[]}
      initialCount={count ?? 0}
    />
  )
}
