# PRD: AHAeCommerce — A–Z eCommerce Decision & Execution Intelligence Platform

**Version:** 1.0
**Author:** initialize-governance v20.0 / prd-framework v8.0
**Date:** 2026-02-28
**Status:** Draft → Pending Gate 1 Review
**Risk Tier:** MEDIUM
**Source:** DISCOVERY_BRIEF.md (v2.0) + DISCOVERY.md (LOCKED)

---

## 1. Problem Statement

### The Pain

eCommerce founders make high-stakes, often irreversible decisions based on content that is:
- **Biased** — written to maximize affiliate commissions, not founder outcomes
- **Tactical, not structural** — focused on "how to click" instead of "why this decision matters"
- **Trend-chasing** — expires in 6–12 months, requiring constant re-research
- **Tool-first** — designed around vendor features, not operator realities

The result: founders overpay for tools, scale prematurely, commit to wrong platforms, and can't distinguish between activity and progress.

### Who Suffers

**Primary**: Early-to-mid stage eCommerce founders and solo operators — an estimated 2–5M active store operators in English-speaking markets. Pain cost: 3–5 hours/week re-reading conflicting advice, $2K–$10K/year in unnecessary SaaS spend from poor tool decisions, and unknown opportunity cost from delayed or wrong platform choices.

**Secondary**: Consultants validating recommendations, agencies seeking neutral explanations, educators.

### Cost of Inaction

Without a trusted, independent decision intelligence source:
- Founders continue to make expensive, avoidable mistakes
- Biased review sites retain authority they haven't earned
- The gap between "information volume" and "decision clarity" compounds

### Why Now

- eCommerce democratization (Shopify, TikTok Shop) has flooded the market with new operators who lack decision frameworks
- AI-generated content is accelerating the decline of trust in generic review sites — creating an opening for verified, practitioner-grade authority
- The independent authority position is unclaimed — no platform currently owns "A–Z eCommerce decisions and systems" with editorial rigor

---

## 2. Users & Stakeholders

### Primary User

- **Who:** Early-to-mid stage eCommerce founder / solo operator ($0–$500K ARR range)
- **Goal:** Make confident, irreversible-mistake-avoiding decisions about platform, tools, team, timing, and growth
- **Current Pain:** Conflicting advice, affiliate-biased reviews, no framework for trade-off evaluation
- **Usage Pattern:** Occasional/triggered — reads when facing a specific decision moment ("Should I switch platforms?", "Do I need this tool?")
- **Device Split:** Mobile for discovery + desktop for deep reads

### Secondary User

- **Consultants / Freelancers:** Use as a neutral reference to validate their recommendations to clients
- **Agency Partners:** Refer clients to neutral explanations they can't provide without appearing self-serving
- **Educators / Content Creators:** Cite as an authoritative, stable reference

### Buyer vs User

In the digital products stream, the buyer and user are the same person (founder). No B2B buyer/user split in Phase 1.

### Internal Stakeholders (Solo Operator Model)

| Stakeholder | Role | Concern |
|-------------|------|---------|
| Founder | Product + Content + Strategy | Revenue, content quality, audience growth |
| HavenWizards | Backend execution partner (optional) | Delivery quality if consulting stream activates |
| Bayanihan Harvest | Proof-of-systems partner | Authenticity of systems depth claims |

### Explicit Trade-offs

> We optimize for **practitioner trust** at the cost of **traffic volume**. We consciously do NOT optimize for keyword density, publication frequency, or affiliate conversion rate. Authority is the asset — monetization follows authority.

---

## 3. Success Outcomes

### Primary Outcome (12-Month Targets)

| Metric | Baseline | Target | Timeline |
|--------|----------|--------|----------|
| Monthly organic sessions | 0 | 5,000 | Month 12 |
| Email subscribers | 0 | 1,000 | Month 9 |
| Content pieces passing editorial gate | 0 | 30 | Month 12 |
| Practitioner Test pass rate (internal audit) | N/A | 100% | Ongoing |

### Secondary Outcomes

| Metric | Baseline | Target | Timeline |
|--------|----------|--------|----------|
| Affiliate revenue (monthly) | $0 | $500 | Month 10 |
| Digital product revenue (monthly) | $0 | $300 | Month 11 |
| Content-to-email conversion rate | N/A | ≥ 3% | Month 6 |
| Average read depth (scroll %) | N/A | ≥ 60% | Month 6 |

### Business Outcomes

| Metric | Baseline | Target | Timeline |
|--------|----------|--------|----------|
| Total monthly revenue | $0 | $800–$1,200 | Month 12 |
| Email list growth rate | N/A | 100–200 new/month | Month 9 |
| Returning visitor ratio | N/A | ≥ 25% | Month 10 |

### Invalidation Criteria

> "We know this approach FAILED if: after 12 months, organic sessions are below 1,000/month AND email subscribers are below 200 AND zero revenue has been generated from any stream."

---

## 4. Scope

### In Scope (Phase 1 — MVP Platform)

- [ ] **Content platform** — Publish A–Z decision/system/reality articles (evergreen, practitioner-grade)
- [ ] **Email capture** — List building infrastructure (opt-in form, confirmation flow, welcome sequence)
- [ ] **Affiliate link integration** — Editorially-justified recommendations with affiliate tracking
- [ ] **Digital product delivery** — Landing page + payment link + delivery mechanism for 1 product (Phase 1 pilot)
- [ ] **SEO infrastructure** — Metadata, sitemap, structured data, URL hierarchy
- [ ] **Basic analytics** — Page views, email captures, conversion events

### Explicitly Out of Scope (Phase 1)

- ❌ **Mobile app** — Web-first; app deferred to future phase
- ❌ **Membership / gated content** — Authentication complexity not justified until email list proves demand
- ❌ **Community / forum** — Requires moderation infrastructure not in solo-operator scope
- ❌ **Custom affiliate dashboard** — Use affiliate network platform (ShareASale / direct)
- ❌ **Video/podcast hosting** — Content format is written; multimedia deferred
- ❌ **i18n / multi-language** — English-only Phase 1
- ❌ **Step-by-step UI tutorials** — Permanently out of scope (DISCOVERY.md §6 hard lock)
- ❌ **Trend/news content** — Permanently out of scope (DISCOVERY.md §6 hard lock)

### Phase 2 (Future — Post-Validation)

- Gated content / lightweight membership
- Course or cohort product
- Agency partner referral portal
- Mobile app (iOS/Android)
- Consulting intake form + scheduling

### NOT Building

> We are not building an eCommerce blog. We are not building a tool review site. We are not building a community platform. We are building an A–Z eCommerce decision and execution intelligence system. Every feature decision must pass this test.

---

## 5. Solution Overview

AHAeCommerce is a **content-authority platform** with an embedded **content loop monetization engine**.

**Core mechanism**:
1. Publish high-quality, evergreen, practitioner-grade articles in the A–Z framework
2. Organic search surfaces these articles at decision moments (high-intent queries)
3. Readers trust the editorial independence → subscribe to the email list
4. Email list compounds → drives digital product sales, affiliate recommendations, consulting inquiries
5. Revenue funds more content depth, not more content volume

**Platform model**: Static-first content site with dynamic components only where required (email capture, product checkout). Not a SaaS product — no multi-user workspace, no dashboards.

**Editorial moat**: Every piece of content passes a 4-question editorial gate (decision clarity, mistake prevention, cost revelation, trade-off explanation). This gate is enforced programmatically in the publishing workflow.

---

## 6. Detailed Requirements

### 6.1 Content System

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Article creation + publication | Markdown-based authoring, exported to structured content format |
| A–Z category tagging | Each article tagged to one or more of the 26 A–Z categories |
| Editorial gate enforcement | Article cannot be published without checklist completion |
| Article states | Draft, Under Review, Published, Archived |
| Reading time estimate | Auto-calculated and displayed per article |
| Table of contents | Auto-generated for articles >1,500 words |
| Related articles | Tag-based related content links (minimum 2 per published article) |

### 6.2 Email Capture System

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Inline opt-in forms | Mid-article and end-of-article placement |
| Lead magnet delivery | Automated email with PDF/resource link on subscribe |
| Welcome sequence | 3-email sequence triggered on subscribe |
| Unsubscribe / CAN-SPAM compliance | One-click unsubscribe, visible in every email |
| List segmentation (basic) | Segment by content category interest (A–Z topic area) |

### 6.3 Affiliate System

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Affiliate link management | Track links per article, per tool |
| Disclosure | Visible affiliate disclosure on every page with affiliate links |
| Editorial gate integration | Affiliate link only appears if recommendation passes editorial test |

### 6.4 Digital Product (Phase 1 Pilot)

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Product landing page | Single product, dedicated page |
| Payment processing | Stripe or Lemon Squeezy integration |
| Delivery | Email delivery of downloadable asset |
| Confirmation | Post-purchase confirmation page + email |

### 6.5 SEO Infrastructure

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Metadata | Title, description, canonical per page |
| Open Graph | OG image, title, description per page |
| Structured data (JSON-LD) | Article schema on content pages |
| Sitemap | Auto-generated, submitted to GSC |
| Robots.txt | Properly configured |
| Core Web Vitals | LCP < 2.5s, INP < 200ms, CLS < 0.1 |

### 6.6 Analytics

| Requirement | Acceptance Criteria |
|-------------|---------------------|
| Page view tracking | Privacy-first analytics (PostHog or Plausible) |
| Email capture events | Conversion event on subscribe |
| Affiliate click events | Click tracking per link |
| Content funnel | Entry page → article → email capture tracking |

---

## 7. Technical Considerations

### System Constraints

- **Hosting**: Vercel (serverless, managed CDN) — no self-managed server
- **Database**: Supabase (Postgres) — primarily for email preferences, product purchases, any user data
- **Auth**: Optional for Phase 1 (no gated content) — Supabase Auth if needed for product delivery
- **CMS approach**: File-based Markdown + Next.js MDX OR headless CMS (Contentlayer / Sanity) — decision for Architecture phase
- **Performance budget**: Static/ISR-first rendering for all content pages — no SSR unless required

### Security & Compliance

- No payment data stored on-platform (Stripe/Lemon Squeezy handle PCI)
- Email data (GDPR basics): consent recorded, unsubscribe honored, data deletion pathway required
- CAN-SPAM: unsubscribe functional and tested before launch
- RLS: required for any Supabase tables containing user data (email subscribers, product purchasers)

### "Magic" Check

> No requirement in this PRD assumes technology that doesn't exist. No AI-generated content is in scope. No real-time personalization is in scope. All requirements are achievable with Next.js + Supabase + ConvertKit/Beehiiv + Stripe.

### Scalability Consideration

- Content pages are static/ISR — scale to millions of views with no architectural change
- Email platform handles list scaling (ConvertKit/Beehiiv own this problem)
- Payment processing scales automatically (Stripe/Lemon Squeezy own this problem)
- The only scaling bottleneck is content production, which is human-constrained by design

---

## 8. Assumptions & Risks

### Facts (Validated)

| Fact | Source | Confidence |
|------|--------|------------|
| Market gap exists for independent eCommerce decision authority | DISCOVERY.md market analysis + personal observation | High |
| A–Z scope is evergreen and not trend-dependent | DISCOVERY.md §9 — decision logic is stable | High |
| Content loop works (content → SEO → email → revenue) | Validated by comparable content businesses | Medium |

### Assumptions (Unvalidated)

| Assumption | Risk if Wrong | Validation Plan |
|------------|---------------|-----------------|
| Founders search for decision-framework content (not just tool tutorials) | Low traffic, high bounce | Keyword research during architecture phase |
| Founders will subscribe to email for decision-framework content | Low email conversion | A/B test lead magnet topic and format |
| Practitioners will pay $29–$199 for decision frameworks as products | Zero digital product revenue | Validate with pre-sale or waitlist before build |
| Editorial independence is a differentiator readers notice | No trust premium | Survey returning readers at Month 3 |

### Unknowns (Need Research)

| Unknown | Impact | How to Learn |
|---------|--------|--------------|
| Top-performing A–Z categories for search volume | SEO prioritization | Keyword research tool (Ahrefs/SEMrush) |
| Competitive content density per A–Z category | Content strategy | Competitive audit during architecture |
| Best lead magnet format for this audience | Email conversion rate | Test 2 formats in first 90 days |

---

## 9. Dependencies & Risks

### External Dependencies

| Dependency | Owner | Risk Level | Mitigation |
|------------|-------|------------|------------|
| Email platform (ConvertKit / Beehiiv) | Vendor | Low | List is exportable; switch cost is low |
| Payment processor (Stripe / Lemon Squeezy) | Vendor | Low | Stripe is standard; Lemon Squeezy is backup |
| Affiliate networks (ShareASale / Impact / direct) | Vendor | Low | Direct partnerships possible if network fails |
| Analytics (PostHog / Plausible) | Vendor | Low | Privacy-first analytics are easily swappable |
| Supabase | Vendor | Medium | Managed Postgres — data exportable, no vendor lock |
| Vercel | Vendor | Low | Next.js runs on any serverless host |

### Legal/Compliance Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| GDPR non-compliance (EU subscribers) | Legal exposure | Implement consent recording + deletion path |
| CAN-SPAM violation | Spam complaint rate, deliverability | Unsubscribe tested before first send |
| Affiliate disclosure failure | FTC risk | Disclosure on every page with affiliate links |

### Operational Risks (Solo Operator)

| Risk | Impact | Mitigation |
|------|--------|------------|
| Content production bottleneck | Slow growth | Prioritize quality over quantity — 2 articles/month beats 10 bad ones |
| Burnout from over-scoping | Project abandonment | Phase discipline — see Scope §4 |
| Algorithm changes (Google) | Traffic disruption | Email list is the resilience buffer |

---

## 10. Execution Plan

### Phase 1: Foundation (Months 1–2)

**Goal:** Platform live with 5 published articles, email capture functional, analytics connected

- [ ] Architecture approved (Next.js + Supabase + Vercel)
- [ ] Design-OS created
- [ ] 5 articles written and editorial-gate-approved
- [ ] Email capture live (ConvertKit or Beehiiv integrated)
- [ ] Basic analytics tracking (PostHog or Plausible)
- [ ] Sitemap + robots.txt + structured data live
- [ ] Domain configured (ahaecommerce.com)

### Phase 2: Content Authority Build (Months 3–5)

**Goal:** 15+ articles published, email list growing, SEO signals accumulating

- [ ] 10 additional articles (1 per A–Z category priority cluster)
- [ ] Welcome email sequence active (3 emails)
- [ ] Lead magnet created and tested (decision framework PDF or template)
- [ ] Affiliate recommendations live in applicable articles
- [ ] Core Web Vitals green
- [ ] First backlink outreach

### Phase 3: Monetization Activation (Months 6–9)

**Goal:** First digital product launched, affiliate revenue flowing, email list at 500+

- [ ] Digital product: first framework/playbook (validate with pre-sale or waitlist)
- [ ] Product landing page + payment integration
- [ ] Consulting/audit inquiry page (optional — if inbound demand appears)
- [ ] Email list segmentation active
- [ ] Affiliate revenue tracking live

### Phase 4: Compounding (Months 10–12)

**Goal:** Organic sessions at 5,000/month, email at 1,000, monthly revenue $800+

- [ ] 30 published articles
- [ ] Second digital product or product bundle
- [ ] Referral partnership inquiry (agency / service partner)
- [ ] Analytics-driven content prioritization

### Progression Pattern

Manual → Semi-automated → Automated
Zero audience → Niche authority → Broad authority
1 product → Product suite → Community/membership (future)

---

## 11. Metrics & Validation

### Success Metrics (KPIs)

| Metric | Type | Target | Measurement |
|--------|------|--------|-------------|
| Monthly organic sessions | Lagging | 5,000 by Month 12 | PostHog / Plausible |
| Email subscribers | Lagging | 1,000 by Month 9 | ConvertKit / Beehiiv |
| Email capture conversion rate | Leading | ≥ 3% of readers | Email platform / analytics |
| Content editorial gate pass rate | Process | 100% (zero exceptions) | Manual audit log |
| Lighthouse SEO score | Process | ≥ 90 | Lighthouse CI |
| Core Web Vitals (LCP) | Process | < 2.5s | Vercel Analytics / GSC |

### Leading Indicators (Early Signals — Month 1–3)

- [ ] Search Console impressions increasing week-over-week
- [ ] Email capture form visible at ≥ 2 placements per article
- [ ] At least 1 article ranking on page 2 for target keyword
- [ ] Email open rate ≥ 35% (first 90 days)

### Lagging Indicators (Final Proof — Month 9–12)

- [ ] 1,000+ email subscribers with ≥ 25% open rate
- [ ] First affiliate commission received
- [ ] First digital product sale completed
- [ ] Returning visitor ratio ≥ 25%

### Invalidation Criteria

> "We know this idea FAILED if at Month 12: organic sessions < 1,000/month AND email list < 200 AND zero revenue from any stream AND no article ranks on page 1 for any target keyword."

---

## 12. Decision Log

### Decision: Content Platform Architecture (CMS Approach)

- **Date:** 2026-02-28 (decision deferred to Architecture phase)
- **Options Considered:**
  1. File-based Markdown + Next.js MDX — Low cost, developer-controlled, no vendor lock
  2. Headless CMS (Sanity, Contentlayer) — Better editorial UX, additional cost/dependency
  3. Full CMS (WordPress, Ghost) — Faster editorial start, worse code control
- **Decision:** DEFERRED — Architecture phase will decide based on authoring workflow needs
- **Rationale:** Solo operator workflow is simpler; MDX may be sufficient; cost matters
- **Revisit Trigger:** Architecture phase — evaluate authoring experience requirements

### Decision: Email Platform Selection

- **Date:** 2026-02-28 (decision deferred to Architecture phase)
- **Options Considered:**
  1. ConvertKit (Kit) — Creator-focused, good automations, moderate cost
  2. Beehiiv — Modern, newsletter-first, built-in monetization features
  3. Resend + custom — Developer-controlled, cheapest, most work
- **Decision:** DEFERRED — Architecture phase will evaluate based on automation and analytics needs
- **Revisit Trigger:** Architecture phase

### Decision: Scope Lock — No Tutorials, No Trends

- **Date:** 2026-02-28 (inherited from DISCOVERY.md)
- **Decision:** Permanent — DISCOVERY.md §6 hard lock
- **Rationale:** Tutorial content ages fast, attracts low-intent traffic, weakens authority positioning
- **Override:** NOT possible — discovery lock is non-overridable

### Decision: Membership / Gated Content Deferred

- **Date:** 2026-02-28
- **Rationale:** Authentication complexity not justified until email list proves demand (1,000+ subscribers). Gated content requires more editorial volume than solo operator can sustain in Phase 1.
- **Revisit Trigger:** Email list reaches 500+ AND product revenue confirmed

---

## 13. Kill Criteria

### Failure Conditions

We will STOP this initiative if:
- [ ] After 12 months, organic sessions < 1,000/month AND email subscribers < 200 AND zero revenue
- [ ] Content production drops below 1 article/month for 3+ consecutive months with no recovery plan
- [ ] Core editorial rule is compromised (trend/tutorial content published to chase traffic)

### Pivot Triggers

We will PIVOT approach if:
- [ ] Keyword research reveals A–Z categories with zero search volume (pivot content strategy to higher-demand categories)
- [ ] Email conversion rate persistently below 1% despite 3 lead magnet variations tested (pivot content format or distribution channel)
- [ ] No digital product validation (zero waitlist or pre-sale interest) after Phase 3 attempt (pivot to consulting-first revenue model)

### What We Will NOT Do to Save This Project

- Publish trend content to chase traffic spikes
- Add affiliate links without editorial justification
- Build membership/community to compensate for weak content authority
- Pursue paid traffic before earning organic authority

### Decision Owner

**Who decides to kill or pivot:** Founder (solo) — reviewed at Month 6 and Month 12 milestones
**Review cadence:** Monthly metric check; formal kill/pivot review at Month 6 and Month 12

---

## 14. Revenue Architecture

### Revenue Stream Map

| Stream | Description | Phase | Revenue Type | Margin |
|--------|-------------|-------|--------------|--------|
| **Ethical Affiliates** | Tool recommendations embedded in decision-framework articles — editorially justified, not conversion-optimized | Phase 2+ | Recurring (per click/conversion) | Near-100% |
| **Digital Products** | Decision frameworks, playbooks, audit templates ($29–$199) | Phase 3+ | One-time, high-margin | 85–95% |
| **Consulting / Audits** | Store architecture audits, stack reviews ($500–$2,000) | Phase 3+ (optional) | One-time, capacity-constrained | 70–85% |
| **Referral Partnerships** | Agency and service partner referrals (neutral basis) | Phase 4 | Per-referral | Variable |
| **Email (Distribution Layer)** | Not revenue itself — the compounding owned channel that drives all other streams | All phases | N/A | N/A |

### Revenue Architecture Rules

1. No stream is prioritized over another if it compromises editorial independence
2. Affiliates earn commissions only for tools the founder would recommend without commission
3. Digital product pricing reflects decision-value delivered, not information volume
4. Consulting stream is optional and capacity-constrained — it does not scale without team
5. Email is the distribution moat — it must be built before monetization is activated at scale

### Billing Model (Digital Products)

- One-time purchase (no subscription for Phase 1 products)
- Stripe Checkout or Lemon Squeezy for payment processing
- No payment data stored on-platform

### Free Tier Boundary

All content is free. No paywalled articles. Email subscription is the only "price" for enhanced value (lead magnets, email sequences). Paid tier = digital products only.

### Growth Loop Hypothesis

```
Content (A–Z articles)
  → SEO authority (organic search rankings)
    → High-intent readers (decision-triggered discovery)
      → Email subscription (lead magnet conversion)
        → Trust compounding (email sequences)
          → Digital product sales + Affiliate conversions
            → Word-of-mouth (shareable frameworks)
              → More content authority → (repeat)
```

**Loop type**: Content loop — compounding organic, not viral or network-effect-driven
**Compounding mechanism**: Each article adds to SEO authority (domain authority, topic clusters)
**Break point**: If content quality drops below Practitioner Test threshold, loop breaks at "Trust compounding" step

---

## 15. Page/Screen Inventory

> All pages are customer-facing (public content platform). Auth is not required in Phase 1.

| # | Page | Purpose | Auth Required | Priority | Page Type |
|---|------|---------|---------------|----------|-----------|
| 1 | **Home** | Brand positioning, featured content, email capture | No | P0 | Customer-facing |
| 2 | **Article** (template) | A–Z decision/system/reality content — the core value | No | P0 | Customer-facing |
| 3 | **Category / Topic** (A–Z letter or cluster) | Browse articles by topic cluster | No | P0 | List-table |
| 4 | **About** | Editorial independence, author credibility, HavenWizards/Bayanihan context | No | P0 | Customer-facing |
| 5 | **Subscribe / Email Opt-in** | Dedicated email capture page (beyond inline forms) | No | P0 | Customer-facing |
| 6 | **Digital Product Landing Page** | Product description, value proposition, CTA to purchase | No | P1 | Transactional |
| 7 | **Thank You / Post-Purchase** | Purchase confirmation, asset delivery instructions | No | P1 | Transactional |
| 8 | **Consulting / Audit Inquiry** | Intake form for consulting stream (optional Phase 3) | No | P2 | Customer-facing |
| 9 | **Start Here** | New reader orientation — where to begin in the A–Z framework | No | P1 | Customer-facing |
| 10 | **Search Results** | Site search for articles | No | P1 | List-table |
| 11 | **404 / Error** | Graceful error handling | No | P0 | Detail-form |
| 12 | **Privacy Policy** | Legal — GDPR, data handling | No | P0 | Customer-facing |
| 13 | **Terms of Service** | Legal — usage terms | No | P0 | Customer-facing |

### Page State Requirements (All Pages)

Each page must implement all 6 states:
1. **Default** — Content loaded, standard view
2. **Empty** — No content yet (category pages with 0 articles)
3. **Loading** — Skeleton or spinner (for async content)
4. **Error** — Graceful error message (API fail, 500)
5. **Offline** — Service worker message or fallback
6. **Permission-denied** — N/A in Phase 1 (no auth) — plan for Phase 2

### Page Classification

| Page Type | Pages |
|-----------|-------|
| Customer-facing (content) | Home, Article, About, Subscribe, Start Here, Privacy, Terms, Consulting |
| List-table | Category/Topic, Search Results |
| Transactional | Digital Product Landing, Thank You / Post-Purchase |
| Detail-form | 404/Error |
| Dashboard | None in Phase 1 |
| Settings | None in Phase 1 |
| Onboarding | None in Phase 1 (Start Here serves this function) |

---

## 16. SEO Strategy

> **Required**: Governance Scope §6 confirms SEO = YES. This is the primary acquisition channel.

### Target Keywords / Themes

**Intent-first targeting** — we target decision-triggered, high-intent queries, not informational volume queries.

| A–Z Category Cluster | Target Intent | Example Query Pattern |
|----------------------|---------------|----------------------|
| A — Architecture | Decision | "should I use Shopify or WooCommerce" |
| B — Business Models | Decision | "dropshipping vs own inventory trade-offs" |
| C — Costs | Cost revelation | "hidden Shopify costs explained" |
| D — Data | Decision | "what ecommerce metrics actually matter" |
| E — Execution Reality | Mistake prevention | "why ecommerce businesses fail execution" |
| M — Monetization | Trade-off | "subscription vs one-time revenue model ecommerce" |
| P — Platform Strategy | Decision | "when to leave Shopify for custom stack" |
| U — Unit Economics | Cost/Trade-off | "ecommerce contribution margin explained" |

**Keyword selection criteria**:
1. Search intent must be decision-triggered or trade-off-focused
2. Content must pass the 4-question editorial gate
3. Keyword difficulty < 40 for initial content (domain authority near zero at launch)
4. Long-tail preferred over head terms in Phase 1

### URL Hierarchy Plan

```
ahaecommerce.com/
  /articles/[slug]                    — Individual articles (canonical content pages)
  /topics/[letter-or-cluster]/        — A–Z category browsing (e.g., /topics/architecture/)
  /start-here/                        — New reader orientation
  /about/                             — Editorial authority page
  /subscribe/                         — Dedicated email capture
  /products/[slug]/                   — Digital product landing pages
  /legal/privacy-policy/              — GDPR compliance
  /legal/terms-of-service/            — Legal
```

**URL principles**:
- Decision-first naming (e.g., `/articles/shopify-vs-woocommerce-decision-framework` not `/articles/platform-comparison-2026`)
- No dates in URLs — evergreen content must not be tied to publication year
- No tag/category in article URL — clean slug only

### Content Discoverability Approach

1. **Topic cluster model**: Each A–Z letter becomes a topic cluster with 1 pillar article + 3–5 supporting articles
2. **Internal linking**: Every article links to 2+ related articles in the same or adjacent A–Z cluster
3. **Article → Email → Product** funnel embedded in article structure (opt-in CTA at article end)

### Competitor SEO Positioning

| Competitor Type | Weakness to Exploit |
|-----------------|---------------------|
| Affiliate review blogs (e.g., Oberlo Blog) | Biased recommendations, trend-driven, not decision-framework |
| Tool documentation | Feature-focused, not trade-off-focused |
| YouTube tutorials | Not text-indexed for long-tail decision queries |
| General marketing blogs (e.g., HubSpot) | Too broad, not eCommerce-specific-system-focused |

**Our positioning wedge**: "Decision framework" + "trade-off explanation" + "practitioner-grade" as modifiers that competitors don't claim or deliver.

### Structured Data Strategy

| Page | Schema Type | Key Fields |
|------|-------------|------------|
| Article | `Article` or `HowTo` | headline, author, datePublished, dateModified |
| Home | `WebSite` | name, url, potentialAction (SearchAction) |
| About | `Person` | name, url, description |
| Digital Product | `Product` | name, description, offers |
| FAQ sections | `FAQPage` | question/answer pairs |

### SEO Gate Requirements (by Phase)

| Phase | SEO Requirement |
|-------|----------------|
| PRD (this doc) | Target keywords, URL hierarchy, content discoverability — ✓ defined |
| Architecture | Route hierarchy matching URL plan, sitemap generation approach, structured data implementation plan |
| Design | Single h1 per page, heading cascade (h2→h3), content-first layout, semantic HTML |
| Development | Metadata exports per page, Open Graph, canonical URLs, JSON-LD injection |
| Launch | Sitemap submitted to GSC, Lighthouse SEO ≥ 90, structured data validated zero errors |

---

## 17. Accessibility Requirements

> **Required**: Governance Scope §6 confirms Accessibility = YES (public UI, WCAG 2.1 AA minimum).

### Target WCAG Level

**WCAG 2.1 AA** — Minimum standard for a public content platform.

### Assistive Technology Scope

| Technology | Platform | Priority |
|------------|----------|----------|
| VoiceOver | macOS / iOS | High (Apple-heavy developer/founder audience) |
| NVDA | Windows | Medium |
| TalkBack | Android | Medium |
| Browser zoom (200%) | All | High |
| High-contrast mode | All | Medium |

### Keyboard Navigation Expectations

- All interactive elements (navigation, email forms, CTAs, product pages) must be keyboard-navigable
- Focus order must match visual order
- Focus indicators must be visible (not browser-default; custom focus ring with sufficient contrast)
- Skip-to-main-content link on all pages

### Platform Considerations

- **Mobile-first**: 375px baseline. All content readable without horizontal scroll on mobile
- **Touch targets**: Minimum 44×44px for all interactive elements on mobile
- **No motion required**: Content is text-dominant; no mandatory animations
- **Color contrast**: All text ≥ 4.5:1 contrast ratio against background (AA); large text ≥ 3:1
- **Alt text**: All images (including decorative) properly marked (alt="" for decorative)
- **Form labels**: All form inputs have associated `<label>` elements
- **Error identification**: Form errors are identified in text, not just color

### Accessibility Debt Policy

> Any accessibility violation introduced in Development phase is a P0 bug before launch. Lighthouse Accessibility score ≥ 90 is a Gate 5 requirement.

---

## Appendix

### Glossary

| Term | Definition | NOT to be confused with |
|------|------------|------------------------|
| A–Z Framework | The 26-category scope covering Decisions, Systems, and Realities of eCommerce | "A to Z" as in comprehensive tutorials |
| Editorial Gate | 4-question test that every published article must pass | Copy review or grammar check |
| Practitioner Test | "Would a seasoned eCommerce operator find this useful and non-obvious?" | Beginner-friendliness test |
| Content Loop | Content → SEO → Audience → Email → Revenue → More Content (compounding) | Viral loop or paid acquisition loop |
| Digital Product | A downloadable asset (framework, playbook, template) sold as a one-time purchase | SaaS product or subscription |
| Lead Magnet | Free resource offered in exchange for email subscription | Gated content (which requires login) |

### Competitive Positioning Summary

| Dimension | AHAeCommerce | Review Blogs | YouTube | Tool Docs |
|-----------|-------------|-------------|---------|-----------|
| Independence | High (editorial gate) | Low (affiliate-first) | Mixed | Zero |
| Evergreen value | High (decisions age slowly) | Low (trend-driven) | Low | Medium |
| Decision clarity | Primary focus | Secondary | Tertiary | None |
| Search findability | Long-tail decision queries | Head terms, reviews | Video search | Tool names |
| Email authority | Built-in loop | Sporadic | YouTube subs | None |

### Discovery Brief Reference

This PRD was created with the following Discovery Brief inputs:
- **Risk Tier**: MEDIUM (basic-PII — names, emails, preferences)
- **Governance Scope**: Security, Performance, Accessibility, SEO, Design System, Content Governance, Integration all active; i18n = NO
- **Deployment Target**: Vercel (managed serverless)
- **External Integrations**: Email platform, Analytics, Affiliate Network, Payment Processor, Error Monitoring
- **Team**: Solo developer / solo operator
- **Discovery Source**: DISCOVERY.md (LOCKED, used as primary Phase 0 input)

---

**PRD Version**: 1.0
**Status**: Draft — Pending Gate 1 (Compound Business Checklist) evaluation
**Next Step**: Gate 1 evaluation → PRD_HANDOFF.md → Architecture phase
