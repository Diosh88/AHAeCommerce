/**
 * E2E — Subscribe flow (UI layer only)
 * Gate 4a — partial activation.
 *
 * SCOPE: These tests verify UI behavior only.
 * They do NOT submit to the API or write to the database.
 *
 * Reason: Supabase project is shared (dev = production).
 * Submitting fake emails in E2E would pollute the real subscriber list.
 *
 * What's tested here:
 *   - Page renders with correct heading
 *   - Form is accessible (label, input, button)
 *   - Client-side validation fires without API call (empty submit)
 *   - Touch targets meet WCAG 44px minimum on mobile
 *   - No horizontal overflow on 375px viewport
 *
 * What's tested elsewhere:
 *   - API correctness: tests/api/subscribe.test.ts (unit, mocked Supabase)
 *   - DB integration:  tests/integration/subscribe.integration.test.ts (real DB, cleanup)
 *   - Happy path E2E:  Activate when a dedicated test DB or seed/cleanup strategy exists
 */

import { test, expect } from '@playwright/test';

test.describe('Subscribe page — UI behavior', () => {

  // ── Page structure ──────────────────────────────────────────────────────────

  test('subscribe page renders with the correct heading', async ({ page }) => {
    await page.goto('/subscribe');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('subscribe page has an accessible email input', async ({ page }) => {
    await page.goto('/subscribe');
    // Scope to main content — footer also has an email input
    const main = page.getByRole('main');
    const input = main.getByLabel(/email address/i);
    await expect(input).toBeVisible();
    await expect(input).toHaveAttribute('type', 'email');
  });

  test('subscribe page has a submit button', async ({ page }) => {
    await page.goto('/subscribe');
    const main = page.getByRole('main');
    await expect(main.getByRole('button', { name: /subscribe/i })).toBeVisible();
  });

  // ── Client-side validation (no API call) ───────────────────────────────────

  test('empty submit shows client-side validation error without calling the API', async ({ page }) => {
    await page.goto('/subscribe');

    // Intercept any fetch to /api/subscribe — it must NOT fire on empty submit
    let apiCalled = false;
    await page.route('**/api/subscribe', (route) => { apiCalled = true; route.abort(); });

    const main = page.getByRole('main');
    await main.getByRole('button', { name: /subscribe/i }).click();

    await expect(main.getByRole('alert')).toBeVisible();
    await expect(main.getByRole('alert')).toContainText(/please enter your email/i);
    expect(page.url()).toContain('/subscribe');
    expect(apiCalled).toBe(false);
  });

  // ── Mobile: touch targets ──────────────────────────────────────────────────

  test('subscribe button meets 44px touch target on 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/subscribe');
    const main = page.getByRole('main');
    const button = main.getByRole('button', { name: /subscribe/i });
    const box = await button.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
    expect(box!.width).toBeGreaterThanOrEqual(44);
  });

  test('email input meets 44px touch target on 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/subscribe');
    const main = page.getByRole('main');
    const input = main.getByLabel(/email address/i);
    const box = await input.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  // ── Mobile layout ──────────────────────────────────────────────────────────

  test('subscribe page has no horizontal overflow on 375px viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/subscribe');
    const overflow = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
    expect(overflow).toBe(false);
  });

  test('form input and button are visible at 375px without scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/subscribe');
    const main = page.getByRole('main');
    await expect(main.getByLabel(/email address/i)).toBeVisible();
    await expect(main.getByRole('button', { name: /subscribe/i })).toBeVisible();
  });
});

// ── API happy path — BLOCKED until test DB or seed strategy is in place ────────
//
// These tests submit to the real subscribe API and would insert fake emails
// into the production subscribers table. Activate when:
//   1. A dedicated test Supabase project exists (separate URL), OR
//   2. A cleanup hook removes e2e-* emails after the test run, OR
//   3. An API flag/header marks requests as test-only (not stored)
//
// Unit coverage:  tests/api/subscribe.test.ts
// DB coverage:    tests/integration/subscribe.integration.test.ts
