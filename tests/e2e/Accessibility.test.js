import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

/**
 * E2E Test: Accessibility
 *
 * Runs axe-core accessibility checks on key pages. Validates WCAG compliance
 * and reports violations.
 */
test.describe('Accessibility', () => {
  test('home page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('blog index page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/blog')
    await page.waitForSelector('text=Loading blog posts...', { state: 'hidden', timeout: 10000 })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('contact page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 })

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('contact page form has accessible labels and controls', async ({ page }) => {
    await page.goto('/contact')
    await expect(page.locator('form')).toBeVisible({ timeout: 10000 })

    const results = await new AxeBuilder({ page })
      .include('form')
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })

  test('privacy page has no critical accessibility violations', async ({ page }) => {
    await page.goto('/privacy')

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze()

    expect(results.violations).toEqual([])
  })
})
