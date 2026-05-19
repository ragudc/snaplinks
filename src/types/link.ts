import type { Database } from "@/types/database"

// ─── Tipos base derivados de la base de datos ─────────────────────

export type Link      = Database["public"]["Tables"]["links"]["Row"]
export type LinkClick = Database["public"]["Tables"]["link_clicks"]["Row"]
export type LinkStats = Database["public"]["Views"]["link_stats"]["Row"]

// ─── Tipos de entrada para operaciones CRUD ───────────────────────

export interface CreateLinkInput {
  url:    string
  title?: string
  slug?:  string
}

export interface UpdateLinkInput {
  url?:       string
  title?:     string
  is_active?: boolean
}

// ─── Tipos de respuesta de la API interna ─────────────────────────

export interface CreateLinkResponse {
  link:     Link
  shortUrl: string
}

export interface LinksListResponse {
  links:   LinkStats[]
  count:   number
  page:    number
  perPage: number
}

export interface ApiError {
  error:   string
  code?:   string
  status?: number
}

// ─── Tipos de UI ──────────────────────────────────────────────────

export type LinkContentType = "url" | "text" | "email" | "wifi"
export type LinkActionState = "idle" | "loading" | "success" | "error"
export type DeviceType      = "mobile" | "desktop" | "tablet" | "unknown"
