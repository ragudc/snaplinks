# SnapLinks ⚡

### Smart URL Shortener with Real-Time Analytics

[![Deploy](https://img.shields.io/badge/deploy-vercel-black?style=flat-square&logo=vercel)](https://vercel.com)
[![Cloudflare Workers](https://img.shields.io/badge/edge-cloudflare_workers-F38020?style=flat-square&logo=cloudflare)](https://workers.cloudflare.com)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)](https://nextjs.org)
[![License](https://img.shields.io/badge/license-MIT-22c55e?style=flat-square)](LICENSE)

SnapLinks turns long URLs into short, trackable links — with click analytics, QR codes, and edge-speed redirections via Cloudflare Workers. No sign-up required to start.

> **Portfolio project** by [Roberto Agudelo](https://github.com/ragudc) — demonstrating full-stack architecture decisions across Next.js, Supabase, and Cloudflare edge infrastructure.

---

<!-- Replace with a real screenshot of the dashboard in dark mode -->
<!-- ![SnapLinks Dashboard](docs/screenshot-dashboard.png) -->

---

## ✨ Features

- **Public shortener** — Create short links instantly, no account needed
- **Edge redirections** — < 10ms redirects via Cloudflare Workers globally distributed
- **Real-time analytics** — Clicks by hour, day, country, and device type
- **QR code generation** — Every link includes a downloadable, theme-aware QR code
- **Authentication** — Email/password and Google OAuth via Supabase Auth
- **Custom slugs** — Choose your own short path (authenticated users)
- **Subscription tiers** — Free / Plus / Pro plans with PayPal billing
- **Dark mode + i18n** — System-aware theme, English and Spanish support
- **Responsive** — Mobile-first design, dashboard works on any screen size

---

## 🛠️ Tech Stack

| Layer | Technology | Why |
|---|---|---|
| **Framework** | Next.js 15 (App Router) | Server Components + API Routes in one repo; Turbopack for fast dev builds |
| **Language** | TypeScript 5 (strict) | End-to-end type safety from DB types to UI props |
| **Styling** | Tailwind CSS v4 | CSS variables-first approach; zero runtime, full dark mode via `next-themes` |
| **UI Components** | shadcn/ui (Radix) | Accessible primitives, fully owned source — no black-box library lock-in |
| **Database + Auth** | Supabase (PostgreSQL) | RLS policies enforce data isolation at the DB level; Auth handles OAuth flows |
| **Edge Redirects** | Cloudflare Workers | V8 isolates start in < 1ms; handles redirects at the network edge, not in Node.js |
| **Analytics Charts** | Recharts | Composable React chart library; colors driven by CSS variables via `useChartColors` |
| **Animations** | Framer Motion | Declarative staggered animations without layout-shift or janky transitions |
| **Payments** | PayPal Subscriptions | Recurring billing with prorated cancellation; no Stripe dependency |
| **QR Codes** | qrcode (npm) | Lightweight, no canvas dependency; generates data URLs server and client-side |
| **Slugs** | nanoid | URL-safe 7-character slugs; cryptographically random, collision-resistant |
| **Package Manager** | pnpm | Strict dependency isolation; ~2× faster installs than npm via content-addressable store |

---

## 🏗️ Architecture

### Redirect flow (the interesting part)

The redirect path runs entirely on Cloudflare Workers — bypassing Next.js and Node.js entirely for maximum speed:

```
User clicks short link (e.g. snaplinks-worker.example.workers.dev/abc1234)
         │
         ▼
┌─────────────────────────────────────────┐
│         Cloudflare Worker (edge)        │
│                                         │
│  1. Parse slug from URL path            │
│  2. Check reserved paths                │
│     (login, dashboard, api, ...)        │
│  3. Fetch link from Supabase REST API   │
│     with 5s timeout                     │
└──────────────┬──────────────────────────┘
               │
       ┌───────┴────────┐
    Found?           Not found / inactive
       │                    │
       ▼                    ▼
  301 Redirect         302 → Next.js app
  to destination       /?error=not_found
       │
       ▼
  ctx.waitUntil()  ← non-blocking, after response sent
  Record click in Supabase:
  { country, device_type, referrer, user_agent }
```

### Why Cloudflare Workers instead of Next.js Middleware?

Next.js Middleware runs on Vercel's Edge Runtime but still goes through Vercel's infrastructure. Cloudflare Workers run directly in 300+ data centers as V8 isolates — the redirect happens before the request even reaches an origin server. This gives sub-10ms response times globally without cold starts.

### Application architecture

```
Browser
  │
  ├── / (landing)          → Server Component + Client Components
  ├── /dashboard           → Protected, Server Components + Supabase Auth
  ├── /dashboard/analytics → Recharts, useChartColors reads CSS variables
  ├── /login               → Supabase OAuth + email/password
  ├── /pricing             → Static, PayPal SDK loaded client-side
  ├── /checkout            → PayPal subscription activation
  │
  └── API Routes (server-only)
        ├── /api/links          (CRUD, RLS-aware)
        ├── /api/analytics/:id  (aggregated click data)
        └── /api/paypal/*       (webhook verification, plan activation)

Cloudflare Worker (separate deployment)
  └── Handles all /:slug → destination redirects
```

---

## 📊 Database Schema

Three tables, one materialized view:

```sql
-- Short links — nullable user_id supports anonymous creation
CREATE TABLE links (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  slug       TEXT NOT NULL UNIQUE,
  url        TEXT NOT NULL,
  title      TEXT,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Immutable click events written by the Cloudflare Worker
CREATE TABLE link_clicks (
  id          BIGSERIAL PRIMARY KEY,
  link_id     UUID NOT NULL REFERENCES links(id) ON DELETE CASCADE,
  clicked_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  country     CHAR(2),          -- ISO 3166-1 alpha-2, from CF-IPCountry header
  device_type TEXT CHECK (device_type IN ('mobile','desktop','tablet','unknown')),
  referrer    TEXT,             -- domain extracted from Referer header
  user_agent  TEXT              -- truncated to 500 chars
);

-- Subscriptions managed via PayPal webhooks
CREATE TABLE subscriptions (
  id                     UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id                UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan                   TEXT NOT NULL CHECK (plan IN ('free','plus','pro')),
  status                 TEXT NOT NULL DEFAULT 'active'
                           CHECK (status IN ('active','cancelled','expired','pending','suspended')),
  paypal_subscription_id TEXT,
  paypal_plan_id         TEXT,
  current_period_start   TIMESTAMPTZ NOT NULL,
  current_period_end     TIMESTAMPTZ NOT NULL,
  cancel_at_period_end   BOOLEAN NOT NULL DEFAULT false,
  cancelled_at           TIMESTAMPTZ,
  created_at             TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at             TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Aggregated view used by the analytics dashboard
CREATE VIEW link_stats AS
SELECT
  l.id          AS link_id,
  l.slug,
  l.url,
  l.title,
  l.user_id,
  l.is_active,
  l.created_at,
  COUNT(c.id)                                           AS total_clicks,
  COUNT(c.id) FILTER (WHERE c.clicked_at >= now() - INTERVAL '7 days')  AS clicks_7d,
  COUNT(c.id) FILTER (WHERE c.clicked_at >= now() - INTERVAL '30 days') AS clicks_30d,
  COUNT(c.id) FILTER (WHERE c.clicked_at >= now() - INTERVAL '24 hours') AS clicks_24h
FROM links l
LEFT JOIN link_clicks c ON c.link_id = l.id
GROUP BY l.id;
```

**Row Level Security:** Every `SELECT`, `INSERT`, `UPDATE`, `DELETE` on `links` and `subscriptions` is gated by `auth.uid() = user_id`. The Cloudflare Worker uses the service role key to bypass RLS only for the anonymous click recording path.

---

## 🚀 Getting Started

### Prerequisites

```
Node.js >= 20
pnpm >= 9
```

### Clone and install

```bash
git clone https://github.com/ragudc/snaplinks.git
cd snaplinks
pnpm install
```

### Configure environment

```bash
cp .env.example .env.local
# Open .env.local and fill in your Supabase credentials
# See .env.example for a description of every variable
```

Minimum required for local development:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_SHORT_URL_BASE=http://localhost:3000
```

### Run

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

The app handles short-link redirections locally via `src/app/[slug]/route.ts` — the Cloudflare Worker is only needed in production.

---

## ☁️ Deployment

See **[DEPLOY.md](DEPLOY.md)** for step-by-step instructions covering:

- Vercel deploy (Dashboard and CLI)
- Supabase Auth redirect URL configuration
- Cloudflare Worker secrets and `wrangler deploy`
- End-to-end verification checklist

---

## 📁 Project Structure

```
snaplinks/
├── cloudflare-worker/          # Separate Cloudflare Workers project
│   ├── src/
│   │   ├── index.ts            # Worker entry — parses slug, redirects, records click
│   │   ├── supabase.ts         # Supabase REST calls (no SDK, native fetch)
│   │   ├── device.ts           # User-agent parsing for device detection
│   │   └── types.ts            # Worker Env interface + domain types
│   └── wrangler.toml           # Cloudflare deployment config
│
└── src/
    ├── app/                    # Next.js App Router
    │   ├── [slug]/             # Fallback redirect handler (local dev)
    │   ├── api/                # Server-only API Routes
    │   │   ├── links/          # Link CRUD
    │   │   ├── analytics/      # Click aggregation
    │   │   └── paypal/         # Subscription webhooks
    │   ├── auth/callback/      # Supabase OAuth callback
    │   ├── dashboard/          # Protected dashboard routes
    │   ├── login/              # Auth page (sign in + sign up tabs)
    │   ├── pricing/            # Pricing page
    │   ├── checkout/           # PayPal subscription checkout
    │   ├── opengraph-image.tsx # Dynamic OG image (Next.js file convention)
    │   ├── apple-icon.tsx      # Apple touch icon (Next.js file convention)
    │   ├── sitemap.ts          # Auto-generated sitemap.xml
    │   ├── robots.ts           # Auto-generated robots.txt
    │   ├── layout.tsx          # Root layout — ThemeProvider, fonts, metadata
    │   └── globals.css         # Tailwind v4 + shadcn CSS variables
    │
    ├── components/
    │   ├── analytics/          # Recharts wrappers (ClicksChart, CountryBreakdown…)
    │   ├── landing/            # HeroSection, FeaturesSection, PricingSection
    │   ├── layout/             # Header, Footer, Sidebar, DashboardHeader
    │   ├── links/              # LinkCard, LinkShortener, QRCode, CopyButton…
    │   └── ui/                 # shadcn/ui primitives (do not modify)
    │
    ├── hooks/                  # useChartColors, useLinks, useAnalytics, useUser
    ├── lib/
    │   ├── i18n/               # en.ts, es.ts, context, useTranslation hook
    │   ├── supabase/           # Browser + server Supabase client factories
    │   └── utils/              # cn(), url validator, analytics utils
    └── types/                  # database.ts (Supabase generated), link.ts, analytics.ts
```

---

## 🗺️ Roadmap

- [ ] Custom domains (Pro plan)
- [ ] Password-protected links
- [ ] Link expiration dates
- [ ] Bulk import via CSV
- [ ] API access for developers
- [ ] Team collaboration features

---

## 📄 License

MIT © 2025 [Roberto Agudelo](https://github.com/ragudc)
