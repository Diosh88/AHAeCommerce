# Architecture Handoff — AHAeCommerce

**From Phase**: Architecture
**To Phase**: Design
**Generated**: 2026-02-28
**Architecture Version**: 1.0
**Architecture Location**: `docs/architecture/ARCHITECTURE.md`
**Status**: PENDING Gate 2 (Expansion Test) — Design phase locked until gate passes

---

## Handoff Summary

This document extracts the structured decisions from the Architecture phase that Design and Development must consume. Design cannot invent its own layout constraints — it must build on the architecture defined here.

---

## 1. Confirmed Technology Stack

| Category | Choice | Version | Notes |
|---|---|---|---|
| Framework | Next.js | 15 (App Router) | RSC, ISR, Server Actions |
| Styling | Tailwind CSS | v4 | Design-OS tokens map here |
| Content Layer | Velite | Latest | MDX file-based, schema-validated |
| Database | Supabase | Latest | Postgres, RLS enabled |
| Auth | None (Phase 1) | N/A | Supabase Auth ready for Phase 2 |
| Email | ConvertKit (Kit) | Latest | API v4 |
| Payments | Lemon Squeezy | Latest | Merchant of Record |
| Analytics | Plausible | Latest | Privacy-first, no cookies |
| Error Tracking | Sentry | Latest | Next.js integration |
| Search | Pagefind | Latest | Static, client-side |
| OG Images | @vercel/og | Latest | Edge-rendered |
| Testing | Vitest (unit) + Playwright (E2E) | Latest | |

**Stack is now COMMITTED.** Architecture phase has made the final selections.

---

## 2. Page Inventory (Design Must Cover All 13 Pages)

| # | Page | Route | Auth | Priority | Page Type | Rendering |
|---|---|---|---|---|---|---|
| 1 | Home | `/` | No | P0 | Customer-facing | Static |
| 2 | Article (template) | `/articles/[slug]` | No | P0 | Customer-facing | ISR (24h) |
| 3 | Category/Topic | `/topics/[cluster]` | No | P0 | List-table | Static |
| 4 | About | `/about` | No | P0 | Customer-facing | Static |
| 5 | Subscribe | `/subscribe` | No | P0 | Customer-facing | Static |
| 6 | Product Landing | `/products/[slug]` | No | P1 | Transactional | Static |
| 7 | Thank You | `/thank-you` | No | P1 | Transactional | Static |
| 8 | Start Here | `/start-here` | No | P1 | Customer-facing | Static |
| 9 | Search Results | `/search` | No | P1 | List-table | Static shell + client |
| 10 | 404 | built-in | No | P0 | Error | Static |
| 11 | Privacy Policy | `/legal/privacy-policy` | No | P0 | Customer-facing | Static MDX |
| 12 | Terms of Service | `/legal/terms-of-service` | No | P0 | Customer-facing | Static MDX |
| 13 | All Articles Index | `/articles` | No | P2 | List-table | Static |

**Design must produce a page spec for every P0 and P1 page before development begins.**

---

## 3. Component Inventory (Design Must Define All)

### Shared Components (Design-OS Primitives)

| Component | Purpose | Variants |
|---|---|---|
| `Typography` | Headings, body, captions | h1, h2, h3, h4, body, caption, small |
| `Button` | CTAs | primary, secondary, ghost |
| `EmailCapture` | Email opt-in form | inline, end-of-article, dedicated |
| `AffiliateLink` | Affiliate recommendation | inline, card |
| `AffiliateDisclosure` | Required disclosure banner | page-level |
| `ArticleCard` | Article preview in lists | featured, standard |
| `TableOfContents` | Auto-generated nav for long articles | sticky-desktop, collapsible-mobile |
| `RelatedArticles` | Tag-based related content | 2–3 items |
| `CategoryBadge` | A–Z category label | per article |
| `ReadingTime` | Estimated read time | text only |
| `SiteHeader` | Navigation | desktop, mobile (hamburger) |
| `SiteFooter` | Site-wide footer | standard |
| `JsonLD` | Structured data injection | server-only, no visual |
| `CheckoutButton` | Lemon Squeezy checkout CTA | product landing only |

### Navigation Pattern

**Selected**: Top navigation bar (desktop) + hamburger drawer (mobile)
- Navigation links: Home, Topics, Start Here, About, Subscribe (CTA)
- No sidebar navigation (content-first, not portal-style)

---

## 4. URL Hierarchy (Design Must Use These Exact Paths)

```
ahaecommerce.com/                        → Home
ahaecommerce.com/articles/[slug]         → Articles (no dates, no categories in URL)
ahaecommerce.com/topics/[cluster]/       → Topic clusters
ahaecommerce.com/start-here/             → New reader orientation
ahaecommerce.com/about/                  → About
ahaecommerce.com/subscribe/              → Email capture
ahaecommerce.com/products/[slug]/        → Digital products
ahaecommerce.com/thank-you/              → Post-purchase
ahaecommerce.com/legal/privacy-policy/   → Privacy
ahaecommerce.com/legal/terms-of-service/ → Terms
ahaecommerce.com/search/                 → Search
ahaecommerce.com/articles/               → Articles index (P2)
ahaecommerce.com/topics/                 → Topics index (auto from architecture)
```

---

## 5. API Contracts (Relevant to Design)

Design must account for these async interactions:

| Interaction | Endpoint | What Design Must Handle |
|---|---|---|
| Email subscribe | `POST /api/subscribe` | Loading state, success state, error states (DUPLICATE, INVALID_EMAIL, RATE_LIMITED) |
| Checkout redirect | Lemon Squeezy (external) | Loading state on CheckoutButton, redirect handles payment |
| Search | Client-side (Pagefind) | Loading state, no-results state, results list |
| Health | `GET /api/health` | Not user-facing |

---

## 6. Mobile-First Constraints (Architecture Decision)

| Constraint | Value | Source |
|---|---|---|
| Mobile baseline | 375px | PRD §17, Architecture §Security |
| Touch targets | 44×44px minimum | PRD §17 WCAG requirement |
| Reading context | Mobile discovery, desktop deep reads | PRD §2 Primary User |
| No mandatory animations | Content is text-dominant | Architecture §Performance |
| Offline state | Service worker message or fallback | PRD §15 (all 6 states) |

---

## 7. Content Structure (Design Must Layout For)

### Article Anatomy

Every article page must have a layout for:
1. **Article header**: Title, description, category badge, reading time, published date
2. **Table of contents**: Auto-generated, sticky on desktop, collapsible on mobile (articles > 1,500 words)
3. **Article body**: MDX-rendered content with inline email capture and affiliate links
4. **Mid-article email capture**: Inline form at ~50% scroll depth
5. **End-of-article section**: Summary + email capture CTA + related articles (2–3)
6. **Affiliate disclosure**: Visible banner if `affiliateLinks: true` in frontmatter

### A–Z Category Structure

26 categories (A through Z). Each becomes a `/topics/[cluster]/` page.
Design must handle: empty state (0 articles), populated state (1+ articles), paginated state (10+ articles).

---

## 8. SEO Constraints (Design Must Respect)

| Constraint | Requirement |
|---|---|
| One `<h1>` per page | Non-negotiable — SEO |
| Heading cascade | `<h1>` → `<h2>` → `<h3>` — no skipping levels |
| Content-first layout | Text content must be the first meaningful render |
| Semantic HTML | `<article>`, `<nav>`, `<main>`, `<aside>`, `<footer>` used correctly |
| No decorative text in h-tags | Headings must contain real content |
| Alt text | All `<img>` elements need alt (or `alt=""` for decorative) |
| Skip navigation link | Required for accessibility (WCAG 2.1 AA) |

---

## 9. Performance Budget (Design Must Not Violate)

| Budget Item | Limit | Why |
|---|---|---|
| First-load JS bundle | < 100KB | Content pages need minimal JS |
| LCP | < 2.5s | Core Web Vitals — SEO ranking factor |
| CLS | < 0.1 | Fixed image dimensions, no injected elements |
| CSS size | < 50KB (purged) | Tailwind purge handles this |
| Total page weight (average article) | < 500KB | Mobile 3G load time |
| Animations | No mandatory animations | Prefers-reduced-motion must be respected |

---

## 10. Security Design Constraints

| Constraint | Impact on Design |
|---|---|
| No user login Phase 1 | No login page, no account page, no profile page |
| GDPR email compliance | Subscribe form must show GDPR consent checkbox or text |
| Affiliate disclosure | Required banner on any page with affiliate links |
| Unsubscribe path | Footer must include "Manage subscription" link |
| Cookie consent | NOT REQUIRED (Plausible uses no cookies) |

---

## 11. Design-OS Requirements (Gate 3d Prerequisites)

The following must exist before frontend development begins:

1. Design-OS created with project-specific tokens (colors, typography, spacing)
2. Token values defined in `styles/globals.css` (CSS custom properties)
3. `tailwind.config.ts` references Design-OS tokens (no raw Tailwind colors in components)
4. `AI_EXECUTION_SHEET.md` created (single-page design reference for development)
5. `useDesign` hook or equivalent scaffolded
6. Layout wrapper component exists
7. Token enforcement script (`scripts/token-lint.sh`) configured
8. Motion budget defined (per accessibility requirements — prefers-reduced-motion)

---

## 12. Gate 2 Status

| Gate | Status | Result |
|---|---|---|
| Gate 2: Expansion Test | PASS (CONDITIONAL) | All dimensions LOW/MEDIUM. i18n deferred (documented). |

> Design phase is now **UNLOCKED** (pending Gate 3a + Gate 3b).
> Use `/design-ux-executor` with this handoff document as primary input.

---

## Open Architecture Decisions for Design to Be Aware Of

| Item | Status | Design Impact |
|---|---|---|
| i18n deferred to Phase 2 | Documented in ADR | English-only layouts; no multi-language considerations in Phase 1 |
| Gated content deferred to Phase 2 | Documented | No login/paywall states needed in Phase 1 |
| Kit segmentation by topic | Planned | Email capture form may include optional topic checkboxes |
| Pagefind search | Client-side static | Search Results page needs loading + no-results states |

---

**Handoff Version**: 1.0
**Created**: 2026-02-28
**Next**: Gate 3a (Design Completeness) → Gate 3b (Security Readiness) → Gate 3c (Pre-Implementation) → Gate 3d (Design Contract) → Development
