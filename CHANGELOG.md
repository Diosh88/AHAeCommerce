# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added (2026-02-28 — Phase 5: Testing — Gate 4a PASS 7/7)
- L3 integration tests: subscribe (10 tests) + lemonsqueezy webhook (10 tests) — real Supabase, UUID-prefixed data, afterAll cleanup
- E2E tests activated: 404 (9 tests), article-page (9 tests), subscribe-flow (9 tests) — chromium-desktop + chromium-mobile + webkit-mobile
- Test suite: **177 total tests passing** (76 unit+component, 20 L3 integration, 81 E2E)
- Lighthouse scores (production build): Accessibility 98-100, Performance 97, SEO 91-100
- Testing handoff document: `docs/planning/TESTING_HANDOFF.md`
- Gate 4a PASS (7/7 sections) — Deployment phase unlocked

### Fixed (2026-02-28 — Testing)
- `tests/e2e/404.spec.ts`: robots meta test handles multiple `meta[name="robots"]` elements from Next.js metadata system
- `tests/e2e/article-page.spec.ts`: strict mode selectors (`.first()`) for EmailCapture forms; articles link locator uses `a[href="/articles"]`
- `tests/e2e/subscribe-flow.spec.ts`: selectors scoped to `main` role to avoid matching footer EmailCapture; route handler properly calls `route.abort()`
- `tests/components/ArticleCard.test.tsx`: added missing `vi` import
- `tsconfig.json`: excluded `tests/` from main type-check (tests type-checked by vitest)

### Added (2026-02-28 — Phase 5: Testing setup — Gate 4 PASS 7/7)
- Test infrastructure: `vitest.config.mts`, `playwright.config.ts`, `tests/setup.ts`
- API unit tests: health (8), subscribe (15), webhook/lemonsqueezy (14) — includes HMAC security invariant tests
- Component tests: ArticleCard (16), EmailCapture (23)
- E2E Playwright skeletons (`.todo()`): subscribe-flow, article-page (375/768/1280px breakpoints), 404
- Test suite: **76/76 unit+component tests passing**
- New devDependencies: `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom`, `@vitejs/plugin-react`, `jsdom`
- Testing phase unlocked — PROJECT_STATE.json updated to current_phase: testing

### Fixed (2026-02-28 — Development)
- `app/api/webhooks/lemonsqueezy/route.ts`: `crypto.timingSafeEqual` threw `RangeError` on non-hex X-Signature headers (buffer length mismatch). Added length guard before comparison.
- `next.config.ts`: Removed webpack debug logging block (caused "Webpack configured while Turbopack is not" warning). Added `turbopack.root` to silence workspace root inference warning.
- `velite.config.ts`: Fixed double-path slug bug — `s.path()` was returning `articles/slug`, producing `/articles/articles/slug` URLs. Both collections now strip to last path segment in transform.
- Dev server starts cleanly (0 warnings). Build passes (`velite build && next build`). Article URLs correct (`/articles/ecommerce-platform-decision-framework`).

### Added (2026-02-28 — Phase 4: Development)
- Next.js 15 App Router project initialized with Tailwind v4, TypeScript, ESLint (`package.json`, `tsconfig.json`, `next.config.ts`, `postcss.config.mjs`)
- Tailwind v4 CSS-first config with full Design-OS token system (`app/globals.css`) — all colors as CSS custom properties
- Velite content layer with editorial gate enforcement at build time (`velite.config.ts`) — build fails if content fails 4-question test
- Supabase migrations applied: `subscribers` + `purchases` tables with RLS enabled (`supabase/migrations/`)
- TypeScript database types file (`types/database.types.ts`) — exact column names, Gate 3c compliant
- Lazy Supabase server client (`lib/supabase/server.ts`) — no build-time initialization
- API: POST `/api/subscribe` (Zod validation + Upstash rate limiting + Kit sync + Supabase upsert)
- API: POST `/api/webhooks/lemonsqueezy` (HMAC signature validation + idempotent purchase recording)
- API: GET `/api/health` (monitoring endpoint)
- 8 shared Design-OS components: Button (3 variants, 8 states), Badge, ArticleCard, EmailCapture (inline+footer), SkeletonLoader (4 variants), ErrorBanner, MDXContent, SearchBox
- 2 layout components: SiteHeader (sticky, desktop nav + mobile drawer), SiteFooter (3-column + email capture)
- 13 pages: Home (P0), Article template (P0), Category/Topic (P0), Subscribe (P0), Start Here (P0), About (P1), Product Landing (P1), Thank You (P1), Search (P1), 404 (P1), Privacy (P1), Terms (P1), All Articles (P1)
- SEO infrastructure: `app/sitemap.ts` (auto-generated from Velite), `app/robots.ts`, metadata exports on all pages, OG image route
- Sample article that passes editorial gate (`content/articles/ecommerce-platform-decision-framework.mdx`)
- Gate 3c PASS (9/9 checks, auth N/A Phase 1) + Gate 3d PASS (10/10 checks)
- TypeScript: 0 errors. ESLint: 0 warnings or errors.
- EXECUTION_MAP.md delivery tracking document (`docs/planning/EXECUTION_MAP.md`)

### Added (2026-02-28 — Phase 3: Design)
- DESIGN_OS.md — Full Design-OS token system (color, typography, spacing, motion, shadows) (`docs/design/DESIGN_OS.md`)
- AI_EXECUTION_SHEET.md — Single-page development reference with 5 unbreakable rules (`docs/design/AI_EXECUTION_SHEET.md`)
- PAGE_SPECS.md — All 13 pages specified (6 states each, 375px mobile-first, information hierarchy locked) (`docs/design/PAGE_SPECS.md`)
- DESIGN_COMPLETENESS_GATE.md — Gate 3a evaluation: PASS 15/15 + self-rejection loop 10/10 (`docs/planning/DESIGN_COMPLETENESS_GATE.md`)
- DESIGN_HANDOFF.md — 10-section structured handoff to Development phase (`docs/planning/DESIGN_HANDOFF.md`)
- Gate 3b (Security Readiness): PASS 8/8 — recorded in PROJECT_STATE.json
- Design Canon committed: New Yorker × The Economist × Stripe Docs
- Component inventory: 8 shared Design-OS primitives + 11 justified page-specific components
- Development phase unlocked — PROJECT_STATE.json updated to current_phase: development

### Added (2026-02-28 — Phase 2: Architecture)
- ARCHITECTURE.md v1.0 — Full technical architecture (15 skills, 5 ADRs, architect-refiner 4.3/5) (`docs/architecture/ARCHITECTURE.md`)
- ARCHITECTURE_HANDOFF.md — 12-section structured handoff to Design phase (`docs/planning/ARCHITECTURE_HANDOFF.md`)
- EXPANSION_TEST.md — Gate 2 evaluation: PASS CONDITIONAL (5 LOW / 1 MEDIUM) (`docs/planning/EXPANSION_TEST.md`)
- Stack committed: Next.js 15 + Tailwind v4 + Velite + Supabase + Kit + Lemon Squeezy + Plausible + Sentry + Pagefind
- Design phase unlocked — PROJECT_STATE.json updated, Gate 2 recorded

### Added (2026-02-28 — Phase 1: PRD)
- PRD v1.0 — Investor-grade, 17-section product requirements document (`docs/planning/PRD.md`)
- PRD_HANDOFF.md — Structured handoff to Architecture phase (`docs/planning/PRD_HANDOFF.md`)
- COMPOUND_BUSINESS_CHECKLIST.md — Gate 1 evaluation: PASS 11/11 (`docs/planning/COMPOUND_BUSINESS_CHECKLIST.md`)
- Architecture phase unlocked — PROJECT_STATE.json updated to current_phase: architecture
- CLAUDE.md updated — phase progression reflected (PRD complete, Architecture active)

### Added (2026-02-28 — Phase 0: Discovery + Governance Init)
- Project initialized with governance v20.0 (initialize-governance)
- Phase 0: Discovery complete — DISCOVERY_BRIEF.md (15-section Enterprise v2.0)
- Governance files: CLAUDE.md (v41.1 template), CONTEXT_ENGINE.md, CHANGELOG.md
- Governance infrastructure: PROJECT_STATE.json, PHASE_GATES.md, REFUSAL_CONDITIONS.md, REGISTRY_STATUS.md, AGENT_CAPABILITY_LEVEL.md
- Domain registries: 16 files across 8 domains (database, API, devops, security, integration, performance, i18n, design)
- Memory files: MEMORY.md (intelligence map), patterns.md (technical patterns), debugging-playbook.md (error signatures)
- Content infrastructure: CONTENT_GOVERNANCE.md, seo-quick-reference.md, LESSONS_LEARNED_SYSTEM.md
- Environment: .env.example scaffolded for Vercel/email/analytics/payments stack
- MCP: .mcp.json scaffolded (Context7 + pending Supabase/GitHub/Vercel)

[//]: # (New entries go above this line. Format: YYYY-MM-DD)
