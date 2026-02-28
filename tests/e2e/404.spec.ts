/**
 * E2E — 404 page handling
 * Gate 4a — activated during Testing phase.
 *
 * Spec source: app/not-found.tsx
 */

import { test, expect } from '@playwright/test';

const NON_EXISTENT_URL = '/this-route-absolutely-does-not-exist-xyz-9999';

test.describe('404 page', () => {

  test('visiting a non-existent route renders the 404 page', async ({ page }) => {
    await page.goto(NON_EXISTENT_URL);
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
    await expect(page.getByText('404')).toBeVisible();
  });

  test('404 page has an h1 with "Page Not Found" text', async ({ page }) => {
    await page.goto(NON_EXISTENT_URL);
    const h1 = page.getByRole('heading', { level: 1, name: /page not found/i });
    await expect(h1).toBeVisible();
  });

  test('404 page shows the "Back to home" link with href="/"', async ({ page }) => {
    await page.goto(NON_EXISTENT_URL);
    const homeLink = page.getByRole('link', { name: /back to home/i });
    await expect(homeLink).toBeVisible();
    await expect(homeLink).toHaveAttribute('href', '/');
  });

  test('clicking "Back to home" on the 404 page navigates to "/"', async ({ page }) => {
    await page.goto(NON_EXISTENT_URL);
    await page.getByRole('link', { name: /back to home/i }).click();
    await expect(page).toHaveURL('/');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('404 page shows "Browse all articles" link with href="/articles"', async ({ page }) => {
    await page.goto(NON_EXISTENT_URL);
    const articlesLink = page.getByRole('link', { name: /browse all articles/i });
    await expect(articlesLink).toBeVisible();
    await expect(articlesLink).toHaveAttribute('href', '/articles');
  });

  test('multiple non-existent routes all render the 404 page', async ({ page }) => {
    const paths = [
      '/fake/nested/path',
      '/articles/this-slug-does-not-exist',
      '/category/nonexistent',
      '/admin',
    ];
    for (const path of paths) {
      await page.goto(path);
      await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
    }
  });

  test('404 page renders correctly on 375px mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(NON_EXISTENT_URL);
    await expect(page.getByRole('heading', { name: /page not found/i })).toBeVisible();
    const homeLink = page.getByRole('link', { name: /back to home/i });
    const box = await homeLink.boundingBox();
    expect(box!.height).toBeGreaterThanOrEqual(44);
  });

  test('404 page has no horizontal overflow on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(NON_EXISTENT_URL);
    const overflow = await page.evaluate(
      () => document.body.scrollWidth > document.body.clientWidth
    );
    expect(overflow).toBe(false);
  });

  test('404 page has robots meta tag set to noindex', async ({ page }) => {
    await page.goto(NON_EXISTENT_URL);
    // Next.js may render multiple robots meta tags (layout + not-found metadata).
    // Verify at least one contains "noindex".
    const robotsMetas = page.locator('meta[name="robots"]');
    const count = await robotsMetas.count();
    expect(count).toBeGreaterThan(0);
    let hasNoindex = false;
    for (let i = 0; i < count; i++) {
      const content = await robotsMetas.nth(i).getAttribute('content');
      if (content?.includes('noindex')) {
        hasNoindex = true;
        break;
      }
    }
    expect(hasNoindex).toBe(true);
  });
});
