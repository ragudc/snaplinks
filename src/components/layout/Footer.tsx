"use client"

import Link from "next/link"
import { Link2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { useTranslation } from "@/lib/i18n"

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border/40 bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* ── Brand ───────────────────────────────────────────── */}
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold text-foreground hover:opacity-80 transition-opacity w-fit"
              aria-label="SnapLinks — Home"
            >
              <Link2 className="h-4 w-4 text-primary" aria-hidden="true" />
              <span className="text-sm tracking-tight">SnapLinks</span>
            </Link>
            <p className="text-xs text-muted-foreground max-w-[220px]">
              {t.footer.tagline}
            </p>
          </div>

          {/* ── Links ───────────────────────────────────────────── */}
          <nav
            className="flex flex-wrap gap-x-6 gap-y-2"
            aria-label="Footer navigation"
          >
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.footer.links.privacy}
            </Link>
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.footer.links.terms}
            </Link>
            <Link
              href="/contact"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.footer.links.contact}
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors"
            >
              {t.footer.links.github}
            </a>
          </nav>
        </div>

        <Separator className="my-6" />

        {/* ── Bottom row ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-muted-foreground">
            © {year} SnapLinks. {t.footer.copyright}
          </p>
          <p className="text-xs text-muted-foreground">
            {t.footer.poweredBy}{" "}
            <a
              href="https://supabase.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              Supabase
            </a>
            {" & "}
            <a
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors underline underline-offset-2"
            >
              Next.js
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
