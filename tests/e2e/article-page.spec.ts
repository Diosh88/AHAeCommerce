/**
 * E2E — Article page rendering
 * Gate 4a — activated during Testing phase.
 *
 * Spec source:
 *   - app/articles/[slug]/page.tsx
 *   - components/shared/ArticleCard.tsx
 *   - components/shared/EmailCapture.tsx
 *
 * Fixture: ecommerce-platform-decision-framework (published, featured, non-draft)
 */

import { test, expect } from '@playwright/test';

const FIXTURE_ARTICLE_SLUG = 'ecommerce-platform-decision-framework';
const FIXTURE_ARTICLE_URL = `/articles/${FIXTURE_ARTICLE_SLUG}`;

test.describe('Article page rendering', () => {

  // ── Content visibility at breakpoints ────────────────────────────────────────

  test('article h1 is visible at 375px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(FIXTURE_ARTICLE_URL);
    const h1 = page.getByRole('heading', { level: 1 });
    await expect(h1).toBeVisible();
  });

  test('article h1 is visible at 768px tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto(FIXTURE_ARTICLE_URL);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('article h1 is visible at 1280px desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 720 });
    await page.goto(FIXTURE_ARTICLE_URL);
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  // ── EmailCapture presence ────────────────────────────────────────────────────

  test('article page contains the EmailCapture component', async ({ page }) => {
    await page.goto(FIXTURE_ARTICLE_URL);
    // Article page has multiple EmailCapture forms (inline, end-of-article, footer).
    // Use .first() to verify at least one is visible.
    const emailForm = page.getByRole('form', { name: /subscribe to email list/i }).first();
    await expect(emailForm).toBeVisible();
  });

  test('EmailCapture on article page has accessible email input label', async ({ page }) => {
    await page.goto(FIXTURE_ARTICLE_URL);
    // Multiple email inputs exist (inline, end-of-article, footer). Target the first.
    const emailInput = page.getByLabel(/email address/i).first();
    await expect(emailInput).toBeVisible();
  });

  // ── Topic badge ──────────────────────────────────────────────────────────────

  test('article page shows the topic badge (category label)', async ({ page }) => {
    await page.goto(FIXTURE_ARTICLE_URL);
    const badge = page.locator('.badge').first();
    await expect(badge).toBeVisible();
    await expect(badge).not.toBeEmpty();
  });

  // ── Mobile readability ───────────────────────────────────────────────────────

  test('article body text is readable at 375px (no horizontal overflow)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(FIXTURE_ARTICLE_URL);
    const overflow = await page.evaluate(() => document.body.scrollWidth > document.body.clientWidth);
    expect(overflow).toBe(false);
  });

  test('article page reading time and publish date are present', async ({ page }) => {
    await page.goto(FIXTURE_ARTICLE_URL);
    await expect(page.getByText(/min read/)).toBeVisible();
    await expect(page.locator('time')).toBeVisible();
  });

  // ── Navigation ───────────────────────────────────────────────────────────────

  test('back-to-articles link is present and navigates correctly', async ({ page }) => {
    await page.goto(FIXTURE_ARTICLE_URL);
    // Find any link pointing to /articles (may be in footer or header).
    // Use href attribute for reliability across viewport sizes.
    const articlesLink = page.locator('a[href="/articles"]').first();
    await articlesLink.scrollIntoViewIfNeeded();
    await articlesLink.click();
    await expect(page).toHaveURL(/\/articles/);
  });

  // ── Non-existent article ────────────────────────────────────────────────────

  test('visiting a non-existent article slug renders the 404 page', async ({ page }) => {
    await page.goto('/articles/this-article-does-not-exist-xyz-123');
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
  });
});
