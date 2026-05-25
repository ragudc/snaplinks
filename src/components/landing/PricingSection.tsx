"use client"

import Link from "next/link"
import { Check } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { PLANS } from "@/types/subscription"
import { useTranslation } from "@/lib/i18n"
import { cn } from "@/lib/utils"

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1 },
  }),
}

export function PricingSection() {
  const { t } = useTranslation()

  return (
    <section
      className="px-4 py-16 sm:px-6 md:py-24 bg-muted/30"
      aria-labelledby="landing-pricing-title"
    >
      <div className="mx-auto max-w-5xl flex flex-col gap-12">
        <div className="text-center flex flex-col gap-3">
          <h2
            id="landing-pricing-title"
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl"
          >
            {t.landing.pricing.title}
          </h2>
          <p className="mx-auto max-w-xl text-sm text-muted-foreground sm:text-base">
            {t.landing.pricing.subtitle}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-3 sm:items-stretch">
          {PLANS.map((plan, i) => {
            const text = t.pricing.plans[plan.id]
            const isFree = plan.price === 0
            const features = Object.values(text.features).filter(Boolean)

            return (
              <motion.div
                key={plan.id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeInUp}
                className="flex"
              >
                <Card
                  className={cn(
                    "relative flex h-full w-full flex-col",
                    plan.highlighted
                      ? "border-primary shadow-primary/10 shadow-xl"
                      : "border-border hover:shadow-md transition-shadow"
                  )}
                >
                  {text.badge && (
                    <div className="absolute top-3 left-1/2 z-10 -translate-x-1/2">
                      <Badge
                        className={cn(
                          "whitespace-nowrap px-3 py-0.5 text-xs font-semibold",
                          plan.highlighted
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
                          {t.common.free}
                        </span>
                      ) : (
                        <>
                          <span className="text-4xl font-extrabold tracking-tight">
                            ${plan.price}
                          </span>
                          <span className="pb-1 text-muted-foreground">{t.pricing.perMonth}</span>
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
                              plan.highlighted ? "text-primary" : "text-muted-foreground"
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
                      variant={plan.highlighted ? "default" : "outline"}
                      size="lg"
                    >
                      <Link href="/login">{text.cta}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
