import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server"
import { getSubscription } from "@/lib/paypal/client"

/**
 * POST /api/paypal/activate-subscription
 *
 * Llamado por el PayPalButton del checkout después de que el usuario
 * aprueba el pago en el popup de PayPal.
 *
 * Flujo:
 * 1. Verificar sesión del usuario
 * 2. Verificar la suscripción con PayPal (evita fraudes)
 * 3. Determinar el plan (Plus o Pro) a partir del Plan ID
 * 4. Guardar la suscripción en Supabase con service_role
 */
export async function POST(request: NextRequest) {
  // ── 1. Verificar sesión ───────────────────────────────────────
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // ── 2. Parsear body ───────────────────────────────────────────
  let body: { subscriptionId: string; planId: string } | null = null
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  if (!body?.subscriptionId || !body?.planId) {
    return NextResponse.json(
      { error: "subscriptionId and planId are required." },
      { status: 400 }
    )
  }

  const { subscriptionId, planId } = body

  // ── 3. Verificar la suscripción con PayPal ────────────────────
  let paypalSub: Record<string, unknown>
  try {
    paypalSub = await getSubscription(subscriptionId)
  } catch (err) {
    console.error("[activate-subscription] PayPal verify error:", err)
    return NextResponse.json(
      { error: "Could not verify subscription with PayPal. Please try again." },
      { status: 502 }
    )
  }

  // El status debe ser ACTIVE o APPROVED para continuar
  const paypalStatus = paypalSub.status as string
  if (!["ACTIVE", "APPROVED"].includes(paypalStatus)) {
    return NextResponse.json(
      { error: `Subscription is not active. PayPal status: ${paypalStatus}` },
      { status: 400 }
    )
  }

  // ── 4. Determinar el plan a partir del Plan ID de PayPal ──────
  const planMap: Record<string, "plus" | "pro"> = {
    "P-8DM56493D86352247NIHZNEA": "plus",
    "P-2MW342516Y0845032NIHZQTA": "pro",
    [process.env.PAYPAL_PLAN_ID_PLUS              ?? ""]: "plus",
    [process.env.PAYPAL_PLAN_ID_PRO               ?? ""]: "pro",
    [process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PLUS  ?? ""]: "plus",
    [process.env.NEXT_PUBLIC_PAYPAL_PLAN_ID_PRO   ?? ""]: "pro",
  }

  const plan = planMap[planId]
  if (!plan) {
    return NextResponse.json(
      { error: `Unknown plan ID: ${planId}` },
      { status: 400 }
    )
  }

  // ── 5. Calcular el período de facturación (1 mes) ─────────────
  const now       = new Date()
  const periodEnd = new Date(now)
  periodEnd.setMonth(periodEnd.getMonth() + 1)

  // ── 6. Guardar en Supabase con service_role (bypasa RLS) ──────
  const serviceSupabase = createServiceClient()
  const { error: upsertError } = await serviceSupabase
    .from("subscriptions")
    .upsert(
      {
        user_id:                user.id,
        plan,
        status:                 "active",
        paypal_subscription_id: subscriptionId,
        paypal_plan_id:         planId,
        current_period_start:   now.toISOString(),
        current_period_end:     periodEnd.toISOString(),
        cancel_at_period_end:   false,
      },
      { onConflict: "user_id" }
    )

  if (upsertError) {
    console.error("[activate-subscription] Supabase upsert error:", upsertError)
    return NextResponse.json(
      { error: "Subscription approved but failed to save. Contact support." },
      { status: 500 }
    )
  }

  return NextResponse.json({ success: true, plan })
}
