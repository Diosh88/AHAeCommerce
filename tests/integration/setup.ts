/**
 * Integration test setup — L3 real database tests
 *
 * IMPORTANT: This file is intentionally different from tests/setup.ts.
 * tests/setup.ts installs fake Supabase credentials for unit tests.
 * This file loads REAL credentials from .env so API handlers connect to
 * the actual Supabase database.
 *
 * LL-GOV-023: Integration (L3) tests must connect to a real database of
 * the SAME technology as production. This setup file makes that possible.
 */

import fs from 'node:fs';
import path from 'node:path';

// ---------------------------------------------------------------------------
// Load .env into process.env (dependency-free)
// Must run before any module that reads env vars (e.g. getSupabaseServer).
// ---------------------------------------------------------------------------
function loadEnvFile() {
  const envPath = path.resolve(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    throw new Error(
      `[integration/setup] .env not found at ${envPath}. ` +
      'Real DB credentials are required for L3 integration tests.'
    );
  }

  const content = fs.readFileSync(envPath, 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eqIdx = trimmed.indexOf('=');
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    const val = trimmed.slice(eqIdx + 1).trim();
    // Only set if not already in environment (shell env takes precedence)
    if (key && !(key in process.env)) {
      process.env[key] = val;
    }
  }
}

loadEnvFile();

// ---------------------------------------------------------------------------
// Verify required credentials are present (fail fast — STOP S13 gate)
// ---------------------------------------------------------------------------
const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'SUPABASE_SERVICE_ROLE_KEY',
];

for (const key of required) {
  if (!process.env[key]) {
    throw new Error(
      `[integration/setup] STOP S13: Missing required env var: ${key}. ` +
      'Cannot run L3 integration tests without real DB credentials.'
    );
  }
}

// Set webhook secret for LemonSqueezy webhook tests (known test value)
// The actual secret only needs to match what tests use to sign payloads.
process.env.LEMON_SQUEEZY_WEBHOOK_SECRET =
  process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? 'integration-test-webhook-secret-32!!';
