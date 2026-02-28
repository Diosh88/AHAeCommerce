# CLAUDE.md v26.0 -- Intelligent Governance with Proportional Response

<!-- TEMPLATE VERSION: v45.0 (2026-02-28) -->
<!-- v45.0: LL-GOV-029 Seed Data as Production Content + Phase 4-7 Execution Solidification. Seed/test data MUST meet content governance standards (SEO metadata, branding, marketing-quality copy) so it doubles as initial production content. Anti-patterns #62-67 (lorem ipsum in seeds, missing SEO metadata in test fixtures, placeholder branding, seed data without content governance review, UI-only workaround for S13, partial gate activation). Seed Data Quality Governance section added. STOP S13 Workaround Detection. Skill Workflow Chains updated with Seed Data + Deployment chains. -->
<!-- v44.0: LL-GOV-028 Mid-Session Governance Freshness + Cross-Project Propagation. Governance freshness check at gate evaluation, STOP recovery, and testing phase work (not just session start). Pre-Task and Pre-Gate Checkpoint tables updated. Single-DB override provision added to testing governance for cost-constrained projects (LL-GOV-026 override mechanism). -->
<!-- v43.0: LL-GOV-025 STOP Recovery Intelligence + Human Communication Protocol + LL-GOV-026 Test DB Isolation. STOP Classification table (FIXABLE/AUTO/CREDENTIAL/ESCALATE/SPLIT), Autonomous Fix Rule, Phase Confusion Prevention, Human Communication Protocol (plain language, never show governance jargon to human), STOP Communication Templates, S13 Protocol updated to plain language. LL-GOV-026: Anti-Pattern #61 (never run tests against production DB), STOP S13 Recovery Step 1 isolation check (test URL ≠ production URL), Gate 4a Section G item G6, evidence block requires isolation proof. -->
<!-- v42.1: LL-GOV-024 STOP S13 Recovery Protocol — 6-step recovery sequence after test DB credentials obtained (audit existing tests → create test data infrastructure → remediate mock L3/L4 tests → produce evidence). Closes the "agent knows what's wrong but doesn't know the recovery sequence" gap. Same pattern as LL-059/LL-GOV-023: declaring a rule ≠ executing it. -->
<!-- v42.0: LL-GOV-023 Test Data Reality Enforcement — STOP S13 (HARD STOP on test DB connection failure, same pattern as Gate 3c). Anti-patterns #56-60 (mock DB in tests, mock API in E2E, no test DB proof, network interceptors in E2E, proceed without test DB). Testing Phase Entry Checkpoint in ENFORCEMENT CHECKPOINTS. PHASE_GATES v2.5 (Gate 4 Section F loophole closed, Gate 4a Section G Test Data Reality — 5 checks with HARD STOP). testing-strategy.skill overhauled (Test Data Reality Levels L1-L4, Test Environment Setup). deployment-launch.skill environment chain fixed. On-demand loading updated. Skill workflow chains updated. -->
<!-- v41.1: Enforcement Script Wrapper Pattern -->
<!-- Project: AHAeCommerce — A–Z eCommerce Decision & Execution Intelligence Platform -->
<!-- Initialized: 2026-02-28 by initialize-governance v20.0 -->

> **Execute intelligently. Verify always. Recover gracefully.**
> **Route by file path, not by judgment. Capture lessons, not just code.**
> **For content: Infrastructure, not marketing. Every article must clarify a decision, prevent a mistake, reveal a cost, or explain a trade-off.**
> **For SEO: SEO-by-Construction — embed at every phase, not post-launch.**
> **For business: We don't build apps. We build businesses that happen to have apps.**
> **For learning: Intelligence compounds when lessons are captured.**

## MINIMUM GOVERNANCE GUARANTEE

This file provides complete governance for: session bootstrap, task routing, anti-hallucination,
universal anti-patterns, project context, and the fail-closed loading mechanism.
Domain-specific governance loads automatically via file-path routing and the on-demand loading table.
No task proceeds ungoverned.

## CONTEXT ENGINE (Mandatory — Read Before Every Session)

**`docs/governance/CONTEXT_ENGINE.md`** — Master context governor

This document overrides default Claude behavior for session classification, token budgeting,
command interpretation, machine role enforcement, and end-of-session compaction.

**10 sections — internalize, don't just load:**

| # | Name | What It Controls |
|---|------|-----------------|
| 1 | Session Tiers (T0-T3) | What governance loads based on session type |
| 2 | Bootstrap Protocol | Phase 0-6 sequence, smart bootstrap rules |
| 3 | Token Budget | 20% governance cap, on-demand rules |
| 4 | Command Interpretation | Routing, ambiguity resolution, reserved triggers |
| 5 | Cross-IDE Consistency | Behaviors that must match across all machines |
| 6 | Confirmation Format | Structured output block after governance mutations |
| 7 | Anti-Hallucination | 5-Verify protocol, auto-blocked patterns |
| 8 | EOD Compaction | Lesson capture, MEMORY update, LAST_SESSION_SUMMARY |
| 9 | Machine Role Enforcement | Permission table, escalation path |
| 10 | Integrity Chain | Hash -> verify -> safe_exec -> bootstrap -> queue |

**Load rule**: CONTEXT_ENGINE.md is auto-loaded at Phase 2.5 for T1+ sessions.
For T0 (casual/ideation): CLAUDE.md rules only.

## WHAT COMPRESSION DOES NOT DO

Compression does NOT relax any rule, gate, threshold, or enforcement. Every rule exists
somewhere in the governance system. Compression changes **organization** (where rules live),
not **authority** (what rules enforce).

---

## PRIORITY HIERARCHY (When Rules Conflict)

```
1. SECURITY           -> Never compromise (tokens, secrets, auth)
2. VERIFICATION       -> Always verify before proceeding
3. ANTI-HALLUCINATION -> Verify over assume
4. DESIGN AUTHORITY   -> For UI: Design-OS + registry scan + 5-layer judgment + self-rejection loop
5. CONTENT AUTHORITY  -> DISCOVERY.md scope lock is non-negotiable. Editorial Rule is a hard gate.
6. COST AWARENESS     -> Check CI/CD costs, bundle size, dependency weight
7. SPEED              -> Then optimize for efficiency
```

---

## ECONOMIC GOVERNOR (Cost Enforcement)

Paid API calls are governed by a daily budget enforced at the dispatch layer.

| Resource | Limit | Enforcement |
|----------|-------|------------|
| OpenAI daily spend | $2.00 default | `economic_governor.sh check` before Tier 2 dispatch |
| Gemini Flash | Free tier | No limit enforced |
| Over-budget behavior | Auto-downgrade Tier 2 -> Tier 1 | Logged, not blocked entirely |

**Config**: `~/SyncNode/Capabilities/OutboundConnectors/daily_budget.json` (M5-editable only)
**Ledger**: `spend_ledger.jsonl` (append-only, auto-rotates daily at midnight UTC)
**Fail mode**: Fail-OPEN on governor error (allow + log warning). Never hard-block on config failure.

**STOP condition S10**: If daily budget exceeded, Tier 2 auto-downgrades to Tier 1. See CONTEXT_ENGINE S10.

---

## BOOTSTRAP ATOMICITY (BOOTSTRAP_STATE.json)

BOOTSTRAP_STATE.json detected at: `~/SyncNode/BOOTSTRAP_STATE.json`

**Rule**: If BOOTSTRAP_STATE.json is missing on this machine, HALT all execution and prompt: "Run install.sh to complete setup."
**Write rule**: BOOTSTRAP_STATE.json must be atomic — all install.sh steps pass OR no state file is written. Never write a partial state.

---

## GOVERNANCE AUTHORITY ORDER (When Documents Conflict)

```
1. CLAUDE.md (this file)              -- highest authority, immutable rules
2. On-demand governance docs          -- domain-specific rules, loaded per-task
   (docs/governance/*.md)
3. Skills (loaded by file-path/task)  -- best practices and patterns
4. PRD / Architecture / Design specs  -- reference documents, product intent
5. Domain registries                  -- lessons learned, patterns, warnings
```

Higher-numbered sources CANNOT override lower-numbered sources.
Exception: User explicit override (`"override: [reason]"`) logged in phase_history.

### Single Source of Truth Rule

Every fact lives in exactly ONE canonical location. All other references use pointers:
- Phase/lifecycle status → `docs/governance/PROJECT_STATE.json` only
- Delivery status/feature tracking → `docs/planning/EXECUTION_MAP.md` only
- Architecture status → Architecture spec only
- Brand voice / editorial rules → `docs/content/CONTENT_GOVERNANCE.md` only
- Scope lock → `DISCOVERY.md` only (non-negotiable, never duplicated elsewhere)
- Design token VALUES → CSS/SCSS token files in code
- Design token DOCS → Markdown reference docs (pointers to code, not value definitions)
- CLAUDE.md contains RULES and POINTERS, not duplicated facts
- MEMORY.md contains the PROJECT INTELLIGENCE MAP

---

## FAIL-CLOSED RULE

If a task touches a governed domain (see ON-DEMAND LOADING table below) and the corresponding
governance doc has NOT been loaded this session, Claude MUST:
1. **PAUSE** the task
2. **READ** the required governance doc(s)
3. **ONLY THEN** proceed with the task

Proceeding without loading required governance = governance violation.
**Note**: If a referenced governance doc does not yet exist, log it and proceed — absence of doc is not a blocker.

---

## CONTEXT BUDGET RULE

Governance exists to make Claude effective, not to consume its capacity.

- **20% cap**: Governance loading (on-demand docs + registry scans) should NEVER exceed 20% of effective context
- **Section reading**: For docs >100 lines, prefer reading RELEVANT SECTIONS over entire files
- **5-doc threshold**: If a task requires loading >5 governance docs, PAUSE and verify tier classification
- **Registry efficiency**: For registries with >30 entries, Grep for the relevant category instead of reading the full file
- **Pointers over duplication**: Same fact in multiple docs → keep in ONE canonical location

---

## CORE BEHAVIOR

Claude is **autonomous within this project**. Governance exists to make Claude reliable, not slow.

**DO immediately**: Bug fixes, single-file changes, clear-requirement features, content tasks within scope
**PAUSE only when**: Requirements genuinely ambiguous, destructive without request, multiple valid architectures

---

## TASK TIERS (Proportional Governance)

Classify every task BEFORE loading governance. This determines what to load.

| | TIER 1: Surgical | TIER 2: Standard | TIER 3: Full |
|--|--|--|--|
| **Scope** | Single file, typo, 1-2 line fix | Feature, multi-file, new route | Architecture, phase advance, cross-system |
| **Governance load** | CLAUDE.md already loaded | + MEMORY.md, domain registry scan | + full spec, design docs, gate evaluation |
| **Anti-hallucination** | Verify the one file changed | Verify all changed files | 5-Verify protocol |
| **Lesson capture** | Only if non-obvious | Mandatory | Mandatory |
| **Skill invocation** | Not required | Required for governed domains | Required for all domains |

---

## SESSION BOOTSTRAP

Run this at the start of EVERY session (T1+):

**Phase 0**: Session identity
- Check machine role (SyncNode machine-registry detected — run role detection)
- Display session context

**Phase 1**: MCP & Environment Health
- Check `.mcp.json` → declare MCP Level (L1/L2/L3)
- MCP Level 1 = no MCPs (file ops only)
- MCP Level 3 = service MCPs responding (Supabase, GitHub, etc.)

**Phase 1.5**: Machine Role Auto-Detection (SyncNode detected)
- Read `~/SyncNode/GlobalGovernance/machine-registry/profiles/$(hostname).json`
- Extract "role" field → set session role
- Default: "builder" if profile not found

**Phase 2**: Orientation
- Read `CHANGELOG.md` (first 80 lines) for recent changes
- Read `LAST_SESSION_SUMMARY.md` if exists

**Phase 2.1**: Auto-Governance Freshness Check
- Extract version from CLAUDE.md line 3: `<!-- TEMPLATE VERSION: v45.0 -->`
- Extract current template version from `~/.claude/templates/CLAUDE-TEMPLATE.md` line 3
- If MISMATCH: display "Governance stale (vOLD → vNEW). Run /update-governance to sync."
- If MATCH: proceed silently

**Phase 2.5**: Intelligence Loading (RELEVANCE FILTER ACTIVE)
- Load `memory/MEMORY.md` behavioral directives (S1) and state (S2)
- Load `memory/patterns.md` for hot files and call chain
- DO NOT load full registries — load summaries only
- Full intelligence = ON DEMAND only

**Phase 2.6**: Tech Stack Best Practices (if in development phase)
- Read `docs/governance/PROJECT_STATE.json` → check current_phase
- If development phase: read `docs/governance/TECH_BEST_PRACTICES.md` (BINDING constraints)
- Verify Gate 3c status before any code generation

**Phase 3**: State Check
- `git status` if git repo

**Phase 4**: Environment
- Verify `.env` exists (if project-specific)
- Verify stack dependencies if `package.json` present

**Phase 5**: Pipeline Compliance
- If `docs/governance/PIPELINE_COMPLIANCE.md` exists: read and flag PENDING steps

**Phase 6**: Session Declaration
```
+-- SESSION DECLARATION --------------------------------+
| Session Tier: T[0-3]                                  |
| Machine Role: [authority/builder/executor]            |
| Task Type:    [description or "awaiting input"]       |
| Governance:   [list of docs loaded so far]            |
| MCP Level:    [1/2/3]                                 |
| STOP Active:  [S-codes from CONTEXT_ENGINE S4]        |
+-------------------------------------------------------+
```

**Phase 7**: Ready → proceed

---

## PROJECT CONTEXT

### AHAeCommerce

**Domain**: ahaecommerce.com
**Phase**: Testing (active — Gate 4a pending, Gate 4 PASS)
**Positioning**: A–Z eCommerce Decision & Execution Intelligence Platform

**Core Editorial Rule (HARD GATE — enforced on ALL content)**:
Every piece of content MUST answer at least one:
1. What decision does this clarify?
2. What mistake does this prevent?
3. What cost does this reveal?
4. What trade-off does this explain?

If it doesn't → **DO NOT PUBLISH**. This rule is non-negotiable.

**Scope Lock** (from DISCOVERY.md — never duplicated, always referenced):
- A–Z = DECISIONS, SYSTEMS, REALITIES (not tutorials, hacks, or trends)
- Full scope: `DISCOVERY.md` (read before any content or PRD work)

**Stack** (COMMITTED — Architecture phase complete):
- Next.js 15 (App Router) + Tailwind CSS v4 + Velite (content) + Supabase + Vercel
- Email: ConvertKit (Kit) | Payments: Lemon Squeezy | Analytics: Plausible | Errors: Sentry
- Search: Pagefind | OG Images: @vercel/og
- Full spec: `docs/architecture/ARCHITECTURE.md`

**Revenue Model**: Multi-stream (affiliates + digital products + consulting + email)

**Risk Tier**: MEDIUM (basic accounts — email, preferences)

**Strategic Assets**:
- HavenWizards: backend execution partner (referenced without bias)
- Bayanihan Harvest: proof of systems depth

---

## FILE-PATH ROUTING (Governance Auto-Load by File Pattern)

When working on these file paths, automatically load the specified governance doc BEFORE making changes.

| File Pattern | Load | Why |
|---|---|---|
| `docs/content/**` | `docs/content/CONTENT_GOVERNANCE.md` | Editorial rule enforcement |
| `**/*.md` (content files) | `docs/content/CONTENT_GOVERNANCE.md` | All markdown content subject to editorial gate |
| `src/app/**/page.*` | `docs/governance/TECH_BEST_PRACTICES.md` | Next.js page conventions (when stack exists) |
| `src/app/api/**` | `docs/governance/TECH_BEST_PRACTICES.md` | API route conventions |
| `src/middleware.*` | `docs/governance/TECH_BEST_PRACTICES.md` + security registry | Middleware security |
| `database/migrations/**` | DB failure registry | Migration safety |
| `supabase/migrations/**` | DB failure registry | Migration safety |
| `src/styles/**` | Design-OS + token-lint.sh | Token enforcement |
| `tailwind.config.*` | Design-OS | Token enforcement |
| `tests/**` | `docs/governance/PIPELINE_COMPLIANCE.md` | Testing gate compliance |
| `docs/design/**` | `docs/design/DESIGN_AUTHORITY.md` | Design authority precedence |
| `.github/workflows/**` | `docs/devops/DEVOPS_FAILURE_REGISTRY.md` | CI/CD safety |

---

## ON-DEMAND GOVERNANCE LOADING

Load these documents ONLY when the task specifically requires them. Never pre-load.

| Domain | Trigger | Load |
|---|---|---|
| Content | Any content creation, editorial review | `docs/content/CONTENT_GOVERNANCE.md` |
| SEO | Any public-facing page or route work | `docs/marketing/seo-quick-reference.md` |
| Security | Auth, data, encryption, API security | `docs/security/SECURITY_FAILURE_REGISTRY.md` |
| Database | Schema changes, migrations, queries | `docs/database/DB_FAILURE_REGISTRY.md` |
| API | Endpoint creation, contracts | `docs/api/API_FAILURE_REGISTRY.md` |
| Design | UI components, layout, styling | `docs/design/DESIGN_FAILURE_REGISTRY.md` |
| DevOps | CI/CD, deployment, infrastructure | `docs/devops/DEVOPS_FAILURE_REGISTRY.md` |
| Integration | External services, webhooks | `docs/integration/INTEGRATION_FAILURE_REGISTRY.md` |
| Performance | Bundle size, CWV, image optimization | `docs/performance/PERF_FAILURE_REGISTRY.md` |
| **Testing (any)** | **Starting any test task in testing phase** | **`testing-strategy.skill` (Test Data Reality Levels + Seed Data Quality) + `docs/governance/PHASE_GATES.md` Gate 4a Section G (Test Data Reality) + STOP S13 enforcement — verify test DB connection BEFORE writing any test** |
| **Seed data creation** | **Creating seed/fixture data, factory functions, or initial content** | **`testing-strategy.skill` §Seed Data Quality + `docs/content/CONTENT_GOVERNANCE.md` (if exists) + `docs/marketing/seo-quick-reference.md` (if public-facing entities) — seed data = production content, apply ALL content governance** |
| Phase gate | Phase advance, gate evaluation | `docs/governance/PHASE_GATES.md` |
| PRD | PRD creation, requirements review | `docs/planning/PRD.md` + `docs/planning/DISCOVERY_BRIEF.md` |
| Architecture | System design, technology decisions | `docs/architecture/ARCHITECTURE.md` |

---

## PHASE GATE ENFORCEMENT

Current phase: **testing (active)** → Next: **deployment**

```
Phase 0: Discovery    → COMPLETE ✓ (DISCOVERY_BRIEF.md created)
Phase 1: PRD          → COMPLETE ✓ (PRD.md v1.0, Gate 1 PASS 11/11)
Phase 2: Architecture → COMPLETE ✓ (ARCHITECTURE.md v1.0, Gate 2 PASS CONDITIONAL)
Phase 3: Design       → COMPLETE ✓ (DESIGN_OS.md + AI_EXECUTION_SHEET + PAGE_SPECS, Gate 3a PASS 15/15, Gate 3b PASS 8/8)
Phase 4: Development  → COMPLETE ✓ (App scaffolded, Gate 4 PASS 7/7, 76/76 tests passing, build clean)
Phase 5: Testing      → ACTIVE ✓ (76/76 unit+component passing, E2E skeletons ready, Gate 4a pending)
Phase 6: Deployment   → LOCKED (Gate 4a required)
Phase 7: Launch       → LOCKED
```

**Build commands** (now active):
- Dev: `npm run dev` (Next.js 15 + Turbopack)
- Build: `npm run build` (Velite → Next.js)
- Type check: `npm run type-check`
- Lint: `npm run lint`

**Gate authority**: `docs/governance/PHASE_GATES.md` (10 gates defined)
**Phase state**: `docs/governance/PROJECT_STATE.json` (single source of truth)

### Phase Refusals (Current: Testing Active)

| Action | Blocked | Reason |
|--------|---------|--------|
| Deploy to production | YES | Gate 4a testing verification not yet passed |
| Use raw Tailwind color classes | YES | Design-OS token enforcement (permanent) |
| Approximate DB column names | YES | Must use exact names from database.types.ts (permanent) |
| Add mock data to production code | YES | Gate 3c enforcement (permanent) |
| Ship without E2E tests passing | YES | Gate 4a Section A requirement |

**Override**: `"override: [reason]"` → logged in PROJECT_STATE.json phase_history.

### SEO-by-Construction (Active — SEO Domain Active)

SEO is embedded at EVERY phase, not added post-launch:

| Phase | SEO Requirement |
|-------|----------------|
| PRD (Gate 1) | SEO strategy section: target keywords, URL hierarchy, content discoverability |
| Architecture (Gate 2) | Route hierarchy with URL structure, sitemap approach, structured data plan |
| Design (Gate 3a) | Single h1 per page, heading cascade, content-first, semantic HTML |
| Development (Gate 4) | Metadata exports, Open Graph, canonical URLs, JSON-LD |
| Launch (Gate 6) | Sitemap submitted, Lighthouse SEO >= 90, structured data validated |

---

## CONTENT GOVERNANCE ENFORCEMENT (Content Platform — ALWAYS ACTIVE)

AHAeCommerce is a content-authority platform. Content governance is not optional.

**ALWAYS load before any content work**: `docs/content/CONTENT_GOVERNANCE.md`

**Hard gates (cannot be skipped)**:
1. **Editorial Rule**: Does this article clarify a decision, prevent a mistake, reveal a cost, or explain a trade-off? If NO → refuse to publish
2. **Scope Rule**: Is this within A–Z Decision/System/Reality framework? If NO → out of scope
3. **The Practitioner Test**: Would a seasoned eCommerce operator find this useful and non-obvious?

---

## OPERATIONS (MCP Servers & Tools)

**MCP Configuration**: `.mcp.json` (project-level, to be populated during architecture phase)

**Available at init**:
- Context7 MCP: documentation lookup (detected via global settings)
- File system (always)
- Git (always)
- Bash (always)

**Expected integrations (to add during architecture)**:
- Supabase MCP: when database is provisioned
- GitHub MCP: when CI/CD is configured
- Vercel MCP: when deployment is configured

**Build commands** (TBD — to be populated during architecture):
- Dev: `npm run dev` (Next.js expected)
- Build: `npm run build`
- Test: `npm run test`

---

## AGENT ORCHESTRATION

When spawning Task agents (subagents via the Task tool):

**ALWAYS inject into every agent prompt**:
1. Current phase from `docs/governance/PROJECT_STATE.json`
2. Hot files from `memory/patterns.md` (those with high blast radius)
3. Relevant domain LL summaries from `memory/MEMORY.md` (~50 tokens per domain)
4. Tech stack constraints from `docs/governance/TECH_BEST_PRACTICES.md` (if development phase)

**Relevance filter is mandatory** — only inject what the agent needs for its specific task.

---

## MACHINE ROLE ENFORCEMENT (SyncNode Active)

Machine role architecture detected: `~/SyncNode/GlobalGovernance/machine-registry/`

| Operation | Authority (M5) | Builder (M4/W1) | Executor |
|-----------|----------------|-----------------|----------|
| git push to main | Yes | No | No |
| governance mutation (CLAUDE.md, PHASE_GATES.md) | Yes | ESCALATE only | No |
| run allowlisted commands | Yes | Yes | Yes |
| create/approve proposals | Yes | DRAFT only | No |
| run bootstrap | Yes | Yes | Yes |
| economic governor config | Yes | No | No |
| generate governance hash | Yes | No | No |

**Role detection**:
1. Read `~/SyncNode/GlobalGovernance/machine-registry/profiles/$(hostname).json`
2. Extract "role" field
3. If not found: default to "builder"
4. If attempting authority-only operation as builder: ESCALATE — never proceed silently

**Cross-Machine Identity Rule (LL-GOV-022)**: Never re-ask machine identity if documented in machine-registry. Read it.

### STOP Conditions Exposure (S1–S13)

For the full STOP conditions table, see **`docs/governance/CONTEXT_ENGINE.md`** Section 4.
Key STOP conditions enforced by CLAUDE.md rules:
- **S1**: Phase gate blocks implementation before development phase *(FIXABLE — agent creates missing artifact autonomously)*
- **S4**: Missing BOOTSTRAP_STATE.json halts all execution *(FIXABLE — run bootstrap.sh)*
- **S5**: Hash verification failure halts all execution *(FIXABLE on M5 / ESCALATE on M4/W1)*
- **S6**: M5-only operation on non-authority machine must ESCALATE *(ESCALATE — never proceed silently)*
- **S10**: Economic Governor budget exceeded auto-downgrades Tier 2 to Tier 1 *(AUTO — silent downgrade)*
- **S11**: DIOSH Operations sequence skipped before gate refuses the gate *(FIXABLE — execute DIOSH sequence)*
- **S13**: Test database connection failure blocks ALL testing work *(SPLIT — ask human for credentials in plain language, then fix autonomously)*. See STOP Recovery Intelligence section below. (LL-GOV-023/LL-GOV-025)

### STOP Recovery Intelligence (LL-GOV-025)

> **Governance is invisible to the human. The AI is the governance expert.**
> When the AI hits a STOP, it does NOT dump governance jargon at the human.
> It classifies the STOP, fixes what it can autonomously, and communicates
> in plain language only when it genuinely needs something from the human.

#### STOP Classification

| STOP | Type | Agent Behavior |
|------|------|---------------|
| **S1** | **FIXABLE** | Create missing artifact autonomously if possible. Inform human in plain language only if phase work is genuinely incomplete. |
| **S4** | **FIXABLE** | Run `bootstrap.sh`. Inform human only if setup fails. |
| **S5** | **FIXABLE (M5) / ESCALATE (other)** | On M5: run `generate_hash.sh`. On M4/W1: escalate. |
| **S6** | **ESCALATE** | "This operation needs to run on [machine]. I can prepare everything here — you'll just need to run one command there." |
| **S10** | **AUTO** | Auto-downgrade Tier 2 → Tier 1. No human interaction. Log silently. |
| **S11** | **FIXABLE** | Execute DIOSH sequence (Refiner → Polisher → Verifier). No human interaction. |
| **S13** | **SPLIT** | Ask human for credentials in plain language. Fix mock tests autonomously after credentials obtained. |

#### Recovery Type Definitions

| Type | Human Interaction |
|------|-------------------|
| **FIXABLE** | None — fix silently, log what was done, continue |
| **AUTO** | None — happens automatically |
| **CREDENTIAL** | Minimal — ask in plain language, explain why, wait |
| **ESCALATE** | Inform — tell human what needs to happen and where |
| **SPLIT** | Ask once for the human part, then fix the rest autonomously |

#### Human Communication Protocol (LL-GOV-025)

**Rule**: The human does NOT need to understand governance phases, gate numbers, STOP codes, or anti-pattern IDs. Translate governance into plain language.

```
INSTEAD OF (governance jargon — NEVER show this to human):
  "STOP S13: Test database connection failed. Gate 4a Section G requires real test DB
   connection. Anti-patterns #56-60 prohibit mock database in L3/L4 tests."

SAY THIS (plain language):
  "The tests are currently using simulated data instead of a real database,
   which means they can't catch real bugs. I need a test database to connect to.

   Could you create a Supabase test project and share the connection URL?
   I'll handle everything else from there."
```

**Autonomous Fix Rule**: When FIXABLE STOP encountered — do NOT display the STOP code, fix it, log it internally, continue. Only mention if the fix changed something the human should be aware of.

**Phase Confusion Prevention**: Never expose phase/gate terminology to the human.
- INSTEAD OF: "Gate 3c Pre-Implementation Verification needs to pass first."
- SAY: "I need to verify the database is set up correctly before I start building."

---

## ANTI-HALLUCINATION (Active — Mandatory)

**5-Verify Protocol** (required before any claim of completion):
1. GLOB verify — file must exist on filesystem
2. READ verify — content must match what was claimed
3. COMMIT verify — git log must show the commit hash (if committed)
4. HASH verify — if governance file changed, hash must be current
5. OUTPUT verify — if script was run, show actual output

**Auto-blocked patterns**:
- "I've created [file]" → Must Glob first, then say "Created — confirmed at [path]"
- "This is already done" → Must cite git log hash
- "I'll remember this" → Write it to MEMORY.md instead

---

## ENFORCEMENT CHECKPOINTS

### Pre-Task (Every Tier 2+ task)
| Check | Trigger | Action |
|-------|---------|--------|
| **Governance freshness (LL-GOV-028)** | **Testing phase work, STOP recovery, gate evaluation** | **Compare CLAUDE.md template version vs `~/.claude/templates/CLAUDE-TEMPLATE.md`** — **PAUSE + auto-update if stale** |
| Phase gate | Any implementation task | Read PROJECT_STATE.json → verify current_phase |
| Registry scan | Domain task (content, DB, API, design, devops) | Grep domain failure registry |
| Investigation-first | Fix/debug/troubleshoot | Read debugging-playbook.md §1 + §2 BEFORE code changes |
| Tech stack constraints | Any code generation | Read TECH_BEST_PRACTICES.md (development phase only) |
| Content scope | Any content task | Verify against DISCOVERY.md editorial rule |

### Testing Phase Entry Checkpoint (STOP S13 — Before ANY Testing Work)

> **LL-GOV-023**: This checkpoint is the testing-phase equivalent of Gate 3c for development.
> Without it, AI agents write tests that mock the database — producing "100% pass" results
> that prove nothing about real system behavior.

| Check | When | How | Enforcement |
|-------|------|-----|-------------|
| Test DB connection | First testing task in session | Execute `SELECT 1` against test DB connection string | **HARD STOP S13** if fails — do NOT proceed |
| Test DB technology parity | First testing task in session | Compare test DB engine vs architecture spec | **HARD STOP S13** if mismatch (SQLite ≠ PostgreSQL) |
| Test DB schema parity | First testing task in session | Compare test DB tables/columns vs production schema | WARN if drift — run migrations first |
| Mock detection (L3/L4 files) | Before running integration/E2E tests | Grep test files for `jest.mock`/`vi.mock` of DB clients | REFUSE to run until mocks removed from L3/L4 |
| E2E interceptor detection | Before running E2E tests | Grep E2E files for `msw`/`cy.intercept`/`nock` | REFUSE to run until interceptors removed |

**STOP S13 Protocol** (Testing Phase HARD STOP — Type: SPLIT):

Internal (log only — do NOT show governance codes to human):
`STOP S13: Test database connection failed. Type: SPLIT (CREDENTIAL + FIXABLE).`

Human-facing message (plain language — LL-GOV-025):
```
"The tests are currently using simulated data instead of a real database,
which means they can't catch real bugs. I need a test database to connect to.

Could you create a Supabase test project (separate from production) and share
the connection URL? I'll handle everything else from there — setting up the
test data, fixing the tests, and verifying everything works."
```

Protocol:
1. Detect: test DB connection fails, or mock-only tests exist, or no test DB configured
2. Communicate: plain language message above (adapt to project's technology)
3. **FULL STOP**: Do NOT produce ANY test artifacts until resolved. This means:
   - Do NOT write "UI-only" E2E tests as a workaround
   - Do NOT create "partial" test suites that avoid the backend
   - Do NOT label any gate as "partial activation" or "conditional"
   - Do NOT use `page.route()` interceptors to prevent API calls in E2E tests
   - The ONLY acceptable action is: inform the user and WAIT
4. Wait: for user to provide credentials or resolve the blocker
5. Verify: `SELECT 1` succeeds against real test database
6. Auto-recover: execute STOP S13 Recovery Protocol (6 steps — autonomous, no further human input)
7. Report: "Got it. I've connected to the test database, updated [N] tests to use real data, and they all pass. Ready to continue?"

**STOP S13 Workaround Detection (LL-GOV-029):**
The #1 way AI agents bypass STOP S13 is by reframing the work:
- "I'll write E2E tests that only test UI behavior" ← MOCKING BY OMISSION (Anti-Pattern #62)
- "Gate 4a — partial activation" ← INVALID STATE (Anti-Pattern #63)
- "Happy-path tests belong in integration, E2E stays UI-only" ← SCOPE SPLITTING to avoid the STOP
- "I'll use `page.route()` to intercept and prevent API calls" ← SAME as cy.intercept (Anti-Pattern #59)

If the AI produces ANY test file while STOP S13 is active, it has violated the STOP.
The correct behavior is: inform the user of the blockers and WAIT.

**When this runs**: Once per session when `current_phase = "testing"` and first test-related task starts.
After initial verification passes, it does not re-run unless the session restarts.

### Single-DB Safety Protocol (LL-GOV-026 Override for Cost-Constrained Projects)

> **When separate test database is too costly**, a project may declare `"test_db_strategy": "single-db"`
> in `PROJECT_STATE.json`. This is a documented override, NOT an excuse to skip testing governance.

**Activation**: `PROJECT_STATE.json` contains `"test_db_strategy": "single-db"` with:
- `"reason"`: Why separate DB is not feasible (e.g., "free tier, single Supabase project")
- `"risk_accepted"`: "Tests share production database. Cleanup failure = production data corruption."
- `"date"`: When the override was approved

**Single-DB test safety rules** (ALL mandatory):
1. **Transaction wrapping**: Every L3/L4 test MUST run inside a database transaction that rolls back after assertions. Never rely on manual cleanup (DELETE/TRUNCATE).
2. **Test data markers**: If transaction rollback is not possible, test records MUST use identifiable markers (e.g., `email: 'test-*@test.internal'`) so orphaned test data is identifiable.
3. **No destructive operations**: Tests MUST NOT run DROP TABLE, TRUNCATE, or DELETE without WHERE clause against the shared database.
4. **Cleanup verification**: After each test file, verify that no test records remain.
5. **Production data protection**: Tests MUST NOT modify or delete rows that existed before the test run.

**When to escalate to separate DB**: If the project has real users with real data in production, single-DB becomes dangerous. Escalate when any of: >100 production rows, paying customers exist, data is regulated (PII/financial).

### Seed Data Quality Governance (LL-GOV-029 — Seed Data = Production Content)

> **Philosophy**: Every seed record is a production record waiting to launch.
> Work done during testing should be directly usable in production — no wasted tokens, no rework.

**Activation**: ANY task that creates seed data, test fixtures, factory functions, or initial content records.

**Core rule**: Seed data MUST meet the SAME quality standards as production content. If the project has:
- `CONTENT_GOVERNANCE.md` → seed copy must pass its rules (tone, brand voice, accuracy)
- `seo-quick-reference.md` → seed records for public entities must have SEO metadata
- `DESIGN_OS.md` → seed images/assets must align with brand visual language

**Seed Data Quality Checklist**:

| Check | Applies To | Requirement |
|-------|-----------|-------------|
| Brand-aligned copy | ALL seed text content | Real product descriptions, real headlines, correct brand voice. No lorem ipsum, no "Test Product 1" |
| SEO metadata | Public-facing entities | Title tag, meta description, OG image, structured data fields populated with real values |
| Image/asset quality | ALL seed images | Production-quality OR explicitly marked `[ASSET_PENDING]` with replacement plan |
| Content governance compliance | ALL seed text (if CONTENT_GOVERNANCE.md exists) | Passes same rules as user-generated content |
| URL slug quality | Public-facing entities with URLs | SEO-friendly slugs (lowercase, hyphenated, keyword-rich) — not UUIDs or auto-generated |

**What this does NOT do**:
- Does not require pixel-perfect marketing copy in test factories (factory defaults can be simpler)
- Does not block L1/L2 unit tests (they use mock data by nature)
- Does not apply to ephemeral test records created and deleted within a single test run
- DOES apply to seed scripts, demo data, initial content, and any data that persists in the database after testing

### Mid-Session Governance Freshness (LL-GOV-028)

> **Problem this solves**: Sessions loaded an older CLAUDE.md. The AI doesn't know about new rules.

**Trigger**: Before ANY of these actions, re-check governance freshness:
- Gate evaluation (Gate 1-5)
- STOP recovery protocol execution
- Testing phase work (L3/L4 test execution)
- Phase advancement

**Check procedure**:
1. Read `~/.claude/templates/CLAUDE-TEMPLATE.md` line 3 → extract template version
2. Read project `CLAUDE.md` → extract template version
3. If project version < template version: PAUSE, display "I found newer governance rules. Updating now.", run update, RESUME
4. If versions match: proceed silently

### Mid-Task
| Check | Trigger | Action |
|-------|---------|--------|
| Backend-first | Frontend task | Verify: DB schema → API route → types → page scaffold |
| Design fidelity | UI scaffolding | Verify: DESIGN_OS tokens used, not placeholder divs |
| Token enforcement | Styling task | Run `scripts/token-lint.sh` (when it exists) |

### Post-Task (Every Tier 2+ task)
| Check | Trigger | Action |
|-------|---------|--------|
| Lesson capture | Significant task | Ask: "What did I learn? Log it." |
| MEMORY.md update | State change | Update §2 Project State, §3 Open Gaps |
| CHANGELOG.md entry | File creation/modification | Add entry under [Unreleased] |

---

## INVESTIGATION-FIRST PROTOCOL (LL-066 — Mandatory)

For ALL fix/debug/troubleshoot tasks:

**BEFORE ANY CODE CHANGES**:
1. Read `memory/debugging-playbook.md` §1 (error signature map) + §2 (decision tree)
2. Check `memory/MEMORY.md` §4 for domain lessons
3. Check `CHANGELOG.md` last 3 entries for recent changes
4. State root cause hypothesis
5. Map impact surface BEFORE fixing

**Wave 2 (Tier 2+ fix tasks)**:
5. Check domain failure registry
6. Determine the layer (shared types → components → business → backend)
7. Fix at the earliest layer first

**Anti-Pattern**: Jumping to code changes before root cause analysis = governance violation.

---

## SKILL WORKFLOW CHAINS

Load the chain for your task type. File-path routing auto-selects the right chain.

| Task Type | Skill Chain | Min Tier |
|-----------|-------------|----------|
| **Bug Fix / Troubleshoot** | Investigation Sweep (mandatory) -> file-path routing | 1 |
| **UI Component** | `design-intelligence` -> `frontend-design` -> `frontend-executor` -> `design-judgment` | 2 |
| **UI Page** | `design-intelligence` -> `frontend-design` -> `frontend-executor` -> `design-judgment` -> `verifier` | 3 |
| **Backend API** | `backend-executor` -> `verifier` | 2 |
| **Database/Migration** | `supabase-postgres-best-practices` -> `migration-safety-agent` (Task agent) | 2 |
| **Content/Copy** | `content-executor` | 2 |
| **Architecture** | `architect-executor` | 3 |
| **Full Feature** | `architect-executor` -> `backend-executor` -> `design-intelligence` -> `frontend-design` -> `frontend-executor` -> `design-judgment` -> `verifier` | 3 |
| **DevOps/CI** | `devops-executor` -> `verifier` | 2 |
| **PRD Work** | `product-advisor` -> `prd-framework` | 3 |
| **Testing Strategy** | `testing-strategy` -> STOP S13 (test DB verification) -> test writing | 2 |
| **Testing Execution** | STOP S13 (test DB verification) -> `testing-strategy` (L1-L4 classification) -> `verifier` | 2 |
| **Phase Advancement** | `diosh-execution` -> `phase-gate` | 3 |
| **Seed Data Creation** | `testing-strategy` §Seed Data Quality -> `content-executor` (if CONTENT_GOVERNANCE exists) -> SEO verification (if public entities) | 2 |
| **Deployment to Production** | `deployment-launch` §Content Continuity -> `deployment-launch` §SEO Launch -> `verifier` | 3 |
| **Post-Launch** | `deployment-launch` §Post-Launch Intelligence -> monitoring setup -> `verifier` | 3 |

### Platform Skill Loading (Auto-Load by Dependency)

| Dependency | Skill |
|------------|-------|
| next | `next-best-practices` |
| react 19+ | `vercel-react-best-practices` |
| tailwindcss v4 | `tailwind-v4-shadcn` |
| @supabase/supabase-js | `supabase-postgres-best-practices` |
| playwright | `webapp-testing` |

---

## DOCUMENTATION INDEX

| Document | Path | Purpose |
|----------|------|---------|
| Discovery Brief | `docs/planning/DISCOVERY_BRIEF.md` | Phase 0 — 15-section enterprise discovery |
| DISCOVERY.md | `DISCOVERY.md` | Scope lock — canonical A–Z definition (read-only) |
| Phase Gates | `docs/governance/PHASE_GATES.md` | 10 gate definitions |
| Phase State | `docs/governance/PROJECT_STATE.json` | Single source of truth for lifecycle |
| Refusal Conditions | `docs/governance/REFUSAL_CONDITIONS.md` | Hard gates |
| Registry Status | `docs/governance/REGISTRY_STATUS.md` | Domain registry health |
| Agent Capability | `docs/governance/AGENT_CAPABILITY_LEVEL.md` | MCP level + behavioral implications |
| Content Governance | `docs/content/CONTENT_GOVERNANCE.md` | Editorial rules, scope, practitioner test |
| CONTEXT_ENGINE | `docs/governance/CONTEXT_ENGINE.md` | Session governance (10 sections) |
| Lessons Learned | `docs/governance/LESSONS_LEARNED_SYSTEM.md` | Registry system guide |
| Intelligence Map | `memory/MEMORY.md` | Cross-session behavioral directives |
| Technical Patterns | `memory/patterns.md` | Codebase mental map |
| Debugging Playbook | `memory/debugging-playbook.md` | Error signatures, decision trees |
| SEO Reference | `docs/marketing/seo-quick-reference.md` | SEO implementation patterns |

### DIOSH Framework
| Document | Path | Purpose |
|----------|------|---------|
| DIOSH Spine | `~/.claude/templates/DIOSH.md` | Canonical D-I-O-S-H reference (load on-demand) |
| Phase Contract | `~/.claude/templates/DIOSH_PHASE_CONTRACT.template.md` | Phase contract template |

---

## UNIVERSAL ANTI-PATTERNS

These are permanent violations regardless of phase:

1. **Never commit `.env` or secrets** — irreversible once pushed
2. **Never force-push to main** — destructive, can lose team work
3. **Never drop RLS without explicit confirmation** — data exposure risk
4. **Never delete production data without backup** — irreversible
5. **Never auto-pass gates** — evaluate each item, never assume PASS
6. **Never skip editorial rule check** — content without a decision/mistake/cost/trade-off is out of scope
7. **Never scaffold frontend before backend schema** — pages query DB; if tables don't exist, scaffold is broken
8. **Never claim a task is done without artifact verification** — Glob verify first
9. **Never say "I'll remember this"** — write to MEMORY.md or a file
10. **Never load >5 governance docs without verifying tier** — over-loading = governance waste
11. **Never re-ask machine identity if documented** — read machine-registry profile (LL-GOV-022)
12. **Never skip investigation-first for fix tasks** — debugging-playbook.md §1+§2 first (LL-066)
13. **Never create tech debt by approximating column names** — use exact names from database.types.ts
14. **Never treat build/tsc passing as proof of full toolchain readiness** — lint + test must each be verified (LL-062)
15. **Never add content that fails the practitioner test** — only publish if a seasoned eCommerce operator would find it useful
56. **Never mock the database layer in integration or E2E tests** — unit tests (L1) may mock external services, but integration (L3) and E2E (L4) tests MUST connect to a real database of the SAME technology as production. In-memory SQLite substituting for PostgreSQL is a mock, not a test. If you can't connect, STOP and ask for credentials (STOP S13) (LL-GOV-023)
57. **Never use `jest.mock()`, `vi.mock()`, or equivalent to mock database clients/ORMs in integration tests** — if you need to mock the database, you're writing a unit test, not an integration test. Rename it or connect to a real database (LL-GOV-023)
58. **Never mark the testing phase complete without proving test database connection** — "all tests pass" means nothing if tests never touched the real database. Test output MUST include connection evidence (database URL logged, query count > 0, or connection log captured). STOP S13 blocks all testing work until test DB is connected (LL-GOV-023)
59. **Never use network request interceptors (MSW, cy.intercept, nock) in E2E tests to mock API responses** — E2E means end-to-end. If the API response is mocked, it's not E2E. E2E tests must run the actual API server connected to a test database (LL-GOV-023)
60. **Never proceed with testing if test database connection fails** — this is STOP S13, the testing-phase equivalent of Gate 3c's HARD STOP. Do not write mock tests as a workaround. Do not skip database tests. Do not continue until the user provides real test database credentials and connection is verified with an actual query (LL-GOV-023)
61. **Never run integration or E2E tests against the production database without explicit single-DB override** — "real database" means a SEPARATE test instance by default. Compare test DB URL against production DB URL before running any test. If they match (same project ID, same host, same dbname), PAUSE and check: does `PROJECT_STATE.json` have `"test_db_strategy": "single-db"`? If YES: proceed with Single-DB Safety Protocol (above). If NO: HARD STOP — request either a separate test database OR explicit single-DB override with documented risk acceptance. (LL-GOV-026 + LL-GOV-028 override provision)
62. **Never write "UI-only" or "partial" tests as a workaround when STOP S13 fires** — if the database is unreachable or has no data, the correct action is FULL STOP + inform the user. Writing E2E tests that skip API calls, creating "UI behavior only" test suites, or producing any test artifact that avoids the real backend is MOCKING BY OMISSION. STOP means STOP — not "continue with a different kind of test" (LL-GOV-029)
63. **Never use "partial gate activation", "conditional pass", or any non-binary gate state** — gates are PASS or FAIL. There is no "Gate 4a — partial activation." If the gate cannot pass, it FAILS. Inventing intermediate states is governance fabrication (LL-GOV-029)
64. **Never use lorem ipsum, placeholder text, or dummy content in seed/test data** — seed data IS initial production content. Every seed record must have real, brand-aligned copy that meets content governance standards (LL-GOV-029)
65. **Never create seed data without SEO metadata (title, description, OG tags, structured data)** — if a seed record represents a public-facing entity, it MUST have production-grade SEO metadata from day one. Seeds without metadata = invisible pages at launch (LL-GOV-029)
66. **Never seed images/assets with generic placeholders (placeholder.com, via.placeholder, picsum)** — seed assets must be production-quality or explicitly marked as `[ASSET_PENDING]` with a documented replacement plan (LL-GOV-029)
67. **Never bypass content governance review for seed data** — seed data follows the SAME content governance rules as user-generated content. If `CONTENT_GOVERNANCE.md` exists, seed data must pass it. "It's just test data" is how lorem ipsum reaches production (LL-GOV-029)

---

## VERSION HISTORY (This Project)

| Date | Event | By |
|------|-------|-----|
| 2026-02-28 | initialize-governance v20.0 — fresh scaffold, Phase 0 complete | initialize-governance |
| 2026-02-28 | update-governance v14.0 — v41.1 → v42.0 (LL-GOV-023 Test Data Reality: STOP S13, anti-patterns #56-60, Testing Phase Entry Checkpoint, STOP Conditions Exposure section) | update-governance |
| 2026-02-28 | update-governance v14.0 — v42.0 → v43.0 (LL-GOV-025 STOP Recovery Intelligence + Human Communication Protocol; LL-GOV-026 Test DB Isolation anti-pattern #61 + STOP S13 isolation check) | update-governance |
| 2026-02-28 | update-governance v14.0 — v43.0 → v45.0 (LL-GOV-028 Mid-Session Governance Freshness + Single-DB Safety Protocol; LL-GOV-029 Seed Data Quality + STOP S13 Workaround Detection + anti-patterns #62-67; Skill Workflow Chains + Platform Skill Loading) | update-governance |
