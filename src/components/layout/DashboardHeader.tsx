"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Sidebar } from "@/components/layout/Sidebar"
import { useUser } from "@/hooks/useUser"

/**
 * DashboardHeader — Barra superior visible solo en mobile (< lg).
 * En desktop el Sidebar fijo sustituye este header.
 */
export function DashboardHeader() {
  const { user } = useUser()
  const [open, setOpen] = useState(false)

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "U"

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-border bg-background px-4 lg:hidden">
      <div className="flex items-center gap-3">
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" aria-hidden="true" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <Sidebar onNavigate={() => setOpen(false)} />
          </SheetContent>
        </Sheet>

        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary">
            <Zap className="h-3.5 w-3.5 text-primary-foreground" aria-hidden="true" />
          </div>
          <span>SnapLinks</span>
        </Link>
      </div>

      <Avatar className="h-8 w-8">
        <AvatarFallback className="text-xs bg-primary text-primary-foreground">
          {initials}
        </AvatarFallback>
      </Avatar>
    </header>
  )
}
