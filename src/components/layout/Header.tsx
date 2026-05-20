"use client"

import { useState } from "react"
import Link from "next/link"
import { Link2, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { LanguageToggle } from "@/components/layout/LanguageToggle"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

export function Header() {
  const { t } = useTranslation()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-sm">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* ── Logo ─────────────────────────────────────────────── */}
        <Link
          href="/"
          className="flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity"
          aria-label="SnapLinks — Home"
        >
          <Link2 className="h-5 w-5 text-primary" aria-hidden="true" />
          <span className="text-base tracking-tight">SnapLinks</span>
        </Link>

        {/* ── Desktop nav ──────────────────────────────────────── */}
        <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/">{t.nav.home}</Link>
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/pricing">{t.nav.pricing}</Link>
          </Button>
        </nav>

        {/* ── Desktop actions ───────────────────────────────────── */}
        <div className="hidden md:flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <Separator orientation="vertical" className="mx-1 h-5" />
          <Button variant="ghost" size="sm" asChild>
            <Link href="/login">{t.nav.login}</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/login?tab=signup">{t.nav.signUp}</Link>
          </Button>
        </div>

        {/* ── Mobile actions ───────────────────────────────────── */}
        <div className="flex md:hidden items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
            aria-expanded={menuOpen}
          >
            {menuOpen
              ? <X className="h-4 w-4" aria-hidden="true" />
              : <Menu className="h-4 w-4" aria-hidden="true" />
            }
          </Button>
        </div>
      </div>

      {/* ── Mobile menu ──────────────────────────────────────────── */}
      {menuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background px-4 pb-4 pt-2">
          <nav className="flex flex-col gap-1" aria-label="Mobile navigation">
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setMenuOpen(false)}
            >
              <Link href="/">{t.nav.home}</Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setMenuOpen(false)}
            >
              <Link href="/pricing">{t.nav.pricing}</Link>
            </Button>
            <Separator className="my-1" />
            <Button
              variant="ghost"
              className="w-full justify-start"
              asChild
              onClick={() => setMenuOpen(false)}
            >
              <Link href="/login">{t.nav.login}</Link>
            </Button>
            <Button
              className="w-full"
              asChild
              onClick={() => setMenuOpen(false)}
            >
              <Link href="/login?tab=signup">{t.nav.signUp}</Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  )
}
