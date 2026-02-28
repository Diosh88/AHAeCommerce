# Page Specifications — AHAeCommerce

**Version:** 1.0
**Date:** 2026-02-28
**Authority:** `docs/design/DESIGN_OS.md` (tokens) + `docs/planning/ARCHITECTURE_HANDOFF.md` (page inventory)
**Coverage:** All 13 pages from Architecture §Page Inventory

---

## Spec Format

Each page spec includes:
- **Purpose** and user intent
- **Route** (from architecture)
- **Information hierarchy** (locked — development may not reorder)
- **Mobile layout** (375px baseline)
- **All 6 states**: Default / Empty / Loading / Error / Offline / Permission-denied
- **Key components**
- **Accessibility requirements**
- **Platform compliance** (SEO, WCAG)

---

---

# PAGE 1: Home

**Route**: `/`
**Priority**: P0
**Page Type**: Customer-facing (marketing)
**Rendering**: Static, revalidated on content push

## Purpose

Convert high-intent search-arrivals and direct visitors into readers and email subscribers. Establish editorial authority at first glance.

## Information Hierarchy (LOCKED)

```
1. Brand identity + positioning (above fold, 375px)
2. Value proposition headline — what decisions this clarifies
3. Primary CTA — [Subscribe] or [Start Here]
4. Featured articles (3 most recent/featured)
5. Topic cluster navigation (A–Z browsing entry)
6. Secondary email capture (mid-page or end of page)
7. Footer
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐ ← 375px
│  [AHAeCommerce]           [≡]  │ ← SiteHeader (64px, sticky)
├─────────────────────────────────┤
│                                 │
│  The A–Z eCommerce              │ ← h1, text-4xl, font-extrabold
│  Decision Platform              │    leading-tight, mt-12
│                                 │
│  Stop making expensive guesses. │ ← p, text-lg, text-secondary
│  Start making decisions based   │    leading-normal, mt-4
│  on systems and trade-offs.     │
│                                 │
│  [Start Here →]   [Subscribe]   │ ← CTA row, gap-3, mt-8
│                                 │    Primary + CTA buttons
│                                 │
│ ─────────────────────────────── │ ← border-DEFAULT, my-12
│                                 │
│  Featured Articles              │ ← h2, text-2xl, font-bold
│                                 │
│  [ArticleCard]                  │ ← Stack vertically on mobile
│  [ArticleCard]                  │
│  [ArticleCard]                  │
│                                 │
│  [View all articles →]          │ ← Ghost button, text-brand
│                                 │
│ ─────────────────────────────── │
│                                 │
│  Browse by Topic                │ ← h2, text-2xl
│                                 │
│  [A][B][C][D][E][F][G]         │ ← Letter grid, 7 per row mobile
│  [H][I][J][K][L][M][N]         │    bg-brand-light, text-brand
│  ...                            │    rounded-md, p-3, text-center
│                                 │
│ ─────────────────────────────── │
│                                 │
│  📬 Join 1,000+ operators       │ ← EmailCapture: end-of-article
│  [Email capture]                │    variant, centered
│                                 │
└─────────────────────────────────┘
│  [SiteFooter]                   │
```

## Desktop Extension (≥ 1024px)

- Hero: 2-column split — text left (60%), illustration/visual right (40%), or single-column centered with larger type
- Featured articles: 3-column grid
- Topic grid: Full A–Z in 4 rows of 7 letters (horizontal layout)

## States

| State | Behavior |
|---|---|
| **Default** | All content rendered, featured articles populated from Velite |
| **Empty** | No featured articles yet — show "First articles coming soon" placeholder card with consistent height |
| **Loading** | N/A (static render — no page-level loading state. Individual email form has loading state.) |
| **Error** | If static render fails at build time → Vercel serves last successful build. No user-visible error. |
| **Offline** | Service worker shows offline banner: `bg-warning-bg` strip below header. Content still readable (cached). |
| **Permission-denied** | N/A — no auth in Phase 1 |

## Key Components

- `SiteHeader` — sticky top navigation
- `HeroSection` — headline + CTAs + positioning copy
- `ArticleCard` × 3 — featured articles
- `TopicGrid` — A–Z letter navigation (26 letters)
- `EmailCapture` (end-of-article variant)
- `SiteFooter`

## Accessibility

- `<main id="main-content">` immediately after header
- Skip-to-main-content link
- h1 = brand positioning headline (one only)
- CTA buttons have descriptive aria-label ("Start your A–Z eCommerce journey")
- TopicGrid letters: aria-label="Browse articles for letter A — Architecture"

## SEO

- Title: `AHAeCommerce — A–Z eCommerce Decision Platform`
- Description: 120–155 chars covering decision-framework positioning
- OG image: Brand-designed hero card (`/api/og`)
- Schema: `WebSite` with `potentialAction: SearchAction`
- Priority: 1.0 in sitemap

## Grayscale Test

Hierarchy holds without color:
- Hero headline is largest text on page ✓
- Featured articles visually grouped ✓
- Topic grid is a recognizable navigation pattern ✓
- CTA buttons clearly interactive (shape + border) ✓

---

---

# PAGE 2: Article (Template)

**Route**: `/articles/[slug]`
**Priority**: P0
**Page Type**: Customer-facing (content) — the core value
**Rendering**: ISR (revalidate: 86400)

## Purpose

Deliver an evergreen decision-framework article that passes the editorial gate. Convert readers to email subscribers at natural scroll points.

## Information Hierarchy (LOCKED)

```
1. Breadcrumb: Home → Topics → [Category]
2. Category badge
3. Article h1 (title)
4. Meta row: reading time · published date · [affiliate disclosure if applicable]
5. Article description/lede (larger type, positions the decision being clarified)
6. Table of contents (sticky sidebar desktop, collapsible mobile)
7. Article body (Lora, text-lg, leading-relaxed)
   — Inline email capture at ~50% scroll depth
8. End-of-article section:
   — Summary (what decision this clarified)
   — EmailCapture (end-of-article variant)
   — Related articles (2–3)
9. Footer
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  Home > Architecture            │ ← Breadcrumb, text-sm, text-muted
│                                 │
│  [A — Architecture]             │ ← CategoryBadge, mt-2
│                                 │
│  When Should You Leave          │ ← h1, text-4xl, font-bold
│  Shopify for a Custom Stack?    │    leading-tight, mt-4
│                                 │
│  5 min read  ·  Feb 28, 2026   │ ← text-sm, text-muted, mt-3
│                                 │
│  [AffiliateDisclosure]          │ ← if affiliateLinks: true
│                                 │
│  ─────────────────────────────  │
│                                 │
│  The decision to move off       │ ← Lede, text-xl, leading-normal
│  Shopify is irreversible for    │    text-secondary, mb-8
│  6–12 months. Here's the        │
│  trade-off framework to decide. │
│                                 │
│  ▼ Table of Contents            │ ← Collapsible, bg-surface-raised
│    1. The real cost of migration│    border-l-4 border-brand
│    2. When Shopify limits scale │
│    3. The decision framework    │
│    4. What usually breaks       │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  [Article body — Lora serif]    │ ← text-lg, leading-relaxed
│                                 │    max-w-prose, mx-auto
│  ...                            │
│                                 │
│  ╔═══════════════════════════╗  │ ← Inline EmailCapture
│  ║ 📬 Get more frameworks   ║  │    ~50% through article
│  ║ [email] [→]              ║  │
│  ╚═══════════════════════════╝  │
│                                 │
│  [More article body...]         │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ■ The Decision                 │ ← Summary box, bg-brand-light
│  If X then Y. If A then B.     │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Did this help?                 │ ← EmailCapture: end-of-article
│  [email capture form]           │
│                                 │
│  Related Articles               │ ← h2, text-2xl
│  [ArticleCard]                  │
│  [ArticleCard]                  │
│                                 │
└─────────────────────────────────┘
│  [SiteFooter]                   │
```

## Desktop Extension (≥ 1024px)

```
┌──────────────────────────────────────────────────────────────┐
│  [SiteHeader]                                                │
├──────────┬───────────────────────────────────────────────────┤
│          │                                                   │
│  [TOC]   │  [Article body]          [max-w-prose centered]  │
│  sticky  │                                                   │
│  top-24  │                                                   │
│  w-48    │                                                   │
│  lg:w-56 │                                                   │
│          │                                                   │
└──────────┴───────────────────────────────────────────────────┘
```

Desktop: 3-column approach — TOC left (200px), article center (prose-width), future ads/related right (optional future).

## States

| State | Behavior |
|---|---|
| **Default** | Full article rendered with all metadata |
| **Empty** | N/A — articles only exist if built. No empty state for a specific article. |
| **Loading** | ISR: previous cached version serves during revalidation (invisible to user). Email form has loading spinner on submit. |
| **Error** | If slug not found: redirect to `not-found.tsx` (404 page). API errors in email form: error message below input. |
| **Offline** | Offline banner + cached article content readable. Email form shows "No connection" gracefully. |
| **Permission-denied** | N/A — all articles public in Phase 1 |

## Key Components

- `SiteHeader`, `SiteFooter`
- `Breadcrumb`
- `CategoryBadge`
- `ReadingTime`
- `AffiliateDisclosure` (conditional — if frontmatter `affiliateLinks: true`)
- `TableOfContents` (collapsible mobile, sticky sidebar desktop)
- `ArticleBody` (MDX renderer, prose styles)
- `EmailCapture` × 2 (inline variant + end-of-article variant)
- `RelatedArticles` (2–3 ArticleCards)
- `JsonLD` (Article schema)

## Accessibility

- `<article>` wraps article body
- `<nav aria-label="Table of contents">` for TOC
- `<nav aria-label="Breadcrumb">` with correct aria-current
- Affiliate disclosure: `role="note" aria-label="Affiliate disclosure"`
- All email capture forms: label + aria-describedby for help text
- RelatedArticles heading: h2

## SEO

- Title: `[Article Title] | AHAeCommerce`
- Description: article description (120–155 chars)
- Canonical: `/articles/[slug]`
- JSON-LD: `Article` schema with author, datePublished, dateModified
- OG: Article type with `publishedTime` + `modifiedTime`
- h1 = article title only
- Heading cascade: h1 (title) → h2 (major sections) → h3 (subsections)

## Affiliate Link Handling

Every `<AffiliateLink>` component:
- Renders as standard anchor with `target="_blank" rel="noopener noreferrer sponsored"`
- Tracks click via Plausible custom event: `affiliate_click` with tool name + article slug
- Disclosure indicator: subtle "(affiliate)" label inline

## Grayscale Test

Article hierarchy holds without color:
- h1 is largest text ✓
- Section headings visually distinct from body ✓
- Email capture box identifiable by border + contrast ✓
- TOC distinct from article body ✓

---

---

# PAGE 3: Category / Topic

**Route**: `/topics/[cluster]`
**Priority**: P0
**Page Type**: List-table
**Rendering**: Static (generateStaticParams for all 26 A–Z clusters)

## Purpose

Entry point for readers browsing a specific A–Z category. Helps discover all articles within a decision cluster.

## Information Hierarchy (LOCKED)

```
1. Category header: Letter + Name (e.g., "A — Architecture")
2. Category description: What decisions this cluster clarifies
3. Article list (grid on desktop, stack on mobile)
4. Related categories (adjacent A–Z letters)
5. EmailCapture (end of page)
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  A — Architecture               │ ← h1, text-4xl, font-bold
│                                 │
│  Decisions about store          │ ← p, text-lg, text-secondary
│  architecture, tech stack,      │    leading-normal, mt-3
│  and when complexity is worth   │
│  the cost.                      │
│                                 │
│  5 articles                     │ ← text-sm, text-muted
│                                 │
│  ─────────────────────────────  │
│  [ArticleCard]                  │ ← Stacked, full width
│  [ArticleCard]                  │
│  [ArticleCard]                  │
│  ...                            │
│                                 │
│  Related Topics:                │ ← h2, text-xl
│  [B — Business Models]          │ ← pill links, bg-brand-light
│  [I — Infrastructure]           │
│  [P — Platform Strategy]        │
│                                 │
│  [EmailCapture]                 │
│                                 │
└─────────────────────────────────┘
```

## States

| State | Behavior |
|---|---|
| **Default** | Category header + article grid populated |
| **Empty** | Category exists but has 0 articles: "No articles in this category yet. Articles for [A — Architecture] coming soon." + [Subscribe to be notified] CTA |
| **Loading** | N/A (static) |
| **Error** | Invalid cluster slug → 404 |
| **Offline** | Cached page reads normally. Offline banner. |
| **Permission-denied** | N/A |

## Empty State Design

```
┌─────────────────────────────────┐
│  [📂 icon]                      │
│                                 │
│  A — Architecture               │
│  No articles yet                │
│                                 │
│  We're building out this        │
│  decision cluster. Subscribe    │
│  to be notified when the first  │
│  article publishes.             │
│                                 │
│  [Subscribe for updates]        │
└─────────────────────────────────┘
```

## Accessibility

- h1 = "[Letter] — [Cluster Name]"
- `<section aria-label="Articles in this category">` wraps article grid
- Related topics: `<nav aria-label="Related topic clusters">`

---

---

# PAGE 4: About

**Route**: `/about`
**Priority**: P0
**Page Type**: Customer-facing (trust/authority)
**Rendering**: Static

## Purpose

Establish editorial independence and authority. Explain WHY this platform exists differently from biased review sites.

## Information Hierarchy (LOCKED)

```
1. Mission statement headline (h1)
2. The core problem this solves (biased content ecosystem)
3. Editorial independence declaration (the 4-question rule, made visible)
4. Strategic context: HavenWizards + Bayanihan Harvest (as proof, not promotion)
5. Contact / Submit a question CTA
6. EmailCapture
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  What Makes This Different      │ ← h1, text-4xl, font-bold, mt-8
│                                 │
│  Most eCommerce content is      │ ← text-lg, text-secondary
│  written to earn a click.       │    leading-normal, mt-4
│  This is written to earn        │
│  a decision.                    │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  The Problem                    │ ← h2, text-2xl
│  [Problem narrative paragraphs] │
│                                 │
│  Our Editorial Rule             │ ← h2, text-2xl, mt-8
│                                 │
│  ╔═══════════════════════════╗  │ ← Rule box, bg-brand-light
│  ║ Every article must:       ║  │    border-l-4 border-brand
│  ║ ✓ Clarify a decision      ║  │
│  ║ ✓ Prevent a mistake       ║  │
│  ║ ✓ Reveal a cost           ║  │
│  ║ ✓ Explain a trade-off     ║  │
│  ║ If it doesn't → not       ║  │
│  ║   published.              ║  │
│  ╚═══════════════════════════╝  │
│                                 │
│  The Context                    │ ← h2 — HavenWizards / BH
│  [Brief context, no promotion]  │
│                                 │
│  [EmailCapture]                 │
│                                 │
└─────────────────────────────────┘
```

## States

| State | Behavior |
|---|---|
| **Default** | Full editorial statement |
| **Empty** | N/A (static content) |
| **Loading** | N/A |
| **Error** | N/A (static) |
| **Offline** | Cached. Offline banner. |
| **Permission-denied** | N/A |

## Schema

- `Person` or `Organization` schema for editorial identity
- No `Article` schema (not a content article)

---

---

# PAGE 5: Subscribe

**Route**: `/subscribe`
**Priority**: P0
**Page Type**: Customer-facing (lead capture)
**Rendering**: Static

## Purpose

Dedicated email capture page. High-intent visitors who clicked a Subscribe CTA elsewhere.

## Information Hierarchy (LOCKED)

```
1. Headline: What subscribers get (not generic "subscribe to newsletter")
2. Benefits list: 3–4 specific, concrete benefits
3. Social proof: subscriber count (if available)
4. Email form with consent copy (GDPR: "By subscribing, you agree to...")
5. [Subscribe] CTA (accent button)
6. Reassurance: "No spam. Unsubscribe anytime. We respect your inbox."
7. Sample content preview (optional — link to best article as proof)
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  Decision clarity, delivered.   │ ← h1, text-4xl, font-bold, mt-12
│                                 │
│  Join operators who make        │ ← text-lg, text-secondary, mt-4
│  better decisions faster.       │    leading-normal
│                                 │
│  ✓ A–Z frameworks for the       │ ← Benefits list
│    most expensive decisions     │    text-base, check icon text-brand
│  ✓ Cost transparency others     │    space-y-3, mt-6
│    don't publish                │
│  ✓ Trade-off explanations       │
│    that stay relevant for years │
│  ✓ No tutorials. No trends.     │
│    Just decisions.              │
│                                 │
│  [Name (optional)]              │ ← Input, text-base
│  [Email address*]               │ ← Input, required
│                                 │
│  By subscribing, you agree to   │ ← text-xs, text-muted, mt-2
│  receive emails from            │
│  AHAeCommerce. Unsubscribe      │
│  anytime.                       │
│                                 │
│  [Subscribe — it's free]        │ ← CTA Button (accent), full-width
│                                 │    min-h-[44px]
│                                 │
│  No spam. No daily emails.      │ ← text-sm, text-muted, text-center
│  Unsubscribe with one click.    │
│                                 │
└─────────────────────────────────┘
```

## States

| State | Behavior |
|---|---|
| **Default** | Full form visible, all fields enabled |
| **Empty** | N/A (form is always shown) |
| **Loading** | Submit button shows spinner, disabled. Label: "Subscribing..." |
| **Error** | Field-level errors (invalid email: "Please enter a valid email address"). API error: error banner below form |
| **Success** | Form replaced with: `bg-success-bg` box — "You're in! Check your inbox for a confirmation." |
| **Offline** | Error banner: "You appear to be offline. Try again when connected." Submit button disabled. |
| **Permission-denied** | N/A |

## Error Handling

```
Invalid email:
  → Border-color: var(--color-error)
  → Error text below: text-error text-sm: "Please enter a valid email address"
  → aria-describedby links input to error message

Duplicate email (API returns DUPLICATE):
  → "You're already subscribed! Check your inbox."
  → bg-info-bg, text-info (not an error tone)

Rate limited:
  → "Too many attempts. Please try again in a moment."
  → bg-warning-bg, text-warning
```

## Accessibility

- `<form>` with `aria-label="Email subscription form"`
- All inputs: `<label>` + matching `id`/`htmlFor`
- GDPR consent text: `aria-describedby` linked to consent paragraph
- Success state: `role="status" aria-live="polite"`
- Error state: `role="alert" aria-live="assertive"`

---

---

# PAGE 6: Digital Product Landing

**Route**: `/products/[slug]`
**Priority**: P1
**Page Type**: Transactional
**Rendering**: Static

## Purpose

Convert readers who trust the content into buyers of a decision framework or playbook.

## Information Hierarchy (LOCKED)

```
1. Product headline (what decision this product resolves)
2. Who this is for (specific operator type + situation)
3. Who this is NOT for (honesty builds trust)
4. What's included (concrete, specific, no fluff)
5. Price + CTA (Lemon Squeezy checkout)
6. Trust signals (editorial independence, money-back guarantee if offered)
7. Sample / preview (excerpt or table of contents)
8. Secondary CTA (repeat)
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  The Platform Migration         │ ← h1, text-4xl, font-bold, mt-8
│  Decision Framework             │
│                                 │
│  A decision tool for operators  │ ← text-xl, text-secondary, mt-3
│  deciding whether to move off   │    leading-normal
│  Shopify — and to what.         │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  This is for you if:            │ ← h2, text-2xl
│  ✓ You're on Shopify 2+ years   │
│  ✓ Revenue $200K–$2M            │
│  ✓ Feeling platform constraints │
│                                 │
│  This is NOT for you if:        │ ← h2, text-2xl, mt-6
│  ✗ You just launched           │
│  ✗ You haven't hit constraints  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  What's Included                │ ← h2
│  ✓ 6-factor decision matrix     │
│  ✓ 3-platform comparison table  │
│  ✓ Cost modeling worksheet      │
│  ✓ Migration risk checklist     │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  ╔═══════════════════════════╗  │ ← Pricing card, bg-surface
│  ║  $49                      ║  │    border border-DEFAULT
│  ║  One-time purchase        ║  │    rounded-lg, p-6
│  ║  [Buy Now →]              ║  │    sticky on scroll (future)
│  ╚═══════════════════════════╝  │
│                                 │
│  [Sample: read page 1 free →]   │ ← text-brand, underline
│                                 │
└─────────────────────────────────┘
```

## States

| State | Behavior |
|---|---|
| **Default** | Product page fully rendered |
| **Empty** | N/A (product exists or doesn't) |
| **Loading** | [Buy Now] button: spinner on click (waiting for Lemon Squeezy redirect) |
| **Error** | Lemon Squeezy redirect fails: "Couldn't open checkout. Try again or contact us." |
| **Offline** | Buy button shows "No connection — checkout unavailable offline" |
| **Permission-denied** | N/A |

## CheckoutButton States

```
Default:      [Buy Now — $49]               bg-accent
Loading:      [⟳ Opening checkout...]       bg-accent opacity-80
Error:        [Try Again]                   bg-error
Disabled:     [Buy Now — $49]               opacity-50 cursor-not-allowed
```

## Accessibility

- h1 = product headline
- Pricing: `<p aria-label="Price: 49 US dollars. One-time purchase.">`
- CheckoutButton: `aria-label="Purchase [Product Name] for $49"`
- "Who this is for" / "not for" lists: `<ul>` with `<li>` — not just visual checkmarks

---

---

# PAGE 7: Thank You / Post-Purchase

**Route**: `/thank-you`
**Priority**: P1
**Page Type**: Transactional (confirmation)
**Rendering**: Static

## Purpose

Confirm purchase, set expectations for delivery, cross-sell related resources.

## Information Hierarchy (LOCKED)

```
1. Confirmation: Purchase confirmed (no anxiety)
2. Delivery instructions: "Check your email for download link"
3. What to expect next (email delivery timeline)
4. Related free articles (keep them in the ecosystem)
5. Subscribe if not already subscribed
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  ✓                              │ ← Success icon, text-success
│  Thank you for your purchase!   │ ← h1, text-4xl, font-bold
│                                 │
│  Your download is on its way.   │ ← text-lg, text-secondary, mt-4
│  Check your inbox at:           │
│  [email@example.com]            │ ← If capturable from LS webhook
│                                 │
│  ─────────────────────────────  │
│                                 │
│  What to do next                │ ← h2, text-2xl
│  1. Open the email from         │
│     AHAeCommerce                │
│  2. Download your framework     │
│  3. Work through section 2      │
│     before your next decision   │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Keep reading — it's free       │ ← h2
│  [ArticleCard] (related topic)  │
│  [ArticleCard]                  │
│                                 │
│  [EmailCapture if not subbed]   │ ← Optional: only if not subscribed
│                                 │
└─────────────────────────────────┘
```

## States

| State | Behavior |
|---|---|
| **Default** | Confirmation shown with delivery instructions |
| **Empty** | N/A |
| **Loading** | N/A (static page) |
| **Error** | "Didn't receive your download? Contact us." (fallback — Lemon Squeezy handles delivery) |
| **Offline** | Cached page shows. Offline banner. |
| **Permission-denied** | N/A |

---

---

# PAGE 8: Start Here

**Route**: `/start-here`
**Priority**: P1
**Page Type**: Customer-facing (orientation/onboarding)
**Rendering**: Static

## Purpose

Orient new readers. Give them a structured starting point based on where they are in their eCommerce journey.

## Information Hierarchy (LOCKED)

```
1. Welcome statement — what this platform is (not generic)
2. Choose your starting point (decision paths by operator type)
3. Featured starting articles per path
4. Email capture (get the reading guide by email)
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  Where Should You Start?        │ ← h1, text-4xl
│                                 │
│  AHAeCommerce covers A–Z.       │ ← text-lg, text-secondary
│  The right entry point depends  │
│  on where you are.              │
│                                 │
│  I'm...                         │ ← h2, text-2xl
│                                 │
│  ┌───────────────────────────┐  │ ← Path card
│  │ Just starting out          │  │    border, rounded-md, p-4
│  │ (< $10K revenue)          │  │
│  │ → Start with: Z then B    │  │ ← text-brand link
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Growing ($10K–$200K)      │  │
│  │ → Start with: C then G    │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌───────────────────────────┐  │
│  │ Scaling ($200K+)          │  │
│  │ → Start with: A then M    │  │
│  └───────────────────────────┘  │
│                                 │
│  ─────────────────────────────  │
│                                 │
│  The Most-Read Articles         │ ← h2
│  [ArticleCard] × 3              │
│                                 │
│  [EmailCapture]                 │
│                                 │
└─────────────────────────────────┘
```

## States

| State | Behavior |
|---|---|
| **Default** | All 3 paths shown with starting articles |
| **Empty** | No articles yet: "Check back soon — first articles publishing shortly." |
| **Loading** | N/A (static) |
| **Error** | N/A |
| **Offline** | Cached. Offline banner. |
| **Permission-denied** | N/A |

---

---

# PAGE 9: Search Results

**Route**: `/search`
**Priority**: P1
**Page Type**: List-table
**Rendering**: Static shell + client-side Pagefind

## Purpose

Allow readers to search for specific decision topics within the published article database.

## Information Hierarchy (LOCKED)

```
1. Search input (prominent, auto-focused)
2. Results count
3. Results list (article cards matching query)
4. No-results state with suggestions
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  Search                         │ ← h1, text-4xl, font-bold
│                                 │
│  [🔍 What are you deciding?]    │ ← Input, text-base, full-width
│                                 │    auto-focus on mount
│  ─────────────────────────────  │
│                                 │
│  12 results for "Shopify"       │ ← text-sm, text-muted (post-search)
│                                 │
│  [ArticleCard]                  │ ← Results stacked
│  [ArticleCard]                  │
│  ...                            │
│                                 │
└─────────────────────────────────┘
```

## States

| State | Behavior |
|---|---|
| **Default** | Search input empty. Suggested searches: "platform", "costs", "scaling". Recent/popular searches. |
| **Empty** (no results) | "No articles found for '[query]'. Try: [3 suggestion terms]" |
| **Loading** | Spinner in search input right side. Small "Searching..." text. |
| **Error** | Pagefind index fails to load: "Search unavailable. Browse articles by topic instead." + link to /topics |
| **Offline** | Pagefind won't load. "Search is unavailable offline. Browse topics." + link. |
| **Permission-denied** | N/A |

## No-Results Design

```
┌──────────────────────────────────┐
│  [🔍 icon]                       │
│                                  │
│  No articles for "[query]"       │
│                                  │
│  Try:                            │
│  → "platform decision"           │
│  → "scaling costs"               │
│  → "tool evaluation"             │
│                                  │
│  Or browse all topics →          │
└──────────────────────────────────┘
```

## Accessibility

- Search input: `aria-label="Search articles"`, `role="searchbox"`
- Results: `aria-live="polite"` region for result count updates
- No-results: `role="status"`

---

---

# PAGE 10: 404 / Not Found

**Route**: `not-found.tsx` (Next.js built-in)
**Priority**: P0
**Page Type**: Error
**Rendering**: Static

## Information Hierarchy (LOCKED)

```
1. Friendly error heading (not "404 Error")
2. Short explanation
3. Primary recovery: [Home] button
4. Secondary recovery: [Search] link
5. Topic browsing grid (give them somewhere to go)
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  This page doesn't exist        │ ← h1, text-4xl, font-bold
│                                 │
│  The article or page you're     │ ← text-lg, text-secondary
│  looking for may have moved     │
│  or never existed.              │
│                                 │
│  [← Back to Home]              │ ← Primary button, bg-brand
│  [Search articles]              │ ← Secondary, text-brand link
│                                 │
│  ─────────────────────────────  │
│                                 │
│  Browse by topic                │ ← h2
│  [TopicGrid — compact]         │
│                                 │
└─────────────────────────────────┘
```

## States

Single state (error is the default). No empty/loading/offline/permission-denied variants needed — this page IS the error state.

---

---

# PAGE 11: Privacy Policy

**Route**: `/legal/privacy-policy`
**Priority**: P0
**Page Type**: Customer-facing (legal)
**Rendering**: Static (MDX)

## Purpose

GDPR + CAN-SPAM compliance. Clear disclosure of data collection practices.

## Information Hierarchy (LOCKED)

```
1. Page heading: "Privacy Policy"
2. Last updated date
3. Table of contents (section anchors)
4. Sections: Data collected / How used / Third parties / Your rights / Contact
```

## Mobile Layout

Standard prose layout — same as article body but with legal content. `max-w-prose`, `font-sans`, `text-base`, `leading-relaxed`.

No email capture on legal pages (not appropriate context).

## States

All states: Static render only. Error = N/A. Offline = cached page still readable.

---

---

# PAGE 12: Terms of Service

**Route**: `/legal/terms-of-service`
**Priority**: P0
**Page Type**: Customer-facing (legal)
**Rendering**: Static (MDX)

Same structure as Privacy Policy. Standard prose. No email capture.

---

---

# PAGE 13: All Articles Index

**Route**: `/articles`
**Priority**: P2
**Page Type**: List-table
**Rendering**: Static

## Purpose

Complete article index, browsable and filterable. Discovery page for readers who want to explore broadly.

## Information Hierarchy (LOCKED)

```
1. Heading: "All Articles"
2. Filter by topic (A–Z category pills)
3. Sort: Newest / Most relevant (static — by publishedAt)
4. Article grid
5. Email capture (end of page)
```

## Mobile Layout (375px)

```
┌─────────────────────────────────┐
│  [SiteHeader]                   │
├─────────────────────────────────┤
│                                 │
│  All Articles                   │ ← h1, text-4xl
│  30 decision frameworks         │ ← text-sm, text-muted
│                                 │
│  Filter by topic:               │ ← h2, text-xl (sr-only on mobile)
│  [All] [A] [B] [C] [D] [E]...  │ ← Scrollable pills row
│                                 │
│  [ArticleCard]                  │ ← Stacked on mobile
│  [ArticleCard]                  │
│  ...                            │
│                                 │
│  [EmailCapture]                 │
│                                 │
└─────────────────────────────────┘
```

## States

| State | Behavior |
|---|---|
| **Default** | Full article grid |
| **Empty** | No articles published yet: "First articles coming soon. Subscribe to be notified." |
| **Loading** | N/A (static) |
| **Error** | N/A |
| **Offline** | Cached. Offline banner. |
| **Permission-denied** | N/A |

---

---

## Component Inventory Summary

### Shared Components (Design-OS Primitives)

| Component | Used In | Design Source |
|---|---|---|
| `SiteHeader` | All 13 pages | DESIGN_OS.md §Navigation |
| `SiteFooter` | All 13 pages | DESIGN_OS.md |
| `EmailCapture` | Home, Article, Subscribe, Category, Start Here, Articles | DESIGN_OS.md §EmailCapture |
| `ArticleCard` | Home, Category, Start Here, Search, Articles, Thank You | DESIGN_OS.md §ArticleCard |
| `CategoryBadge` | Article, ArticleCard | DESIGN_OS.md §CategoryBadge |
| `Button` (Primary/Secondary/CTA) | All pages | DESIGN_OS.md §Button |
| `TopicGrid` | Home, 404 | Page 1 spec |

### Page-Specific Components

| Component | Page(s) | Notes |
|---|---|---|
| `HeroSection` | Home | One-off — justified (primary entry point) |
| `TableOfContents` | Article | Justified — long-form navigation |
| `ArticleBody` | Article | MDX renderer — unique need |
| `AffiliateDisclosure` | Article, Product | Governance-required |
| `AffiliateLink` | Article | Inline link wrapper |
| `RelatedArticles` | Article | Tagged relationship component |
| `Breadcrumb` | Article, Category | Navigation aid |
| `CheckoutButton` | Product Landing | Lemon Squeezy integration |
| `PathCard` | Start Here | 3 instances only (3 operator paths) — justified |
| `ReadingTime` | Article, ArticleCard | Simple computed display |
| `JsonLD` | Article, Home, Product, About | Server-only, no visual |

**No unjustified one-off components**. Every component above is either shared (Design-OS) or has a documented page-specific justification.

---

## Platform Compliance

| Requirement | Pages | Status |
|---|---|---|
| Single h1 per page | All 13 | ✅ Specified in each spec |
| Heading cascade (no skip) | All 13 | ✅ h1 → h2 → h3 in all specs |
| Skip-to-main-content | All 13 | ✅ In root layout |
| Affiliate disclosure | Article, Product | ✅ Conditional on frontmatter |
| GDPR consent on subscribe forms | Subscribe, EmailCapture | ✅ Consent copy specified |
| `<article>` for articles | Article | ✅ Specified |
| `<nav aria-label>` | All nav elements | ✅ Specified |
| Touch targets 44×44px | All interactive elements | ✅ Design-OS requirement |
| 375px baseline | All 13 | ✅ Mobile layout specified first |

---

## Accessibility Summary

| Requirement | Implementation |
|---|---|
| WCAG 2.1 AA | All color tokens verified (DESIGN_OS.md §Contrast Ratios) |
| Skip navigation | Root layout `<a href="#main-content">` |
| Keyboard nav | All interactive elements natively keyboard-accessible (buttons, links, inputs) |
| Screen reader | Semantic HTML + ARIA labels on all custom patterns |
| Reduced motion | Global CSS media query in globals.css |
| Touch targets | 44×44px minimum enforced by Design-OS |
| Color independence | Grayscale tests documented per page |

---

**PAGE_SPECS Version**: 1.0
**Created**: 2026-02-28
**Pages covered**: All 13 (P0 × 7, P1 × 5, P2 × 1)
