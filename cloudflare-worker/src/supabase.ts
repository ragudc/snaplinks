import type { Env, SupabaseLink, ClickPayload, LinkLookupResult } from "./types"

function getSupabaseHeaders(env: Env): HeadersInit {
  return {
    "apikey":        env.SUPABASE_SERVICE_ROLE_KEY,
    "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
    "Content-Type":  "application/json",
    "Prefer":        "return=minimal",
  }
}

export async function lookupLink(
  slug: string,
  env:  Env
): Promise<LinkLookupResult> {
  const params = new URLSearchParams({
    slug:   `eq.${slug}`,
    select: "id,url,is_active",
  })

  let response: Response
  try {
    response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/links?${params}`,
      { method: "GET", headers: getSupabaseHeaders(env) }
    )
  } catch {
    return { found: false, reason: "db_error" }
  }

  if (!response.ok) {
    return { found: false, reason: "db_error" }
  }

  const rows = await response.json() as SupabaseLink[]

  if (!rows || rows.length === 0) {
    return { found: false, reason: "not_found" }
  }

  const link = rows[0]

  if (!link.is_active) {
    return { found: false, reason: "inactive" }
  }

  return { found: true, link }
}

export async function recordClick(
  payload: ClickPayload,
  env:     Env
): Promise<void> {
  try {
    const response = await fetch(
      `${env.SUPABASE_URL}/rest/v1/link_clicks`,
      {
        method:  "POST",
        headers: getSupabaseHeaders(env),
        body:    JSON.stringify(payload),
      }
    )

    if (!response.ok) {
      const text = await response.text()
      console.error(`[SnapLinks Worker] Click recording failed: ${response.status} — ${text}`)
    }
  } catch (err) {
    console.error(`[SnapLinks Worker] Click recording network error:`, err)
  }
}
