# Skill: Auth Patterns — SnapLinks

## Flujo de autenticación

```
Login page (/login)
     ↓
Usuario elige: Google OAuth | Email + Password
     ↓
Supabase Auth procesa
     ↓
Callback: /auth/callback (intercambia code por sesión)
     ↓
Redirect a /dashboard
```

## Ruta de callback obligatoria
```ts
// src/app/auth/callback/route.ts
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  const next = searchParams.get("next") ?? "/dashboard"

  if (code) {
    const supabase = await createServerSupabaseClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) return NextResponse.redirect(`${origin}${next}`)
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_error`)
}
```

## Login con Google OAuth
```ts
const supabase = createClient() // browser client
await supabase.auth.signInWithOAuth({
  provider: "google",
  options: {
    redirectTo: `${window.location.origin}/auth/callback`,
  },
})
```

## Logout
```ts
const supabase = createClient()
await supabase.auth.signOut()
router.push("/")
```

## Hook para acceder al usuario en Client Components
```ts
"use client"
import { createClient } from "@/lib/supabase/client"
import { useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => setUser(session?.user ?? null)
    )
    return () => subscription.unsubscribe()
  }, [])

  return user
}
```

## Protección de API Routes
```ts
const supabase = await createServerSupabaseClient()
const { data: { user } } = await supabase.auth.getUser()
if (!user) {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
}
```
