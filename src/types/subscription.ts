import type { Database } from "@/types/database"

// ─── Tipos derivados de la base de datos ──────────────────────────

export type Subscription       = Database["public"]["Tables"]["subscriptions"]["Row"]
export type PlanType           = Subscription["plan"]
export type SubscriptionStatus = Subscription["status"]

// ─── Configuración de planes ──────────────────────────────────────

export interface PlanConfig {
  id:          PlanType
  name:        string
  price:       number        // USD por mes (0 = gratis)
  description: string
  features:    string[]
  cta:         string        // Texto del botón CTA
  highlighted: boolean       // Card visualmente destacada
  badge?:      string        // "Most Popular", "Best Value", etc.
}

/**
 * PLANS — Configuración de los 3 planes de SnapLinks.
 *
 * IDs de PayPal Sandbox:
 *   Plus: P-8DM56493D86352247NIHZNEA
 *   Pro:  P-2MW342516Y0845032NIHZQTA
 */
export const PLANS: PlanConfig[] = [
  {
    id:          "free",
    name:        "Free",
    price:       0,
    description: "Perfect for getting started with link shortening.",
    features: [
      "Up to 5 links per month",
      "Basic click counter",
      "QR code generation",
      "Links never expire",
    ],
    cta:         "Get Started",
    highlighted: false,
  },
  {
    id:          "plus",
    name:        "Plus",
    price:       5,
    description: "Full analytics and unlimited links for creators.",
    features: [
      "Unlimited short links",
      "Full analytics dashboard",
      "Custom slugs",
      "Click tracking by country & device",
      "QR code with branding",
      "Email support",
    ],
    cta:         "Start Plus",
    highlighted: true,
    badge:       "Most Popular",
  },
  {
    id:          "pro",
    name:        "Pro",
    price:       15,
    description: "Advanced features for teams and businesses.",
    features: [
      "Everything in Plus",
      "Team access (up to 5 members)",
      "Custom domain support",
      "API access",
      "Advanced analytics export",
      "Priority support",
    ],
    cta:         "Start Pro",
    highlighted: false,
    badge:       "Best Value",
  },
]

// ─── Cálculo de prorrateo ─────────────────────────────────────────

export interface ProratedBilling {
  daysUsed:        number   // Días usados desde el inicio del período
  daysRemaining:   number   // Días restantes hasta fin del período
  totalDays:       number   // Total de días del período de facturación
  amountCharged:   string   // Monto a cobrar en USD (2 decimales)
  estimatedCredit: string   // Crédito estimado por días no usados
}

/**
 * calculateProration — Calcula el desglose de facturación proporcional.
 *
 * @param planPrice   - Precio mensual del plan en USD
 * @param periodStart - ISO string del inicio del período actual
 * @param periodEnd   - ISO string del fin del período actual
 */
export const calculateProration = (
  planPrice:   number,
  periodStart: string,
  periodEnd:   string
): ProratedBilling => {
  const start    = new Date(periodStart)
  const end      = new Date(periodEnd)
  const today    = new Date()
  const msPerDay = 1000 * 60 * 60 * 24

  const totalDays     = Math.max(1, Math.ceil((end.getTime()   - start.getTime()) / msPerDay))
  const rawDaysUsed   = Math.ceil((today.getTime() - start.getTime()) / msPerDay)
  const daysUsed      = Math.min(Math.max(0, rawDaysUsed), totalDays)
  const daysRemaining = totalDays - daysUsed
  const dailyRate     = planPrice / totalDays

  return {
    daysUsed,
    daysRemaining,
    totalDays,
    amountCharged:   (daysUsed      * dailyRate).toFixed(2),
    estimatedCredit: (daysRemaining * dailyRate).toFixed(2),
  }
}
