# Refusal Conditions — AHAeCommerce

> Claude MUST refuse the following actions and explain why. These are hard gates, not suggestions.
> Version: 9.0 | Created: 2026-02-28

---

## Phase Gate Refusals

| Current Phase | Blocked Action | Refusal Message |
|---------------|----------------|-----------------|
| prd | Create database migrations | "Phase gate: Architecture not approved. Complete PRD first, then architecture." |
| prd | Build UI components or pages | "Phase gate: Design not yet approved. Architecture must be approved first." |
| prd | Write implementation code | "Phase gate: PRD not yet approved. Use `/prd-framework` with DISCOVERY_BRIEF.md context." |
| architecture | Build UI components or pages | "Phase gate: Design not yet approved. Use `/design-ux-executor` to create designs first." |
| architecture | Write frontend code | "Phase gate: Design phase not reached. Architecture is approved but design review is needed." |
| Any phase before development | Deploy to production | "Phase gate: Development phase not reached. Cannot deploy before implementation." |
| Any phase before development | Run deployment scripts | "Phase gate: Not ready for deployment. Current phase: [current_phase]." |

---

## Content Refusals (AHAeCommerce-Specific — Always Active)

| Condition | Blocked Action | Refusal Message |
|-----------|----------------|-----------------|
| Content doesn't answer any of 4 editorial questions | Publish or finalize | "Editorial gate fail: This content does not clarify a decision, prevent a mistake, reveal a cost, or explain a trade-off. Revise or reject." |
| Content is a step-by-step UI tutorial | Create or publish | "Scope violation: Step-by-step UI tutorials are permanently out of scope. See DISCOVERY.md §6." |
| Content is trend-based | Create or publish | "Scope violation: Trend content is permanently out of scope. See DISCOVERY.md §6." |
| Content fails the Practitioner Test | Publish | "Practitioner test fail: A seasoned eCommerce operator would not find this useful or non-obvious. Revise or reject." |
| Affiliate recommendation is not editorially justified | Include affiliate link | "Affiliate bias gate: This recommendation is not editorially justified. Only include if you would recommend without the commission." |

---

## Environment Refusals

| Condition | Blocked Action | Refusal Message |
|-----------|----------------|-----------------|
| No `.env` file exists | Run deploy commands | "Missing .env file. Cannot deploy without environment configuration. Create .env from .env.example first." |
| No `.mcp.json` exists | Claim production database state | "No MCP configured. Cannot verify production state. Operating at Level 1 (Static)." |
| MCP project ref mismatch | Proceed with MCP operations | "MCP project reference mismatch. Fix .mcp.json before proceeding." |
| No test runner configured | Claim tests pass | "No test runner detected. Cannot verify test status. Set up testing first." |

---

## Registry Refusals

| Condition | Behavior |
|-----------|----------|
| Registry file is EMPTY (0 entries) | Say: "No institutional memory exists for [domain] yet. Proceeding with caution — findings will be captured post-task." |
| Registry file not found | Say: "No [domain] registry found. Will create one after this task if significant lessons are learned." |
| Registry entry confidence is ASSUMED | Say: "This lesson is based on assumption, not direct evidence. Treat as guidance, not rule." |

---

## Override Protocol

Users can override any refusal by saying **"override: [reason]"**.

When an override is granted, Claude MUST:
1. Log the override in `docs/governance/PROJECT_STATE.json` phase_history:
   ```json
   {"phase": "current", "action": "override", "reason": "[user's reason]", "timestamp": "ISO-8601", "by": "user"}
   ```
2. Proceed with the requested action
3. Note the override in the session summary (LAST_SESSION_SUMMARY.md)
4. If the override bypasses a phase gate, add a warning: "Phase gate was overridden. Consider completing [skipped phase] retroactively."

---

## Non-Overridable Rules

These cannot be overridden even with "override:":

| Rule | Why |
|------|-----|
| Never commit tokens or secrets | Security — irreversible once pushed |
| Never force-push to main | Destructive — can lose team's work |
| Never drop RLS without explicit confirmation | Security — data exposure risk |
| Never delete production data without backup | Destructive — irreversible |
| Never publish content without editorial rule check | Authority — one piece of bad content damages trust permanently |

---

## Version

- Template version: 9.0
- Customized for AHAeCommerce: 2026-02-28 (added content refusals — permanent, non-overridable)
