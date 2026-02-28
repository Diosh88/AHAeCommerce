# Content Governance — AHAeCommerce

> Authority: DISCOVERY.md (scope lock — always primary)
> This document operationalizes the editorial rules from DISCOVERY.md into executable governance.
> Version: 1.0 | Created: 2026-02-28

---

## 1. The Editorial Rule (Non-Negotiable Hard Gate)

**Every piece of content MUST answer at least one:**

| # | Question | Test |
|---|----------|------|
| 1 | What decision does this clarify? | A reader facing this decision will know what to choose and why |
| 2 | What mistake does this prevent? | A reader will avoid a specific, costly, or irreversible error |
| 3 | What cost does this reveal? | A reader will understand a real financial, operational, or strategic cost they didn't know |
| 4 | What trade-off does this explain? | A reader will understand the upside and downside of a choice |

**If it doesn't answer any of these → DO NOT PUBLISH.**

This gate cannot be overridden. Not by traffic opportunity. Not by SEO signal. Not by trend.

---

## 2. Scope Lock (from DISCOVERY.md)

**A–Z = DECISIONS, SYSTEMS, REALITIES**

### Permanently OUT OF SCOPE (authority-killers):
- Step-by-step UI tutorials ("How to add a product in Shopify")
- Trend content ("Best TikTok ad hack this week")
- Tool documentation or changelogs
- Platform update coverage
- "Top 10 tools" without decision frameworks

### WITHIN SCOPE (canonical examples):
- When to choose Shopify vs WooCommerce vs custom (decision)
- Why tool bloat kills margins before revenue (cost)
- How working capital traps stall growth at $50K/month (system reality)
- What actually happens to your store when you scale before readiness (trade-off)
- When to shut down or pivot (kill switch)

**Reference**: `DISCOVERY.md` §6 (Scope Lock) and §7 (Canonical A–Z Framework) — always read before content planning.

---

## 3. The Practitioner Test

Before publishing, ask: **Would a seasoned eCommerce operator (5+ years, $1M+ GMV) find this useful and non-obvious?**

| Result | Action |
|--------|--------|
| YES — useful AND non-obvious | PASS — proceed to publish |
| YES — useful BUT obvious | REVISE — add depth, cost analysis, or non-obvious angle |
| NO — not useful to a practitioner | REJECT — not in scope for AHAeCommerce |

**The target audience is NOT beginners** who need tutorials. The target audience is decision-makers who need clarity.

---

## 4. Content Types (Approved)

| Type | Description | Gate |
|------|-------------|------|
| Decision Framework | Structured approach to choosing between options | Must clarify at least one major decision |
| Cost Analysis | Real cost breakdown (tools, platforms, ops) | Must reveal at least one non-obvious cost |
| Trade-off Analysis | Upside vs downside of a choice | Must explain the real trade-off, not just list pros/cons |
| System Reality | How eCommerce works at a system level | Must reveal execution constraints or system logic |
| Kill Switch Guide | When to stop, pivot, or exit | Must prevent a mistake or reveal a cost |
| Architecture Overview | Platform/stack/structure decisions | Must clarify decisions, not just describe options |

---

## 5. Brand Voice

- **Tone**: Calm, direct, confident — not hyperbolic, not cautionary-tale
- **Voice**: Experienced operator talking to another operator — peer-to-peer, not teacher-to-student
- **Avoid**: Hype, urgency triggers, "you must", "don't miss", "secret"
- **Prefer**: "This is how it works", "Here's what the data shows", "The decision point is..."
- **Authority source**: Systems logic + economics + real trade-offs (not personality or trend)

---

## 6. SEO Alignment

SEO is a downstream outcome of content authority, not a driver of content decisions.

**Allowed SEO integration**:
- Target evergreen decision-intent keywords ("shopify vs woocommerce for high volume")
- URL hierarchy reflects decision frameworks (/platform-strategy/shopify-vs-woocommerce)
- Internal linking follows logical decision paths (not keyword clusters)

**Not allowed**:
- Creating content to rank for high-volume keywords that don't meet editorial rule
- Keyword stuffing or optimizing around trend queries
- Content that passes SEO but fails the Practitioner Test

---

## 7. Affiliate Integration Rules

- Affiliate recommendations MUST be editorially justified (not financially motivated)
- Disclosure required on all affiliate content
- If a tool would NOT be recommended without the affiliate relationship → DO NOT INCLUDE
- Affiliate commission influences NONE of the decision framework or trade-off analysis
- **Test**: Would this recommendation change if the affiliate relationship ended? If YES → bias detected → revise

---

## 8. Content Failure Registry

Capture content rejections and near-misses for institutional learning.

- Failure registry: `docs/content/CONTENT_FAILURE_REGISTRY.md`
- Success registry: `docs/content/CONTENT_SUCCESS_REGISTRY.md`

**Capture when**:
- Content fails editorial gate → log which question it failed + why
- Scope drift detected mid-draft → log the drift pattern
- Affiliate bias detected → log and correct

---

## 9. Publication Checklist

Before marking any content as "publish-ready":

- [ ] Answers at least one of the 4 editorial questions (cite which)
- [ ] Within A–Z Decisions/Systems/Realities scope (not tutorials, not trends)
- [ ] Passes the Practitioner Test (useful AND non-obvious to seasoned operator)
- [ ] No step-by-step UI tutorials
- [ ] No trend-chasing framing
- [ ] Affiliate disclosure present (if applicable)
- [ ] Affiliate recommendation is editorially justified (would recommend without commission)
- [ ] SEO metadata complete (title, description, canonical — when applicable)
- [ ] Heading hierarchy correct (single h1, logical cascade)

---

## 10. Gold Standard Samples

Located in: `docs/content/samples/`

> Will be populated as high-quality content is produced. These serve as editorial benchmarks.

---

## Version

- Version: 1.0
- Created: 2026-02-28 by initialize-governance v20.0
- Authority: DISCOVERY.md (always primary — this document operationalizes DISCOVERY.md rules)
