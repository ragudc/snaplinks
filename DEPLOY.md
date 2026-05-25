# SnapLinks — Deployment Guide

This guide covers deploying SnapLinks to production: the **Next.js app on Vercel** and the **redirect worker on Cloudflare Workers**.

---

## Prerequisites

- Node.js ≥ 20
- pnpm ≥ 9 (`npm install -g pnpm`)
- [Vercel CLI](https://vercel.com/docs/cli) (`pnpm add -g vercel`)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/) (`pnpm add -g wrangler`)
- A [Supabase](https://supabase.com) project with the schema applied
- A [Cloudflare](https://cloudflare.com) account

---

## Part 1 — Vercel (Next.js App)

### 1. Clone and install

```bash
git clone https://github.com/ragudc/snaplinks.git
cd snaplinks
pnpm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
# Open .env.local and fill in all values — see .env.example for descriptions
```

### 3. Deploy to Vercel

**Option A — Vercel Dashboard (recommended)**

1. Push your repository to GitHub
2. Go to [vercel.com/new](https://vercel.com/new) and import the repository
3. Add all variables from `.env.example` under **Project Settings → Environment Variables**
4. Deploy — Vercel auto-detects Next.js and builds correctly

**Option B — Vercel CLI**

```bash
vercel --prod
# Follow the prompts, then set env vars:
vercel env add SUPABASE_SERVICE_ROLE_KEY production
vercel env add PAYPAL_CLIENT_SECRET production
# ... repeat for all variables in .env.example
```

### 4. Configure Supabase Auth redirect URL

After deploying, add your production URL to Supabase:

1. Supabase Dashboard → **Authentication → URL Configuration**
2. Add to **Redirect URLs**: `https://YOUR_DOMAIN/auth/callback`
3. Set **Site URL**: `https://YOUR_DOMAIN`

### 5. Update environment variables

Set `NEXT_PUBLIC_APP_URL` to your production Vercel URL in the Vercel Dashboard and redeploy.

---

## Part 2 — Cloudflare Worker (Redirect Engine)

The Cloudflare Worker handles all short-link redirections at the edge with < 10ms latency.

### 1. Authenticate with Cloudflare

```bash
cd cloudflare-worker
wrangler login
```

### 2. Set secrets

Secrets are encrypted and never appear in `wrangler.toml`:

```bash
wrangler secret put SUPABASE_URL
# Paste your Supabase project URL when prompted

wrangler secret put SUPABASE_SERVICE_ROLE_KEY
# Paste your Supabase service role key when prompted

wrangler secret put NEXT_APP_URL
# Paste your Vercel production URL (e.g. https://snaplinks.vercel.app)
```

### 3. Deploy the Worker

```bash
wrangler deploy
```

The Worker will be available at:
```
https://snaplinks-worker.YOUR_SUBDOMAIN.workers.dev
```

### 4. Update the Next.js app

Set `NEXT_PUBLIC_SHORT_URL_BASE` in Vercel to the Worker URL and redeploy.

### 5. (Optional) Custom domain

To use a custom short domain (e.g. `go.yourdomain.com`):

1. Add your domain to Cloudflare DNS
2. Uncomment the `[[routes]]` section in `cloudflare-worker/wrangler.toml`
3. Update `pattern` and `zone_name` with your domain
4. Redeploy: `wrangler deploy`

---

## Deployment Checklist

### Vercel

- [ ] All environment variables set in Vercel Dashboard
- [ ] `NEXT_PUBLIC_APP_URL` matches the production URL
- [ ] Supabase redirect URL includes `/auth/callback`
- [ ] Deploy succeeds without build errors

### Cloudflare Worker

- [ ] `SUPABASE_URL` secret set via `wrangler secret put`
- [ ] `SUPABASE_SERVICE_ROLE_KEY` secret set via `wrangler secret put`
- [ ] `NEXT_APP_URL` secret set via `wrangler secret put`
- [ ] Worker deployed and accessible at workers.dev URL
- [ ] `NEXT_PUBLIC_SHORT_URL_BASE` updated in Vercel to Worker URL

### End-to-end verification

- [ ] Create a short link from the landing page (no auth)
- [ ] Visit the short link — should redirect to destination
- [ ] Log in and check analytics — click should appear
- [ ] Dark mode toggle works
- [ ] OG image renders at `/opengraph-image`
- [ ] `sitemap.xml` accessible at `/sitemap.xml`

---

## Local Development

```bash
# Terminal 1 — Next.js app
pnpm dev

# Terminal 2 — Cloudflare Worker (optional)
cd cloudflare-worker
cp .dev.vars.example .dev.vars   # fill in local Supabase credentials
pnpm dev
```

The Next.js app also handles redirects locally via `src/app/[slug]/route.ts`, so the Worker is optional during development.
