# AI Execution Sheet — AHAeCommerce Design System

> **Single-page design reference for development. Read this before writing any UI code.**
> If it conflicts with DESIGN_OS.md, DESIGN_OS.md wins.

---

## Identity in One Line

> Content-authority editorial platform. Trust through restraint. Authority through clarity.

---

## Stack

Next.js 15 App Router · Tailwind CSS v4 · Inter (sans) · Lora (serif) · JetBrains Mono (code)

---

## The 5 Rules You Cannot Break

1. **One `<h1>` per page** — SEO + hierarchy law
2. **Zero raw Tailwind colors** — use only Design-OS tokens (`text-brand`, `bg-accent`, etc.)
3. **Zero arbitrary spacing** — use only spacing scale (`p-4`, `mt-6`, not `p-[17px]`)
4. **Every interactive element needs all 8 states** — default, hover, focus, active, disabled, loading, error, success
5. **375px first** — design mobile, extend to desktop. Never the other way.

---

## Color Cheat Sheet

| Token | Value | Use |
|---|---|---|
| `bg-background` | `#FAFAF8` | Page background |
| `bg-surface` | `#FFFFFF` | Cards, modals |
| `bg-surface-raised` | `#F5F5F2` | Sidebars, subtle sections |
| `bg-brand` | `#1B3A5C` | Primary buttons, nav active |
| `bg-brand-light` | `#EBF0F7` | Inline callouts, highlighted sections |
| `bg-accent` | `#B45309` | CTA buttons (Subscribe, Checkout) |
| `bg-accent-light` | `#FEF3C7` | Warning callouts, editorial highlights |
| `text-DEFAULT` | `#111827` | All body text |
| `text-secondary` | `#4B5563` | Labels, metadata, secondary content |
| `text-muted` | `#9CA3AF` | Captions, placeholders (large text only) |
| `text-brand` | `#1B3A5C` | Links in text, branded labels |
| `text-accent` | `#B45309` | Editorial emphasis, callout text |
| `text-inverse` | `#FFFFFF` | Text on brand/dark backgrounds |
| `border-DEFAULT` | `#E5E7EB` | All borders |
| `border-strong` | `#D1D5DB` | Focused inputs, emphasis |
| `border-brand` | `#1B3A5C` | Selected states |

---

## Typography Cheat Sheet

| Use Case | Class | Font |
|---|---|---|
| Home hero heading | `text-5xl md:text-6xl font-extrabold leading-tight font-sans` | Inter |
| Page h1 (interior) | `text-4xl font-bold leading-tight font-sans` | Inter |
| Section h2 | `text-3xl font-bold leading-tight font-sans` | Inter |
| Subsection h3 | `text-2xl font-semibold leading-snug font-sans` | Inter |
| Card heading h4 | `text-xl font-semibold font-sans` | Inter |
| **Article body** | `text-lg leading-relaxed font-serif` | **Lora** |
| UI body | `text-base leading-normal font-sans` | Inter |
| Label / metadata | `text-sm font-medium text-secondary font-sans` | Inter |
| Caption | `text-xs text-muted font-sans` | Inter |
| Code in article | `text-sm font-mono bg-surface-raised` | JetBrains Mono |

---

## Spacing Cheat Sheet

| Token | Value | Common Use |
|---|---|---|
| `space-1` / `p-1` | 4px | Icon padding |
| `space-2` / `p-2` | 8px | Chip padding vertical |
| `space-3` / `p-3` | 12px | Input padding, button vertical |
| `space-4` / `p-4` | 16px | Card padding, section inner |
| `space-6` / `p-6` | 24px | Card padding (larger), section gap |
| `space-8` / `p-8` | 32px | Section separation |
| `space-12` / `p-12` | 48px | Major section spacing |
| `space-16` / `p-16` | 64px | Page-level vertical rhythm |
| `space-24` / `p-24` | 96px | Hero padding |

---

## Layout Rules

```
Article prose max-width: max-w-prose (45rem / 720px)
Content container:        max-w-[65rem] mx-auto px-4 md:px-6
Outer container:          max-w-[75rem] mx-auto
```

---

## Component Quick Reference

### Button Variants
```html
<!-- Primary -->
<button class="bg-brand hover:bg-brand-hover text-inverse font-semibold px-6 py-3 rounded-md transition-base">
  Label
</button>

<!-- CTA (Subscribe / Checkout) -->
<button class="bg-accent hover:bg-accent-hover text-inverse font-bold px-6 py-3 rounded-md transition-base">
  Subscribe — it's free
</button>

<!-- Secondary -->
<button class="border border-brand text-brand hover:bg-brand-light font-semibold px-6 py-3 rounded-md transition-base">
  Learn More
</button>
```

### Email Capture (Inline)
```html
<div class="bg-brand-light border-l-4 border-brand p-6 rounded-md">
  <p class="text-brand font-semibold text-base mb-1">📬 Get decision frameworks in your inbox</p>
  <form class="flex gap-2 mt-3">
    <input type="email" placeholder="you@example.com"
      class="flex-1 border border-DEFAULT rounded-sm px-4 py-3 text-base focus:outline-brand" />
    <button type="submit" class="bg-accent text-inverse font-bold px-4 py-3 rounded-md">→</button>
  </form>
  <p class="text-muted text-xs mt-2">No spam. Unsubscribe anytime.</p>
</div>
```

### Article Card
```html
<article class="border border-DEFAULT rounded-md p-6 bg-surface hover:border-brand hover:shadow-md transition-base">
  <span class="badge">A — Architecture</span>
  <h3 class="text-xl font-semibold mt-3 mb-2 leading-snug font-sans">Title</h3>
  <p class="text-secondary text-base leading-normal line-clamp-3">Description</p>
  <div class="flex gap-3 mt-4 text-muted text-sm">
    <span>5 min read</span>
    <span>·</span>
    <span>Feb 28, 2026</span>
  </div>
</article>
```

---

## Page Structure Template

```html
<!DOCTYPE html>
<html lang="en">
<head><!-- next/head or metadata export --></head>
<body class="bg-background text-DEFAULT font-sans">

  <!-- Skip link (REQUIRED) -->
  <a href="#main-content" class="skip-link sr-only focus:not-sr-only">
    Skip to main content
  </a>

  <!-- Site Header (sticky) -->
  <header class="sticky top-0 z-50 bg-surface border-b border-DEFAULT">
    <SiteHeader />
  </header>

  <!-- Main content -->
  <main id="main-content" tabindex="-1">
    <!-- Page content here -->
  </main>

  <!-- Site Footer -->
  <footer class="bg-surface border-t border-DEFAULT mt-24">
    <SiteFooter />
  </footer>

</body>
</html>
```

---

## Navigation Structure

```
Desktop Nav: Logo | Topics | Start Here | About || [Subscribe →]
Mobile Nav:  Logo || [≡]  →  Drawer: Topics / Start Here / About / [Subscribe →]
```

Active nav link: `text-brand font-semibold border-b-2 border-brand`
Inactive nav link: `text-secondary hover:text-DEFAULT`

---

## 6 Required States (Every Page & Key Component)

| State | Visual Pattern |
|---|---|
| Default | Normal render, content visible |
| Empty | Icon + heading + helpful description + action button |
| Loading | Skeleton (content) or spinner (action). Never blank white flash. |
| Error | `bg-error-bg border-l-4 border-error` + user-readable message + retry action |
| Offline | `bg-warning-bg` banner: "You appear to be offline. Content may be outdated." |
| Permission-denied | N/A in Phase 1 (no auth). Template ready for Phase 2. |

---

## Affiliate Disclosure (Required on any page with affiliate links)

```html
<div class="bg-warning-bg border-l-4 border-warning text-warning text-sm p-4 mb-8 rounded-r-sm">
  ⚠ <strong>Affiliate disclosure:</strong> Some links on this page may earn a commission.
  We only recommend tools we would use without the commission.
</div>
```

---

## SEO Requirements (Per Page)

```typescript
// Every page.tsx must export:
export const metadata: Metadata = {
  title: "[Page Title] | AHAeCommerce",
  description: "[120-155 char description]",
  alternates: { canonical: "/route" },
  openGraph: { title, description, type, images: ["/api/og?..."] },
  twitter: { card: "summary_large_image", title, description }
}
```

---

## Accessibility Checklist (Run Before Any Page Is Done)

- [ ] Single h1 on page
- [ ] Heading levels don't skip (h1 → h2 → h3, never h1 → h3)
- [ ] All images have alt text (decorative: `alt=""`)
- [ ] All form inputs have `<label>` with matching `htmlFor`
- [ ] All interactive elements have focus styles (`:focus-visible`)
- [ ] Touch targets ≥ 44×44px
- [ ] Affiliate disclosure visible if `affiliateLinks: true`
- [ ] Skip-to-main-content link present in root layout
- [ ] Color contrast verified (use browser DevTools contrast checker)
- [ ] Reduced-motion CSS applied globally

---

**Sheet Version**: 1.0
**Created**: 2026-02-28
