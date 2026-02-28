# Agent Capability Level — AHAeCommerce

> Declared at session start based on detected MCP servers and tools.
> Version: 9.0 | Created: 2026-02-28 by initialize-governance v20.0

---

## Current Level: UNDETERMINED

*(Set during session bootstrap based on MCP detection)*

---

## Level Definitions

| Level | Name | Requirements | Capabilities |
|-------|------|-------------|--------------|
| **1** | **Static** | File system access only | Read/write files, run builds, git operations, lint, test locally |
| **2** | **Repo-Aware** | Git + test runner + CI | All Level 1 + branch management, test execution, CI status awareness |
| **3** | **Service-Aware** | MCP servers active | All Level 2 + live DB queries, PR creation, deployment verification, external API calls |

---

## MCP Detection Matrix

| MCP Server | Detected | Status | Impact on Level |
|------------|----------|--------|-----------------|
| Context7 | YES (global settings) | Active | Documentation lookup — enables up-to-date library docs |
| Supabase | Configured in .mcp.json | Pending (needs SUPABASE_ACCESS_TOKEN in .env) | Enables live DB queries, migration verification, RLS checks |
| GitHub | Configured in .mcp.json | Pending (needs GITHUB_PERSONAL_ACCESS_TOKEN) | Enables PR creation, issue management, branch operations |
| Vercel | Not configured | Not configured | Enables deployment status, preview URL verification |

**Current MCP Level**: L1 (Static) — Supabase and GitHub MCPs configured but not yet connected (no database provisioned, no tokens in .env)

---

## Behavioral Implications

### Level 1 (Static) — Current
- Cannot verify production database state — must ask user
- Cannot create PRs programmatically — must provide instructions
- Cannot verify external service health
- Registry entries default to "UNVERIFIED"
- Claims about production state are PROHIBITED (see REFUSAL_CONDITIONS.md)

### Level 2 (Repo-Aware)
- Can verify tests pass locally
- Can check branch state and recent CI status
- Still cannot verify production state
- Registry entries can be marked "VERIFIED (local)"
- Can create branches and commits

### Level 3 (Service-Aware)
- Can verify production database state via Supabase MCP
- Can create PRs and manage GitHub issues
- Can check live service health
- Registry entries can be marked "VERIFIED (production)"
- Full agentic capability

---

## Session Declaration Protocol

At session start, Claude MUST:

1. Check for `.mcp.json` in project root
2. Check for configured MCP servers in `~/.claude/settings.json`
3. If MCPs found: attempt one lightweight call (e.g., `list_tables` or `get_repo`)
4. Set level based on results:
   - No MCPs configured → Level 1
   - MCPs configured but calls fail → Level 1 (with warning)
   - Git + tests available, no service MCPs → Level 2
   - Service MCPs responding → Level 3
5. State: "Operating at **Level [N] ([Name])** this session."
6. If level changed from previous session: note in session summary

---

## Upgrade Path

To upgrade to Level 3 (Service-Aware):
1. Add `SUPABASE_ACCESS_TOKEN` to `.env` (after Supabase project is provisioned)
2. Add `GITHUB_PERSONAL_ACCESS_TOKEN` to `.env`
3. Both MCPs will activate automatically on next session bootstrap

> Note: This upgrade should happen during Architecture phase when Supabase is provisioned.
