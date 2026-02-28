/**
 * Vitest configuration for AHAeCommerce
 *
 * Test scope:
 * - Unit tests: API route handlers (imported directly, no HTTP)
 * - Component tests: React components via @testing-library/react (jsdom)
 * - Excluded: Playwright E2E specs (tests/e2e/**) — run via `npm run test:e2e`
 *
 * Path aliases: @/* resolves to project root (matches tsconfig.json paths)
 * Environment: jsdom for component tests, node (default) for API/logic tests
 *
 * Gate 4c requirement: configuration exists. Tests need not all pass until Gate 4a.
 */

import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  test: {
    // Use jsdom so React components have access to browser globals
    environment: 'jsdom',

    // Setup file — loads @testing-library/jest-dom matchers globally
    setupFiles: ['./tests/setup.ts'],

    // Include only unit and component tests; exclude Playwright specs
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['tests/e2e/**', 'tests/integration/**', 'node_modules/**'],

    // Global test utilities available without imports (describe, it, expect, vi)
    globals: true,

    // Coverage configuration (available via `vitest run --coverage`)
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: [
        'app/api/**/*.ts',
        'components/**/*.tsx',
        'lib/**/*.ts',
      ],
      exclude: [
        'node_modules/**',
        'tests/**',
        '**/*.config.*',
        '**/*.d.ts',
      ],
    },
  },

  resolve: {
    alias: {
      // Match tsconfig.json: @/* -> root
      '@': path.resolve(__dirname, '.'),
    },
  },
});
