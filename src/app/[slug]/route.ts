import { NextRequest, NextResponse } from "next/server"
import { createServiceClient } from "@/lib/supabase/server"

/**
 * Dev-only redirect handler for /{slug}.
 * In PRODUCTION the Cloudflare Worker intercepts before Next.js and handles
 * the redirect at the edge. This route exists so local dev works end-to-end
 * without needing the Worker.
 */

const RESERVED_PATHS = new Set([
  "login", "dashboard", "api", "auth",
  "pricing", "about", "contact", "favicon.ico",
])

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params
  const baseUrl   = new URL(request.url).origin

  if (RESERVED_PATHS.has(slug.toLowerCase())) {
    return NextResponse.next()
  }

  const supabase = createServiceClient()

  const { data: link, error } = await supabase
    .from("links")
    .select("id, url, is_active")
    .eq("slug", slug)
    .maybeSingle()

  if (error || !link) {
    return NextResponse.redirect(`${baseUrl}/?error=not_found`, { status: 302 })
  }

  if (!link.is_active) {
    return NextResponse.redirect(`${baseUrl}/?error=link_inactive`, { status: 302 })
  }

  // Register the click best-effort — never blocks the redirect
  void (async () => {
    try {
      const ua         = request.headers.get("user-agent") ?? ""
      const country    = request.headers.get("cf-ipcountry") ?? null
      const referer    = request.headers.get("referer")
      const isMobile   = /mobile|android|iphone/i.test(ua)
      const isTablet   = /tablet|ipad/i.test(ua)
      const deviceType = isTablet ? "tablet" : isMobile ? "mobile" : "desktop"
      const referrer   = referer
        ? (() => { try { return new URL(referer).hostname } catch { return null } })()
        : null

      await supabase.from("link_clicks").insert({
        link_id:     link.id,
        country,
        device_type: deviceType,
        referrer,
        user_agent:  ua.slice(0, 500),
      })
    } catch {
      // A failed click record must never interrupt the redirect
    }
  })()

  return NextResponse.redirect(link.url, { status: 301 })
}
