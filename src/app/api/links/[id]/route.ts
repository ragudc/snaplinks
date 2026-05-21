import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { validateUrl, normalizeUrl } from "@/lib/utils/url-validator"
import type { UpdateLinkInput } from "@/types/link"
import type { Database } from "@/types/database"

type LinkUpdate = Database["public"]["Tables"]["links"]["Update"]

type RouteContext = { params: Promise<{ id: string }> }

// --- Helper: verificar que el link pertenece al usuario -----------
async function verifyLinkOwnership(linkId: string, userId: string) {
  const supabase = await createServerSupabaseClient()
  const { data } = await supabase
    .from("links")
    .select("id, user_id")
    .eq("id", linkId)
    .maybeSingle()

  if (!data)                   return { ok: false, status: 404, error: "Link not found." }
  if (data.user_id !== userId) return { ok: false, status: 403, error: "Forbidden." }
  return { ok: true, status: 200, error: null }
}

// --- GET /api/links/:id -------------------------------------------
export async function GET(_req: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const { id }   = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const ownership = await verifyLinkOwnership(id, user.id)
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status })
  }

  const { data, error } = await supabase
    .from("link_stats")
    .select("*")
    .eq("link_id", id)
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: "Link not found." }, { status: 404 })
  }

  return NextResponse.json(data)
}

// --- PUT /api/links/:id -------------------------------------------
export async function PUT(request: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const { id }   = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const ownership = await verifyLinkOwnership(id, user.id)
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status })
  }

  let body: UpdateLinkInput
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const updates: LinkUpdate = {}

  if (body.url !== undefined) {
    const urlError = validateUrl(body.url)
    if (urlError) return NextResponse.json({ error: urlError }, { status: 400 })
    updates.url = normalizeUrl(body.url)
  }

  if (body.title !== undefined) {
    updates.title = body.title?.trim() || null
  }

  if (body.is_active !== undefined) {
    updates.is_active = body.is_active
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 })
  }

  const { data, error } = await supabase
    .from("links")
    .update(updates)
    .eq("id", id)
    .select()
    .single()

  if (error || !data) {
    console.error("PUT /api/links/:id error:", error)
    return NextResponse.json({ error: "Failed to update link." }, { status: 500 })
  }

  return NextResponse.json(data)
}

// --- DELETE /api/links/:id ----------------------------------------
export async function DELETE(_req: NextRequest, { params }: RouteContext): Promise<NextResponse> {
  const { id }   = await params
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const ownership = await verifyLinkOwnership(id, user.id)
  if (!ownership.ok) {
    return NextResponse.json({ error: ownership.error }, { status: ownership.status })
  }

  const { error } = await supabase
    .from("links")
    .delete()
    .eq("id", id)

  if (error) {
    console.error("DELETE /api/links/:id error:", error)
    return NextResponse.json({ error: "Failed to delete link." }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
