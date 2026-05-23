"use client"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema"
import { ArrowLeft, Shield, CheckCircle2, Loader2 } from "lucide-react"
import Link from "next/link"
import { PayPalScriptProvider } from "@paypal/react-paypal-js"
import { Button }    from "@/components/ui/button"
import { Input }     from "@/components/ui/input"
import { Label }     from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge }     from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Header }    from "@/components/layout/Header"
import { PayPalSubscriptionButton } from "@/components/checkout/PayPalSubscriptionButton"
import { PLANS }     from "@/types/subscription"
import { checkoutSchema, type CheckoutInput } from "@/lib/utils/checkout-schemas"

const PAYPAL_PLAN_IDS: Record<string, string> = {
  plus: process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PLUS ?? "P-8DM56493D86352247NIHZNEA",
  pro:  process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PRO  ?? "P-2MW342516Y0845032NIHZQTA",
}

function SuccessScreen({ planName }: { planName: string }) {
  const router = useRouter()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 px-4 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
        <CheckCircle2 className="h-10 w-10 text-primary" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">You&apos;re all set! 🎉</h1>
        <p className="text-muted-foreground max-w-sm">
          Your <strong>SnapLinks {planName}</strong> plan is now active.
          Welcome to the full experience!
        </p>
      </div>
      <Button size="lg" onClick={() => router.push("/dashboard")}>
        Go to Dashboard
      </Button>
    </div>
  )
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const planId       = searchParams.get("plan") ?? "plus"
  const plan         = PLANS.find((p) => p.id === planId)
  const paypalPlanId = PAYPAL_PLAN_IDS[planId]

  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isValid },
  } = useForm<CheckoutInput>({
    resolver: standardSchemaResolver(checkoutSchema),
    mode:     "onChange",
  })

  if (!plan || plan.price === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4">
        <p className="text-muted-foreground">Invalid plan selected.</p>
        <Button asChild variant="outline">
          <Link href="/pricing">← View Pricing</Link>
        </Button>
      </div>
    )
  }

  if (isSuccess) {
    return <SuccessScreen planName={plan.name} />
  }

  const handlePayPalClick = () => {
    handleSubmit((data) => { void data })()
  }

  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Header />

      <main className="flex-1 py-10 px-4">
        <div className="mx-auto max-w-2xl">

          <Button
            variant="ghost"
            size="sm"
            asChild
            className="-ml-2 mb-6 gap-2"
          >
            <Link href="/pricing">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Back to Pricing
            </Link>
          </Button>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-5">

            <div className="md:col-span-3 flex flex-col gap-5">

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Your Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    className="flex flex-col gap-4"
                    noValidate
                    aria-label="Personal information form"
                  >
                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        autoComplete="given-name"
                        aria-invalid={!!errors.firstName}
                        aria-describedby={
                          errors.firstName ? "firstName-error" : undefined
                        }
                        {...register("firstName")}
                      />
                      {errors.firstName && (
                        <p
                          id="firstName-error"
                          role="alert"
                          className="text-xs text-destructive"
                        >
                          {errors.firstName.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        autoComplete="family-name"
                        aria-invalid={!!errors.lastName}
                        aria-describedby={
                          errors.lastName ? "lastName-error" : undefined
                        }
                        {...register("lastName")}
                      />
                      {errors.lastName && (
                        <p
                          id="lastName-error"
                          role="alert"
                          className="text-xs text-destructive"
                        >
                          {errors.lastName.message}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="john@example.com"
                        autoComplete="email"
                        aria-invalid={!!errors.email}
                        aria-describedby={
                          errors.email ? "email-error" : undefined
                        }
                        {...register("email")}
                      />
                      {errors.email && (
                        <p
                          id="email-error"
                          role="alert"
                          className="text-xs text-destructive"
                        >
                          {errors.email.message}
                        </p>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Shield className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    Secure Payment
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <p className="text-xs text-muted-foreground">
                    Click the PayPal button to complete your subscription.
                    You&apos;ll be redirected to PayPal to authorize the payment securely.
                  </p>

                  {paypalPlanId ? (
                    <PayPalScriptProvider
                      options={{
                        clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID
                                ?? "AfmzJi0gPD8kkoWwj1uXpxNn0METOEaOmKV_Fz7HDtTk4dxqnXSeJ22QKKIFu0SxJhyadxEpRumEnq1N",
                        vault:  true,
                        intent: "subscription",
                      }}
                    >
                      <PayPalSubscriptionButton
                        paypalPlanId={paypalPlanId}
                        isFormValid={isValid}
                        getFormValues={getValues}
                        onBeforeOpen={handlePayPalClick}
                        onSuccess={() => setIsSuccess(true)}
                      />
                    </PayPalScriptProvider>
                  ) : (
                    <p className="text-xs text-destructive">
                      PayPal is not configured. Check environment variables.
                    </p>
                  )}
                </CardContent>
              </Card>
            </div>

            <aside className="md:col-span-2">
              <Card className="sticky top-20">
                <CardHeader>
                  <CardTitle className="text-base">Order Summary</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">

                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">SnapLinks {plan.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Monthly subscription — billed via PayPal
                      </p>
                    </div>
                    <Badge variant="secondary">{plan.name}</Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between">
                    <span className="text-sm">Monthly total</span>
                    <span className="font-bold text-lg">
                      ${plan.price}.00
                      <span className="text-sm font-normal text-muted-foreground">
                        {" "}/mo
                      </span>
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 pt-1">
                    {plan.features.map((f) => (
                      <p key={f} className="text-xs text-muted-foreground flex gap-1.5">
                        <span className="text-primary shrink-0">✓</span>
                        {f}
                      </p>
                    ))}
                  </div>

                  <Separator />

                  <div className="rounded-md bg-muted/50 p-3">
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      <strong className="text-foreground">Cancel anytime.</strong>{" "}
                      If you cancel, you&apos;ll only be charged for the days you&apos;ve
                      actually used. Any remaining credit is calculated and shown
                      before confirming.
                    </p>
                  </div>

                  <Button variant="ghost" size="sm" asChild className="w-full">
                    <Link href="/pricing">Choose a different plan</Link>
                  </Button>
                </CardContent>
              </Card>
            </aside>
          </div>
        </div>
      </main>
    </div>
  )
}

function CheckoutFallback() {
  return (
    <div className="flex min-h-screen flex-col bg-muted/10">
      <Header />
      <main className="flex-1 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </main>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutFallback />}>
      <CheckoutContent />
    </Suspense>
  )
}
