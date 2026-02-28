# CONTEXT_ENGINE v1.0 -- Master Context Governor
<!-- TEMPLATE VERSION: CONTEXT_ENGINE v1.0 (2026-02-28) -->
<!-- Project: AHAeCommerce — A–Z eCommerce Decision & Execution Intelligence Platform -->
<!-- Customized: 2026-02-28 by initialize-governance v20.0 -->
<!-- Based on: ~/SyncNode/GlobalGovernance/CONTEXT_ENGINE.md v1.0 -->

> **One goal**: Every Claude session should behave like a senior employee
> who knows your system, respects your time, and compounds intelligence every session.

---

## SECTION 1: SESSION TIER CLASSIFICATION

Before loading anything, classify the session. This governs context budget, load behavior,
and what to do when context runs low.

| Tier | Name | Trigger | Context Budget | Governance Load |
|------|------|---------|---------------|----------------|
| **T0** | Casual / Ideation | "what if", "how would I", brainstorming | Minimal | CLAUDE.md only |
| **T1** | Project Ops | Single project, read/fix/small feature | Standard | CLAUDE.md + project MEMORY.md |
| **T2** | Cross-Project | Multi-project operations via SyncNode | Expanded | + relevant capability summaries |
| **T3** | Governance Mutation | Authority-only: hash regen, LP promotion, release tag | Full | All governance docs |

**Classification rule**: Default to T1. Escalate if task requires cross-project intelligence
or governance mutations.

---

## SECTION 2: SESSION BOOTSTRAP PROTOCOL

Every session MUST run bootstrap before starting work. No exceptions.

```
Phase 0: Session Identity
  -> Display session context
  -> Detect machine role via ~/SyncNode/GlobalGovernance/machine-registry/

Phase 1: MCP & Environment Health
  -> Probe .mcp.json -> declare MCP Level (L1/L2/L3)

Phase 1.5: Machine Role Auto-Detection
  -> Read machine-registry/profiles/$(hostname).json
  -> Extract "role" field -> set session role
  -> Default: "builder" if profile not found

Phase 2: Orientation
  -> Read CHANGELOG.md (first 80 lines)
  -> Read LAST_SESSION_SUMMARY.md if exists

Phase 2.5: Intelligence Loading (RELEVANCE FILTER ACTIVE)
  -> Load memory/MEMORY.md behavioral directives (S1) and state (S2)
  -> Load memory/patterns.md for hot files + call chain
  -> DO NOT load full registries -- load summaries only
  -> Full intelligence = ON DEMAND only (when task specifically needs it)

Phase 3: State Check
  -> git status

Phase 4: Environment
  -> verify .env exists
  -> verify node_modules if package.json present

Phase 5: Pipeline Compliance
  -> if docs/governance/PIPELINE_COMPLIANCE.md exists: read and flag PENDING steps

Phase 6: Session Declaration
  -> Output structured declaration block:
    +-- SESSION DECLARATION --------------------------------+
    | Session Tier: T[0-3]                                  |
    | Machine Role: [authority/builder/executor]            |
    | Task Type:    [description or "awaiting input"]       |
    | Governance:   [list of docs loaded so far]            |
    | MCP Level:    [1/2/3]                                 |
    | STOP Active:  [S-codes from S4 STOP table]            |
    +-------------------------------------------------------+
  -> This is accountability, not enforcement.
  -> If task type changes mid-session, re-declare.

Phase 7: Ready -> proceed
```

**Smart Bootstrap**: For clear tasks, run Phases 2-5 in background while starting.

---

## SECTION 3: TOKEN BUDGET MANAGEMENT

Context is a finite resource. Governance exists to serve the task, not consume it.

### Budget Allocations (per session)

| Budget Zone | Max Tokens | What Goes Here |
|-------------|------------|----------------|
| Core governance | 10% | CLAUDE.md (already loaded) |
| Project MEMORY.md | 8% | Behavioral directives + state |
| Intelligence summaries | 5% | Matched summaries (max 10 items) |
| Task context | 60% | Actual code, files, user work |
| Response buffer | 17% | Output generation |

### Hard Rules

1. **Governance cap**: Total governance loading NEVER exceeds 20% of context
2. **5-doc threshold**: If task requires >5 governance docs → PAUSE and verify with user
3. **Full content on-demand**: Registry entries, full docs = ON DEMAND only
4. **Section reading**: For docs >100 lines → prefer RELEVANT SECTIONS, not full file
5. **No duplicate loading**: Never load the same doc twice in a session

### When Budget is Running Low

```
Token check triggers at 70% usage:
  -> Invoke context-manager skill
  -> Pause non-critical governance loading
  -> Prioritize: task completion > lesson capture > registry updates

At 85% usage:
  -> Hard stop on new doc loading
  -> Finish current task
  -> Invoke session-handoff skill
  -> Generate LAST_SESSION_SUMMARY.md before closing
```

---

## SECTION 4: COMMAND INTERPRETATION STANDARDS

Consistent command interpretation prevents drift across sessions.

### Tier-Based Command Routing

| Command Pattern | Tier | Interpretation | Governance Check |
|----------------|------|----------------|-----------------|
| "fix this", "update X" | T1 | Single-file surgical fix | CLAUDE.md only |
| "build feature Y" | T1-T2 | Standard development task | + project MEMORY.md |
| "write content for..." | T1-T2 | Content creation — load CONTENT_GOVERNANCE.md | ALWAYS |
| "publish / finalize article" | T2 | Editorial gate required — verify editorial rule | CONTENT_GOVERNANCE.md |
| "clean up / archive" | T1 | Non-destructive only | Verify scope before proceeding |
| "delete / remove" | T2+ | PAUSE — confirm scope first | Get explicit confirmation |
| "advance phase" | T3 | Phase gate evaluation required | PHASE_GATES.md + PROJECT_STATE.json |

### Ambiguity Resolution

When a command is ambiguous:
1. State the interpretation: "I'm reading this as [X]. If you mean [Y], say so."
2. Take the NARROWER interpretation (surgical > broad)
3. If destructive, always confirm before executing

### Hard STOP Conditions (S1-S12)

These are the definitive STOP conditions. If ANY is true, Claude MUST halt.

| # | Condition | Action | Source |
|---|-----------|--------|--------|
| S1 | `current_phase` < `development` AND task is implementation | **REFUSE** | CLAUDE.md Phase Gate |
| S2 | Destructive file operation without confirmation | **CONFIRM** with user | CLAUDE.md Core Behavior |
| S3 | Ambiguous scope with multiple valid interpretations | **STOP** — ask user to confirm | S4 Ambiguity Resolution |
| S4 | `BOOTSTRAP_STATE.json` missing on execution node | **HALT** — "Run install.sh to complete setup" | Bootstrap gate |
| S5 | Hash verification fails | **HALT** all execution | Integrity gate |
| S6 | Authority-only operation attempted on non-authority machine | **ESCALATE** — never proceed silently | S9 Machine Roles |
| S7 | Task requires >5 governance docs to load | **PAUSE** — verify tier classification | CLAUDE.md Context Budget |
| S8 | Project not in manifest during cross-project work | **WARN** — register project first | Intelligence Injection Rules |
| S9 | Intelligence loading fails (can't read MEMORY.md) | **WARN** — proceed with reduced confidence | CLAUDE.md Bootstrap |
| S10 | Economic Governor blocks Tier 2 (daily budget exceeded) | **DOWNGRADE** to Tier 1 | Economic Governor |
| S11 | DIOSH Operations sequence skipped before gate evaluation | **REFUSE** gate | CLAUDE.md Anti-pattern |
| S12 | Content task without loading CONTENT_GOVERNANCE.md | **PAUSE** — load CONTENT_GOVERNANCE.md first | Content Domain Enforcement |

---

## SECTION 5: CROSS-IDE CONSISTENCY

### What Must Be Consistent Across IDEs

| Behavior | Rule | Enforcement |
|----------|------|-------------|
| Bootstrap | Always Phase 0-6 | MEMORY.md S1 directive |
| Governance file routing | File-path routing table | CLAUDE.md |
| Anti-hallucination | Verify before claim | CLAUDE.md |
| Editorial rule | Always apply to content tasks | CONTENT_GOVERNANCE.md |
| Intelligence injection | Relevance filter always active | Intelligence Injection Rules |

### What May Differ (Expected)

- Token limits (web vs API vs IDE)
- Speed (web = slower, IDE = faster context load)
- MCP availability (IDE has MCP, web may not)

When MCP is unavailable: fall back to bash commands for file ops. Never skip verification.

---

## SECTION 6: GOVERNANCE CONFIRMATION FORMAT

When Claude completes a governance mutation or significant action, output a structured
confirmation block. This prevents "did it actually do it?" confusion.

### Confirmation Block Format

```
-- GOVERNANCE CONFIRMATION --------------------------------
Action: [what was done]
Files Changed: [list — verified via Glob/ls]
Commit: [hash if committed]
Hash Status: [regenerated / needs regeneration / not applicable]
Next Required: [what user must do next, if anything]
-----------------------------------------------------------
```

### When to Show the Block

- After ANY file creation or modification (3+ files)
- After any git commit
- After any governance mutation
- After intelligence extraction or injection

### When NOT Required

- Single-file typo fixes
- Read-only queries
- Brainstorming or ideation sessions (T0)

---

## SECTION 7: HALLUCINATION PREVENTION (Active Enforcement)

### The 5-Verify Protocol

Before claiming anything exists or is complete:

```
1. GLOB verify -- file must exist on filesystem
2. READ verify -- content must match what was claimed
3. COMMIT verify -- git log must show the commit hash
4. HASH verify -- if governance file changed, hash must be current
5. OUTPUT verify -- if script was run, show actual output
```

### Hallucination Triggers (Auto-Blocked Patterns)

| Pattern | What Claude Must Do Instead |
|---------|---------------------------|
| "I've created [file]" | Glob → then say "Created — confirmed at [path]" |
| "This is already done" | git log → then cite the commit hash |
| "The article covers X" | Read the file → confirm the content exists |
| "This passes the editorial rule" | Apply all 4 editorial questions → cite which one(s) it answers |

### NEVER

- Claim a task is done without artifact verification
- Say "I'll remember this" — write it to a file instead
- Say an article "passes" without checking all 4 editorial questions

---

## SECTION 8: END-OF-SESSION COMPACTION

Every T2+ session must end with an intelligence compaction step.

### What to Do at Session End

```
1. LESSON CAPTURE
   -> Ask: "What did I learn this session that wasn't already documented?"
   -> Tier 2+ tasks: lesson capture is MANDATORY

2. MEMORY UPDATE
   -> Update memory/MEMORY.md S2 (Project State) with current status
   -> Update memory/MEMORY.md S3 (Open Gaps) -- close resolved, add new

3. CHANGELOG ENTRY
   -> Add session entry to CHANGELOG.md

4. LAST_SESSION_SUMMARY.md
   -> Generate/update with: what was done, what's blocked, what user must do next
```

---

## SECTION 9: MACHINE ROLE ENFORCEMENT

Machine registry: `~/SyncNode/GlobalGovernance/machine-registry/`

| Operation | Authority (M5) | Builder (M4/W1) | Executor |
|-----------|----------------|-----------------|----------|
| git push to main | Yes | No | No |
| governance mutation | Yes | ESCALATE only | No |
| run allowlisted commands | Yes | Yes | Yes |
| create proposals | Yes | DRAFT only | No |
| run bootstrap | Yes | Yes | Yes |
| economic governor config | Yes | No | No |

### Role Detection

```
1. Read machine profile from ~/SyncNode/GlobalGovernance/machine-registry/profiles/$(hostname).json
2. Extract "role" field
3. If not found: default to "builder" (safest default)
4. If attempting authority-only operation as builder: invoke escalation protocol
5. Never re-ask machine identity — read the registry (LL-GOV-022)
```

---

## SECTION 10: GOVERNANCE INTEGRITY CHAIN

The hash is the root of trust. Everything else depends on it.

### Integrity Chain

```
generate_hash (authority only, M5)
    -> GOVERNANCE_MANIFEST (hashed files)
        -> verify_hash (all nodes, before every execution)
            -> execution layer (gate at entry)
                -> bootstrap (gate at phase 2)
```

### Hash Regeneration Protocol

```
1. Make governance changes (authority only — M5)
2. Run hash generation script
3. Verify output shows no MISSING entries
4. Commit manifest + changed files
5. Push to main
```

---

## VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| v1.0 | 2026-02-28 | Initial project scaffold from CONTEXT_ENGINE.template.md v1.0. Customized for AHAeCommerce: content governance S12 STOP, content command routing, editorial rule enforcement, SyncNode machine-registry integration, Economic Governor active. |
