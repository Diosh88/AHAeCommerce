# Phase Gates — AHAeCommerce

**Version:** 2.7
**Authority:** CLAUDE.md PHASE GATE ENFORCEMENT section
**Loaded:** On-demand when phase advancement or task enforcement is needed
**Created:** 2026-02-28 by initialize-governance v20.0
**Changelog:** v2.7 (2026-02-28): LL-GOV-026 Test Database Isolation — Gate 4a Section G item G6 added (test DB URL ≠ production DB URL). HARD STOP if test runs against production. Evidence block MUST include both URLs for comparison.
**Changelog:** v2.6 (2026-02-28): LL-GOV-024 STOP S13 Recovery Protocol cross-reference — Gate 4a Section G HARD STOP Rule now points to 6-step recovery sequence (audit → infrastructure → remediate → evidence). Agent knows what to do AFTER credentials obtained.

---

## DIOSH Pre-Gate Checklist (Applies to ALL Gates)

> **Immutability Rule**: DIOSH enforces prerequisites before gates. It CANNOT modify gate logic.
> Gates are stable governance artifacts. DIOSH wraps them — it does not replace or mutate them.
> **Reference**: `~/.claude/templates/DIOSH.md` (Canonical DIOSH v1.0)

Before evaluating ANY gate, the following DIOSH prerequisites must be satisfied for the current phase:

| # | Prerequisite | Check |
|---|-------------|-------|
| 1 | **Declarations (D)** complete for current phase | Scope, inputs, dependencies documented |
| 2 | **Infrastructure (I)** validated | Tools, environments, prior handoff received |
| 3 | **Operations (O)** completed | Refiner → Polisher → Verifier sequence done (all three) |
| 4 | **Safeguards (S)** verified | Security ✓ Growth ✓ Platform ✓ Performance ✓ Monetization ✓ |
| 5 | **Hand-off artifacts (H)** ready | Outputs complete for gate review |

**Enforcement**: If any DIOSH prerequisite fails, the gate evaluation does NOT proceed.

---

## Gate 1: Compound Business Checklist (PRD → Architecture)

**Template**: `~/.claude/templates/COMPOUND_BUSINESS_CHECKLIST.template.md`
**Threshold**: 8 of applicable items must PASS (N/A items excluded from count)
**Output**: `docs/planning/COMPOUND_BUSINESS_CHECKLIST.md`

### 11 Checklist Items

1. Revenue architecture has 2+ streams identified
2. Growth loop identified (content/product/network/marketplace)
3. Primary user persona quantified (audience size + pain cost)
4. Kill criteria defined (when to stop)
5. Metrics are measurable (not aspirational)
6. Dependencies mapped with fallbacks
7. Scope has explicit "NOT building" section
8. Phased execution plan (not "build everything at once")
9. Second-order effects considered
10. Accessibility requirements declared (target WCAG level, assistive tech scope, keyboard nav)
11. Data sensitivity classified (Risk Tier MEDIUM+) — PII types listed, regulatory requirements identified

### Conditional Evaluation Rules

- Items #1 and #2 can be N/A for internal tools with no revenue model (requires justification)
- Item #10 is N/A for CLI/API-only projects with no UI
- Item #11 is N/A if Risk Tier = LOW (no user data)
- N/A items reduce the denominator

**AHAeCommerce context**: All 11 items are applicable (MEDIUM risk, content platform, multi-stream revenue, public UI).

**Gate Logic**: Count PASS items vs applicable items. If >= 8/applicable: PASS. If < 8: FAIL.

---

## Gate 2: Expansion Test (Architecture → Design)

**Template**: `~/.claude/templates/EXPANSION_TEST.template.md`
**Threshold**: Must be PASS or CONDITIONAL (FAIL blocks)
**Output**: `docs/planning/EXPANSION_TEST.md`

### 6 Dimensions (Evaluated at 10x Scale)

1. **Users** — concurrent, total, auth sessions at 10x
2. **Data Volume** — rows, storage, ingestion at 10x
3. **API Load** — rps, peak ratio, webhooks at 10x
4. **Third-Party Dependencies** — rate limits, cost at 10x
5. **Cost** — hosting, DB, APIs, storage at 10x
6. **Team/Operations** — support, deploys, monitoring at 10x

**Gate Logic**:
- PASS: All dimensions LOW/MEDIUM
- CONDITIONAL: 1-2 HIGH with documented mitigations
- FAIL: Any CRITICAL or 3+ HIGH (blocks advance)

---

## Gate 3a: Design Completeness (Design → Development, Part 1)

**Template**: `~/.claude/templates/DESIGN_COMPLETENESS_GATE.template.md`
**Threshold**: All 15 items must PASS
**Output**: `docs/planning/DESIGN_COMPLETENESS_GATE.md`

### 15 Checklist Items

1. Design-OS created with project-specific tokens
2. Audience profiles defined
3. Every page from architecture has a page spec
4. Every page spec has all 6 states (default, empty, loading, error, offline, permission-denied)
5. Every page spec has mobile-first layout (375px baseline)
6. Every page spec has information hierarchy locked
7. Navigation pattern selected from allowed list
8. Page types correctly classified
9. Platform compliance noted per page
10. Component inventory identified (shared vs page-specific)
11. Design Canon identified
12. Self-rejection loop passed (10 questions, all correct)
13. Accessibility requirements per page
14. No unjustified one-off components
15. Grayscale test passes (hierarchy holds without color)

**Gate Logic**: All 15 must PASS. Any FAIL blocks advance.

---

## Gate 3b: Security Readiness (Design → Development, Part 2)

**Threshold**: All 8 items must PASS
**Runs**: AFTER Gate 3a passes. Both 3a AND 3b required to advance to development.
**Output**: Recorded in `PROJECT_STATE.json` `gate_results.design_to_development_security`

### 8 Security Checklist Items

1. Authentication model defined (provider, session strategy, token storage)
2. Authorization model defined (RBAC/ABAC/RLS, roles, protected routes)
3. RLS policies designed (every table with user data has policy spec)
4. Input validation schemas defined (every API endpoint has Zod spec)
5. API security requirements documented (rate limiting, CORS, CSRF)
6. Data protection approach specified (encryption, PII, secrets management)
7. Role enforcement mapped to routes (every auth route → required roles)
8. Security test stubs identified (unauth, role escalation, injection, XSS)

**AHAeCommerce context**: MEDIUM risk tier — 6/8 threshold applies. Items #3-4 most critical for email data protection.

**Gate Logic**: All 8 must PASS (MEDIUM risk). Any FAIL → remediate or override with documentation.

---

## Gate 3c: Pre-Implementation Verification (Before First Code Gen)

**Threshold**: All 9 checks must PASS before any code generation begins
**Runs**: Before first frontend page scaffold — not at phase advance
**Enforcement**: `scripts/gate-3c-verify.sh` (when populated)

### 9 Checks

1. **Real database connection verified** — not mocked, not assumed
2. **Migration applied** — tables exist in database
3. **TypeScript types generated** — database.types.ts matches schema
4. **API routes created** — at least one endpoint per page data requirement
5. **Auth middleware wired** — protected routes have auth checks
6. **No mock data in page scaffolds** — pages use real API calls
7. **No approximate column names** — all queries use exact names from types
8. **Architecture alignment** — page scaffold matches architecture page inventory
9. **Toolchain verified** — lint + test + build each pass independently

---

## Gate 3d: Design Contract Enforcement (Before First Frontend)

**Threshold**: All 10 checks must PASS before frontend pages are created
**Runs**: Before first UI component scaffold
**N/A**: If project has no DESIGN_OS

### 10 Checks

1. DESIGN_OS exists with project-specific token values
2. AI_EXECUTION_SHEET.md created (single-page design reference)
3. Design paradigm hook scaffolded (`useDesign` or equivalent)
4. Layout wrapper component exists
5. Token enforcement script (`token-lint.sh`) configured
6. No raw Tailwind color classes in any component (zero tolerance)
7. No arbitrary spacing values (`[17px]` style)
8. All pages use layout wrapper, not ad-hoc layouts
9. Motion budget defined and enforced
10. Typography scale from Design-OS applied to all text elements

---

## Gate 4: Development Completeness (Development → Testing)

**Threshold**: All 7 sections must PASS (A through G)
**Output**: Recorded in `PROJECT_STATE.json` `gate_results.development_to_testing`

### Section A: Functional Readiness (5 items)
- All planned features from EXECUTION_MAP implemented
- All page types from architecture inventory built
- All 6 states per page implemented (default, empty, loading, error, offline, permission-denied)
- Navigation flows complete
- Auth flows implemented and tested manually

### Section B: Quality Readiness (5 items)
- `npm run build` passes without errors
- `npm run lint` passes without errors
- `tsc --noEmit` passes without errors
- No console.error in production build output
- No TODO/FIXME in critical paths

### Section C: Test Readiness (4 items)
- Test files exist for all API routes
- Test files exist for all critical page components
- E2E test skeletons exist for critical user flows
- Security test stubs created (auth, role, injection)

### Section D: Security Verification (3 items)
- No secrets or tokens in source code (grep verified)
- Auth/authz tests pass
- Input validation active on all user-facing endpoints

### Section E: Delivery Completeness (6 items)
- EXECUTION_MAP.md reflects actual delivery state
- All M stories marked `verified` (not just `done`)
- P0 features complete
- P1 features complete or deferred with justification
- CHANGELOG.md updated with all changes
- No orphaned feature branches

### Section F: Backend Reality Verification (6 items — LL-059 + LL-GOV-023)

> If Gate 3c was executed and passed, Section F should also pass. This is the defense-in-depth check.

1. Gate 3c evidence on file (runtime verified, not artifact-only — `pre_implementation_verification` in PROJECT_STATE.json = PASS)
2. Zero mock data in production code paths (Grep for `mock`, `dummy`, `fake`, `placeholder` in route handlers)
3. All column names match database.types.ts exactly
4. RLS policies applied to all user-data tables
5. Supabase client typed with `Database` generic
6. No `jest.mock`/`vi.mock` of database clients in integration/E2E test files (Grep `tests/**/*.test.*` for DB client mock patterns — unit test files may mock, integration/E2E may NOT)

**Mock detection rule**: The old "(test files excluded)" exemption is REMOVED (LL-GOV-023). Mocking the database is acceptable ONLY in unit tests (L1). Integration (L3) and E2E (L4) test files must pass the same mock-data scan as production code.

### Section G: Design Fidelity Verification (6 items — LL-063)
- All pages render with DESIGN_OS visual language (not placeholder divs)
- Token compliance grep passes (zero raw color classes)
- Spacing rhythm matches Design-OS scale
- Typography scale matches Design-OS
- Hover/focus states match Design-OS motion budget
- Verified at 375px, 768px, 1280px breakpoints

**Gate Logic**: All 7 sections must PASS. Any FAIL → remediate or user override (logged).

---

## Gate 4a: Testing Verification (Testing → Deployment)

**Threshold**: All applicable sections must PASS (project-type degradation applies)
**Output**: Recorded in `PROJECT_STATE.json` `gate_results.testing_verification`

### Section A: Test Coverage (5 items)
- `npm test` passes (all tests green)
- `npm run test:e2e` passes
- All API endpoints have passing unit tests
- All critical user flows have passing E2E tests
- Test coverage meets target

### Section B: Security Testing (5 items)
- `npm audit` zero critical/high vulnerabilities
- Auth/authz tested with role-based scenarios
- Input validation tested with malformed data
- Gate 3b security requirements re-verified in running code
- Secret grep shows zero exposed credentials

### Section C: Accessibility Testing (4 items)
- Automated accessibility scan passes (Lighthouse >= 90)
- Keyboard navigation verified on all critical flows
- Screen reader compatibility on data-dense pages
- Color contrast WCAG 2.1 AA compliant

### Section D: Performance Testing (4 items)
- Lighthouse Performance >= 80 on all critical pages
- Core Web Vitals within targets (LCP < 2.5s, INP < 200ms, CLS < 0.1)
- Bundle size within budget
- API response times within targets

### Section E: Visual Regression (3 items)
- All pages verified at 375px, 768px, 1280px
- Token compliance (zero raw Tailwind colors, zero arbitrary spacing)
- Cross-browser (Chrome + Safari minimum)

### Section F: Bug Status (3 items)

1. Zero open critical/high severity bugs
2. All medium bugs triaged — fix or defer with written justification
3. Known issues documented with workarounds in TESTING_HANDOFF.md

### Section G: Test Data Reality Verification (6 items -- LL-GOV-023 + LL-GOV-026) — MANDATORY PREREQUISITE

> **LL-GOV-023 ENFORCEMENT**: This section exists because AI agents write tests that mock the database.
> Gate 3c enforces real backend for development — but nothing stopped tests from mocking everything.
> "76/76 tests pass" means nothing if tests never touched the real database.
> Same pattern as LL-059: structural enforcement beats documentary rules.
>
> **HARD STOP S13**: If test database connection fails during verification, the agent MUST STOP.
> Do not proceed with mock tests. Do not write more tests. Do not continue until:
> 1. Real test database credentials are obtained from the user
> 2. Connection is verified with an actual query
> 3. Schema parity is confirmed
> This is the testing-phase equivalent of Gate 3c's HARD STOP.

| # | Check | How to Verify | PASS Criteria |
|---|-------|---------------|---------------|
| G1 | Test database uses same technology as production | Compare test DB connection string technology against architecture spec | Same engine (PostgreSQL→PostgreSQL, NOT PostgreSQL→SQLite) |
| G2 | Test database connection verified with real query | Execute `SELECT 1` or equivalent against test DB — capture actual output | Query returns result (not connection error, not timeout) |
| G3 | Test database schema matches production | Run pending migrations on test DB, compare table count/names | All production tables exist in test DB with same columns |
| G4 | Zero DB client mocks in L3/L4 test files | Grep integration + E2E test files for `jest.mock`, `vi.mock` of DB client imports | Zero matches (unit test files excluded from this check) |
| G5 | Zero network interceptors in E2E test files | Grep E2E test files for `msw`, `setupServer`, `cy.intercept`, `nock` | Zero matches — E2E tests hit actual API server |
| G6 | Test database is SEPARATE from production (LL-GOV-026) | Compare test DB URL/project-ID against production DB URL/project-ID | Different project IDs / hosts / database names — HARD FAIL if same |

**HARD STOP Rule**: If G1, G2, or G6 fails, the testing phase CANNOT proceed. The agent MUST:
1. If G1/G2 fail: Request test database credentials from user (STOP S13)
2. If G6 fails (test URL = production URL): **IMMEDIATELY STOP** — running tests against production
   is the most dangerous testing anti-pattern. Request a SEPARATE test database from user.
   The agent MUST NOT run any tests until test DB ≠ production DB is confirmed.
3. Wait for credentials / separate project
4. Re-verify G1 + G2 + G6
5. Only then proceed with testing

**After STOP S13 is resolved** (credentials obtained, connection verified): The agent MUST follow the
**STOP S13 Recovery Protocol** (see CLAUDE.md ENFORCEMENT CHECKPOINTS or `testing-strategy.skill`).
The 6-step sequence is: Verify Connection → Verify Schema → Audit Existing Tests → Create Test
Infrastructure → Remediate Mock L3/L4 Tests → Run Suite + Produce Evidence. The agent does NOT
need user permission for recovery steps — they are autonomous. Do NOT skip steps or jump to
writing new tests without auditing and remediating existing mock tests first.

**Verification method**: [PROGRAMMATIC] Execute test DB connection query. Run Grep scans for mock patterns. Compare schema. All evidence must be captured outputs, not assertions.

**N/A Rule**: If project has no database (static site, pure frontend, CLI), Section G scores N/A with justification.

### Evaluation Method

1. **FIRST**: Verify test database connection (Section G, items G1-G2) — HARD STOP if fails
2. Run `npm test` + `npm run test:e2e` → capture exit codes for Test Coverage
3. Run `npm audit` + security test suite + secret grep → capture output for Security Testing
4. Run accessibility scanner (axe-core/Lighthouse) → capture scores for Accessibility Testing
5. Run Lighthouse CLI → capture Performance + CWV scores for Performance Testing
6. Run token compliance greps + capture screenshots for Visual Regression
7. Query issue tracker + review TESTING_HANDOFF → capture bug status
8. Run mock-detection greps (Section G, items G3-G5) → capture results for Test Data Reality

**Anti-Pattern**: NEVER mark a gate section PASS without programmatic evidence or artifact. "I checked" is not evidence. Every PASS must have a captured output, score, or screenshot.

**Gate Logic**: All applicable sections must PASS (see degradation table plus Section G). N/A sections excluded from evaluation. Any section failure requires remediation or user override. Section G failure on G1/G2 = HARD STOP (STOP S13).

---

## Gate 5: Deployment Readiness (Deployment → Launch)

**Threshold**: All applicable sections must PASS
**Output**: Recorded in `PROJECT_STATE.json` `gate_results.testing_to_deployment`

### Section A: Store Compliance (N/A — Web only initially)

### Section B: Monetization & Privacy Compliance (5 items)
- Billing path functional (Stripe / Lemon Squeezy)
- Privacy policy published and accessible
- Account deletion flow works
- Data disclosures accurate
- Email unsubscribe functional (CAN-SPAM)

### Section C: Performance Baseline (4 items)
- Lighthouse Performance >= 80
- Lighthouse SEO >= 90
- Core Web Vitals within range
- Mobile 3G verification

### Section D: DIOSH Final Verification (3 items)
- All completed phases have DIOSH contracts
- Override log reviewed and acknowledged
- Final safeguards sweep complete

### Section E: Deployment Infrastructure (5 items)
- CI/CD pipeline configured and tested (builds deploy to staging)
- Monitoring & alerting configured (Sentry, uptime check)
- Rollback procedure documented and tested
- Database migration plan verified (forward + rollback)
- Environment parity verified (staging matches production config)

### Section F: Operational Readiness (4 items)
- Health endpoint responding (200)
- Environment variables set (no PLACEHOLDER/TODO/CHANGEME)
- DNS/domain configured (ahaecommerce.com)
- SSL certificates valid and auto-renewing

---

## Gate 6: Launch Readiness (Launch → Active)

**Threshold**: 4 of 5 sections must PASS (Section E is advisory)
**Output**: Recorded in `PROJECT_STATE.json` `gate_results.launch_readiness`

### Section A: Analytics & Metrics (4 items)
- Analytics tracking verified (events fire correctly)
- Funnel tracking configured
- Dashboards created for launch day metrics
- Baseline metrics recorded pre-launch

### Section B: Content & SEO (5 items)
- All public pages have complete meta tags
- Sitemap generated and submitted to Google Search Console
- Structured data validated (zero errors)
- Help/docs/FAQ published
- At minimum 5 content articles pass editorial gate and are published

### Section C: Legal & Compliance (3 items)
- Privacy policy published and accessible
- Terms of service published
- Cookie consent / data collection disclosures present

### Section D: Growth Mechanism (3 items)
- Content loop implemented (content → SEO → audience → email)
- Email capture functional and verified
- 30-day optimization plan documented

### Section E: Marketing Readiness (Advisory — 3 items)
- Launch channels identified with content ready
- Email welcome sequence configured
- Social presence activated (at minimum one platform)

---

## Handoff Chain

Each phase requires a handoff document before the next phase begins:

| From | To | Handoff Document |
|------|----|-----------------|
| Discovery | PRD | `docs/planning/DISCOVERY_BRIEF.md` ✓ |
| PRD | Architecture | `docs/planning/PRD_HANDOFF.md` |
| Architecture | Design | `docs/planning/ARCHITECTURE_HANDOFF.md` |
| Design | Development | `docs/planning/DESIGN_HANDOFF.md` |
| Development | Testing | `docs/governance/PIPELINE_COMPLIANCE.md` |
| Testing | Deployment | `docs/planning/TESTING_HANDOFF.md` |
| Deployment | Launch | `docs/planning/DEPLOYMENT_RUNBOOK.md` |
| Launch | Active | `docs/planning/LAUNCH_READINESS.md` |

**Silence = blocking gap.** If a handoff document doesn't exist, the phase cannot advance.

---

## Current Gate Status

| Gate | Status | Score | Date |
|------|--------|-------|------|
| Gate 1: Business Checklist | **PASS** | 11/11 | 2026-02-28 |
| Gate 2: Expansion Test | **PASS (CONDITIONAL)** | 5 LOW / 1 MEDIUM | 2026-02-28 |
| Gate 3a: Design Completeness | **PASS** | 15/15 | 2026-02-28 |
| Gate 3b: Security Readiness | **PASS** | 8/8 | 2026-02-28 |
| Gate 3c: Pre-Implementation | **PASS** | 9/9 (auth N/A Phase 1) | 2026-02-28 |
| Gate 3d: Design Contract | **PASS** | 10/10 | 2026-02-28 |
| Gate 4: Development Completeness | LOCKED | -- | -- |
| Gate 4a: Testing Verification | LOCKED | -- | -- |
| Gate 5: Deployment Readiness | LOCKED | -- | -- |
| Gate 6: Launch Readiness | LOCKED | -- | -- |
