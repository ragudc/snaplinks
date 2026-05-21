import type { Metadata } from "next"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Sidebar } from "@/components/layout/Sidebar"
import { DashboardHeader } from "@/components/layout/DashboardHeader"

export const metadata: Metadata = {
  title: "Dashboard — SnapLinks",
  description: "Manage your SnapLinks short links and analytics.",
}

/**
 * Dashboard Layout
 *
 * - Mobile (< lg): DashboardHeader sticky + contenido sin sidebar
 * - Desktop (lg+): Sidebar fijo a la izquierda + contenido
 *
 * Doble check de auth: el middleware ya redirige, pero el Server Component
 * hace su propia verificación como segunda línea de defensa.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")

  return (
    <div className="flex min-h-screen bg-muted/10">

      {/* Sidebar fijo — solo desktop (lg+) */}
      <aside className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:border-r lg:border-border lg:bg-background">
        <Sidebar />
      </aside>

      {/* Contenido principal */}
      <div className="flex flex-1 flex-col min-w-0">
        <DashboardHeader />
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </div>

    </div>
  )
}
