# Skill: TypeScript Patterns — SnapLinks

## Reglas estrictas
- Nunca usar `any` — usar `unknown` y narrowing si es necesario
- Siempre tipar los retornos de funciones async explícitamente
- Usar `satisfies` en vez de castear con `as` cuando sea posible
- Preferir `interface` para objetos de dominio, `type` para unions/intersections

## Tipos de la base de datos
```ts
import type { Database } from "@/types/database"
import type { Link, LinkStats, LinkClick } from "@/types/link"
```

## Patrón para API Routes tipadas
```ts
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import type { ApiError } from "@/types/link"

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    // ...
    return NextResponse.json(data, { status: 201 })
  } catch (err) {
    const error: ApiError = { error: (err as Error).message }
    return NextResponse.json(error, { status: 500 })
  }
}
```

## Narrowing de errores de Supabase
```ts
const { data, error } = await supabase.from("links").select("*")
if (error) throw new Error(error.message)
return data // TypeScript sabe que data no es null
```
