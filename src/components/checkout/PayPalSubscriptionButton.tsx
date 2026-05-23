"use client"

import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js"
import { Loader2 } from "lucide-react"
import type { CheckoutInput } from "@/lib/utils/checkout-schemas"

interface PayPalSubscriptionButtonProps {
  paypalPlanId:  string
  isFormValid:   boolean
  getFormValues: () => CheckoutInput
  onBeforeOpen:  () => void
  onSuccess:     (subscriptionId: string) => void
}

export function PayPalSubscriptionButton({
  paypalPlanId,
  isFormValid,
  getFormValues,
  onBeforeOpen,
  onSuccess,
}: PayPalSubscriptionButtonProps) {
  const [{ isPending }] = usePayPalScriptReducer()

  if (isPending) {
    return (
      <div className="flex h-12 items-center justify-center gap-2">
        <Loader2
          className="h-4 w-4 animate-spin text-muted-foreground"
          aria-hidden="true"
        />
        <span className="text-sm text-muted-foreground">
          Loading secure payment...
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {!isFormValid && (
        <p
          className="text-xs text-muted-foreground text-center"
          role="status"
          aria-live="polite"
        >
          Please fill in your information above before proceeding.
        </p>
      )}

      <div
        className={
          !isFormValid
            ? "opacity-50 pointer-events-none select-none"
            : undefined
        }
        aria-disabled={!isFormValid}
      >
        <PayPalButtons
          style={{
            layout: "vertical",
            color:  "blue",
            shape:  "rect",
            label:  "subscribe",
            height: 45,
          }}
          createSubscription={(_data, actions) => {
            onBeforeOpen()
            const formData = getFormValues()

            return actions.subscription.create({
              plan_id: paypalPlanId,
              subscriber: {
                name: {
                  given_name: formData.firstName,
                  surname:    formData.lastName,
                },
                email_address: formData.email,
              },
              application_context: {
                shipping_preference: "NO_SHIPPING",
                user_action:         "SUBSCRIBE_NOW",
                brand_name:          "SnapLinks",
                return_url:          `${window.location.origin}/dashboard`,
                cancel_url:          `${window.location.origin}/pricing`,
              },
            })
          }}
          onApprove={async (data) => {
            const formData       = getFormValues()
            const subscriptionId = data.subscriptionID ?? ""

            const res = await fetch("/api/paypal/activate-subscription", {
              method:  "POST",
              headers: { "Content-Type": "application/json" },
              body:    JSON.stringify({
                subscriptionId,
                planId:    paypalPlanId,
                firstName: formData.firstName,
                lastName:  formData.lastName,
                email:     formData.email,
              }),
            })

            if (res.ok) {
              onSuccess(subscriptionId)
            } else {
              const err = await res.json().catch(() => ({}))
              console.error("Subscription activation error:", err)
              alert(
                "Payment approved but account activation failed. " +
                "Please contact support with your PayPal transaction ID: " +
                subscriptionId
              )
            }
          }}
          onError={(err) => {
            console.error("PayPal button error:", err)
          }}
          onCancel={() => {
            console.log("[PayPal] User cancelled the payment flow")
          }}
        />
      </div>
    </div>
  )
}
