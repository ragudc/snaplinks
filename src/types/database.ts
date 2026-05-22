export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      links: {
        Row: {
          id:         string
          user_id:    string | null
          slug:       string
          url:        string
          title:      string | null
          is_active:  boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?:         string
          user_id?:    string | null
          slug:        string
          url:         string
          title?:      string | null
          is_active?:  boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?:         string
          user_id?:    string | null
          slug?:       string
          url?:        string
          title?:      string | null
          is_active?:  boolean
          updated_at?: string
        }
        Relationships: []
      }
      link_clicks: {
        Row: {
          id:          number
          link_id:     string
          clicked_at:  string
          country:     string | null
          device_type: "mobile" | "desktop" | "tablet" | "unknown" | null
          referrer:    string | null
          user_agent:  string | null
        }
        Insert: {
          id?:          number
          link_id:      string
          clicked_at?:  string
          country?:     string | null
          device_type?: "mobile" | "desktop" | "tablet" | "unknown" | null
          referrer?:    string | null
          user_agent?:  string | null
        }
        Update: {
          id?:          number
          link_id?:     string
          clicked_at?:  string
          country?:     string | null
          device_type?: "mobile" | "desktop" | "tablet" | "unknown" | null
          referrer?:    string | null
          user_agent?:  string | null
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          id:                     string
          user_id:                string
          plan:                   "free" | "plus" | "pro"
          status:                 "active" | "cancelled" | "suspended" | "expired"
          paypal_subscription_id: string | null
          paypal_plan_id:         string | null
          current_period_start:   string
          current_period_end:     string
          cancel_at_period_end:   boolean
          cancelled_at:           string | null
          created_at:             string
          updated_at:             string
        }
        Insert: {
          id?:                     string
          user_id:                 string
          plan:                    "free" | "plus" | "pro"
          status?:                 "active" | "cancelled" | "suspended" | "expired"
          paypal_subscription_id?: string | null
          paypal_plan_id?:         string | null
          current_period_start:    string
          current_period_end:      string
          cancel_at_period_end?:   boolean
          cancelled_at?:           string | null
          created_at?:             string
          updated_at?:             string
        }
        Update: {
          id?:                     string
          user_id?:                string
          plan?:                   "free" | "plus" | "pro"
          status?:                 "active" | "cancelled" | "suspended" | "expired"
          paypal_subscription_id?: string | null
          paypal_plan_id?:         string | null
          current_period_start?:   string
          current_period_end?:     string
          cancel_at_period_end?:   boolean
          cancelled_at?:           string | null
          updated_at?:             string
        }
        Relationships: []
      }
    }
    Views: {
      link_stats: {
        Row: {
          link_id:      string
          slug:         string
          url:          string
          title:        string | null
          user_id:      string | null
          is_active:    boolean
          created_at:   string
          total_clicks: number
          clicks_7d:    number
          clicks_30d:   number
          clicks_24h:   number
        }
        Relationships: []
      }
    }
    Functions: Record<string, never>
    Enums:     Record<string, never>
  }
}
