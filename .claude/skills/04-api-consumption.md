# Skill: Consumo de API — SnapLinks

## Endpoints internos

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET    | /api/links | Lista links del usuario autenticado |
| POST   | /api/links | Crear link (auth opcional) |
| GET    | /api/links/:id | Obtener link por ID |
| PUT    | /api/links/:id | Actualizar link (auth requerida) |
| DELETE | /api/links/:id | Eliminar link (auth requerida) |
| GET    | /api/analytics/:id | Analytics de un link |

## Regla de oro
- Mutaciones (POST, PUT, DELETE) → siempre API Routes en servidor
- Lecturas públicas → pueden hacerse desde Server Components directamente
- Lecturas autenticadas → API Routes con verificación de sesión

## Patrón de fetch en Client Components
```ts
const res = await fetch("/api/links", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url, title }),
})
if (!res.ok) {
  const err = await res.json()
  throw new Error(err.error ?? "Request failed")
}
return res.json()
```
