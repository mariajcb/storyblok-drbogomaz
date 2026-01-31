import { test, expect } from '@playwright/test'

/**
 * E2E Test: Performance Validation
 *
 * Validates basic performance metrics for key pages. Uses Navigation Timing API
 * to assert page load completes within acceptable thresholds. Thresholds are
 * relaxed for CI and local dev (e.g. cold start).
 */

const MAX_LOAD_TIME_MS = 15000 // 15s - accommodates dev server cold start and CI

test.describe('Performance Validation', () => {
  test('home page loads within acceptable time', async ({ page }) => {
    const start = Date.now()
    await page.goto('/', { waitUntil: 'load' })
    const loadTime = Date.now() - start

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS)
  })

  test('home page navigation timing shows load completed', async ({ page }) => {
    await page.goto('/', { waitUntil: 'load' })

    const timing = await page.evaluate(() => {
      const nav = performance.getEntriesByType('navigation')[0]
      if (!nav || nav.loadEventEnd === 0) return null
      return {
        loadEventEnd: nav.loadEventEnd,
        domContentLoaded: nav.domContentLoadedEventEnd - nav.fetchStart
      }
    })

    expect(timing).not.toBeNull()
    expect(timing.loadEventEnd).toBeGreaterThan(0)
  })

  test('blog index page loads within acceptable time', async ({ page }) => {
    const start = Date.now()
    await page.goto('/blog', { waitUntil: 'load' })
    await page.waitForSelector('text=Loading blog posts...', { state: 'hidden', timeout: 10000 })
    const loadTime = Date.now() - start

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS)
  })

  test('contact page loads within acceptable time', async ({ page }) => {
    const start = Date.now()
    await page.goto('/contact', { waitUntil: 'load' })
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 })
    const loadTime = Date.now() - start

    expect(loadTime).toBeLessThan(MAX_LOAD_TIME_MS)
  })
})
