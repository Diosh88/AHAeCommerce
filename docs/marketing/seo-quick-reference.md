# SEO Quick Reference — AHAeCommerce

> Supporting intelligence — not a governance document.
> Load when working on public-facing pages or SEO implementation.
> Authority: Architecture Spec (when created) → this document (implementation patterns).

---

## Core SEO Principle (AHAeCommerce Context)

SEO is the **primary acquisition channel** for a content-authority platform.
Content authority creates organic SEO — not the reverse.

**Evergreen > trending**: Target decision-intent queries, not trend queries.
The content loop: High-quality content → authority signals → ranking → audience → email → revenue.

---

## Per-Page SEO Requirements (Every Public Page)

| Element | Requirement | Anti-Pattern |
|---------|-------------|--------------|
| Title tag | Unique, 50-60 chars, includes decision/cost/trade-off signal | Generic or keyword-stuffed |
| Meta description | 150-160 chars, summarizes the decision clarity offered | "This article discusses..." |
| Open Graph | og:title, og:description, og:image (1200x630), og:url | Missing or duplicated from meta |
| Canonical URL | Self-referential canonical on every page | Missing or pointing to wrong URL |
| Single h1 | One per page, matches intent of the page | Multiple h1s, or h1 ≠ page intent |
| Heading hierarchy | h1 → h2 → h3 (no skips, no decorative headings) | Skipping h2, using headings for styling |
| Structured data | JSON-LD: Article / BreadcrumbList / Organization | Missing on content pages |
| Image alt text | Descriptive, informative — not decorative or keyword-stuffed | "image1.jpg" or empty on content images |

---

## URL Structure (Decision-First Hierarchy)

```
ahaecommerce.com/
  ├── /platform-strategy/          (A–Z: Platform Strategy)
  │     ├── /shopify-vs-woocommerce/
  │     ├── /when-to-leave-shopify/
  │     └── /platform-exit-strategy/
  ├── /unit-economics/             (A–Z: Unit Economics)
  │     ├── /contribution-margin-calculator/
  │     └── /break-even-analysis/
  ├── /cost-reality/               (A–Z: Costs & Cash Flow)
  │     ├── /shopify-true-cost/
  │     └── /tool-bloat-audit/
  ├── /growth-constraints/         (A–Z: Growth Constraints)
  ├── /kill-switches/              (A–Z: Kill Switches)
  └── /systems-thinking/          (A–Z: Systems Thinking)
```

> URL hierarchy to be finalized during Architecture phase. This is the recommended pattern.

---

## Target Keyword Intent

**Priority: Decision intent (highest conversion potential)**
- "shopify vs woocommerce for [specific situation]"
- "when to scale ecommerce"
- "ecommerce platform costs"
- "should I dropship or carry inventory"

**Secondary: Cost/risk awareness**
- "shopify hidden costs"
- "ecommerce tool bloat"
- "scaling ecommerce too early"

**Avoid: Tutorial intent (wrong audience)**
- "how to add products shopify"
- "best ecommerce platforms 2024" (trend decay)
- "tiktok ecommerce tutorial"

---

## Technical SEO Checklist (Implementation)

### Next.js Implementation (when stack is set)

```typescript
// Every public page must export:
export const metadata: Metadata = {
  title: '[Decision-signal title] | AHAeCommerce',
  description: '[150-char summary of decision clarity offered]',
  openGraph: {
    title: '[OG title]',
    description: '[OG description]',
    images: [{ url: '/og/[page-slug].jpg', width: 1200, height: 630 }],
    url: 'https://ahaecommerce.com/[path]',
  },
  alternates: {
    canonical: 'https://ahaecommerce.com/[path]',
  },
}
```

### Structured Data (Article pages)

```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "[Article title]",
  "author": { "@type": "Organization", "name": "AHAeCommerce" },
  "datePublished": "YYYY-MM-DD",
  "dateModified": "YYYY-MM-DD",
  "mainEntityOfPage": { "@type": "WebPage", "@id": "https://ahaecommerce.com/[path]" }
}
```

---

## Lighthouse SEO Targets

| Metric | Target | Gate |
|--------|--------|------|
| Lighthouse SEO | >= 90 | Gate 5 (Deployment Readiness) |
| LCP | < 2.5s | Core Web Vitals |
| CLS | < 0.1 | Core Web Vitals |
| INP | < 200ms | Core Web Vitals |
| Mobile score | >= 80 | Gate 5 |

---

## Sitemap Strategy

- Auto-generated via Next.js `sitemap.ts` (App Router)
- Include: all published content pages, decision framework pages
- Exclude: draft pages, admin routes, API routes, search result pages
- Update frequency: weekly (content platform)
- Submit to Google Search Console on launch (Gate 6 requirement)

---

## Version

- Version: 1.0
- Created: 2026-02-28 by initialize-governance v20.0
- Load: When working on public-facing pages or SEO implementation
