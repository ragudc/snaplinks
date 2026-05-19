# Skill: Tailwind CSS v4 — SnapLinks

## Breakpoints del proyecto
| Prefijo | Min-width | Uso |
|---------|-----------|-----|
| (base)  | 0px       | Mobile 320px+ |
| `xs:`   | 320px     | Mobile pequeño |
| `sm:`   | 640px     | Mobile grande |
| `md:`   | 768px     | Tablet |
| `lg:`   | 1024px    | Laptop |
| `xl:`   | 1280px    | Desktop |
| `2xl:`  | 1536px    | Monitor grande |

## Reglas
- Siempre mobile-first: base → xs → sm → md → lg → xl → 2xl
- Nunca colores hardcodeados — solo variables CSS de shadcn
- Nunca `overflow-x: hidden` en body o layout raíz
- Usar `cn()` siempre para combinar clases condicionales
