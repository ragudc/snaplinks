import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server"
import { cancelSubscription } from "@/lib/paypal/client"
import { calculateProration, PLANS } from "@/types/subscription"

/**
 * POST /api/paypal/cancel-subscription
 *
 * Llamado desde /dashboard/settings cuando el usuario hace clic
 * en "Cancel Subscription" y confirma en el AlertDialog.
 *
 * Flujo:
 * 1. Verificar sesión
 * 2. Buscar suscripción activa del usuario en Supabase
 * 3. Calcular el prorrateo (días usados vs días totales)
 * 4. Cancelar en PayPal (best-effort — no bloquea si falla)
 * 5. Marcar como cancelada en Supabase
 * 6. Retornar el cálculo de prorrateo al frontend
 */
export async function POST(_request: NextRequest) {
  // ── 1. Verificar sesión ───────────────────────────────────────
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ── 2. Buscar suscripción activa ──────────────────────────────
  const { data: sub, error: fetchError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", user.id)
    .eq("status", "active")
    .maybeSingle()

  if (fetchError) {
    console.error("[cancel-subscription] Fetch error:", fetchError)
    return NextResponse.json(
      { error: "Failed to retrieve subscription." },
      { status: 500 }
    )
  }

  if (!sub) {
    return NextResponse.json(
      { error: "No active subscription found." },
      { status: 404 }
    )
  }

  // ── 3. Calcular prorrateo ─────────────────────────────────────
  const plan      = PLANS.find((p) => p.id === sub.plan)
  const planPrice = plan?.price ?? 0
  const proration = calculateProration(
    planPrice,
    sub.current_period_start,
    sub.current_period_end
  )

  // ── 4. Cancelar en PayPal (best-effort) ───────────────────────
  if (sub.paypal_subscription_id) {
    try {
      await cancelSubscription(
        sub.paypal_subscription_id,
        "Customer requested cancellation from SnapLinks dashboard"
      )
    } catch (err) {
      console.error("[cancel-subscription] PayPal cancel error:", err)
    }
  }

  // ── 5. Actualizar estado en Supabase ──────────────────────────
  const serviceSupabase = createServiceClient()
  const { error: updateError } = await serviceSupabase
    .from("subscriptions")
    .update({
      status:               "cancelled",
      cancelled_at:         new Date().toISOString(),
      cancel_at_period_end: true,
    })
    .eq("id", sub.id)

  if (updateError) {
    console.error("[cancel-subscription] Update error:", updateError)
    return NextResponse.json(
      { error: "Failed to update subscription status." },
      { status: 500 }
    )
  }

  // ── 6. Responder con el prorrateo y la fecha de acceso ────────
  const accessUntilDate = new Date(sub.current_period_end).toLocaleDateString(
    "en-US",
    { month: "long", day: "numeric", year: "numeric" }
  )

  return NextResponse.json({
    success:     true,
    proration,
    accessUntil: sub.current_period_end,
    message:     `Your subscription has been cancelled. You have access until ${accessUntilDate}.`,
  })
}
