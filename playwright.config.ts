/**
 * Playwright configuration for AHAeCommerce E2E tests
 *
 * Projects:
 * 1. chromium-desktop  — 1280x720 (primary desktop target)
 * 2. chromium-mobile   — 375x667 (iPhone SE — minimum supported mobile)
 * 3. webkit-mobile     — 375x667 (Safari mobile — required for iOS coverage)
 *
 * Web server: starts `npm run dev` and waits for http://localhost:3000
 * E2E specs location: tests/e2e/**\/*.spec.ts
 *
 * Note: Gate 4c skeleton tests use test.todo() — they do not run until
 * the Testing phase (Gate 4a) when the app is fully operational.
 */

import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  // Only include E2E specs — Vitest handles unit/component tests
  testDir: './tests/e2e',
  testMatch: '**/*.spec.ts',

  // Fail fast during CI; allow full run locally
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 1 : undefined,

  // Reporters: HTML for local review, list for CI legibility
  reporter: [
    ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],

  use: {
    // Base URL — all page.goto('/path') calls resolve against this
    baseURL: 'http://localhost:3000',

    // Capture artifacts on first failure only (not retries)
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',

    // Default action timeout (ms)
    actionTimeout: 10_000,
    navigationTimeout: 30_000,
  },

  projects: [
    // Desktop Chrome — primary test surface
    {
      name: 'chromium-desktop',
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 720 },
      },
    },

    // Mobile Chrome — 375x667 (iPhone SE form factor)
    {
      name: 'chromium-mobile',
      use: {
        ...devices['Pixel 5'],
        viewport: { width: 375, height: 667 },
        isMobile: true,
        hasTouch: true,
      },
    },

    // Mobile Safari — 375x667 (iOS coverage)
    {
      name: 'webkit-mobile',
      use: {
        ...devices['iPhone SE'],
        viewport: { width: 375, height: 667 },
        isMobile: true,
        hasTouch: true,
      },
    },
  ],

  // Start the Next.js dev server before running E2E tests
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
});
