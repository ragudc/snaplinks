"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/supabase/client"
import type { User } from "@supabase/supabase-js"

interface UseUserReturn {
  user:      User | null
  isLoading: boolean
  signOut:   () => Promise<void>
}

export function useUser(): UseUserReturn {
  const [user,      setUser]      = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    let mounted = true

    // Safety net: stop loading after 3 seconds regardless of auth state
    const maxTimer = setTimeout(() => {
      if (mounted) setIsLoading(false)
    }, 3000)

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data.user)
        clearTimeout(maxTimer)
        setIsLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        if (mounted) {
          setUser(session?.user ?? null)
          setIsLoading(false) // always clear loading on any auth event
        }
      }
    )

    return () => {
      mounted = false
      clearTimeout(maxTimer)
      subscription.unsubscribe()
    }
  }, [])

  const signOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    window.location.href = "/"
  }

  return { user, isLoading, signOut }
}
