# Expansion Test — Gate 2: Architecture → Design

**Project**: AHAeCommerce
**Gate**: Gate 2 (Architecture → Design)
**Template**: Per PHASE_GATES.md Gate 2 — 6 dimensions evaluated at 10x scale
**Threshold**: PASS (all LOW/MEDIUM) or CONDITIONAL (1–2 HIGH with documented mitigations)
**FAIL condition**: Any CRITICAL or 3+ HIGH (blocks advance)
**Evaluated by**: architect-executor v12.0
**Date**: 2026-02-28
**Architecture Reference**: `docs/architecture/ARCHITECTURE.md` v1.0

---

## Evaluation

### Dimension 1: Users — Concurrent, total, auth sessions at 10x

**Phase 1 baseline**: 0–100 concurrent users, 0–5,000 monthly visitors, no auth sessions
**At 10x**: 0–1,000 concurrent users, 50,000 monthly visitors, no auth sessions

**Analysis**:
- Content pages are static/ISR — served from Vercel CDN with no origin server involvement
- Vercel Hobby plan handles ~10,000 concurrent CDN requests; Pro handles unlimited
- No auth sessions in Phase 1 → zero session management scaling concern
- API routes (subscribe, health, webhooks) are low-frequency; 10x = ~1,000 calls/month

**Risk**: **LOW**
**Evidence**: Static CDN architecture is inherently linearly scalable. No architectural change required at 10x.

---

### Dimension 2: Data Volume — Rows, storage, ingestion at 10x

**Phase 1 baseline**: ~1,000 subscribers, ~10 purchases, 30 articles (filesystem)
**At 10x**: ~10,000 subscribers, ~100 purchases, 300 articles

**Analysis**:
- Supabase Free tier: 500MB database, 1GB file storage — 10,000 subscriber rows < 5MB
- Supabase Pro tier trigger: > 500MB DB or > 10,000 rows (Supabase actually has generous free limits)
- Content is filesystem-based (not in DB) — 300 MDX files ≈ 3–10MB total
- Velite processes all content at build time — 300 articles increases build time from ~30s to ~3min (acceptable with Vercel build caching)

**Risk**: **LOW**
**Evidence**: Supabase Free supports well beyond 10K subscriber rows. Content is filesystem.

---

### Dimension 3: API Load — RPS, peak ratio, webhooks at 10x

**Phase 1 baseline**: ~100 subscribe calls/month, ~5 webhooks/month
**At 10x**: ~1,000 subscribe calls/month, ~50 webhooks/month

**Analysis**:
- Vercel serverless functions are stateless and scale automatically to thousands of concurrent requests
- `/api/subscribe` rate-limited at 5 req/IP/hour — prevents DDoS on peak days
- `/api/webhooks/lemonsqueezy` is triggered by purchases only — extremely low volume
- No database connection pooling concern (Supabase uses pgBouncer internally; serverless connections are ephemeral)

**Risk**: **LOW**
**Evidence**: Serverless auto-scales. Low-frequency API. Rate limiting prevents abuse.

---

### Dimension 4: Third-Party Dependencies — Rate limits, cost at 10x

**Phase 1 baseline**: Kit Free/Starter, Plausible $9/mo, Lemon Squeezy free
**At 10x**: Kit Creator ($79/mo at 10K subs), Plausible Growth ($19/mo), Lemon Squeezy 3.5%+$0.30/transaction

**Analysis**:
| Service | Phase 1 Cost | 10x Cost | Risk |
|---|---|---|---|
| Kit | $0 (< 1K subs) | $79/mo (10K subs) | Cost growth tracked |
| Plausible | $9/mo (10K pageviews/mo) | $19/mo (100K pageviews) | Manageable |
| Lemon Squeezy | Free (no sales) | ~$35–100/mo (at $1K/mo revenue) | Revenue-funded |
| Supabase | Free | Pro $25/mo (if > 500MB) | Manageable |
| Vercel | Hobby ($0) | Pro ($20/mo or on-demand) | Manageable |

**Total 10x infrastructure cost**: ~$150–200/month. At 10x users, revenue should be $1,000+/month. Sustainable.

**Kit rate limits**: Kit API has no documented hard rate limits for typical usage. Automation sequences are not burst-limited in ways that affect Phase 1 scale.

**Risk**: **MEDIUM** (cost increase is significant but predictable and revenue-funded)
**Mitigation**: Kit cost increase is linear with list growth. Revenue from email list (digital products, affiliates) grows in parallel. At 10K subscribers, monthly revenue target is $1,500+.

---

### Dimension 5: Cost — Hosting, DB, APIs, storage at 10x

**Summary of all costs at 10x** (from Dimension 4):

| Item | Phase 1 | 10x |
|---|---|---|
| Vercel | $0 (Hobby) | $20/mo (Pro) |
| Supabase | $0 (Free) | $25/mo (Pro) |
| Kit | $0 → $29/mo | $79/mo |
| Plausible | $9/mo | $19/mo |
| Sentry | $0 (Free) | $0 (Free tier sufficient) |
| Lemon Squeezy | % of sales | % of sales (revenue-funded) |
| **Total** | **$9–38/mo** | **$143–163/mo** |

**Risk**: **LOW**
**Evidence**: Total 10x infrastructure cost is $150–165/month. Content loop target at 10x users is $1,500+/month revenue. 10% cost-to-revenue ratio is healthy.

---

### Dimension 6: Team/Operations — Support, deploys, monitoring at 10x

**Phase 1 baseline**: Solo developer, 1–2 deploys/week, 0 customer support tickets
**At 10x**: Solo developer, 1–2 deploys/week, 5–10 customer support tickets/month

**Analysis**:
- **Deploys**: Vercel deployment is a `git push` — no operational overhead at 10x
- **Monitoring**: Sentry + Plausible + Vercel dashboard — solo operator can manage at 10x
- **Customer support**: Digital product purchases = delivery via Lemon Squeezy (automated). Support tickets are primarily email delivery issues or download problems. Lemon Squeezy handles most of this.
- **Content moderation**: None required (no user-generated content)
- **Database maintenance**: Zero (managed Supabase)

**Risk**: **LOW**
**Evidence**: Static architecture + managed services = near-zero operational overhead. Customer support at 10x is manageable solo.

---

## Expansion Test Score

| Dimension | Risk Level | Status |
|---|---|---|
| 1. Users | LOW | ✅ |
| 2. Data Volume | LOW | ✅ |
| 3. API Load | LOW | ✅ |
| 4. Third-Party Dependencies | MEDIUM | ✅ (mitigated) |
| 5. Cost | LOW | ✅ |
| 6. Team/Operations | LOW | ✅ |

**HIGH dimensions**: 0
**MEDIUM dimensions**: 1 (Dimension 4 — cost growth, mitigated)
**CRITICAL dimensions**: 0

---

## Gate Decision

```
┌──────────────────────────────────────────────────────────┐
│  GATE 2: EXPANSION TEST                                   │
│  Result: PASS (CONDITIONAL)                               │
│                                                           │
│  Condition: i18n is a future architectural constraint     │
│  (documented in ADR-004 equivalent — ARCHITECTURE.md)     │
│  Adding i18n post-launch requires route-level changes.    │
│  Accepted: English-only Phase 1 is explicitly in scope.   │
│                                                           │
│  Date: 2026-02-28                                         │
│  Evaluated by: architect-executor v12.0                   │
│                                                           │
│  Design phase: UNLOCKED                                   │
└──────────────────────────────────────────────────────────┘
```

---

## Conditional Note (i18n)

Adding 3 new language markets at 10x would require:
- Next.js route-level i18n configuration (`/[locale]/` prefix)
- Content translation workflow (not in Phase 1 scope)
- Plausible domain tracking per locale (manageable)
- Kit list segmentation by locale (manageable)

**This is documented, not a surprise.** DISCOVERY_BRIEF.md §6 explicitly marks i18n as inactive. The constraint is known and accepted. PASS CONDITIONAL.

---

**Expansion Test Version**: 1.0
**Created**: 2026-02-28
**Next Step**: Design phase — use `/design-ux-executor` with ARCHITECTURE_HANDOFF.md
