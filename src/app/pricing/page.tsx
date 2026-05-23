import type { Metadata } from "next"
import Link from "next/link"
import { Check, Zap } from "lucide-react"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge }    from "@/components/ui/badge"
import { Button }   from "@/components/ui/button"
import { Header }   from "@/components/layout/Header"
import { Footer }   from "@/components/layout/Footer"
import { PLANS, type PlanConfig } from "@/types/subscription"
import { cn } from "@/lib/utils"

export const metadata: Metadata = {
  title: "Pricing — SnapLinks",
  description:
    "Simple, transparent pricing. Start free, upgrade when you need more power.",
}

function PricingCard({ plan }: { plan: PlanConfig }) {
  const isFree = plan.price === 0
  const href   = isFree
    ? "/login?tab=signup"
    : `/checkout?plan=${plan.id}`

  return (
    <Card
      className={cn(
        "relative flex flex-col transition-all duration-200",
        plan.highlighted
          ? [
              "border-primary shadow-xl shadow-primary/10",
              "lg:scale-105 lg:-translate-y-1",
            ]
          : "border-border hover:shadow-md hover:-translate-y-0.5"
      )}
    >
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
          <Badge
            className={cn(
              "px-3 py-0.5 text-xs font-semibold whitespace-nowrap shadow-sm",
              plan.highlighted
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground border border-border"
            )}
          >
            {plan.badge}
          </Badge>
        </div>
      )}

      <CardHeader className="pt-8 pb-4 text-center">
        <h3 className="text-xl font-bold">{plan.name}</h3>
        <p className="text-sm text-muted-foreground mt-1 min-h-[2.5rem]">
          {plan.description}
        </p>

        <div className="mt-5 flex items-end justify-center gap-1">
          {isFree ? (
            <span className="text-4xl font-extrabold tracking-tight">
              Free
            </span>
          ) : (
            <>
              <span className="text-4xl font-extrabold tracking-tight">
                ${plan.price}
              </span>
              <span className="text-muted-foreground pb-1">/month</span>
            </>
          )}
        </div>
      </CardHeader>

      <CardContent className="flex-1 pt-0 pb-6 px-6">
        <ul className="flex flex-col gap-2.5" role="list">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-sm"
            >
              <Check
                className={cn(
                  "h-4 w-4 shrink-0 mt-0.5",
                  plan.highlighted
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                aria-hidden="true"
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-0 pb-6 px-6">
        <Button
          asChild
          className="w-full"
          variant={plan.highlighted ? "default" : "outline"}
          size="lg"
        >
          <Link href={href}>{plan.cta}</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">

        <section className="py-14 md:py-20 text-center border-b border-border">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <div className="mb-4 flex justify-center">
              <Badge variant="secondary" className="gap-1.5 px-3 py-1 text-xs">
                <Zap className="h-3 w-3" aria-hidden="true" />
                Simple, transparent pricing
              </Badge>
            </div>

            <h1 className="text-3xl xs:text-4xl md:text-5xl font-extrabold tracking-tight">
              Start free.{" "}
              <span className="text-primary">Upgrade</span> when you&apos;re ready.
            </h1>

            <p className="mt-4 text-base md:text-lg text-muted-foreground max-w-xl mx-auto">
              No hidden fees. No contracts. Cancel anytime and only pay for
              the days you&apos;ve used.
            </p>
          </div>
        </section>

        <section
          className="py-14 md:py-20"
          aria-labelledby="pricing-heading"
        >
          <h2 id="pricing-heading" className="sr-only">
            Pricing plans
          </h2>

          <div className="mx-auto max-w-5xl px-4 sm:px-6">
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-start lg:pt-6">
              {PLANS.map((plan) => (
                <PricingCard key={plan.id} plan={plan} />
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-border py-12 md:py-16 bg-muted/20">
          <div className="mx-auto max-w-2xl px-4 sm:px-6">
            <h2 className="text-xl font-semibold text-center mb-8">
              Common Questions
            </h2>

            <div className="flex flex-col gap-5">
              {[
                {
                  q: "Can I cancel anytime?",
                  a: "Yes — cancel anytime from your dashboard. You'll only be charged for the days you've actually used. Any remaining credit is calculated and shown to you before confirming.",
                },
                {
                  q: "Is my payment information secure?",
                  a: "Absolutely. All payments are processed securely through PayPal. SnapLinks never stores your card details.",
                },
                {
                  q: "What happens to my links if I downgrade?",
                  a: "Your existing links stay active forever. If you exceed the Free plan's monthly limit, new link creation pauses until the next billing cycle.",
                },
                {
                  q: "Do you offer annual billing?",
                  a: "Annual billing with a 20% discount is coming soon. Stay tuned!",
                },
              ].map(({ q, a }) => (
                <div key={q} className="border-b border-border pb-4 last:border-0">
                  <p className="font-medium text-sm">{q}</p>
                  <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
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
