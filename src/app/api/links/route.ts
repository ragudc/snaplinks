import { NextRequest, NextResponse } from "next/server"
import { createServerSupabaseClient, createServiceClient } from "@/lib/supabase/server"
import { generateSlug, isValidSlugFormat } from "@/lib/utils/slug"
import { validateUrl, normalizeUrl } from "@/lib/utils/url-validator"
import type { CreateLinkInput, CreateLinkResponse, LinksListResponse } from "@/types/link"
import type { Database } from "@/types/database"

type LinkInsert = Database["public"]["Tables"]["links"]["Insert"]

const MAX_SLUG_RETRIES = 5
const DEFAULT_PER_PAGE = 20
const MAX_PER_PAGE     = 100

// ─── GET /api/links — Lista paginada del usuario autenticado ──────
export async function GET(request: NextRequest): Promise<NextResponse> {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const search  = searchParams.get("q")?.trim() ?? ""
  const page    = Math.max(0, parseInt(searchParams.get("page")  ?? "0", 10))
  const perPage = Math.min(
    MAX_PER_PAGE,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_PER_PAGE), 10))
  )

  let query = supabase
    .from("link_stats")
    .select("*", { count: "exact" })
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(page * perPage, (page + 1) * perPage - 1)

  if (search) {
    query = query.or(`url.ilike.%${search}%,title.ilike.%${search}%,slug.ilike.%${search}%`)
  }

  const { data, error, count } = await query

  if (error) {
    console.error("GET /api/links error:", error)
    return NextResponse.json({ error: "Failed to load links." }, { status: 500 })
  }

  const response: LinksListResponse = {
    links:   data ?? [],
    count:   count ?? 0,
    page,
    perPage,
  }

  return NextResponse.json(response)
}

// ─── POST /api/links — Crear link ─────────────────────────────────
export async function POST(request: NextRequest): Promise<NextResponse> {
  let body: CreateLinkInput

  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 })
  }

  const { url, title, slug: customSlug } = body

  // 1. Validate URL
  const urlError = validateUrl(url ?? "")
  if (urlError) {
    return NextResponse.json({ error: urlError }, { status: 400 })
  }

  // 2. Validate custom slug format if provided
  if (customSlug && !isValidSlugFormat(customSlug)) {
    return NextResponse.json(
      { error: "Slug can only contain lowercase letters, numbers, and hyphens (3–50 chars)." },
      { status: 400 }
    )
  }

  // 3. Get authenticated user if present (optional auth)
  const serverSupabase = await createServerSupabaseClient()
  const { data: { user } } = await serverSupabase.auth.getUser()

  // 4. Use service client to bypass RLS for inserts
  const supabase = createServiceClient()

  // 5. Resolve a unique slug
  let slug = customSlug ?? generateSlug()
  let attempts = 0

  while (attempts < MAX_SLUG_RETRIES) {
    const { data: existing } = await supabase
      .from("links")
      .select("slug")
      .eq("slug", slug)
      .maybeSingle()

    if (!existing) break

    if (customSlug) {
      return NextResponse.json(
        { error: "This custom slug is already taken. Please try a different one." },
        { status: 409 }
      )
    }

    slug = generateSlug()
    attempts++
  }

  if (attempts >= MAX_SLUG_RETRIES) {
    return NextResponse.json(
      { error: "Could not generate a unique slug. Please try again." },
      { status: 500 }
    )
  }

  // 6. Insert the link
  const insertData: LinkInsert = {
    slug,
    url:       normalizeUrl(url),
    title:     title?.trim() || null,
    user_id:   user?.id ?? null,
    is_active: true,
  }

  const { data: link, error: insertError } = await supabase
    .from("links")
    .insert(insertData)
    .select()
    .single()

  if (insertError || !link) {
    console.error("Link insert error:", insertError)
    return NextResponse.json(
      { error: "Failed to create link. Please try again." },
      { status: 500 }
    )
  }

  // 7. Build response
  const base     = process.env.NEXT_PUBLIC_SHORT_URL_BASE ?? "http://localhost:3000"
  const shortUrl = `${base}/${slug}`

  const response: CreateLinkResponse = { link, shortUrl }
  return NextResponse.json(response, { status: 201 })
}
