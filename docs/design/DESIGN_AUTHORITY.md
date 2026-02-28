# Design Authority & Governance Resolution — AHAeCommerce

<!-- TEMPLATE VERSION: v1.3 (2026-02-28) -->
<!-- PURPOSE: Vertical authority over horizontal design documents. -->
<!-- SCOPE: Governance law ONLY. No tokens, no components, no implementation. -->
<!-- CREATED BY: update-governance v14.0 (2026-02-28) — gap detected: design docs existed without authority spine. -->

> **This is the design execution spine.** Load this first.
> Resolve intent before components or tokens.

---

## Authority Scope

This document defines **governance and decision precedence only**. It is pure law.

It MUST NOT:

- Define component APIs, props, or behavior
- Define token values (colors, spacing, timing)
- Reference implementation files, paths, or framework code
- Contain framework-specific logic (React, data attributes, providers, etc.)
- Define visual styles or aesthetic choices (that is `DESIGN_OS.md`)
- Duplicate skill chains defined in CLAUDE.md (Single Source of Truth Rule)

All implementation must comply with this document, but this document must remain
**implementation-agnostic**.

---

## Relationship to Other Governance

| Document | Relationship | Direction |
|----------|-------------|-----------|
| CLAUDE.md | DESIGN_AUTHORITY operates UNDER CLAUDE.md authority | CLAUDE.md > this |
| Skill Workflow Chains (CLAUDE.md) | This document references the chain, never redefines it | CLAUDE.md owns chain |
| DESIGN_OS.md | This document declares its precedence rank | This > DESIGN_OS |
| AI_EXECUTION_SHEET.md | Unbreakable rules for AI execution | Peer — both must be loaded |
| PAGE_SPECS.md | Page-level design specs | This > PAGE_SPECS |
| DESIGN_FAILURE_REGISTRY.md | Known failure patterns | This governs when to consult it |
| DESIGN_SUCCESS_REGISTRY.md | Proven patterns | This governs when to apply them |

**Single Source of Truth**: The Design Skill Chain is defined in CLAUDE.md Skill Workflow Chains.
This document enforces that chain's execution semantics (fail-fast, classification thresholds)
but does NOT restate the chain members.

---

## Document Precedence Hierarchy (Top Overrides Bottom)

| Rank | Document | Purpose | Location |
|------|----------|---------|----------|
| 1 | **Design Canon (Editorial Authority)** | The New Yorker × The Economist × Stripe Docs — immutable aesthetic north star | `docs/design/DESIGN_OS.md` §Design Paradigm |
| 2 | **DESIGN_OS.md** | Visual language: tokens, spacing, typography, color system | `docs/design/DESIGN_OS.md` |
| 3 | **AI_EXECUTION_SHEET.md** | 5 unbreakable rules for AI UI execution | `docs/design/AI_EXECUTION_SHEET.md` |
| 4 | **PAGE_SPECS.md** | Page-level surface classification and design rules | `docs/design/PAGE_SPECS.md` |
| 5 | **Rejection Criteria** | Hard-stop validation (DESIGN_FAILURE_REGISTRY) | `docs/design/DESIGN_FAILURE_REGISTRY.md` |
| 6 | **Success Patterns** | Proven patterns to apply | `docs/design/DESIGN_SUCCESS_REGISTRY.md` |

**Context mismatch = auto-reject** (e.g., dashboard surface with conversion-first urgency aesthetics).

---

## Audience Profiles (From DESIGN_OS.md — Governance Reference)

| Audience | Surface Type | Design Priority |
|----------|-------------|----------------|
| The Stressed Operator (primary) | Content/decision pages | Cognitive load reduction, no distractions, clear hierarchy |
| The Validating Consultant (secondary) | Reference/scan pages | Scannable structure, TOC, clear headings |
| The Mobile Researcher (tertiary) | Mobile-first all surfaces | 375px first, reading time visible, non-intrusive captures |

---

## Context-to-Canon Mapping

| Context | Canon Benchmark | Density | Design Paradigm |
|---------|----------------|---------|----------------|
| Content / Long-form | The New Yorker × The Economist | Editorial, generous whitespace | Utility/Editorial — trust through restraint |
| Marketing / Landing | Stripe Docs | Clean, restrained | Conversion without urgency — no popups, no timers |
| Navigation / Index | Library catalog | High scannability | Efficiency — make the right path obvious |
| Transactional (products) | Focused checkout | Minimal friction | Task completion — reduce decisions |

---

## Pre-Design Requirements (Mandatory)

Before any design output, the following must be resolved:

1. **Context detection** — Classify the surface: Content, Marketing, Navigation, or Transactional
2. **Audience profile** — Identify which audience: Stressed Operator, Validating Consultant, or Mobile Researcher
3. **Registry scan** — Check `DESIGN_FAILURE_REGISTRY.md` before any UI work (Growing maturity = scan before Tier 2+ tasks)
4. **5-layer check** — Purpose > Hierarchy > Restraint > Litmus > Patterns (via design-judgment skill per CLAUDE.md workflow chain)
5. **Mobile-first** — Always 375px first; never start with desktop layout
6. **Gate 3a alignment** — Design output must satisfy all 15 items of Gate 3a before development begins
7. **SEO-compatible structure** (all public surfaces):
   - Single `<h1>` per page; logical heading cascade (h1 → h2 → h3, no skips)
   - Content-first above-the-fold
   - Semantic HTML (sections, articles, nav, main — not div-soup)
   - Image alt text strategy defined
   - No critical content behind JS-only interactions

---

## Conflict Resolution Rules

When design documents or decisions conflict:

1. Higher-ranked documents in the Precedence Hierarchy always win
2. Design Canon **always** overrides token interpretation
3. Canon principles override Specification details
4. Rejection Criteria override everything (hard-stop layer)
5. Tokens may never introduce new aesthetics — they are implementation, not expression
6. Components may not reinterpret design intent — they execute it
7. If two documents at the same rank conflict: escalate to user

No interpretation. No averaging. No "best of both." Earlier authority wins.

---

## Fail-Fast Conditions

Design execution must halt (PAUSE) under these conditions:

| Condition | Behavior | Recovery |
|-----------|----------|----------|
| Context classification confidence < 0.8 | PAUSE — no downstream skill executes | Resolve ambiguity with user |
| Context mismatch detected (e.g., urgency pattern on editorial surface) | REJECT — output invalid | Reclassify, apply correct canon |
| Purpose cannot be stated in one sentence | PAUSE | Clarify intent before proceeding |
| Failure pattern matched in DESIGN_FAILURE_REGISTRY | PAUSE | Apply documented prevention |
| Raw Tailwind color class in design output (`bg-blue-600`, `text-gray-500`) | REJECT | Use CSS custom property tokens only |
| Public surface with no heading hierarchy plan | PAUSE | Define H1 + heading cascade first |
| Design violates Editorial Authority paradigm (popups, countdown timers, urgency) | REJECT | Remove urgency pattern — design north star is trust through restraint |

---

## AI Execution Semantics

When AI encounters a design task governed by this document:

1. **Load this document first** — before DESIGN_OS, tokens, or components
2. **Check Authority Scope** — verify the task is within governance
3. **Validate context classification** — design-intelligence must achieve >= 0.8 confidence
4. **If < 0.8** — PAUSE. Do not proceed. Resolve with user.
5. **Load AI_EXECUTION_SHEET.md** — internalize the 5 unbreakable rules
6. **Resolve conflicts via Precedence Hierarchy** — deterministic, no judgment
7. **Only then proceed** — to DESIGN_OS, PAGE_SPECS, components

This document is the `main()` of the design system. Without it, there is no entry point.

---

## Automated Enforcement

| Layer | Tool | What It Catches | When |
|-------|------|----------------|------|
| **Design Token Compliance** | `scripts/token-lint.sh` | Raw Tailwind color/spacing classes in components | Build time (Gate 4) |
| **Pre-commit** | Stylelint (if configured) | Hardcoded colors, `!important`, `max-width` queries | Every CSS commit |
| **CI/CD** | Build pipeline | Token import errors, type errors | Every push |

**Rule**: Enforcement exists because AI compliance alone = guaranteed drift (LL-020).
Structural enforcement > AI memory.

---

## What This Document Does NOT Replace

- **CLAUDE.md** — highest authority; this document operates under it
- **Skill Workflow Chains** — defined in CLAUDE.md; this document references them
- **DESIGN_OS.md** — source for token values; this document governs precedence
- **Lifecycle Gates** — Gate 3a (15/15) and Gate 3b (8/8) must both pass before development. See `docs/governance/PHASE_GATES.md`

---

## Version History

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-02-28 | Created from global template v1.3 — retroactive gap fill. Design docs existed (DESIGN_OS, PAGE_SPECS, AI_EXECUTION_SHEET) without authority spine. Customized for AHAeCommerce Editorial Authority paradigm. |
