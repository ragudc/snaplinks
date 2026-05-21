import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { DashboardHeader } from "@/components/layout/DashboardHeader"

export const metadata: Metadata = {
  title: "Dashboard — SnapLinks",
  description: "Manage your SnapLinks short links and analytics.",
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  const serverUser = {
    email:       user.email ?? "",
    displayName: (user.user_metadata?.full_name as string | undefined)
      ?? user.email?.split("@")[0]
      ?? "User",
    initials:    user.email?.slice(0, 2).toUpperCase() ?? "U",
  }

  return (
    <div className="flex min-h-screen bg-muted/10">

      {/* Sidebar fijo — solo desktop (lg+) */}
      <aside className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-background">
        <Sidebar serverUser={serverUser} />
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader serverUser={serverUser} />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  )
}
