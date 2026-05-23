"use client"

import { Check, Zap } from "lucide-react"
import Link from "next/link"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge }  from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { PLANS }  from "@/types/subscription"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────

interface PlanText {
  name:        string
  description: string
  badge:       string
  cta:         string
  features:    Record<string, string>
}

interface PricingCardProps {
  planId:      string
  price:       number
  highlighted: boolean
  text:        PlanText
  perMonth:    string
  freeLabel:   string
}

// ─── PricingCard ──────────────────────────────────────────────────

function PricingCard({
  planId,
  price,
  highlighted,
  text,
  perMonth,
  freeLabel,
}: PricingCardProps) {
  const isFree   = price === 0
  const href     = isFree ? "/login?tab=signup" : `/checkout?plan=${planId}`
  const features = Object.values(text.features).filter(Boolean)

  return (
    <Card
      className={cn(
        "relative flex h-full flex-col transition-all duration-200",
        highlighted
          ? "border-primary shadow-primary/10 shadow-xl"
          : "border-border hover:shadow-md"
      )}
    >
      {text.badge && (
        <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2">
          <Badge
            className={cn(
              "whitespace-nowrap px-3 py-0.5 text-xs font-semibold shadow-sm",
              highlighted
                ? "bg-primary text-primary-foreground"
                : "border border-border bg-muted text-muted-foreground"
            )}
          >
            {text.badge}
          </Badge>
        </div>
      )}

      <CardHeader className="pb-4 pt-8 text-center">
        <h3 className="text-xl font-bold">{text.name}</h3>
        <p className="mt-1 min-h-10 text-sm text-muted-foreground">
          {text.description}
        </p>

        <div className="mt-5 flex items-end justify-center gap-1">
          {isFree ? (
            <span className="text-4xl font-extrabold tracking-tight">
              {freeLabel}
            </span>
          ) : (
            <>
              <span className="text-4xl font-extrabold tracking-tight">
                ${price}
              </span>
              <span className="pb-1 text-muted-foreground">{perMonth}</span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 px-6 pb-6 pt-0">
        <ul className="flex flex-col gap-2.5" role="list">
          {features.map((feature) => (
            <li key={feature} className="flex items-start gap-2.5 text-sm">
              <Check
                className={cn(
                  "mt-0.5 h-4 w-4 shrink-0",
                  highlighted ? "text-primary" : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="px-6 pb-6 pt-0">
        <Button
          asChild
          className="w-full"
          variant={highlighted ? "default" : "outline"}
          size="lg"
        >
          <Link href={href}>{text.cta}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

// ─── PricingContent ───────────────────────────────────────────────

export function PricingContent() {
  const { t } = useTranslation()

  const faqs = [
    { q: t.pricing.faq.q1, a: t.pricing.faq.a1 },
    { q: t.pricing.faq.q2, a: t.pricing.faq.a2 },
    { q: t.pricing.faq.q3, a: t.pricing.faq.a3 },
    { q: t.pricing.faq.q4, a: t.pricing.faq.a4 },
  ]

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="border-b border-border py-14 text-center md:py-20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <div className="mb-4 flex justify-center">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
                <Zap className="h-3 w-3" aria-hidden="true" />
                {t.pricing.badge}
              </Badge>
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight xs:text-4xl md:text-5xl">
              {t.pricing.hero.title}{" "}
              <span className="text-primary">{t.pricing.hero.titleHighlight}</span>{" "}
              {t.pricing.hero.titleEnd}
            </h1>

            <p className="mx-auto mt-4 max-w-xl text-base text-muted-foreground md:text-lg">
              {t.pricing.hero.subtitle}
            </p>
          </div>
        </section>

        {/* ── Plans grid ────────────────────────────────────────── */}
        <section className="py-14 md:py-20" aria-labelledby="pricing-heading">
          <h2 id="pricing-heading" className="sr-only">
            {t.pricing.srOnly}
          </h2>

          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-6 pt-8 lg:grid-cols-3 lg:items-stretch">
              {PLANS.map((plan) => (
                <PricingCard
                  key={plan.id}
                  planId={plan.id}
                  price={plan.price}
                  highlighted={plan.highlighted}
                  text={t.pricing.plans[plan.id]}
                  perMonth={t.pricing.perMonth}
                  freeLabel={t.common.free}
                />
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────── */}
        <section className="border-t border-border bg-muted/20 py-12 md:py-16">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="mb-8 text-center text-xl font-semibold">
              {t.pricing.faq.title}
            </h2>

            <div className="flex flex-col gap-5">
              {faqs.map(({ q, a }) => (
                <div key={q} className="border-b border-border pb-4 last:border-0">
                  <p className="text-sm font-medium">{q}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                    {a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  )
}
