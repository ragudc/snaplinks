import type { Metadata } from "next"
import { PricingContent } from "./PricingContent"

export const metadata: Metadata = {
  title: "Pricing — SnapLinks",
  description:
    "Simple, transparent pricing. Start free, upgrade when you need more power.",
}

export default function PricingPage() {
  return <PricingContent />
}
