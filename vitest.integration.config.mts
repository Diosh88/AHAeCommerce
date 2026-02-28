/**
 * Vitest configuration for L3 Integration Tests
 *
 * These tests connect to the REAL Supabase database.
 * They are separate from unit tests (vitest.config.mts) which mock Supabase.
 *
 * Key differences from unit test config:
 * - setupFiles: loads tests/integration/setup.ts (real env vars, no mock overrides)
 * - pool: forks — each test FILE runs in a fresh Node.js process, resetting
 *   the Supabase singleton (_client) between files
 * - environment: node — no jsdom needed for API integration tests
 * - include: only tests/integration/**
 *
 * Run with: npm run test:integration
 * Requires: real Supabase credentials in .env (NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY)
 *
 * LL-GOV-023: These are the L3 tests that Gate 4a Section G requires.
 */

import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    // Node environment — API route handlers don't need jsdom
    environment: 'node',

    // Load real .env — NO tests/setup.ts (it sets fake env vars that override real ones)
    setupFiles: ['./tests/integration/setup.ts'],

    // Only integration tests in this config
    include: ['tests/integration/**/*.integration.test.ts'],
    exclude: ['node_modules/**'],

    // Forks pool: each test file gets a fresh Node.js process.
    // This resets the Supabase singleton (_client) between files so each file
    // initialises the client with real credentials from .env.
    pool: 'forks',

    // Longer timeout for real network calls
    testTimeout: 15000,
    hookTimeout: 15000,

    // Sequential within each file to avoid DB race conditions
    sequence: {
      concurrent: false,
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
});
