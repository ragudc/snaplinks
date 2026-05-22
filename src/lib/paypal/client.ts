/**
 * paypal/client.ts — Cliente HTTP para la PayPal REST API (Sandbox).
 *
 * Configuración del proyecto SnapLinks:
 * - Modo:       sandbox (desarrollo y testing)
 * - Product:    PROD-1S819909FH182515F
 * - Plan Plus:  P-8DM56493D86352247NIHZNEA ($5/mes)
 * - Plan Pro:   P-2MW342516Y0845032NIHZQTA ($15/mes)
 * - Webhook:    1WT940802E601305W
 *
 * IMPORTANTE: Este archivo solo se ejecuta en el servidor (API Routes).
 * NUNCA importar en Client Components ("use client").
 */

// ─── Configuración base ───────────────────────────────────────────

const IS_SANDBOX = (process.env.PAYPAL_MODE ?? "sandbox") === "sandbox"

export const PAYPAL_BASE_URL = IS_SANDBOX
  ? "https://api-m.sandbox.paypal.com"
  : "https://api-m.paypal.com"

// ─── Cache del access token en memoria ───────────────────────────
// PayPal emite tokens con ~9h de vida. Lo cacheamos para no
// hacer una petición de auth en cada llamada a la API.

let cachedToken: { token: string; expiresAt: number } | null = null

/**
 * getPayPalAccessToken — Obtiene un token OAuth2 de PayPal.
 * Reutiliza el token cacheado si aún no ha expirado (con 60s de margen).
 */
export const getPayPalAccessToken = async (): Promise<string> => {
  // Devolver token cacheado si es válido
  if (cachedToken && Date.now() < cachedToken.expiresAt - 60_000) {
    return cachedToken.token
  }

  // Leer credenciales — PAYPAL_CLIENT_ID es la variable de servidor
  // NEXT_PUBLIC_PAYPAL_CLIENT_ID es el fallback para compatibilidad
  const clientId = (
    process.env.PAYPAL_CLIENT_ID ??
    process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID ??
    ""
  ).trim()

  const clientSecret = (process.env.PAYPAL_CLIENT_SECRET ?? "").trim()

  if (!clientId || !clientSecret) {
    throw new Error(
      "PayPal credentials missing. " +
      "Verify PAYPAL_CLIENT_ID and PAYPAL_CLIENT_SECRET in .env.local"
    )
  }

  // Codificar en Base64 para Basic Auth
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString("base64")

  const res = await fetch(`${PAYPAL_BASE_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      "Authorization": `Basic ${credentials}`,
      "Content-Type":  "application/x-www-form-urlencoded",
      "Accept":        "application/json",
    },
    body: "grant_type=client_credentials",
    cache: "no-store",
  })

  if (!res.ok) {
    const errText = await res.text()
    throw new Error(
      `PayPal auth failed [${res.status}]: ${errText}`
    )
  }

  const data = await res.json() as {
    access_token: string
    expires_in:   number
    token_type:   string
  }

  // Guardar en cache con timestamp de expiración
  cachedToken = {
    token:     data.access_token,
    expiresAt: Date.now() + data.expires_in * 1000,
  }

  return cachedToken.token
}

// ─── Helper genérico para llamadas autenticadas ───────────────────

/**
 * paypalFetch — Wrapper de fetch con autenticación Bearer automática.
 * Agrega PayPal-Request-Id para idempotencia en mutaciones.
 */
export const paypalFetch = async <T>(
  path:    string,
  options: RequestInit = {}
): Promise<T> => {
  const token = await getPayPalAccessToken()

  const res = await fetch(`${PAYPAL_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Authorization":     `Bearer ${token}`,
      "Content-Type":      "application/json",
      "Accept":            "application/json",
      "PayPal-Request-Id": crypto.randomUUID(),
      ...(options.headers ?? {}),
    },
    cache: "no-store",
  })

  // 204 No Content — respuesta válida de operaciones como cancel
  if (res.status === 204) return {} as T

  if (!res.ok) {
    let errMsg = `PayPal API error [${res.status}]`
    try {
      const errJson = await res.json() as { message?: string; details?: unknown[] }
      errMsg += `: ${errJson.message ?? JSON.stringify(errJson)}`
    } catch {
      errMsg += `: ${await res.text()}`
    }
    throw new Error(errMsg)
  }

  return res.json() as Promise<T>
}

// ─── Funciones específicas de la API ──────────────────────────────

/**
 * getSubscription — Obtiene los detalles de una suscripción de PayPal.
 * Usado para verificar que el pago fue aprobado antes de activar en BD.
 */
export const getSubscription = async (
  subscriptionId: string
): Promise<Record<string, unknown>> =>
  paypalFetch<Record<string, unknown>>(
    `/v1/billing/subscriptions/${subscriptionId}`
  )

/**
 * cancelSubscription — Cancela una suscripción activa en PayPal.
 * Llamado desde /api/paypal/cancel-subscription cuando el usuario
 * solicita cancelar su plan desde el dashboard de Settings.
 */
export const cancelSubscription = async (
  subscriptionId: string,
  reason: string
): Promise<void> =>
  paypalFetch<void>(
    `/v1/billing/subscriptions/${subscriptionId}/cancel`,
    {
      method: "POST",
      body:   JSON.stringify({ reason }),
    }
  )
