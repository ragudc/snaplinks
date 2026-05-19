# Skill: Next.js 15 App Router — SnapLinks

## Server vs Client Component

| Criterio | Server Component | Client Component |
|----------|-----------------|-----------------|
| Leer sesión de Supabase | ✅ (getUser()) | ✅ (useUser hook) |
| Mutaciones de DB | ❌ → usar API Route | ✅ via fetch a API Route |
| useState / useEffect | ❌ | ✅ |
| Interactividad (onClick) | ❌ | ✅ |
| Acceso a SUPABASE_SERVICE_ROLE_KEY | ✅ | ❌ NUNCA |

## Auth en Server Components
```tsx
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect("/login")
  // ...
}
```

## Rutas protegidas
- El middleware en `src/middleware.ts` protege /dashboard/*
- Las Server Components de /dashboard/* hacen un doble check con getUser()
- Las API Routes verifican la sesión antes de cualquier mutación
