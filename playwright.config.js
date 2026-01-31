import { defineConfig, devices } from '@playwright/test'

/**
 * Playwright configuration for Nuxt 3 application
 * @see https://playwright.dev/docs/test-configuration
 *
 * Parallelization: fullyParallel runs test files in parallel; workers use all
 * available cores locally. CI uses 1 worker to avoid overloading the single dev server.
 */
export default defineConfig({
  testDir: './tests/e2e',

  timeout: 30 * 1000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI, // no test skips in production
  retries: process.env.CI ? 2 : 0, // retries in CI reduce flakiness from network/timing
  workers: process.env.CI ? 1 : undefined,
  
  reporter: [
    ['html'],
    ['list'], // console output
    process.env.CI ? ['github'] : ['list']
  ],
  use: {
    baseURL: process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
})

