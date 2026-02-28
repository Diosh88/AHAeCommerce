# Technical Architecture — AHAeCommerce

**Version:** 1.0
**Phase:** Architecture
**Date:** 2026-02-28
**Status:** Draft → Pending Gate 2 (Expansion Test)
**PRD Input:** `docs/planning/PRD_HANDOFF.md` (v1.0)
**Risk Tier:** MEDIUM
**Team:** Solo developer

---

## Problem Translation (Skill 1)

| Business Goal | System Requirement | Constraint |
|---|---|---|
| Content authority → organic traffic | Static/ISR rendering with perfect SEO instrumentation | Every content page must score Lighthouse SEO ≥ 90 |
| Email list → monetization moat | Reliable email capture with zero data loss | Rate-limited form endpoint + Kit API fallback |
| Multi-stream revenue | Independent revenue modules, no cross-stream coupling | Each revenue stream is a separate integration |
| Solo operator sustainability | Zero-ops infrastructure (managed everything) | No self-managed servers, no containers, no cron jobs |
| Trust via editorial independence | Editorial gate enforced at build time, not policy | Build fails if `editorialGate` schema is violated |

**Non-negotiable system properties:**

1. Content pages are **always available** (CDN-cached, no DB dependency for reads)
2. Email capture **never silently fails** (server-side validation + Kit API + Supabase backup)
3. Editorial gate is **infrastructure-enforced**, not honor-system
4. Payment processing is **never on-platform** (Lemon Squeezy handles PCI and global tax)
5. The system **costs near-zero** at zero traffic (Vercel Hobby + Supabase Free + Plausible $9/mo)

---

## System Decomposition (Skill 2)

### Top-Level Modules

```
AHAeCommerce Platform
│
├── CONTENT MODULE (file-based, no DB)
│   ├── MDX articles (content/articles/*.mdx)
│   ├── Topic clusters (content/topics/*.mdx)
│   ├── Velite content layer (schema + transform)
│   └── Editorial gate (build-time enforcement)
│
├── PRESENTATION MODULE (Next.js App Router)
│   ├── Static pages (Home, About, Start Here, Legal)
│   ├── ISR pages (Articles — revalidate 24h)
│   ├── Dynamic pages (Search — client-side)
│   └── Layout system (root layout, article layout)
│
├── EMAIL MODULE (Kit API + Supabase backup)
│   ├── Capture endpoint (/api/subscribe)
│   ├── Kit subscriber sync
│   ├── Supabase subscriber record
│   └── Webhook handler (Kit → Supabase)
│
├── PRODUCT MODULE (Lemon Squeezy)
│   ├── Product landing pages (content/products/*.mdx)
│   ├── Lemon Squeezy checkout redirect
│   ├── Webhook handler (/api/webhooks/lemonsqueezy)
│   └── Purchase record (Supabase purchases table)
│
├── ANALYTICS MODULE (Plausible)
│   ├── Page view tracking (script injection)
│   ├── Custom events (email capture, affiliate clicks)
│   └── Goal tracking (conversions)
│
├── SEO MODULE (Next.js + Vercel)
│   ├── Metadata API (per-page metadata exports)
│   ├── Open Graph images (@vercel/og)
│   ├── JSON-LD injection (Article, Product schemas)
│   ├── Auto-generated sitemap (app/sitemap.ts)
│   └── robots.txt (app/robots.ts)
│
└── OBSERVABILITY MODULE (Sentry + Vercel Logs)
    ├── Error tracking (Sentry)
    ├── Performance monitoring (Sentry + Vercel)
    └── Health endpoint (/api/health)
```

**Replacement test**: Each module can be swapped without rewriting others:
- Kit → Beehiiv: change `/api/subscribe` implementation only
- Plausible → PostHog: change script injection only
- Lemon Squeezy → Stripe: change webhook handler + product page CTA only
- Velite → Sanity: change content layer, Presentation module unchanged

---

## Technology Stack (Skill 9)

### Committed Decisions (from PRD)

| Layer | Choice | Rationale |
|---|---|---|
| Hosting | Vercel | Committed. Zero-ops, CDN-native, Next.js-native |
| Database | Supabase | Committed. Managed Postgres, free tier generous, RLS built-in |

### Architecture-Phase Decisions

| Decision | Choice | Rationale | Escape Hatch |
|---|---|---|---|
| Framework | **Next.js 15** (App Router) | Vercel-native, App Router + RSC = content-first. ISR for articles. | Runs on any serverless host (Railway, Cloudflare) |
| Styling | **Tailwind CSS v4** | Design-OS token system, purged CSS, no runtime overhead | Pure CSS (Tailwind is build-only) |
| Content Layer | **Velite** | TypeScript-native MDX collections, no vendor lock, schema validation at build | Direct MDX parsing (gray-matter + next-mdx-remote) |
| Email Platform | **ConvertKit (Kit)** | Automation maturity, API quality, segmentation by topic interest, reliable delivery | Export list to any provider (CSV) |
| Analytics | **Plausible** | Privacy-first (no cookies, no GDPR banner needed), ~1KB script, EU-hosted option | Swap script for PostHog in < 1 hour |
| Payment Processor | **Lemon Squeezy** | Merchant of Record → handles EU VAT + global digital product taxes automatically. Solo op cannot manage tax compliance manually | Stripe (add Stripe Tax) |
| OG Images | **@vercel/og** | Edge-rendered, zero latency, no external dependency | Pre-generated static images |
| Error Tracking | **Sentry** | Industry standard, generous free tier, Vercel integration | Vercel Logs only (acceptable fallback) |
| Type Safety | **TypeScript strict** | Solo operator: types prevent entire class of runtime errors | N/A (no alternatives) |
| Linting | **ESLint + next/core-web-vitals** | Built-in Next.js config | N/A |
| Testing | **Vitest** (unit) + **Playwright** (E2E) | Vitest for content schema tests; Playwright for critical user flows | Jest + Cypress |

### Rejected Alternatives

| Choice | Rejected | Why |
|---|---|---|
| Sanity CMS | Content Layer | Adds $0–$99/mo cost + vendor lock + complexity. Solo dev IS the author — no editorial UX needed |
| Stripe | Lemon Squeezy | Stripe requires manual EU VAT handling (complex for solo operator). LS is Merchant of Record |
| PostHog | Plausible | PostHog is heavier (~60KB), overkill for content platform Phase 1. Plausible is sufficient |
| Beehiiv | Kit | Kit has 10+ years of automation maturity vs Beehiiv 2 years. Kit's API is more stable |
| Pages Router | App Router | App Router = RSC + streaming + built-in ISR. Pages Router is legacy |
| Vercel Postgres | Supabase | Supabase has RLS built-in + free Auth + Realtime for future phases. Vercel Postgres is raw Postgres only |
| WordPress/Ghost | Next.js MDX | SEO control, performance, and editorial gate enforcement all require code ownership |

---

## Interface & Contract Design (Skill 3)

### API Route Contracts

```typescript
// POST /api/subscribe
// Request
type SubscribeRequest = {
  email: string         // required, validated
  name?: string         // optional
  source: string        // required: article slug or page name
  topics?: string[]     // optional: A–Z category interests
}

// Response (success)
type SubscribeSuccess = {
  success: true
  message: "Subscribed"
}

// Response (error)
type SubscribeError = {
  success: false
  error: "DUPLICATE" | "INVALID_EMAIL" | "RATE_LIMITED" | "SERVICE_ERROR"
}
// Rate limit: 5 requests per IP per hour (Upstash Ratelimit or Vercel middleware)

// POST /api/webhooks/lemonsqueezy
// Receives: Lemon Squeezy webhook (order.created, order.refunded)
// Validates: X-Signature header (HMAC-SHA256)
// Writes to: Supabase purchases table
// Returns: 200 OK or 400 Bad Request
// No response body needed

// GET /api/health
// Returns: { status: "ok", db: "connected" | "error", timestamp: ISO string }
// Used by: Uptime monitoring
```

### Content Schema Contracts (Velite)

```typescript
// Article frontmatter schema (enforced at build time)
type ArticleFrontmatter = {
  title: string                    // max 60 chars (SEO)
  description: string              // 120–155 chars (SEO meta description)
  slug: string                     // url-safe, no dates
  category: AZCategory             // one of 26 A–Z categories
  tags: string[]                   // 2–5 tags
  publishedAt: string              // ISO date YYYY-MM-DD
  updatedAt?: string               // ISO date if updated
  editorialGate: {
    clarifies_decision: boolean
    prevents_mistake: boolean
    reveals_cost: boolean
    explains_tradeoff: boolean
    // BUILD FAILS if all four are false
  }
  affiliateLinks: boolean          // triggers disclosure component
  draft: boolean                   // true = excluded from build
  ogImage?: string                 // custom OG image path (optional)
}

// Product frontmatter schema
type ProductFrontmatter = {
  title: string
  description: string
  slug: string
  price: number                    // in USD cents
  lemonsqueezyVariantId: string    // Lemon Squeezy variant ID
  publishedAt: string
  draft: boolean
}
```

### Component Interface Contracts

Key shared component interfaces:

```typescript
// EmailCapture — used inline in articles and on /subscribe page
type EmailCaptureProps = {
  source: string           // article slug or page name
  variant: 'inline' | 'end-of-article' | 'dedicated'
  topic?: string           // pre-fill topic interest
}

// AffiliateLink — wraps any affiliate recommendation
type AffiliateLinkProps = {
  href: string             // affiliate URL
  text: string             // link text
  tool: string             // tool name (for tracking)
  article: string          // article slug (for reporting)
}
// Renders with disclosure indicator, tracks click event
```

---

## Data Architecture & Ownership (Skill 4)

### Source of Truth Map

| Entity | Source of Truth | Why |
|---|---|---|
| Articles | `content/articles/*.mdx` (filesystem) | Content is code, version-controlled |
| Topics/Categories | `content/topics/*.mdx` + hardcoded A–Z map | Static metadata |
| Email subscribers | **Kit** (primary) + Supabase (backup) | Kit owns delivery; Supabase owns data portability |
| Purchases | **Lemon Squeezy** (primary) + Supabase (record) | LS owns transaction; Supabase owns lookup |
| Analytics | **Plausible** | External, no local storage |
| Site config | `lib/config.ts` | Typed constants (site name, URLs, social links) |

### Database Schema (Supabase)

```sql
-- =====================
-- subscribers
-- =====================
CREATE TABLE public.subscribers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email           TEXT UNIQUE NOT NULL,
  name            TEXT,
  source          TEXT NOT NULL,           -- article slug or page
  topics          TEXT[],                  -- A–Z category interests
  kit_id          TEXT,                    -- Kit subscriber ID (sync)
  gdpr_consent    BOOLEAN NOT NULL DEFAULT FALSE,
  gdpr_consent_at TIMESTAMPTZ,
  subscribed_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: No direct client access. Server-side service_role only.
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;
-- policy: anon = deny all, service_role = bypass RLS (Supabase default)

-- =====================
-- purchases
-- =====================
CREATE TABLE public.purchases (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email               TEXT NOT NULL,
  product_slug        TEXT NOT NULL,
  lemon_order_id      TEXT UNIQUE NOT NULL,
  lemon_variant_id    TEXT NOT NULL,
  amount_cents        INTEGER NOT NULL,
  currency            TEXT NOT NULL DEFAULT 'USD',
  status              TEXT NOT NULL DEFAULT 'completed',
  -- 'completed' | 'refunded'
  purchased_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS: No direct client access. Service_role only.
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;

-- =====================
-- Indexes
-- =====================
CREATE INDEX idx_subscribers_email ON public.subscribers(email);
CREATE INDEX idx_subscribers_kit_id ON public.subscribers(kit_id);
CREATE INDEX idx_purchases_email ON public.purchases(email);
CREATE INDEX idx_purchases_lemon_order ON public.purchases(lemon_order_id);
```

**Data principles**:
- No user accounts in Phase 1 → no `users` table needed
- Content is never in the database → filesystem only
- Purchase asset delivery is URL-based (Lemon Squeezy handles file delivery or email)
- GDPR delete path: `DELETE FROM subscribers WHERE email = ?` + Kit unsubscribe API

---

## Route Architecture (Full Map)

```
app/
├── layout.tsx                         # Root layout: fonts, Sentry, Plausible
├── page.tsx                           # Home — Static, revalidate on content push
├── not-found.tsx                      # 404 — Static
├── error.tsx                          # Error boundary — Static
├── sitemap.ts                         # Auto-generated sitemap — all articles + pages
├── robots.ts                          # robots.txt — allow all, point to sitemap
│
├── about/
│   └── page.tsx                       # About — Static
│
├── start-here/
│   └── page.tsx                       # Start Here — Static
│
├── subscribe/
│   └── page.tsx                       # Subscribe — Static (form → /api/subscribe)
│
├── search/
│   └── page.tsx                       # Search — Static shell + client-side search
│                                      # (Pagefind for static search, zero server cost)
│
├── articles/
│   ├── page.tsx                       # Article index — Static (all articles)
│   └── [slug]/
│       └── page.tsx                   # Article — ISR (revalidate: 86400)
│
├── topics/
│   ├── page.tsx                       # All topics — Static
│   └── [cluster]/
│       └── page.tsx                   # Topic cluster — Static (generateStaticParams)
│
├── products/
│   └── [slug]/
│       └── page.tsx                   # Product landing — Static
│
├── thank-you/
│   └── page.tsx                       # Post-purchase — Static
│
├── legal/
│   ├── privacy-policy/
│   │   └── page.tsx                   # Privacy Policy — Static MDX
│   └── terms-of-service/
│       └── page.tsx                   # Terms of Service — Static MDX
│
└── api/
    ├── subscribe/
    │   └── route.ts                   # POST: email capture → Kit + Supabase
    ├── webhooks/
    │   └── lemonsqueezy/
    │       └── route.ts               # POST: purchase webhook → Supabase
    └── health/
        └── route.ts                   # GET: health check → { status, db }
```

### URL Hierarchy (from PRD §16)

```
ahaecommerce.com/                        # Home
ahaecommerce.com/articles/[slug]         # Individual articles (no dates, no category prefix)
ahaecommerce.com/topics/[cluster]/       # A–Z category browsing
ahaecommerce.com/start-here/             # New reader orientation
ahaecommerce.com/about/                  # Editorial authority
ahaecommerce.com/subscribe/              # Email capture
ahaecommerce.com/products/[slug]/        # Digital products
ahaecommerce.com/thank-you/              # Post-purchase
ahaecommerce.com/legal/privacy-policy/
ahaecommerce.com/legal/terms-of-service/
ahaecommerce.com/search/
```

---

## Directory Structure (Full)

```
AHAeCommerce/
│
├── app/                        # Next.js App Router
│   └── (see Route Architecture above)
│
├── content/                    # MDX content (file-based CMS)
│   ├── articles/               # A–Z articles
│   ├── topics/                 # Topic cluster metadata
│   └── products/               # Digital product descriptions
│
├── components/
│   ├── layout/                 # RootLayout, ArticleLayout, SiteHeader, SiteFooter
│   ├── content/                # ArticleCard, ArticleBody, TableOfContents, RelatedArticles
│   ├── email/                  # EmailCapture (inline, end-of-article, dedicated)
│   ├── seo/                    # JsonLD, OGImage
│   ├── affiliate/              # AffiliateLink, AffiliateDisclosure
│   ├── product/                # ProductCard, CheckoutButton
│   └── ui/                     # Design-OS primitives (Typography, Button, etc.)
│
├── lib/
│   ├── config.ts               # Site constants (name, URL, socials)
│   ├── content.ts              # Velite content utilities
│   ├── kit.ts                  # ConvertKit API client
│   ├── supabase/
│   │   ├── server.ts           # Supabase server client
│   │   └── types.ts            # Generated database types
│   ├── lemonsqueezy.ts         # Lemon Squeezy webhook validation
│   └── ratelimit.ts            # Rate limiting utility
│
├── styles/
│   └── globals.css             # Tailwind + Design-OS tokens
│
├── public/
│   ├── images/                 # Static images
│   └── og/                     # Pre-generated OG images (fallback)
│
├── supabase/
│   └── migrations/             # Database migrations (version-controlled)
│
├── content.config.ts           # Velite schema definitions
├── velite.config.ts            # Velite build config
├── next.config.ts              # Next.js config
├── tailwind.config.ts          # Tailwind + Design-OS token mapping
├── tsconfig.json               # TypeScript strict
├── .env.local                  # Local secrets (gitignored)
├── .env.example                # Template (committed)
└── package.json
```

---

## Scalability Profile (Skill 5)

### Current Baseline → 10x Scale

| Dimension | Phase 1 (0–6 months) | 10x (Phase 4+) | Architecture Response |
|---|---|---|---|
| **Monthly page views** | 0–5,000 | 50,000 | CDN-cached static pages — no change needed |
| **Concurrent users** | 1–10 | 10–100 | Vercel Edge CDN handles this transparently |
| **Articles** | 0–30 | 300 | Velite build time increases; Vercel build cache mitigates |
| **Email subscribers** | 0–1,000 | 10,000 | Kit handles this; Supabase free tier supports 10K rows |
| **API calls/month** | ~100 (subscriptions) | ~1,000 | Vercel serverless — scales automatically |
| **Storage** | < 100MB (content + images) | < 1GB | Vercel + Supabase free tiers cover this |
| **Monthly cost** | ~$9 (Plausible only) | ~$50–75 | Plausible growth + Kit paid tier + Supabase Pro |

**Scalability verdict**: Content platform with static/ISR rendering has near-unlimited scale headroom. The bottleneck is content production (human), not infrastructure.

---

## Failure & Resilience Design (Skill 6)

| Failure Mode | Impact | Detection | Recovery |
|---|---|---|---|
| Vercel CDN outage | All pages down | Vercel status page + Sentry uptime | Vercel SLA 99.99% — no local mitigation needed |
| Supabase outage | Email capture fails silently | Health check endpoint | Queue email captures in memory + retry (or accept loss — low volume) |
| Kit API timeout | Subscription fails | Sentry error alert | Return success to user, retry via webhook or manual import |
| Lemon Squeezy webhook failure | Purchase not recorded | Sentry + webhook retry (LS retries 5x) | Manual Supabase insert from LS dashboard |
| Velite build failure | New content not deployed | Vercel build failure notification | Previous deploy stays live (Vercel atomic deploys) |
| Content MDX syntax error | Build fails | Vercel build log | Fix MDX + redeploy. Old version live until fixed. |

**Resilience principle**: Atomic Vercel deploys mean a broken build never touches production. Previous working deploy stays live indefinitely.

**Email capture failure strategy**:
```
User submits email
  → /api/subscribe receives request
  → Validate (Zod)
  → INSERT into Supabase (if fail → log to Sentry, continue)
  → POST to Kit API (if fail → log to Sentry, return success to user)
  → Return success
```
User always sees success. Kit failure is recoverable via Supabase record sync.

---

## Security Architecture (Skill 7)

### Authentication Model

**Phase 1: No user-facing auth.** No gated content, no user login.

The only privileged operations are server-side (API routes):
- `/api/subscribe`: public endpoint with rate limiting
- `/api/webhooks/lemonsqueezy`: HMAC-SHA256 signature verification
- `/api/health`: public endpoint, read-only

**Supabase access from server**:
- All DB operations use `SUPABASE_SERVICE_ROLE_KEY` (server-side only, never in browser)
- `SUPABASE_ANON_KEY` exposed to browser only for future auth flows (Phase 2+)

### Authorization Model

No user roles in Phase 1. All content is public. Database is server-only (no RLS policies needed for end-users, but enabled as defense-in-depth).

### Input Validation (Zod schemas)

```typescript
// /api/subscribe — Zod schema
const subscribeSchema = z.object({
  email: z.string().email().max(254),
  name: z.string().max(100).optional(),
  source: z.string().max(200),
  topics: z.array(z.string().max(50)).max(10).optional()
})

// /api/webhooks/lemonsqueezy — validates signature before parsing body
// Uses crypto.timingSafeEqual for HMAC comparison (prevents timing attacks)
```

### Rate Limiting

`/api/subscribe`: 5 requests per IP per hour via `@upstash/ratelimit` + Vercel KV (or `@vercel/kv`).

If Upstash not available: use in-memory Map (acceptable for low volume).

### Secrets Management

| Secret | Variable | Access |
|---|---|---|
| Supabase service key | `SUPABASE_SERVICE_ROLE_KEY` | Server only (never in NEXT_PUBLIC_) |
| Supabase anon key | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Client (safe — protected by RLS) |
| Supabase URL | `NEXT_PUBLIC_SUPABASE_URL` | Client (safe) |
| Kit API key | `KIT_API_KEY` | Server only |
| Lemon Squeezy webhook secret | `LEMONSQUEEZY_WEBHOOK_SECRET` | Server only |
| Sentry DSN | `NEXT_PUBLIC_SENTRY_DSN` | Client (safe — public by design) |
| Plausible domain | `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | Client (safe) |

**Rule**: Any variable without `NEXT_PUBLIC_` prefix is server-only and never exposed to the browser.

### Attack Surface

- No user accounts → no account takeover risk
- No file uploads → no upload injection risk
- No rich text editor → no XSS via user content
- No search database → search is client-side static (Pagefind)
- Affiliate links are hardcoded in MDX → no URL injection risk
- Webhook validates HMAC before processing → no forged payment events

---

## SEO Architecture (Skill 1 — SEO translation)

### Metadata Per Page

```typescript
// app/articles/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  const article = getArticleBySlug(params.slug)
  return {
    title: `${article.title} | AHAeCommerce`,
    description: article.description,           // 120–155 chars
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt,
      images: [`/api/og?slug=${article.slug}`]
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
    }
  }
}
```

### Structured Data (JSON-LD)

```typescript
// Article schema
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": article.title,
  "description": article.description,
  "author": { "@type": "Person", "name": "AHAeCommerce" },
  "datePublished": article.publishedAt,
  "dateModified": article.updatedAt ?? article.publishedAt,
  "url": `https://ahaecommerce.com/articles/${article.slug}`,
  "publisher": {
    "@type": "Organization",
    "name": "AHAeCommerce",
    "url": "https://ahaecommerce.com"
  }
}
```

### Sitemap Generation

```typescript
// app/sitemap.ts
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articles = getAllArticles()
  const staticPages = ['', 'about', 'start-here', 'subscribe']

  return [
    ...staticPages.map(page => ({
      url: `https://ahaecommerce.com/${page}`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: page === '' ? 1.0 : 0.8
    })),
    ...articles.map(article => ({
      url: `https://ahaecommerce.com/articles/${article.slug}`,
      lastModified: new Date(article.updatedAt ?? article.publishedAt),
      changeFrequency: 'yearly',    // evergreen content
      priority: 0.9
    }))
  ]
}
```

### Core Web Vitals Strategy

| Metric | Target | Architecture Decision |
|---|---|---|
| LCP | < 2.5s | Static/ISR rendering, `next/image` with priority on hero, no render-blocking scripts |
| INP | < 200ms | No heavy client-side JS on content pages, React Server Components for all content |
| CLS | < 0.1 | Fixed image dimensions via `next/image`, no dynamic injected elements without reserved space |
| Lighthouse SEO | ≥ 90 | All metadata present, h1 per page, robots.txt, sitemap, canonical |
| Lighthouse Performance | ≥ 80 | Static/ISR, optimized images, minimal JS bundle |

---

## Observability Design (Skill 12)

### What Gets Logged

| Event | Where | Retention |
|---|---|---|
| All errors (server + client) | Sentry | 30 days free |
| Subscription attempts (success + fail) | Sentry breadcrumbs | 30 days |
| Webhook receipts (success + fail) | Sentry | 30 days |
| Page views, unique visitors | Plausible | Unlimited (paid plan) |
| Email capture conversions | Plausible custom events | Unlimited |
| Affiliate link clicks | Plausible custom events | Unlimited |
| Build logs | Vercel | 30 days |

### Alerts

| Alert | Condition | Via |
|---|---|---|
| Error spike | >10 errors/hour | Sentry email alert |
| Health check failure | `/api/health` returns non-200 | Uptime robot (free tier) |
| Supabase DB size | > 400MB (near free tier limit) | Supabase dashboard email |

### Health Endpoint

```typescript
// GET /api/health
export async function GET() {
  const dbCheck = await testSupabaseConnection()
  return Response.json({
    status: 'ok',
    db: dbCheck ? 'connected' : 'error',
    timestamp: new Date().toISOString()
  }, { status: dbCheck ? 200 : 503 })
}
```

---

## Deployment Strategy (Skill 8)

### Environments

| Environment | URL | Purpose | Auto-Deploy |
|---|---|---|---|
| Production | ahaecommerce.com | Live site | Push to `main` |
| Preview | *.vercel.app | PR previews | Push to feature branch |
| Local | localhost:3000 | Development | `npm run dev` |

**No staging environment needed** — Vercel preview deployments serve this purpose for a solo operator.

### Deploy Process

```
1. Write/edit MDX content or code
2. Test locally (npm run dev)
3. Run: npm run build (Velite validates editorial gate + TypeScript compiles)
4. Push to main branch
5. Vercel auto-deploys in ~45 seconds
6. Previous deployment stays live during build (atomic swap)
7. If build fails → previous deployment remains live
```

### Feature Flags

No feature flag infrastructure in Phase 1. Solo operator ships to prod directly.
Phase 2+ consideration: Vercel Edge Config for flags without redeployment.

### Rollback Strategy

```
# Instant rollback via Vercel dashboard (1 click)
# Or: git revert + push
```

Vercel keeps all previous deployments. Rollback is instant (CDN pointer swap, < 5 seconds).

---

## Evolution Path (Skill 13)

### Phase 1 → Phase 2 (Gated Content / Auth)

**Trigger**: Email list > 500, demand for premium content confirmed.

**Migration**:
1. Add Supabase Auth to existing Supabase project (no new infrastructure)
2. Add `user_id` to purchases table (migration: `ALTER TABLE purchases ADD COLUMN user_id UUID`)
3. Add middleware for protected routes (`app/[protected]/*`)
4. Phase 2 architecture builds on Phase 1 — no rewrite

### Phase 1 → Phase 2 (CMS UI)

**Trigger**: Content volume > 30 articles, MDX file management becomes friction.

**Migration**:
- Replace Velite with Keystatic (admin UI for MDX files, same filesystem model)
- Zero content migration — files stay in `content/` directory
- Schema-compatible (Keystatic reads same frontmatter)

### API Versioning

No public API in Phase 1. `/api/*` routes are internal (no versioning needed).
If external API is added in future: prefix at `/api/v1/` from first endpoint.

### Schema Migration Strategy

All Supabase migrations in `supabase/migrations/` — version-controlled.
Migration naming: `YYYYMMDD_description.sql` (e.g., `20260228_create_subscribers.sql`).
No migration runs without being committed to git first.

---

## Second-Order Thinking (Skill 11)

| Scenario | Risk | Architecture Response |
|---|---|---|
| **Kit API changes pricing** | Email platform cost spikes | Supabase stores all emails as backup — migration to Beehiiv/Resend requires CSV export only |
| **Google algorithm punishes AI content** | Traffic loss | All content is human-written + editorial-gated — no algorithmic risk. Schema.org `author` field is populated |
| **Lemon Squeezy outage** | No product sales | Low frequency event; product pages still load, checkout button shows graceful "temporarily unavailable" |
| **Build time increases with 100+ articles** | Slow deploys | Velite + Next.js build caching; only changed files recompile. Vercel Turborepo-compatible |
| **Email capture bot spam** | Fake subscribers pollute list | Honeypot field in subscribe form + Zod validation + rate limiting |
| **Content scraped by AI** | Authority dilution | Schema.org + canonical URLs establish original authorship. Not solvable architecturally. |
| **Solo operator unavailable** | Platform goes stale | Vercel deploys are indefinitely stable — no maintenance required for static content |

---

## Governance & Guardrails (Skill 14)

### What Requires a New Migration

Any change to `supabase/migrations/` requires:
1. Migration file committed to git
2. Migration applied locally first (`supabase db reset` or `supabase migration up`)
3. Migration applied to production Supabase project via Supabase dashboard or CLI

**Never alter production DB without a committed migration file.**

### Editorial Gate (Infrastructure-Enforced)

The editorial gate is enforced by Velite schema validation at build time:

```typescript
// content.config.ts — Velite schema
const editorialGateSchema = z.object({
  clarifies_decision: z.boolean(),
  prevents_mistake: z.boolean(),
  reveals_cost: z.boolean(),
  explains_tradeoff: z.boolean()
}).refine(
  gate => gate.clarifies_decision || gate.prevents_mistake ||
          gate.reveals_cost || gate.explains_tradeoff,
  { message: "Editorial gate fail: article must answer at least one editorial question" }
)
// Build fails if this refinement fails.
// No article that fails the editorial gate can be deployed.
```

This converts the editorial rule from a policy into an infrastructure constraint.

### Secrets Governance

- `SUPABASE_SERVICE_ROLE_KEY` is never in a `NEXT_PUBLIC_` variable
- `.env.local` is gitignored — verified in `.gitignore`
- `.env.example` contains only key names with placeholder values
- Vercel environment variables set via Vercel dashboard (not CLI push)

---

## Architecture Decision Records

### ADR-001: Velite for Content Layer (not Sanity/headless CMS)

**Status**: Accepted
**Context**: PRD requires a content system that enforces editorial gate at infrastructure level. Solo developer is also the author.
**Decision**: Velite (file-based MDX collections with schema validation at build time).
**Consequences**:
- Editorial gate is enforced as a build error — cannot be bypassed
- Content is version-controlled in git (great for solo operator)
- No editorial UI — acceptable because author = developer
- Build time scales with content volume — acceptable at 0–300 articles
**Trade-offs**:
| Factor | Velite | Sanity |
|---|---|---|
| Editorial gate enforcement | Build error (hard) | Validation rule (soft) |
| Cost | Free | $0–$99/mo |
| Authoring UX | VS Code + MDX | Web UI |
| Vendor lock-in | None | High |

**Skills applied**: Skill 2 (System Decomposition), Skill 9 (Tech Selection), Skill 14 (Governance)

---

### ADR-002: Lemon Squeezy for Digital Products (not Stripe)

**Status**: Accepted
**Context**: Solo operator cannot manually manage EU VAT and global digital product tax compliance.
**Decision**: Lemon Squeezy (Merchant of Record).
**Consequences**:
- Lemon Squeezy handles EU VAT, Australian GST, and all digital product taxes globally
- Slightly higher fees (~3.5% + $0.30 vs Stripe's 2.9% + $0.30)
- No PCI compliance burden — LS handles this
- Asset delivery handled by LS (file hosting + download links)
**Trade-offs**:
| Factor | Lemon Squeezy | Stripe |
|---|---|---|
| EU VAT handling | Automatic (Merchant of Record) | Manual (requires Stripe Tax add-on + accounting) |
| Fees | ~3.5% + $0.30 | 2.9% + $0.30 |
| Asset delivery | Built-in | External required |
| Global compliance | Automatic | Manual |

**Skills applied**: Skill 9 (Tech Selection), Skill 10 (Constraint Negotiation)

---

### ADR-003: Plausible for Analytics (not PostHog/GA4)

**Status**: Accepted
**Context**: Privacy-first analytics required (content authority platform must not undermine user trust with invasive tracking). GDPR compliance required.
**Decision**: Plausible Analytics.
**Consequences**:
- No cookie consent banner required (Plausible uses no cookies)
- Script weight: ~1KB (vs Google Analytics ~45KB, PostHog ~60KB)
- No user-level data → better for GDPR
- Limited funnel depth vs PostHog (acceptable for Phase 1)
**Upgrade path**: Add PostHog alongside Plausible if deeper product analytics are needed.

**Skills applied**: Skill 7 (Security/Privacy), Skill 9 (Tech Selection)

---

### ADR-004: No User Auth in Phase 1

**Status**: Accepted
**Context**: PRD §4 explicitly defers gated content to Phase 2. No content is paywalled in Phase 1.
**Decision**: No Supabase Auth, no user sessions, no protected routes in Phase 1.
**Consequences**:
- Zero auth complexity
- No session management
- No password reset flows
- Supabase used for DB only (no Auth in Phase 1)
**Migration path**: Supabase Auth activates in Phase 2 with minimal friction (same Supabase project, same DB).

**Skills applied**: Skill 10 (Constraint Negotiation), Skill 13 (Evolution)

---

### ADR-005: Client-Side Search with Pagefind (not Algolia/Typesense)

**Status**: Accepted
**Context**: Search Results page is P1. No server-side search needed for Phase 1 content volume.
**Decision**: Pagefind — static search index generated at build time, runs in browser.
**Consequences**:
- Zero API cost
- Search works offline
- Index generated from static HTML (no additional pipeline)
- Scales to ~1,000 articles before performance degrades
**Upgrade path**: Replace with Algolia when content volume exceeds Pagefind performance threshold.

**Skills applied**: Skill 9 (Tech Selection), Skill 5 (Scalability)

---

## Expansion Test (Gate 2) — 10x Scale Analysis

> "If this business needs 10x more users, 3 new markets, or 5 new features next quarter — what breaks?"

| Dimension | Phase 1 | 10x | Risk | Mitigation |
|---|---|---|---|---|
| **Users (concurrent)** | 1–10 | 10–100 | LOW | Vercel CDN — no architectural change |
| **Data Volume (subscribers)** | 1,000 | 10,000 | LOW | Supabase Free tier (500MB) supports 50K+ subscriber rows |
| **API Load (subscribe calls)** | 100/mo | 1,000/mo | LOW | Serverless auto-scales; rate limiting prevents abuse |
| **Third-Party Dependencies (Kit)** | 0–1,000 subs | 0–10,000 subs | MEDIUM | Kit Creator plan ($25/mo at 1K subs → $79/mo at 10K subs). Acceptable cost growth |
| **Content Build Time** | 30 articles (~30s) | 300 articles (~3–5min) | LOW | Vercel incremental builds + Velite caching mitigate |
| **Cost (monthly)** | ~$9 (Plausible) | ~$75–100 (Plausible growth + Kit paid + Supabase Pro) | LOW | Revenue from content loop funds infrastructure before this scale |
| **Team/Operations** | Solo | Solo | LOW | Static architecture requires zero ops. Solo operator can manage 300 articles |

**New features at 10x (5 new features)**: The architecture isolates modules. Adding gated content = Supabase Auth activation (no schema rewrite). Adding membership = new table + middleware (no existing table changes). Adding API = new `/api/v1/*` routes (no existing changes).

**3 new markets**: Currently English-only. i18n was excluded from Phase 1. Adding i18n requires route-level changes (`/[locale]/`). This IS an architectural constraint — but it's documented and deferred correctly.

**Gate 2 Verdict**: PASS (CONDITIONAL on i18n note)
- All dimensions: LOW or manageable MEDIUM
- No CRITICAL risks
- No dimension requires schema rewrite at 10x
- i18n is documented as a deferred architectural decision (not a surprise)

---

## Implementation Sequence

For Gate 3c (Pre-Implementation Verification) compliance, this sequence must be followed:

**Week 1–2: Foundation**
1. Initialize Next.js 15 project (`npx create-next-app@latest`)
2. Configure Tailwind CSS v4
3. Set up Supabase project (create project, get credentials)
4. Apply first migration (`supabase/migrations/20260228_initial.sql`)
5. Generate TypeScript types (`npx supabase gen types typescript`)
6. Configure Velite + content schema
7. Set up Sentry
8. Create `/api/health` endpoint and verify DB connection
9. Verify toolchain: lint ✓ + tsc ✓ + build ✓ + test ✓ (all independently)

**Week 2–3: Content Infrastructure**
1. Create root layout with metadata defaults
2. Create Article page template (ISR)
3. Create Home, About, Start Here, Subscribe pages (static)
4. Wire `/api/subscribe` → Kit + Supabase
5. Add Plausible script
6. Configure `app/sitemap.ts` and `app/robots.ts`
7. Add JSON-LD schema to Article pages

**Week 3–4: Monetization**
1. Create digital product content schema
2. Create Product landing page template
3. Wire Lemon Squeezy checkout
4. Create `/api/webhooks/lemonsqueezy`
5. Create Thank You page

**Week 4: Search + SEO Polish**
1. Integrate Pagefind
2. Create Search Results page
3. Configure `@vercel/og` for OG images
4. Verify Core Web Vitals (Lighthouse CI)

---

## Architecture Refiner Score

Scoring on 6 axes (1–5):

| Axis | Score | Evidence |
|---|---|---|
| **Boundaries** | 5 | Every module replaceable: content layer, email, payments, analytics all independently swappable |
| **Scalability** | 4 | Static/ISR = near-unlimited content scale. DB is minimal use. Rate limiting in place. |
| **Resilience** | 4 | Atomic deploys, previous deploy always live, email capture has dual-write fallback |
| **Data Integrity** | 4 | RLS enabled, all DB ops server-side, Zod validation on all inputs, HMAC on webhooks |
| **Operability** | 4 | Sentry, Plausible, Vercel logs, health endpoint, uptime monitoring all in place |
| **Evolvability** | 5 | Auth deferred cleanly, i18n documented, content layer swappable, modules isolated |

**Average: 4.3 / 5** — Exceeds 3.5 threshold. Architecture approved.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Kit API deprecation / pricing change | Low | Medium | All emails in Supabase as backup; migration path to Resend + React Email |
| Velite deprecation (newer project) | Low | Low | Contentlayer2 or direct MDX parsing as fallback; content files unchanged |
| Google Core Update punishing thin content | Medium | High | Editorial gate enforces depth; evergreen positioning protects vs thin-content penalties |
| Lemon Squeezy pricing increase | Low | Low | Stripe + Stripe Tax as fallback (documented in ADR-002) |
| Build times increase past 10 minutes | Low | Low | Velite build caching + Vercel Turborepo future option |

---

**Architecture Version**: 1.0
**Status**: Draft — Gate 2 Expansion Test: PASS (CONDITIONAL — i18n deferred)
**Next Step**: ARCHITECTURE_HANDOFF.md → Gate 2 formal evaluation → Design phase unlock
