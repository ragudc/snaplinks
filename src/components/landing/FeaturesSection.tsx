"use client"

import { Zap, BarChart2, Gift } from "lucide-react"
import { motion } from "framer-motion"
import { useTranslation } from "@/lib/i18n"

const ICONS = [Zap, BarChart2, Gift] as const

const fadeInUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12 },
  }),
}

export function FeaturesSection() {
  const { t } = useTranslation()

  const features = [
    t.landing.features.items.edgeSpeed,
    t.landing.features.items.realAnalytics,
    t.landing.features.items.freeToStart,
  ] as const

  return (
    <section className="px-4 py-16 sm:px-6 md:py-24" aria-labelledby="features-title">
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

        <div className="grid gap-6 sm:grid-cols-3">
          {features.map((feature, i) => {
            const Icon = ICONS[i]
            return (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-40px" }}
                variants={fadeInUp}
                className="flex flex-col gap-3 rounded-xl border border-border/60 bg-card p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="h-5 w-5 text-primary" aria-hidden="true" />
                </div>
                <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{feature.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
