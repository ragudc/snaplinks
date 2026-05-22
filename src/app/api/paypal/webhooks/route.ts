import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

/**
 * POST /api/paypal/webhooks
 *
 * Webhook URL configurada en PayPal Developer Dashboard:
 * https://snaplinks.vercel.app/api/paypal/webhooks
 * Webhook ID: 1WT940802E601305W
 *
 * Eventos manejados:
 * - BILLING.SUBSCRIPTION.ACTIVATED  → status: active
 * - BILLING.SUBSCRIPTION.UPDATED    → status: active
 * - BILLING.SUBSCRIPTION.CANCELLED  → status: cancelled
 * - BILLING.SUBSCRIPTION.EXPIRED    → status: cancelled
 * - BILLING.SUBSCRIPTION.SUSPENDED  → status: suspended
 */
export async function POST(request: NextRequest) {
  let body: string
  try {
    body = await request.text()
  } catch {
    return NextResponse.json({ error: "Cannot read body" }, { status: 400 })
  }

  let event: {
    event_type: string
    resource:   Record<string, unknown>
  }
  try {
    event = JSON.parse(body)
  } catch {
    return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 })
  }

  const subscriptionId = event.resource?.id as string | undefined
  const eventType      = event.event_type ?? ""

  if (process.env.PAYPAL_MODE === "sandbox") {
    console.log(`[PayPal Webhook] Event: ${eventType} | Subscription: ${subscriptionId ?? "N/A"}`)
  }

  const supabase = createServiceClient()

  switch (eventType) {

    case "BILLING.SUBSCRIPTION.ACTIVATED":
    case "BILLING.SUBSCRIPTION.UPDATED":
      if (subscriptionId) {
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status:               "active",
            cancel_at_period_end: false,
          })
          .eq("paypal_subscription_id", subscriptionId)

        if (error) {
          console.error(`[PayPal Webhook] Failed to update ${eventType}:`, error)
        }
      }
      break

    case "BILLING.SUBSCRIPTION.CANCELLED":
    case "BILLING.SUBSCRIPTION.EXPIRED":
      if (subscriptionId) {
        const { error } = await supabase
          .from("subscriptions")
          .update({
            status:       "cancelled",
            cancelled_at: new Date().toISOString(),
          })
          .eq("paypal_subscription_id", subscriptionId)

        if (error) {
          console.error(`[PayPal Webhook] Failed to update ${eventType}:`, error)
        }
      }
      break

    case "BILLING.SUBSCRIPTION.SUSPENDED":
      if (subscriptionId) {
        const { error } = await supabase
          .from("subscriptions")
          .update({ status: "suspended" })
          .eq("paypal_subscription_id", subscriptionId)

        if (error) {
          console.error(`[PayPal Webhook] Failed to update SUSPENDED:`, error)
        }
      }
      break

    case "PAYMENT.SALE.COMPLETED":
      console.log(`[PayPal Webhook] Payment completed for subscription: ${subscriptionId}`)
      break

    default:
      console.log(`[PayPal Webhook] Unhandled event type: ${eventType}`)
  }

  // Always respond 200 — PayPal retries on other status codes
  return NextResponse.json({ received: true }, { status: 200 })
}
