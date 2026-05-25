"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { LinkShortener } from "@/components/links/LinkShortener"
import { useTranslation } from "@/lib/i18n"

export function HeroSection() {
  const { t } = useTranslation()

  return (
    <section
      className="relative flex flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 md:py-28 lg:py-36"
      aria-labelledby="hero-title"
    >
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.08),transparent)]"
        aria-hidden="true"
      />

      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
          {t.landing.hero.noSignupBadge}
        </Badge>
      </motion.div>

      <motion.div
        className="flex max-w-3xl flex-col gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <h1
          id="hero-title"
          className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          {t.landing.hero.title}
        </h1>
        <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
          {t.landing.hero.subtitle}
        </p>
      </motion.div>

      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <LinkShortener />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Button variant="ghost" size="sm" asChild className="gap-2 text-muted-foreground">
          <Link href="/dashboard">
            {t.landing.hero.viewDashboard}
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </Button>
      </motion.div>
    </section>
  )
}
