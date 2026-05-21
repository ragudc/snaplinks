"use client"

import Link from "next/link"
import { Zap, BarChart2, QrCode, Gift, ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { LinkShortener } from "@/components/links/LinkShortener"
import { useTranslation } from "@/lib/i18n"

const FEATURE_ICONS = [Zap, BarChart2, QrCode, Gift] as const

export default function LandingPage() {
  const { t } = useTranslation()

  const features = [
    t.landing.features.items.fast,
    t.landing.features.items.analytics,
    t.landing.features.items.qr,
    t.landing.features.items.free,
  ] as const

  const steps = [
    t.landing.howItWorks.steps.one,
    t.landing.howItWorks.steps.two,
    t.landing.howItWorks.steps.three,
  ] as const

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* -- Hero --------------------------------------------------- */}
        <section
          className="relative flex flex-col items-center gap-8 px-4 py-20 text-center sm:px-6 md:py-28 lg:py-36"
          aria-labelledby="hero-title"
        >
          {/* Subtle radial gradient background */}
          <div
            className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,hsl(var(--primary)/0.08),transparent)]"
            aria-hidden="true"
          />

          <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs font-medium">
            {t.landing.hero.badge}
          </Badge>

          <div className="flex max-w-3xl flex-col gap-4">
            <h1
              id="hero-title"
              className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl md:text-5xl lg:text-6xl"
            >
              {t.landing.hero.title}
            </h1>
            <p className="mx-auto max-w-xl text-base text-muted-foreground sm:text-lg">
              {t.landing.hero.subtitle}
            </p>
          </div>

          <div className="w-full max-w-2xl">
            <LinkShortener />
          </div>
        </section>

        <Separator />

        {/* -- Features ----------------------------------------------- */}
        <section
          className="px-4 py-16 sm:px-6 md:py-24"
          aria-labelledby="features-title"
        >
          <div className="mx-auto max-w-6xl flex flex-col gap-12">
            <div className="text-center flex flex-col gap-3">
              <h2
                id="features-title"
                className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                {t.landing.features.title}
              </h2>
              <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
                {t.landing.features.subtitle}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map((feature, i) => {
                const Icon = FEATURE_ICONS[i]
                return (
                  <div
                    key={feature.title}
                    className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-6 shadow-sm"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                    </div>
                    <h3 className="text-sm font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        <Separator />

        {/* -- How it works ------------------------------------------- */}
        <section
          className="px-4 py-16 sm:px-6 md:py-24"
          aria-labelledby="how-title"
        >
          <div className="mx-auto max-w-4xl flex flex-col gap-12">
            <div className="text-center flex flex-col gap-3">
              <h2
                id="how-title"
                className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                {t.landing.howItWorks.title}
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                {t.landing.howItWorks.subtitle}
              </p>
            </div>

            <ol className="grid gap-8 sm:grid-cols-3" role="list">
              {steps.map((step, i) => (
                <li key={step.number} className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground text-sm font-bold"
                      aria-hidden="true"
                    >
                      {step.number}
                    </span>
                    {/* Connector line between steps */}
                    {i < steps.length - 1 && (
                      <div className="hidden sm:block flex-1 h-px bg-border" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <h3 className="text-sm font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <Separator />

        {/* -- CTA ---------------------------------------------------- */}
        <section
          className="px-4 py-16 sm:px-6 md:py-24"
          aria-labelledby="cta-title"
        >
          <div className="mx-auto max-w-2xl flex flex-col items-center gap-6 text-center">
            <div className="flex flex-col gap-3">
              <h2
                id="cta-title"
                className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
              >
                {t.landing.cta.title}
              </h2>
              <p className="text-sm text-muted-foreground sm:text-base">
                {t.landing.cta.subtitle}
              </p>
            </div>

            <Button size="lg" className="gap-2" asChild>
              <Link href="/login?tab=signup">
                {t.landing.cta.button}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>

            <p className="text-xs text-muted-foreground">
              {t.landing.cta.note}
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
