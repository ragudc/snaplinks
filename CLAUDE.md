# 🔗 SnapLinks — Claude Code Guidelines

## Stack Tecnológico
- Framework: Next.js 15 (App Router + Turbopack)
- Lenguaje: TypeScript 5 (strict mode)
- Estilos: Tailwind CSS v4
- Componentes UI: shadcn/ui (radix-nova)
- Base de datos + Auth: Supabase (PostgreSQL + Auth)
- Iconos: Lucide React
- Gráficas: Recharts
- Animaciones: Framer Motion
- QR: qrcode npm
- Slugs: nanoid
- Package manager: pnpm

## Reglas Globales Irrompibles
1. Nunca uses `any` en TypeScript — usa tipos explícitos o `unknown`
2. Nunca hardcodees colores — usa solo CSS variables de shadcn
3. Nunca expongas `SUPABASE_SERVICE_ROLE_KEY` en Client Components ni con prefijo `NEXT_PUBLIC_`
4. Siempre usa `supabase.auth.getUser()` en el servidor — NUNCA `getSession()`
5. Siempre aplica mobile-first en Tailwind (base → breakpoints hacia arriba)
6. Nunca apliques `overflow-x: hidden` en body o layout raíz
7. Toda mutación de datos (INSERT, UPDATE, DELETE) va en API Routes del servidor, no en Client Components directamente
8. El `createServiceClient()` (service_role) SOLO se usa en API Routes — nunca en Client Components

## Skills de Referencia
@.claude/skills/01-tailwind-v4.md
@.claude/skills/02-shadcn-components.md
@.claude/skills/03-responsive-design.md
@.claude/skills/04-api-consumption.md
@.claude/skills/05-typescript-patterns.md
@.claude/skills/06-nextjs-app-router.md
@.claude/skills/07-git-conventions.md
@.claude/skills/08-accessibility.md
@.claude/skills/09-supabase-patterns.md
@.claude/skills/10-auth-patterns.md
