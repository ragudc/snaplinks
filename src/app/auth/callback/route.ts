import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"

/**
 * GET /auth/callback — OAuth code exchange handler.
 *
 * Supabase redirects here after Google OAuth with a `code`.
 * This handler exchanges the code for an active session.
 *
 * Callback URL to configure in Supabase Dashboard:
 *   Development: http://localhost:3000/auth/callback
 *   Production:  https://your-domain.com/auth/callback
 */
export async function GET(request: NextRequest): Promise<NextResponse> {
  const { searchParams, origin } = new URL(request.url)
  const code       = searchParams.get("code")
  const next       = searchParams.get("next") ?? "/dashboard"
  const errorParam = searchParams.get("error")

  if (errorParam) {
    return NextResponse.redirect(
      `${origin}/login?error=${encodeURIComponent(errorParam)}`
    )
  }

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }

    console.error("Auth callback error:", error.message)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
