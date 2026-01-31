import { test, expect } from '@playwright/test'

test.describe('Cookie Preferences Management Flow', () => {
  // Clear localStorage before each test to ensure clean state
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.evaluate(() => {
      localStorage.removeItem('cookie-consent')
      sessionStorage.removeItem('cookie-consent-fallback')
    })
  })

  test('allows user to view current cookie preferences status when no preference is set', async ({ page }) => {
    await page.goto('/cookie-preferences')
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Cookie Preferences')
    
    // Verify current status shows "No preference set"
    const statusText = page.locator('text=/Current Status:/i')
    await expect(statusText).toBeVisible()
    await expect(page.locator('text=/No preference set/i')).toBeVisible()
    
    // Verify button text shows "Set Preferences"
    await expect(page.locator('button').filter({ hasText: 'Set Preferences' })).toBeVisible()
  })

  test('allows user to accept cookies and view updated status on preferences page', async ({ page }) => {
    // First, navigate to home page and accept cookies
    await page.goto('/')
    
    // Wait for cookie banner to appear
    const cookieBanner = page.locator('.cookie-banner')
    await expect(cookieBanner).toBeVisible({ timeout: 10000 })
    
    // Click "Accept All" button
    const acceptButton = page.locator('button').filter({ hasText: /Accept All/i })
    await expect(acceptButton).toBeVisible()
    await acceptButton.click()
    
    // Wait for banner to disappear
    await expect(cookieBanner).not.toBeVisible({ timeout: 5000 })
    
    // Navigate to cookie preferences page
    await page.goto('/cookie-preferences')
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Cookie Preferences')
    
    // Verify current status shows "Analytics cookies are enabled"
    await expect(page.locator('text=/Analytics cookies are enabled/i')).toBeVisible()
    
    // Verify button text shows "Disable Analytics"
    await expect(page.locator('button').filter({ hasText: 'Disable Analytics' })).toBeVisible()
  })

  test('allows user to reject cookies and view updated status on preferences page', async ({ page }) => {
    // First, navigate to home page and reject cookies
    await page.goto('/')
    
    // Wait for cookie banner to appear
    const cookieBanner = page.locator('.cookie-banner')
    await expect(cookieBanner).toBeVisible({ timeout: 10000 })
    
    // Click "Reject All" button
    const rejectButton = page.locator('button').filter({ hasText: /Reject All/i })
    await expect(rejectButton).toBeVisible()
    await rejectButton.click()
    
    // Wait for banner to disappear
    await expect(cookieBanner).not.toBeVisible({ timeout: 5000 })
    
    // Navigate to cookie preferences page
    await page.goto('/cookie-preferences')
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Cookie Preferences')
    
    // Verify current status shows "Analytics cookies are disabled"
    await expect(page.locator('text=/Analytics cookies are disabled/i')).toBeVisible()
    
    // Verify button text shows "Enable Analytics"
    await expect(page.locator('button').filter({ hasText: 'Enable Analytics' })).toBeVisible()
  })

  test('allows user to update preferences by clearing consent and showing banner again', async ({ page }) => {
    // First, accept cookies
    await page.goto('/')
    const cookieBanner = page.locator('.cookie-banner')
    await expect(cookieBanner).toBeVisible({ timeout: 10000 })
    await page.locator('button').filter({ hasText: /Accept All/i }).click()
    await expect(cookieBanner).not.toBeVisible({ timeout: 5000 })
    
    // Navigate to cookie preferences page
    await page.goto('/cookie-preferences')
    await expect(page.locator('h1')).toContainText('Cookie Preferences')
    
    // Verify status shows enabled
    await expect(page.locator('text=/Analytics cookies are enabled/i')).toBeVisible()
    
    // Click "Disable Analytics" button (this clears consent and reloads page)
    const updateButton = page.locator('button').filter({ hasText: 'Disable Analytics' })
    await updateButton.click()
    
    // Wait for page reload and cookie banner to appear
    await expect(cookieBanner).toBeVisible({ timeout: 10000 })
    
    // Verify we're still on cookie preferences page after reload
    await expect(page.locator('h1')).toContainText('Cookie Preferences')
    
    // Now reject cookies via banner
    await page.locator('button').filter({ hasText: /Reject All/i }).click()
    await expect(cookieBanner).not.toBeVisible({ timeout: 5000 })
    
    // Verify status updated to disabled
    await expect(page.locator('text=/Analytics cookies are disabled/i')).toBeVisible()
    await expect(page.locator('button').filter({ hasText: 'Enable Analytics' })).toBeVisible()
  })

  test('allows user to enable analytics after previously disabling it', async ({ page }) => {
    // First, reject cookies
    await page.goto('/')
    const cookieBanner = page.locator('.cookie-banner')
    await expect(cookieBanner).toBeVisible({ timeout: 10000 })
    await page.locator('button').filter({ hasText: /Reject All/i }).click()
    await expect(cookieBanner).not.toBeVisible({ timeout: 5000 })
    
    // Navigate to cookie preferences page
    await page.goto('/cookie-preferences')
    await expect(page.locator('h1')).toContainText('Cookie Preferences')
    
    // Verify status shows disabled
    await expect(page.locator('text=/Analytics cookies are disabled/i')).toBeVisible()
    
    // Click "Enable Analytics" button (this clears consent and reloads page)
    const updateButton = page.locator('button').filter({ hasText: 'Enable Analytics' })
    await updateButton.click()
    
    // Wait for page reload and cookie banner to appear
    await expect(cookieBanner).toBeVisible({ timeout: 10000 })
    
    // Accept cookies via banner
    await page.locator('button').filter({ hasText: /Accept All/i }).click()
    await expect(cookieBanner).not.toBeVisible({ timeout: 5000 })
    
    // Verify status updated to enabled
    await expect(page.locator('text=/Analytics cookies are enabled/i')).toBeVisible()
    await expect(page.locator('button').filter({ hasText: 'Disable Analytics' })).toBeVisible()
  })

  test('allows user to navigate to privacy policy from cookie preferences page', async ({ page }) => {
    // Navigate to cookie preferences page
    await page.goto('/cookie-preferences')
    await expect(page.locator('h1')).toContainText('Cookie Preferences')
    
    // Find and click the privacy policy link
    const privacyLink = page.locator('a').filter({ hasText: /Back to Privacy Policy/i })
    await expect(privacyLink).toBeVisible()
    await privacyLink.click()
    
    // Verify navigation to privacy policy page
    await expect(page).toHaveURL(/\/privacy/)
    await expect(page.locator('h1')).toContainText(/Privacy/i)
  })
})
