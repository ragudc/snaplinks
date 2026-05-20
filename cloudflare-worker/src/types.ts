export interface Env {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  NEXT_APP_URL: string
}

export interface SupabaseLink {
  id:        string
  url:       string
  is_active: boolean
}

export type DeviceType = "mobile" | "desktop" | "tablet" | "unknown"

export interface ClickPayload {
  link_id:     string
  country:     string | null
  device_type: DeviceType
  referrer:    string | null
  user_agent:  string
}

export type LinkLookupResult =
  | { found: true;  link: SupabaseLink }
  | { found: false; reason: "not_found" | "inactive" | "db_error" }
