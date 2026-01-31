import { test, expect } from '@playwright/test'

/**
 * E2E Test: Cross-Browser Smoke
 *
 * Lightweight smoke test run in all Playwright projects (Chromium, Firefox, WebKit,
 * Mobile Chrome, Mobile Safari). Validates that key pages load and core UI is visible
 * across browsers and viewports.
 */
test.describe('Cross-Browser Smoke', () => {
  test('home page loads and shows main navigation and footer', async ({ page }) => {
    await page.goto('/')

    const nav = page.locator('nav, [role="navigation"]').first()
    await expect(nav).toBeVisible({ timeout: 10000 })

    const footer = page.locator('footer, [role="contentinfo"]').first()
    await expect(footer).toBeVisible({ timeout: 5000 })
  })

  test('blog index page loads and shows content or loading then content', async ({ page }) => {
    await page.goto('/blog')

    await page.waitForSelector('text=Loading blog posts...', { state: 'hidden', timeout: 10000 })

    const errorMessage = page.locator('text=/Failed to load blog posts/i')
    await expect(errorMessage).not.toBeVisible()

    const content = page.locator('main, .blog, [role="main"]').first()
    await expect(content).toBeVisible({ timeout: 5000 })
  })

  test('contact page loads and shows form', async ({ page }) => {
    await page.goto('/contact')

    const form = page.locator('form')
    await expect(form).toBeVisible({ timeout: 10000 })
  })

  test('navigation links are present and point to expected routes', async ({ page }) => {
    await page.goto('/')

    const homeLink = page.locator('a[href="/"]').first()
    await expect(homeLink).toBeVisible()

    const blogLink = page.locator('a[href="/blog"]').first()
    await expect(blogLink).toBeVisible()

    const contactLink = page.locator('a[href="/contact"]').first()
    await expect(contactLink).toBeVisible()
  })
})
