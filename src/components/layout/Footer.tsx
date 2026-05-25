"use client"

import Link from "next/link"
import { Link2, Mail } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/layout/ThemeToggle"
import { useTranslation } from "@/lib/i18n"

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

export function Footer() {
  const { t } = useTranslation()
  const year = new Date().getFullYear()

  return (
    <footer className="border-border/40 bg-background w-full border-t">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col gap-8 sm:flex-row sm:items-start sm:justify-between">
          {/* Brand */}
          <div className="flex flex-col gap-2">
            <Link
              href="/"
              className="text-foreground flex w-fit items-center gap-2 font-semibold transition-opacity hover:opacity-80"
              aria-label="SnapLinks — Home"
            >
              <Link2 className="text-primary h-4 w-4" aria-hidden="true" />
              <span className="text-sm tracking-tight">SnapLinks</span>
            </Link>
            <p className="text-muted-foreground max-w-55 text-xs">
              {t.footer.tagline}
            </p>
          </div>

          {/* Navigation links */}
          <nav className="flex flex-col gap-2" aria-label="Footer navigation">
            <p className="text-foreground text-xs font-medium">
              {t.nav.home.toUpperCase()}
            </p>
            <div className="flex flex-col gap-1.5">
              <Link
                href="/"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {t.nav.home}
              </Link>
              <Link
                href="/dashboard"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {t.nav.dashboard}
              </Link>
              <Link
                href="/login"
                className="text-muted-foreground hover:text-foreground text-xs transition-colors"
              >
                {t.nav.login}
              </Link>
            </div>
          </nav>

          {/* Developer info */}
          <div className="flex flex-col gap-2">
            <p className="text-foreground text-xs font-medium">
              {t.footer.builtBy}
            </p>
            <div className="flex flex-col gap-1.5">
              <span className="text-xs">Roberto Agudelo</span>
              <a
                href="https://github.com/ragudc"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-xs transition-colors"
              >
                <GitHubIcon className="h-3.5 w-3.5" />
                GitHub
              </a>
              <a
                href="https://www.linkedin.com/in/robertoalejandroagudelocallejas"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-xs transition-colors"
              >
                <LinkedInIcon className="h-3.5 w-3.5" />
                LinkedIn
              </a>
              <a
                href="mailto:robertoagudeloc@gmail.com"
                className="text-muted-foreground hover:text-foreground flex w-fit items-center gap-1.5 text-xs transition-colors"
              >
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
                robertoagudeloc@gmail.com
              </a>
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        {/* Bottom row */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-xs">
            © {year} SnapLinks. {t.footer.copyright}
          </p>
          <div className="flex items-center gap-3">
            <p className="text-muted-foreground text-xs">
              {t.footer.poweredBy}{" "}
              <a
                href="https://supabase.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Supabase
              </a>
              {" & "}
              <a
                href="https://nextjs.org"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-foreground underline underline-offset-2 transition-colors"
              >
                Next.js
              </a>
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  )
}
