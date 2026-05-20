import type { Env } from "./types"
import { detectDeviceType, extractReferrerDomain } from "./device"
import { lookupLink, recordClick } from "./supabase"

const RESERVED_PATHS = new Set([
  "login", "dashboard", "api", "auth",
  "pricing", "about", "contact", "privacy", "terms",
  "favicon.ico", "robots.txt", "sitemap.xml",
  "_next", "opengraph-image", "icon",
])

const MAX_SLUG_LENGTH = 100

export default {
  async fetch(
    request:  Request,
    env:      Env,
    ctx:      ExecutionContext
  ): Promise<Response> {

    // ── 1. Solo procesar GET requests ────────────────────────────
    if (request.method !== "GET") {
      return new Response("Method Not Allowed", {
        status:  405,
        headers: { Allow: "GET" },
      })
    }

    // ── 2. Parsear el slug desde la URL ───────────────────────────
    const url  = new URL(request.url)
    const raw  = url.pathname.slice(1).replace(/\/$/, "")
    const slug = raw.toLowerCase()

    if (!slug) {
      return Response.redirect(`${env.NEXT_APP_URL}/`, 302)
    }

    if (RESERVED_PATHS.has(slug.split("/")[0])) {
      return Response.redirect(`${env.NEXT_APP_URL}${url.pathname}`, 302)
    }

    if (slug.length > MAX_SLUG_LENGTH) {
      return Response.redirect(`${env.NEXT_APP_URL}/?error=invalid_slug`, 302)
    }

    // ── 3. Buscar el link en Supabase (con timeout de 5s) ─────────
    const lookupWithTimeout = Promise.race([
      lookupLink(slug, env),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error("Supabase timeout")), 5000)
      ),
    ])

    let lookupResult: Awaited<ReturnType<typeof lookupLink>>

    try {
      lookupResult = await lookupWithTimeout
    } catch (err) {
      console.error("[SnapLinks Worker] Lookup failed:", err)
      return Response.redirect(
        `${env.NEXT_APP_URL}/?error=service_unavailable`,
        302
      )
    }

    // ── 4. Manejar link no encontrado o inactivo ──────────────────
    if (!lookupResult.found) {
      const errorMap = {
        not_found: "not_found",
        inactive:  "link_inactive",
        db_error:  "service_unavailable",
      } as const

      const errorCode = errorMap[lookupResult.reason]
      return Response.redirect(
        `${env.NEXT_APP_URL}/?error=${errorCode}`,
        302
      )
    }

    const { link } = lookupResult

    // ── 5. Registrar el clic en BACKGROUND (non-blocking) ─────────
    const ua         = request.headers.get("User-Agent") ?? ""
    const country    = request.headers.get("CF-IPCountry") ?? null
    const referer    = request.headers.get("Referer")
    const deviceType = detectDeviceType(ua)
    const referrer   = extractReferrerDomain(referer)

    ctx.waitUntil(
      recordClick(
        {
          link_id:     link.id,
          country:     country === "XX" ? null : country,
          device_type: deviceType,
          referrer,
          user_agent:  ua.slice(0, 500),
        },
        env
      )
    )

    // ── 6. Enviar redirect 301 (permanente) ───────────────────────
    return Response.redirect(link.url, 301)
  },
}
