/**
 * Vitest global setup file
 * Loaded before each test file via vitest.config.ts `setupFiles`
 *
 * Responsibilities:
 * - Import @testing-library/jest-dom so matchers like toBeInTheDocument(),
 *   toHaveAttribute(), toBeVisible() etc. are available globally
 * - Set baseline environment variables to prevent getSupabaseServer() from
 *   throwing during module import in API handler tests
 */

import '@testing-library/jest-dom';

// Baseline env vars so lazy-init clients don't throw on import
// Tests that exercise env-missing error paths override these per-test
process.env.NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://localhost:54321';
process.env.SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? 'test-service-role-key';
process.env.LEMON_SQUEEZY_WEBHOOK_SECRET = process.env.LEMON_SQUEEZY_WEBHOOK_SECRET ?? 'test-webhook-secret-32-chars-min!!';
