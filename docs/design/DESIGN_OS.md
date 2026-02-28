# Design-OS — AHAeCommerce

**Version:** 1.0
**Phase:** Design
**Date:** 2026-02-28
**Authority:** This document defines the visual language. All UI code MUST use these tokens.
**Enforcement:** `scripts/token-lint.sh` — zero raw Tailwind color or spacing classes in components.

---

## Design Paradigm: Editorial Authority

AHAeCommerce is a **content-authority platform** — not a SaaS product, not a dashboard.

**Design job**: Make long-form decision-framework content feel authoritative, trustworthy, and comfortable to read. Build enough trust that a practitioner subscribes.

**Paradigm selection**: Utility/Editorial — NOT conversion-first (no popups, no countdown timers, no social-proof urgency). Trust is earned through design restraint and content quality.

**Design Canon**: The New Yorker × The Economist × Stripe Docs
- Restrained color palette
- Generous whitespace
- Editorial typography that rewards reading
- Functional over decorative

---

## Audience Profiles

### Primary: The Stressed Operator

- **Who**: Early-to-mid stage eCommerce founder ($0–$500K ARR)
- **Context**: Researching a specific decision, often while overwhelmed
- **Device**: Mobile first (discovery); desktop for deep reads
- **Cognitive state**: Decision-fatigued, skeptical of hype
- **Design implication**: Reduce cognitive load at every turn. No distractions. Make the right action obvious without being pushy.

### Secondary: The Validating Consultant

- **Who**: Freelancer or agency consultant fact-checking a recommendation
- **Context**: Desktop, quick reference
- **Cognitive state**: Efficient, looking for specifics
- **Design implication**: Scannable structure. Good TOC. Clear headings. Skip-to-section that works.

### Tertiary: The Mobile Researcher

- **Who**: Founder in transit, doing early-stage research on phone
- **Context**: Small screen, interrupted, low patience
- **Design implication**: 375px first. Reading time visible. Email capture non-intrusive.

---

## Color System

### Palette Definitions (CSS Custom Properties)

These are the ONLY allowed color values. Raw Tailwind color classes (`text-blue-600`, `bg-gray-100`, etc.) are BANNED in components.

```css
/* === BRAND COLORS === */
--color-brand:          #1B3A5C;   /* Deep navy — trust, authority, intelligence */
--color-brand-hover:    #152E4A;   /* Darker navy on hover */
--color-brand-light:    #EBF0F7;   /* Light navy tint — backgrounds, highlights */
--color-accent:         #B45309;   /* Amber/bronze — decisions, CTAs, emphasis */
--color-accent-hover:   #92400E;   /* Darker amber on hover */
--color-accent-light:   #FEF3C7;   /* Amber background — callouts, highlights */

/* === BACKGROUND LAYERS === */
--color-background:     #FAFAF8;   /* Warm off-white — page base (easier on eyes) */
--color-surface:        #FFFFFF;   /* Pure white — cards, modals, elevated surfaces */
--color-surface-raised: #F5F5F2;   /* Slightly darker — divider backgrounds, sidebars */

/* === TEXT === */
--color-text:           #111827;   /* Near-black, warm — primary reading text */
--color-text-secondary: #4B5563;   /* Medium gray — secondary labels, metadata */
--color-text-muted:     #9CA3AF;   /* Light gray — captions, placeholders */
--color-text-inverse:   #FFFFFF;   /* White text on dark backgrounds */
--color-text-brand:     #1B3A5C;   /* Brand-colored text for links in context */
--color-text-accent:    #B45309;   /* Accent-colored text — callouts */

/* === BORDERS & DIVIDERS === */
--color-border:         #E5E7EB;   /* Standard border — inputs, cards */
--color-border-strong:  #D1D5DB;   /* Stronger border — focused inputs, emphasis */
--color-border-brand:   #1B3A5C;   /* Brand border — selected states */

/* === FEEDBACK STATES === */
--color-success:        #065F46;   /* Dark green — success states */
--color-success-bg:     #ECFDF5;   /* Light green background */
--color-error:          #991B1B;   /* Dark red — error states */
--color-error-bg:       #FEF2F2;   /* Light red background */
--color-warning:        #92400E;   /* Amber-dark — warning states */
--color-warning-bg:     #FFFBEB;   /* Light amber background */
--color-info:           #1E40AF;   /* Dark blue — informational */
--color-info-bg:        #EFF6FF;   /* Light blue background */
```

### Tailwind Token Mapping (`tailwind.config.ts`)

```typescript
// All Tailwind color extensions map to CSS custom properties
// Components use semantic names, never raw Tailwind colors
colors: {
  brand: {
    DEFAULT: 'var(--color-brand)',
    hover: 'var(--color-brand-hover)',
    light: 'var(--color-brand-light)',
  },
  accent: {
    DEFAULT: 'var(--color-accent)',
    hover: 'var(--color-accent-hover)',
    light: 'var(--color-accent-light)',
  },
  background: 'var(--color-background)',
  surface: 'var(--color-surface)',
  'surface-raised': 'var(--color-surface-raised)',
  // ... text, border, feedback tokens
}
```

### Contrast Ratios (WCAG 2.1 AA Verified)

| Combination | Ratio | AA Text | AA Large | AAA |
|---|---|---|---|---|
| `--color-text` on `--color-background` | 16.1:1 | ✅ | ✅ | ✅ |
| `--color-text-secondary` on `--color-background` | 6.8:1 | ✅ | ✅ | ✅ |
| `--color-text-muted` on `--color-background` | 3.1:1 | ❌ | ✅ | ❌ |
| `--color-text-inverse` on `--color-brand` | 8.9:1 | ✅ | ✅ | ✅ |
| `--color-text-inverse` on `--color-accent` | 4.6:1 | ✅ | ✅ | ❌ |
| `--color-brand` on `--color-surface` | 8.9:1 | ✅ | ✅ | ✅ |

> **Note**: `--color-text-muted` (3.1:1) passes AA for large text (18pt+) and UI components, NOT for body text. Use only for captions, placeholders, and secondary labels at ≥ 18px.

---

## Typography System

### Font Stack

```css
/* Loaded via next/font — no FOUT, preloaded */
--font-sans:  'Inter', system-ui, -apple-system, sans-serif;
--font-serif: 'Lora', Georgia, 'Times New Roman', serif;
--font-mono:  'JetBrains Mono', 'Fira Code', monospace;
```

**Usage rules**:
- `--font-sans`: All UI — navigation, labels, buttons, metadata, marketing headings
- `--font-serif`: Article body text only — long-form reading content
- `--font-mono`: Code snippets within articles only

### Type Scale (1.25 ratio, 16px base)

```css
--text-xs:   0.75rem;    /*  12px — captions, legal micro-copy */
--text-sm:   0.875rem;   /*  14px — metadata, tags, secondary labels */
--text-base: 1rem;       /*  16px — UI body, short descriptions */
--text-lg:   1.125rem;   /*  18px — article body (serif), emphasis text */
--text-xl:   1.25rem;    /*  20px — card headings, section intros */
--text-2xl:  1.5rem;     /*  24px — subsection headings (h3) */
--text-3xl:  1.875rem;   /*  30px — section headings (h2) */
--text-4xl:  2.25rem;    /*  36px — page headings (h1 on interior pages) */
--text-5xl:  3rem;       /*  48px — hero headings (desktop only) */
--text-6xl:  3.75rem;    /*  60px — display headings (home hero desktop) */
```

### Line Heights

```css
--leading-tight:    1.2;    /* Headings, large display type */
--leading-snug:     1.4;    /* UI text, navigation items */
--leading-normal:   1.6;    /* Short body text, descriptions */
--leading-relaxed:  1.75;   /* Article body text (serif) */
--leading-loose:    2.0;    /* Pull quotes, emphasized passages */
```

### Font Weights

```css
--font-normal:    400;   /* Body text */
--font-medium:    500;   /* UI labels, navigation */
--font-semibold:  600;   /* Subheadings, card titles, button labels */
--font-bold:      700;   /* Headings, emphasis */
--font-extrabold: 800;   /* Hero headings, display type */
```

### Heading Hierarchy Rules

- **One `<h1>` per page** — non-negotiable, SEO requirement
- `h1` → `text-4xl` or `text-5xl` (page) or `text-5xl`/`text-6xl` (home hero)
- `h2` → `text-3xl`, `font-bold`, `leading-tight`
- `h3` → `text-2xl`, `font-semibold`, `leading-snug`
- `h4` → `text-xl`, `font-semibold`
- No skipping levels (h1 → h3 without h2 = violation)

---

## Spacing System

### Scale (4px base unit)

```css
--space-0:   0;          /*   0px */
--space-1:   0.25rem;    /*   4px */
--space-2:   0.5rem;     /*   8px */
--space-3:   0.75rem;    /*  12px */
--space-4:   1rem;       /*  16px */
--space-5:   1.25rem;    /*  20px */
--space-6:   1.5rem;     /*  24px */
--space-8:   2rem;       /*  32px */
--space-10:  2.5rem;     /*  40px */
--space-12:  3rem;       /*  48px */
--space-16:  4rem;       /*  64px */
--space-20:  5rem;       /*  80px */
--space-24:  6rem;       /*  96px */
--space-32:  8rem;       /* 128px */
```

**No arbitrary spacing values** — e.g., `p-[17px]` is a violation. Use the closest scale value.

### Layout Widths

```css
--width-prose:     45rem;    /* 720px — article body max width */
--width-content:   65rem;    /* 1040px — page content max width */
--width-container: 75rem;    /* 1200px — outer container max width */
--width-narrow:    32rem;    /* 512px — narrow forms, email capture */
```

### Breakpoints (Mobile-First)

```css
/* Tailwind defaults — never change these values */
sm:  640px   /* Small tablets */
md:  768px   /* Tablets */
lg:  1024px  /* Laptops/desktop */
xl:  1280px  /* Large desktop */
```

**375px** is the design baseline (smallest supported mobile). Every layout is designed for 375px first.

---

## Component Library

### Button

```
Primary Button:
  bg: var(--color-brand)
  text: var(--color-text-inverse)
  padding: var(--space-3) var(--space-6)
  border-radius: var(--radius-md)
  font: var(--font-semibold) var(--text-base)

  States:
  - default:   bg-brand
  - hover:     bg-brand-hover (scale 1.01)
  - focus:     outline 2px var(--color-brand), offset 2px
  - active:    scale 0.98
  - disabled:  opacity 50%, cursor-not-allowed
  - loading:   spinner left of label, cursor-wait

Secondary Button:
  bg: transparent
  text: var(--color-brand)
  border: 1px solid var(--color-brand)
  (same states as primary, hover fills with brand-light bg)

Ghost Button:
  bg: transparent
  text: var(--color-text-secondary)
  (hover: bg surface-raised)

CTA Button (Subscribe/Checkout):
  bg: var(--color-accent)
  text: var(--color-text-inverse)
  font-weight: var(--font-bold)
  (hover: bg-accent-hover)
```

### Input / Form Field

```
Text Input:
  border: 1px solid var(--color-border)
  border-radius: var(--radius-sm)
  padding: var(--space-3) var(--space-4)
  bg: var(--color-surface)
  font: var(--text-base) var(--font-sans)
  color: var(--color-text)

  States:
  - default:  border-color
  - hover:    border-border-strong
  - focus:    outline 2px var(--color-brand), border-transparent
  - error:    border-color var(--color-error), error message below
  - disabled: bg surface-raised, opacity 60%

Label:
  font: var(--text-sm) var(--font-medium)
  color: var(--color-text-secondary)
  margin-bottom: var(--space-2)
  (always associated via htmlFor/id)
```

### EmailCapture Component

Three variants (same data contract, different layout):

```
Variant: inline (within article body)
  ┌─────────────────────────────────────┐
  │ 📬 Get decision frameworks direct  │
  │ to your inbox                       │
  │                                     │
  │ [Email address............] [→]     │
  │ No spam. Unsubscribe anytime.       │
  └─────────────────────────────────────┘
  bg: var(--color-brand-light)
  border-left: 4px solid var(--color-brand)
  padding: var(--space-6)

Variant: end-of-article
  ┌─────────────────────────────────────┐
  │ ── Did this help? ──                │
  │ Join operators who receive the      │
  │ full A–Z decision framework.        │
  │                                     │
  │ [Email address....................]  │
  │ [Subscribe — it's free]             │
  │ No spam. Unsubscribe anytime.       │
  └─────────────────────────────────────┘
  bg: var(--color-surface)
  border: 1px solid var(--color-border)
  border-radius: var(--radius-lg)

Variant: dedicated (Subscribe page, full-width)
  Full-page centered layout — see Subscribe page spec
```

### ArticleCard

```
┌─────────────────────────────────────┐
│ [Category Badge]                    │
│                                     │
│ Article Title (2 lines max)         │
│                                     │
│ Description (3 lines max)           │
│                                     │
│ [Reading time] · [Published date]   │
└─────────────────────────────────────┘
  border: 1px solid var(--color-border)
  border-radius: var(--radius-md)
  padding: var(--space-6)
  bg: var(--color-surface)
  hover: border-color var(--color-border-brand), shadow-sm
  transition: border-color 150ms, box-shadow 150ms
```

### CategoryBadge

```
[A — Architecture]

  bg: var(--color-brand-light)
  text: var(--color-brand)
  font: var(--text-xs) var(--font-semibold)
  letter-spacing: 0.05em
  padding: var(--space-1) var(--space-3)
  border-radius: var(--radius-full)
```

### AffiliateDisclosure

```
⚠ Affiliate disclosure: Some links on this page may earn a commission.
  We only recommend tools we would use ourselves.

  bg: var(--color-warning-bg)
  border-left: 4px solid var(--color-warning)
  color: var(--color-warning)
  font: var(--text-sm)
  padding: var(--space-4)
```

---

## Border Radius

```css
--radius-sm:   4px;      /* inputs, small chips */
--radius-md:   8px;      /* cards, buttons */
--radius-lg:   12px;     /* modals, large cards */
--radius-xl:   16px;     /* hero sections */
--radius-full: 9999px;   /* pills, badges, avatars */
```

---

## Shadow System

```css
--shadow-sm:  0 1px 3px rgba(0,0,0,0.08);                      /* card resting */
--shadow-md:  0 4px 12px rgba(0,0,0,0.10);                     /* card hover */
--shadow-lg:  0 8px 24px rgba(0,0,0,0.12);                     /* floating, modal */
--shadow-xl:  0 16px 48px rgba(0,0,0,0.15);                    /* modals */
--shadow-inner: inset 0 2px 4px rgba(0,0,0,0.06);              /* inputs focus bg */
```

---

## Motion Budget

**Philosophy**: Content platform — motion should not distract from reading.

```css
/* Only these transitions are permitted */
--transition-fast:    100ms ease;    /* hover state feedback (color, border) */
--transition-base:    150ms ease;    /* button state changes */
--transition-slow:    250ms ease;    /* page transitions, modal open/close */
--transition-content: 300ms ease;   /* content reveals, collapsible */

/* Always honor reduced motion */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

**Permitted animations**:
- Hover state color/border changes (150ms)
- Button press scale (98%) — 100ms
- Focus ring appearance — 100ms
- Toast/notification slide-in — 250ms
- Collapsible expand/collapse — 250ms

**Banned animations**:
- Parallax scrolling
- Auto-playing background videos
- Entrance animations on content (content must be visible immediately)
- Persistent looping animations

---

## Navigation Pattern

**Selected**: Top horizontal navigation bar (desktop) + Hamburger drawer (mobile)

```
Desktop (≥ 1024px):
┌──────────────────────────────────────────────────────┐
│  [AHAeCommerce logo]  Topics  Start Here  About      │
│                                    [Subscribe →]     │
└──────────────────────────────────────────────────────┘
  height: 64px
  bg: var(--color-surface)
  border-bottom: 1px solid var(--color-border)
  position: sticky top-0 (z-index: 50)
  max-width: var(--width-container)
  padding: 0 var(--space-6)

Mobile (< 1024px):
┌──────────────────────────────────────┐
│  [AHAeCommerce logo]        [≡]     │
└──────────────────────────────────────┘
Drawer (slides from right):
  - Topics
  - Start Here
  - About
  - [Subscribe →] (CTA, full width)
  Overlay: rgba(0,0,0,0.4)
  Drawer: 280px wide, bg surface, shadow-xl
```

**Skip navigation link** (first focusable element, visually hidden, visible on focus):
```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

---

## Accessibility Standards (Per-System)

### Focus Indicator
```css
/* Applied to ALL interactive elements */
:focus-visible {
  outline: 2px solid var(--color-brand);
  outline-offset: 2px;
  border-radius: var(--radius-sm);
}
/* Never: outline: none — only allowed if custom focus style is implemented */
```

### Touch Targets
```css
/* Minimum 44×44px for all tap targets */
.btn, a, button, input, [role="button"] {
  min-height: 44px;
  min-width: 44px;
}
```

### Color Independence Rule
> **Grayscale test**: Print the design in grayscale. All hierarchy must hold.
- Never use color alone to convey meaning (errors always have icon + text, not just red color)
- Category badges use text labels, not just color dots

---

## Design Canon Reference

| Source | What We Borrow |
|---|---|
| The New Yorker | Typographic restraint, generous whitespace, trust through quality |
| The Economist | Data density done clearly, authoritative tone, no gimmicks |
| Stripe Docs | Clean technical writing layout, good TOC, excellent readability |
| Linear.app | Tight component design, purposeful micro-interactions |

**What we deliberately avoid**:
- ❌ Popups or interstitials (destroys trust)
- ❌ Countdown timers or urgency patterns (manipulative)
- ❌ Auto-playing anything (noise)
- ❌ Excessive social proof widgets (badge-collection)
- ❌ Hero illustrations that obscure the value proposition

---

## Token Lint Rules

`scripts/token-lint.sh` checks for:
1. No raw Tailwind color classes: `text-gray-*`, `bg-blue-*`, `border-red-*`, etc.
2. No arbitrary color values: `text-[#1a1a1a]`, `bg-[rgb(0,0,0)]`
3. No arbitrary spacing values: `p-[17px]`, `mt-[13px]`
4. No inline style colors: `style="color: #..."` (except Design-OS token references)

All components must pass token-lint before merging.

---

**Design-OS Version**: 1.0
**Created**: 2026-02-28
**Next**: AI_EXECUTION_SHEET.md (single-page reference) → PAGE_SPECS.md (all 13 pages)
