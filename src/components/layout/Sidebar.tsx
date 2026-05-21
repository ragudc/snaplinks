"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Zap, Link2, BarChart2, Settings, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useUser } from "@/hooks/useUser"
import { cn } from "@/lib/utils"

interface SidebarProps {
  onNavigate?: () => void
}

const NAV_ITEMS = [
  { href: "/dashboard",           icon: Link2,     label: "My Links"   },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics"  },
  { href: "/dashboard/settings",  icon: Settings,  label: "Settings"   },
] as const

export function Sidebar({ onNavigate }: SidebarProps) {
  const pathname = usePathname()
  const { user, isLoading, signOut } = useUser()

  const initials    = user?.email?.slice(0, 2).toUpperCase() ?? "U"
  const displayName = (user?.user_metadata?.full_name as string | undefined)
    ?? user?.email?.split("@")[0]
    ?? "User"

  return (
    <div className="flex h-full flex-col">

      {/* Logo */}
      <div className="flex h-14 items-center gap-2 px-4 font-bold">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" aria-hidden="true" />
        </div>
        <span className="text-base">SnapLinks</span>
      </div>

      <Separator />

      {/* Navegación */}
      <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label="Dashboard navigation">
        <ul className="flex flex-col gap-0.5" role="list">
          {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
            const isActive =
              pathname === href ||
              (href !== "/dashboard" && pathname.startsWith(href))

            return (
              <li key={href}>
                <Link
                  href={href}
                  onClick={onNavigate}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    "transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                  {label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <Separator />

      {/* User info + Sign Out */}
      <div className="p-3">
        {!isLoading && user && (
          <div className="flex items-center gap-3 rounded-md p-2">
            <Avatar className="h-8 w-8 shrink-0">
              <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-medium leading-tight truncate">{displayName}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
              onClick={signOut}
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </div>

    </div>
  )
}
