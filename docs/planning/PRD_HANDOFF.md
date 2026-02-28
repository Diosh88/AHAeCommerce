# PRD Handoff — AHAeCommerce

**From Phase**: PRD
**To Phase**: Architecture
**Generated**: 2026-02-28
**PRD Version**: 1.0
**PRD Location**: `docs/planning/PRD.md`
**Status**: PENDING Gate 1 (Compound Business Checklist) — Architecture phase locked until gate passes

---

## Handoff Summary

This document extracts the structured decisions from the PRD that the Architecture phase must consume before making any technology or system design decisions. Architecture cannot invent scope — it must implement what the PRD defines.

---

## 1. Problem Context (for Architecture)

**Core problem**: eCommerce founders lack decision clarity. Content market is biased, trend-driven, and tactic-first.

**Platform type**: Content-authority platform with embedded monetization loop (NOT a SaaS product, NOT a dashboard, NOT a community platform).

**Scope lock** (from DISCOVERY.md — non-negotiable):
- A–Z = DECISIONS, SYSTEMS, REALITIES
- No tutorials, no trend content, no tool documentation
- Every article must pass 4-question editorial gate

---

## 2. Technical Constraints (Architecture Must Respect)

| Constraint | Value | Source |
|------------|-------|--------|
| Hosting | Vercel (managed serverless) | PRD §7, DISCOVERY_BRIEF §8 |
| Risk Tier | MEDIUM | DISCOVERY_BRIEF §5 |
| Database | Supabase (Postgres) — for user data only | PRD §7 |
| Rendering strategy | Static/ISR-first (content pages) | PRD §7 |
| Auth | Optional Phase 1 (no gated content) | PRD §4 + §6.2 |
| Payment | Stripe or Lemon Squeezy (no PCI storage on-platform) | PRD §7 |
| i18n | English-only Phase 1 | DISCOVERY_BRIEF §6 |
| Mobile app | Deferred (web-first) | PRD §4 |

---

## 3. Page Inventory (Architecture Must Map Every Page)

| # | Page | Auth | Priority | Page Type |
|---|------|------|----------|-----------|
| 1 | Home | No | P0 | Customer-facing |
| 2 | Article (template) | No | P0 | Customer-facing |
| 3 | Category/Topic | No | P0 | List-table |
| 4 | About | No | P0 | Customer-facing |
| 5 | Subscribe / Email Opt-in | No | P0 | Customer-facing |
| 6 | Digital Product Landing | No | P1 | Transactional |
| 7 | Thank You / Post-Purchase | No | P1 | Transactional |
| 8 | Consulting Inquiry | No | P2 | Customer-facing |
| 9 | Start Here | No | P1 | Customer-facing |
| 10 | Search Results | No | P1 | List-table |
| 11 | 404 / Error | No | P0 | Error |
| 12 | Privacy Policy | No | P0 | Customer-facing |
| 13 | Terms of Service | No | P0 | Customer-facing |

**Architecture must produce a route map for every page above.** No pages may be invented without PRD approval.

---

## 4. External Integrations (Architecture Must Select and Plan)

| Service | Category | Candidates | Decision Required By |
|---------|----------|------------|----------------------|
| Email platform | Email/Automation | ConvertKit, Beehiiv | Architecture phase |
| Analytics | Privacy-first analytics | PostHog, Plausible | Architecture phase |
| Payment processor | Checkout | Stripe, Lemon Squeezy | Architecture phase |
| CMS approach | Content authoring | MDX/Contentlayer, Sanity | Architecture phase |
| Error monitoring | Observability | Sentry | Architecture phase |
| Affiliate tracking | Monetization | ShareASale, Impact, direct | Architecture phase |

---

## 5. Data Model Constraints (Architecture Must Address)

| Data Type | Classification | Storage Requirement | RLS Required |
|-----------|---------------|---------------------|--------------|
| Email subscribers | basic-PII | Supabase or email platform | Yes (if Supabase) |
| Product purchasers | basic-PII | Supabase | Yes |
| Article content | Non-PII | File system or CMS | No |
| Affiliate links | Non-PII | Config or CMS | No |
| Analytics events | Anonymized | PostHog/Plausible (external) | N/A |

**GDPR requirements**: Consent recording, unsubscribe, data deletion pathway — architecture must design for these.

---

## 6. Revenue Architecture (Architecture Must Support)

| Stream | Infrastructure Needed |
|--------|----------------------|
| Ethical Affiliates | Link management, disclosure system, affiliate click tracking |
| Digital Products | Product landing page, payment integration, email delivery of asset |
| Consulting / Audits | Inquiry form (Phase 3) |
| Referral Partnerships | Simple referral tracking (Phase 4) |
| Email (distribution) | Email platform API integration, list segmentation |

---

## 7. SEO Infrastructure (Architecture Must Implement)

| Requirement | Architecture Decision Needed |
|-------------|------------------------------|
| URL hierarchy | Route structure matching PRD §16 plan |
| Metadata | How metadata is defined per-page (static or CMS-driven) |
| Sitemap | Auto-generation approach |
| Structured data | JSON-LD injection mechanism |
| Open Graph | OG image generation (static or dynamic) |
| Core Web Vitals | ISR/SSG strategy, image optimization |

**URL hierarchy** (from PRD §16):
```
/articles/[slug]
/topics/[letter-or-cluster]/
/start-here/
/about/
/subscribe/
/products/[slug]/
/legal/privacy-policy/
/legal/terms-of-service/
```

---

## 8. Success Metrics (Architecture Must Enable Measurement)

| Metric | How Architecture Enables It |
|--------|---------------------------|
| Organic sessions | Analytics integration |
| Email captures | Email platform API + conversion event |
| Article read depth | Scroll event tracking |
| Core Web Vitals | ISR/SSG + image optimization + Vercel Analytics |
| Affiliate clicks | Link tracking implementation |

---

## 9. Security Requirements (Architecture Must Address — Gate 3b)

All of these must have architectural decisions before design begins:

1. **Authentication model**: Supabase Auth (if Phase 1 auth needed) or defer to Phase 2
2. **Authorization model**: RLS on all user-data tables
3. **RLS policies**: Every table with user data (email subscribers, purchasers) must have policy spec
4. **Input validation**: Zod schemas for all form submissions (email capture, inquiry forms)
5. **API security**: Rate limiting on form endpoints, CORS configuration
6. **Data protection**: Encryption in transit (Vercel/Supabase default), GDPR compliance path
7. **Role enforcement**: No complex roles in Phase 1 (no gated content = no role model needed)
8. **Security test stubs**: Unauthenticated access tests, injection tests on forms

---

## 10. Explicit Decisions NOT Made (Architecture Must Decide)

| Decision | Options | Constraint |
|----------|---------|------------|
| CMS vs MDX | Sanity / Contentlayer / MDX | Must support editorial gate workflow |
| Email platform | ConvertKit vs Beehiiv | Must support automations + segmentation |
| Analytics | PostHog vs Plausible | Privacy-first required |
| Payment processor | Stripe vs Lemon Squeezy | No PCI storage on-platform |
| OG image strategy | Static templates vs dynamic generation | Core Web Vitals impact |

---

## 11. Scope Guardrails (Architecture Cannot Violate)

| Rule | Authority |
|------|-----------|
| No tutorials or trend content pages | DISCOVERY.md §6 LOCK |
| No gated content in Phase 1 | PRD §4 |
| No mobile app in Phase 1 | PRD §4 |
| No community/forum | PRD §4 |
| Content pages must be static/ISR | PRD §7 |
| Payment data never stored on-platform | PRD §7 |
| RLS required for all user data tables | PRD §8 + Risk Tier MEDIUM |

---

## 12. Gate 1 Status

| Gate | Status | Required Score | Achieved |
|------|--------|----------------|---------|
| Gate 1: Compound Business Checklist | PENDING | 8/11 | See Gate 1 evaluation below this handoff |

> Architecture phase is LOCKED until Gate 1 passes. Gate 1 evaluation follows immediately after this handoff document.

---

**Handoff Version**: 1.0
**Created**: 2026-02-28
**Next**: Gate 1 evaluation → Architecture phase (if gate passes)
