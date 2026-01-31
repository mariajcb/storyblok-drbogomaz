import { test, expect } from '@playwright/test'

/**
 * E2E Test: Blog Post Reading Flow
 * 
 * Tests the complete user journey of discovering and reading a blog post:
 * 1. User navigates to blog index page
 * 2. User sees list of blog posts
 * 3. User clicks on a blog post
 * 4. User reads the blog post content
 * 
 * Philosophy: Tests the critical user flow end-to-end, focusing on behavior
 * rather than implementation details. This validates that the Storyblok
 * integration works correctly and users can successfully read blog content.
 */
test.describe('Blog Post Reading Flow', () => {
  test('allows user to navigate from blog index to individual blog post and read content', async ({ page }) => {
    // Navigate to blog index page
    await page.goto('/blog')
    
    // Wait for blog posts to load (check for loading state to disappear)
    await page.waitForSelector('text=Loading blog posts...', { state: 'hidden', timeout: 10000 })
    
    // Verify blog index page loaded successfully
    // Check that we're not showing an error message
    const errorMessage = page.locator('text=/Failed to load blog posts/i')
    await expect(errorMessage).not.toBeVisible()
    
    // Find the first blog post link
    const firstBlogPostLink = page.locator('a.blog__detail-link').first()
    
    // Verify at least one blog post exists
    await expect(firstBlogPostLink).toBeVisible()
    
    // Get the blog post title for verification
    const blogPostTitle = await firstBlogPostLink.textContent()
    expect(blogPostTitle).toBeTruthy()
    
    // Click on the first blog post
    await firstBlogPostLink.click()
    
    // Wait for navigation to blog post page
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 })
    
    // Wait for blog post content to load
    await page.waitForSelector('text=Loading blog post...', { state: 'hidden', timeout: 10000 })
    
    // Verify blog post page loaded successfully
    // Check that we're not showing an error message
    const postErrorMessage = page.locator('text=/Failed to load blog post/i')
    await expect(postErrorMessage).not.toBeVisible()
    
    // Verify blog post content is displayed
    // The Blog component should render the post content
    const blogContent = page.locator('section.section')
    await expect(blogContent).toBeVisible()
  })

  test('displays error message when blog post cannot be loaded', async ({ page }) => {
    // Navigate to a non-existent blog post
    await page.goto('/blog/non-existent-post-slug')
    
    // Wait for loading state to complete
    await page.waitForSelector('text=Loading blog post...', { state: 'hidden', timeout: 10000 })
    
    // Verify error message is displayed
    const errorMessage = page.locator('text=/Failed to load blog post|Blog post not found/i')
    await expect(errorMessage).toBeVisible()
  })

  test('allows user to navigate back from blog post to blog index', async ({ page }) => {
    // Navigate to blog index
    await page.goto('/blog')
    
    // Wait for blog posts to load
    await page.waitForSelector('text=Loading blog posts...', { state: 'hidden', timeout: 10000 })
    
    // Click on first blog post
    const firstBlogPostLink = page.locator('a.blog__detail-link').first()
    await firstBlogPostLink.click()
    
    // Wait for blog post page to load
    await page.waitForURL(/\/blog\/.+/, { timeout: 10000 })
    await page.waitForSelector('text=Loading blog post...', { state: 'hidden', timeout: 10000 })
    
    // Navigate back using browser back button
    await page.goBack()
    
    // Verify we're back on blog index
    await expect(page).toHaveURL(/\/blog$/)
    
    // Verify blog posts are still visible
    const blogPostLink = page.locator('a.blog__detail-link').first()
    await expect(blogPostLink).toBeVisible()
  })
})
