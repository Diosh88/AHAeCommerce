# Design Handoff — AHAeCommerce

**From**: Design Phase (design-ux-executor v7.0)
**To**: Development Phase
**Date**: 2026-02-28
**Status**: COMPLETE — Gate 3a PASS (15/15) + Gate 3b PASS (8/8)

---

## 1. Handoff Summary

The design phase is complete. All three primary design artifacts have been created and verified against the Architecture Handoff inputs. Development may begin after passing Gate 3c (Pre-Implementation Verification) and Gate 3d (Design Contract Enforcement) — both run before first code generation, not at phase advance.

| Artifact | Path | Status |
|----------|------|--------|
| Design-OS (token system) | `docs/design/DESIGN_OS.md` | ✅ Complete |
| AI Execution Sheet (dev reference) | `docs/design/AI_EXECUTION_SHEET.md` | ✅ Complete |
| Page Specs (13 pages, 6 states) | `docs/design/PAGE_SPECS.md` | ✅ Complete |
| Gate 3a: Design Completeness | `docs/planning/DESIGN_COMPLETENESS_GATE.md` | ✅ PASS 15/15 |
| Gate 3b: Security Readiness | `docs/governance/PROJECT_STATE.json` §gate_results | ✅ PASS 8/8 |

---

## 2. Design Canon

**Identity**: Content-authority editorial platform. Trust through restraint. Authority through clarity.
**Canon**: New Yorker × The Economist × Stripe Docs
- New Yorker: editorial authority through typography
- The Economist: analytical depth without visual fluff
- Stripe Docs: technical clarity, trust through precision

**Anti-canon** (never build toward):
- Buzzfeed / Mashable (clickbait aesthetics)
- TechCrunch (news blog, info density without hierarchy)
- Generic SaaS landing page (stock photos, gradient CTAs)

---

## 3. Design-OS Token Summary

**Color Palette**

| Token Class | Hex | Role |
|-------------|-----|------|
| `bg-background` | `#FAFAF8` | Page background — warm off-white |
| `bg-surface` | `#FFFFFF` | Cards, modals |
| `bg-surface-raised` | `#F5F5F2` | Sidebars, code blocks |
| `bg-brand` | `#1B3A5C` | Primary buttons, nav active, headers |
| `bg-brand-light` | `#EBF0F7` | Inline callouts, highlighted sections |
| `bg-accent` | `#B45309` | CTA buttons (Subscribe, Checkout) |
| `bg-accent-light` | `#FEF3C7` | Warning callouts, editorial highlights |
| `text-DEFAULT` | `#111827` | All body text |
| `text-secondary` | `#4B5563` | Labels, metadata |
| `text-muted` | `#9CA3AF` | Captions, placeholders (large text only) |
| `text-brand` | `#1B3A5C` | Links in text |
| `text-accent` | `#B45309` | Editorial emphasis |
| `text-inverse` | `#FFFFFF` | Text on brand/dark backgrounds |
| `border-DEFAULT` | `#E5E7EB` | All borders |
| `border-strong` | `#D1D5DB` | Focused inputs, emphasis |
| `border-brand` | `#1B3A5C` | Selected states |

**Typography**

| Use Case | Classes | Font |
|----------|---------|------|
| Home hero h1 | `text-5xl md:text-6xl font-extrabold leading-tight font-sans` | Inter |
| Page h1 | `text-4xl font-bold leading-tight font-sans` | Inter |
| Section h2 | `text-3xl font-bold font-sans` | Inter |
| Article body | `text-lg leading-relaxed font-serif` | Lora |
| UI body | `text-base leading-normal font-sans` | Inter |
| Metadata | `text-sm font-medium text-secondary font-sans` | Inter |
| Code | `text-sm font-mono bg-surface-raised` | JetBrains Mono |

**Spacing** (4px base unit — never use arbitrary values)

| Token | Value | Common Use |
|-------|-------|------------|
| `p-1` | 4px | Icon padding |
| `p-2` | 8px | Chip/badge padding |
| `p-3` | 12px | Input padding, button vertical |
| `p-4` | 16px | Card padding inner |
| `p-6` | 24px | Card padding larger |
| `p-8` | 32px | Section separation |
| `p-12` | 48px | Major section spacing |
| `p-16` | 64px | Page vertical rhythm |
| `p-24` | 96px | Hero padding |

**Motion budget**: max 300ms, `prefers-reduced-motion` always respected.

---

## 4. The 5 Unbreakable Rules (from AI Execution Sheet)

Violations of these rules are build failures, not warnings.

1. **One `<h1>` per page** — SEO + hierarchy law
2. **Zero raw Tailwind colors** — use only Design-OS tokens (`text-brand`, `bg-accent`, etc.)
3. **Zero arbitrary spacing** — use only spacing scale (`p-4`, `mt-6`, not `p-[17px]`)
4. **Every interactive element needs all 8 states** — default, hover, focus, active, disabled, loading, error, success
5. **375px first** — mobile layout is the baseline, desktop is the extension

---

## 5. Page Inventory for Development

| # | Page | Route | Rendering | Priority |
|---|------|-------|-----------|----------|
| 1 | Home | `/` | ISR (24h) | P0 |
| 2 | Article | `/articles/[slug]` | ISR (24h) | P0 |
| 3 | Category/Topic | `/topics/[slug]` | ISR (24h) | P0 |
| 4 | About | `/about` | Static | P1 |
| 5 | Subscribe | `/subscribe` | Static | P0 |
| 6 | Product Landing | `/products/[slug]` | ISR (1h) | P1 |
| 7 | Thank You | `/thank-you` | Static | P1 |
| 8 | Start Here | `/start-here` | Static | P0 |
| 9 | Search Results | `/search` | Client-side | P1 |
| 10 | 404 | `/not-found` | Static | P1 |
| 11 | Privacy Policy | `/privacy` | Static | P1 |
| 12 | Terms of Service | `/terms` | Static | P1 |
| 13 | All Articles | `/articles` | ISR (24h) | P1 |

**Backend-first rule**: Every page that reads data requires its migration, API route, and TypeScript types to exist before the page component is scaffolded.

---

## 6. Component Inventory

### 8 Shared Design-OS Primitives (build these first)

| Component | Description | Used On |
|-----------|-------------|---------|
| `SiteHeader` | Sticky nav (64px desktop, hamburger mobile) | All pages |
| `SiteFooter` | Footer with nav links + email capture | All pages |
| `ArticleCard` | Card with badge, title, lede, metadata | Home, Category, All Articles, Start Here |
| `EmailCapture` | Inline callout with email form | Home, Article (×2), Category, Subscribe, Start Here |
| `Button[primary|secondary|CTA]` | 3 variants, all 8 states | All pages |
| `Badge` | Topic label chip | Article, ArticleCard |
| `SkeletonLoader` | Content skeleton for loading states | All dynamic pages |
| `ErrorBanner` | Error state with retry action | All pages |

### 11 Justified Page-Specific Components

| Component | Page | Justification |
|-----------|------|---------------|
| `HeroSection` | Home | Unique landing composition with value proposition + CTA |
| `FeaturedGrid` | Home | 3-up featured article layout, not a generic card grid |
| `TopicLandingHero` | Category | Category-specific header with description + article count |
| `ArticleHero` | Article | Title + metadata + reading time, specific to article template |
| `TableOfContents` | Article | In-article navigation, sticky sidebar on desktop |
| `AffiliateDisclosure` | Article (conditional) | Legal requirement, page-specific trigger via frontmatter |
| `RelatedArticles` | Article | End-of-article recommendations, article-specific context |
| `ProductCard` | Product Landing | Price + feature list + Lemon Squeezy CTA, unique layout |
| `SearchBox` | Search Results | Pagefind integration, search-specific state management |
| `StartHereRoadmap` | Start Here | Custom sequential article display (visual roadmap) |
| `ConfirmationState` | Thank You | Post-action confirmation with next steps |

---

## 7. API Contracts Required Before Frontend

These API routes must exist and return correct responses before frontend pages can be built.

| Endpoint | Method | Used By | Notes |
|----------|--------|---------|-------|
| `/api/subscribe` | POST | Subscribe page, EmailCapture | Zod validated, rate limited, Kit integration |
| `/api/webhooks/lemonsqueezy` | POST | Product purchase flow | HMAC validated, Supabase insert |
| `/api/health` | GET | Monitoring, uptime check | Returns `{status: "ok", timestamp}` |
| `/api/search` (or Pagefind static) | GET | Search page | Pagefind static index (build-time) |

**Schema** (from ARCHITECTURE.md):
```typescript
// POST /api/subscribe
SubscribeRequest = {
  email: string (valid email),
  name?: string (max 100 chars),
  source: 'home-hero' | 'article-inline' | 'article-end' | 'subscribe-page' | 'category-page',
  topics?: string[]
}

SubscribeResponse = {
  success: boolean,
  message: string
} | ErrorResponse
```

---

## 8. Database Schema Required Before Frontend

Two tables — both need RLS enabled before any frontend work begins.

```sql
-- subscribers
CREATE TABLE public.subscribers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  source TEXT NOT NULL,
  topics TEXT[],
  kit_id TEXT,
  gdpr_consent BOOLEAN NOT NULL DEFAULT FALSE,
  gdpr_consent_at TIMESTAMPTZ,
  subscribed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- purchases
CREATE TABLE public.purchases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  product_slug TEXT NOT NULL,
  lemon_order_id TEXT UNIQUE NOT NULL,
  lemon_variant_id TEXT NOT NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'USD',
  status TEXT NOT NULL DEFAULT 'completed',
  purchased_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE public.purchases ENABLE ROW LEVEL SECURITY;
```

**RLS Policies**: service_role only for both tables. No direct client access Phase 1.

---

## 9. Gate 3c + 3d Pre-Flight (Run Before First Code)

Before writing any page component, the following must be verified (Gate 3c + 3d):

**Gate 3c — Pre-Implementation Verification** (9 checks):
- [ ] Supabase project created and connection verified
- [ ] Migrations applied (both tables exist)
- [ ] TypeScript types generated (`database.types.ts`)
- [ ] `/api/subscribe` route returns correct response
- [ ] `/api/health` route returns 200
- [ ] No mock data in any page scaffold
- [ ] All column names from types, not approximated
- [ ] Page scaffold matches architecture page inventory
- [ ] Build + lint + test each pass independently

**Gate 3d — Design Contract Enforcement** (10 checks):
- [ ] DESIGN_OS.md exists with project-specific token values ✅ (done)
- [ ] AI_EXECUTION_SHEET.md exists ✅ (done)
- [ ] `useDesign` hook or equivalent scaffolded
- [ ] Layout wrapper component (`RootLayout`, `ArticleLayout`) exists
- [ ] `token-lint.sh` configured and runs clean
- [ ] Zero raw Tailwind color classes in any component
- [ ] Zero arbitrary spacing values
- [ ] All pages use layout wrapper
- [ ] Motion budget defined and respected
- [ ] Typography scale from DESIGN_OS applied everywhere

---

## 10. Security Requirements for Development

From Gate 3b (all 8 items PASS):

| Requirement | Implementation |
|-------------|----------------|
| No user auth Phase 1 | ADR-004 — no Supabase Auth configuration needed |
| RLS on subscribers | Policy: service_role INSERT only |
| RLS on purchases | Policy: service_role INSERT only |
| Subscribe API input validation | Zod schema — email, name (optional, max 100), source (enum), topics (array) |
| Webhook HMAC validation | Lemon Squeezy signature header verification before any processing |
| Rate limiting | Upstash Redis — 10 req/min per IP on /api/subscribe |
| No secrets in client | SERVICE_ROLE_KEY server-only. SUPABASE_URL + ANON_KEY client-safe (with RLS). |
| Security test stubs | Subscribe: invalid email, SQL injection, XSS in name, rate limit bypass. Webhook: invalid HMAC, replay, malformed body. |

---

## Phase Unlock Confirmation

```
┌─────────────────────────────────────────────────────────┐
│  DESIGN PHASE: COMPLETE                                   │
│                                                           │
│  Gate 3a (Design Completeness): PASS — 15/15             │
│  Gate 3b (Security Readiness):  PASS — 8/8               │
│                                                           │
│  Development Phase: UNLOCKED                             │
│                                                           │
│  Required before first code: Gate 3c + Gate 3d           │
│  → Run gate-3c-verify.sh when it exists                  │
│  → Verify all 10 Design Contract checks                  │
└─────────────────────────────────────────────────────────┘
```

**Next action**: Use `/frontend-executor` or `/backend-executor` for development. Input: this handoff + `docs/design/AI_EXECUTION_SHEET.md`. Run Gate 3c + 3d as pre-flight before any page component is built.
