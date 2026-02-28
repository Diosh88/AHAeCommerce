# Lessons Learned System — AHAeCommerce

> Intelligence compounds when lessons are captured. Every significant task should leave behind institutional memory.

## Domain Registries

| Domain | Failure Registry | Success Registry |
|--------|-----------------|-----------------|
| Database | docs/database/DB_FAILURE_REGISTRY.md | docs/database/DB_SUCCESS_REGISTRY.md |
| API | docs/api/API_FAILURE_REGISTRY.md | docs/api/API_SUCCESS_REGISTRY.md |
| DevOps | docs/devops/DEVOPS_FAILURE_REGISTRY.md | docs/devops/DEVOPS_SUCCESS_REGISTRY.md |
| Security | docs/security/SECURITY_FAILURE_REGISTRY.md | docs/security/SECURITY_SUCCESS_REGISTRY.md |
| Integration | docs/integration/INTEGRATION_FAILURE_REGISTRY.md | docs/integration/INTEGRATION_SUCCESS_REGISTRY.md |
| Performance | docs/performance/PERF_FAILURE_REGISTRY.md | docs/performance/PERF_SUCCESS_REGISTRY.md |
| i18n | docs/i18n/I18N_FAILURE_REGISTRY.md | docs/i18n/I18N_SUCCESS_REGISTRY.md |
| Design | docs/design/DESIGN_FAILURE_REGISTRY.md | docs/design/DESIGN_SUCCESS_REGISTRY.md |
| Content | docs/content/CONTENT_FAILURE_REGISTRY.md | docs/content/CONTENT_SUCCESS_REGISTRY.md |

> **Note**: Content domain added (not in default template) — AHAeCommerce is a content-authority platform.
> Content lessons are captured separately from design lessons.

## Entry Format

```
ID: [DOMAIN]-[TYPE][NUMBER]
Types: F (failure), S (success), W (warning), P (pattern)

Examples:
  DB-F003  — database failure lesson #3
  API-S002 — API success lesson #2
  DS-W001  — design warning #1
  CT-F001  — content failure #1 (content domain — AHAeCommerce specific)

Fields per entry:
  - Source: [where the lesson came from]
  - Confidence: HIGH / INFERRED / ASSUMED / INHERITED
  - Date: YYYY-MM-DD
  - Severity: CRITICAL / HIGH / MEDIUM / LOW
  - Tags: [comma-separated]
  - Description: [what happened or what works]
  - Root Cause: [why it happened]
  - Fix: [what was done]
  - Prevention: [how to prevent recurrence]
```

## When to Capture

- After completing significant work (3+ files changed)
- When something breaks unexpectedly
- When a non-obvious gotcha is discovered
- When a pattern works particularly well
- After content is rejected by the editorial gate (capture WHY it failed)
- After a content piece passes the practitioner test with exceptional quality

## Content-Specific Capture Rules (AHAeCommerce)

Capture a lesson when:
- **Content rejection**: An article fails the editorial rule → capture WHICH question it failed and WHY
- **Scope drift**: Content that started within scope drifted into tutorials or trend content → capture the pattern
- **Practitioner test fail**: A seasoned operator found the content obvious or non-useful → capture the root cause
- **Affiliate bias detected**: An affiliate recommendation influenced content framing → capture and correct

## Registry Lifecycle

| Status | Count | Behavior |
|--------|-------|----------|
| EMPTY | 0 | State: "No institutional memory for [domain] yet — proceeding with caution." |
| SPARSE | 1-3 | Treat as guidance, not authoritative |
| ACTIVE | 4-10 | Use confidently for pre-task scanning |
| RICH | 11+ | High confidence — auto-reject known failure patterns |

## Version

- Template version: 9.0 (enhanced with content domain for AHAeCommerce)
- Created: 2026-02-28 by initialize-governance v20.0
