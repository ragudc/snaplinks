# Skill: Supabase Patterns — SnapLinks

## Clientes disponibles

| Cliente | Archivo | Cuándo usarlo |
|---------|---------|---------------|
| Browser client | `@/lib/supabase/client.ts` | Client Components con `useEffect` |
| Server client | `@/lib/supabase/server.ts` → `createServerSupabaseClient()` | Server Components, API Routes (sesión del usuario) |
| Service client | `@/lib/supabase/server.ts` → `createServiceClient()` | API Routes que necesitan bypass de RLS |

## Regla crítica de autenticación
```ts
// ✅ SIEMPRE esto en el servidor
const { data: { user } } = await supabase.auth.getUser()

// ❌ NUNCA esto en el servidor (token no verificado)
const { data: { session } } = await supabase.auth.getSession()
```

## Patrón de query con manejo de errores
```ts
const { data, error } = await supabase
  .from("links")
  .select("*")
  .eq("user_id", user.id)
  .order("created_at", { ascending: false })

if (error) throw new Error(error.message)
return data
```

## RLS — Nunca confiar solo en el frontend
Aunque el frontend solo muestre los links del usuario, la RLS en Supabase es la última
línea de defensa. Si falta una policy, un usuario podría acceder a datos de otro usuario
directamente via la API pública de Supabase.

## Tipos de la base de datos
Siempre usar `Database` de `@/types/database.ts` al crear los clientes para
autocompletado correcto en queries:
```ts
createBrowserClient<Database>(url, key)
```
