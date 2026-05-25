import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Separator } from "@/components/ui/separator"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { PricingSection } from "@/components/landing/PricingSection"

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <Separator />
        <FeaturesSection />
        <Separator />
        <PricingSection />
      </main>
      <Footer />
    </div>
  )
}
