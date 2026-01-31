import { test, expect } from '@playwright/test'

/**
 * E2E Test: Contact Form Submission Flow
 * 
 * Tests the complete user journey of submitting a contact form:
 * 1. User navigates to contact page
 * 2. User fills out the contact form
 * 3. User submits the form
 * 4. User sees success/error feedback
 * 
 * Philosophy: Tests the critical user flow end-to-end, focusing on the
 * complete submission process rather than individual validation rules
 * (which are covered in unit tests). This validates that the form
 * integration with Formcarry API works correctly.
 */
test.describe('Contact Form Submission Flow', () => {
  test('allows user to submit contact form with valid data', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact')
    
    // Wait for form to be visible
    const form = page.locator('form')
    await expect(form).toBeVisible()
    
    // Fill out the form with valid data
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="phone"]', '(555)123-4567')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('textarea[name="message"]', 'This is a test message for E2E testing.')
    
    // Submit the form
    const submitButton = page.locator('button[type="submit"]')
    await expect(submitButton).toBeEnabled()
    await submitButton.click()
    
    // Wait for submission to complete (button should show "Sending..." then form should disappear)
    await expect(submitButton).toHaveText('Sending...', { timeout: 5000 })
    
    // Wait for success message to appear
    const successMessage = page.locator('text=/Thank you!/i')
    await expect(successMessage).toBeVisible({ timeout: 15000 })
    
    // Verify success message content
    await expect(page.locator('text=/Your message has been sent successfully/i')).toBeVisible()
  })

  test('shows validation errors when form is submitted with empty required fields', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact')
    
    // Wait for form to be visible
    const form = page.locator('form')
    await expect(form).toBeVisible()
    
    // Try to submit form without filling any fields
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Wait for validation errors to appear (auto-waits via expect)
    // Verify validation errors are shown for all required fields
    await expect(page.locator('text=/Name is required/i')).toBeVisible()
    await expect(page.locator('text=/Phone is required/i')).toBeVisible()
    await expect(page.locator('text=/Email is required/i')).toBeVisible()
    await expect(page.locator('text=/Message is required/i')).toBeVisible()
    
    // Verify form is still visible (not submitted)
    await expect(form).toBeVisible()
  })

  test('shows validation error for invalid email format', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact')
    
    // Wait for form to be visible
    const form = page.locator('form')
    await expect(form).toBeVisible()
    
    // Fill out form with invalid email
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="phone"]', '(555)123-4567')
    await page.fill('input[name="email"]', 'invalid-email')
    await page.fill('textarea[name="message"]', 'Test message')
    
    // Trigger validation by blurring email field
    await page.locator('input[name="email"]').blur()
    
    // Verify email validation error is shown
    await expect(page.locator('text=/Invalid email address/i')).toBeVisible()
    
    // Try to submit - form should not submit
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Verify form is still visible (not submitted) - auto-waits for condition
    await expect(form).toBeVisible()
  })

  test('disables submit button while form is submitting', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact')
    
    // Fill out the form with valid data
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="phone"]', '(555)123-4567')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('textarea[name="message"]', 'Test message')
    
    // Submit the form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Verify button shows "Sending..." and is disabled
    await expect(submitButton).toHaveText('Sending...', { timeout: 5000 })
    await expect(submitButton).toBeDisabled()
  })

  test('shows error message when form submission fails', async ({ page }) => {
    // Navigate to contact page
    await page.goto('/contact')
    
    // Intercept the form submission and force an error
    await page.route('https://formcarry.com/s/mskpCnP2jVxt', async route => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ code: 500, message: 'Server error' })
      })
    })
    
    // Fill out the form with valid data
    await page.fill('input[name="name"]', 'John Doe')
    await page.fill('input[name="phone"]', '(555)123-4567')
    await page.fill('input[name="email"]', 'john.doe@example.com')
    await page.fill('textarea[name="message"]', 'Test message')
    
    // Submit the form
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    // Wait for error message to appear
    const errorMessage = page.locator('text=/Error/i')
    await expect(errorMessage).toBeVisible({ timeout: 15000 })
    
    // Verify error message content
    await expect(page.locator('text=/There was an error sending your message/i')).toBeVisible()
  })
})
