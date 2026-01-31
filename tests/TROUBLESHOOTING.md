# Test troubleshooting guide

Common test failures and how to fix them.

## Vitest (unit & integration)

### `useNuxtApp is not defined` / `Failed to resolve import "#app"`

**Cause:** A component uses `useNuxtApp()` (or `import { useNuxtApp } from '#app'`) but Vitest has no Nuxt runtime.

**Fix:**

1. Ensure `vitest.config.js` has a `#app` alias pointing at `tests/mocks/app.js` (see `resolve.alias`).
2. In the component, use an explicit import: `import { useNuxtApp } from '#app'` so Vitest can resolve it.
3. If the test mocks `#app` with `vi.mock('#app', () => ({ useNuxtApp: () => ({ $gtag: mockGtag }) }))`, define `mockGtag` at **module scope** (e.g. `const mockGtag = vi.fn()` at the top of the file), not inside `beforeEach`, so the hoisted mock can reference it.

### `Component is missing template or render function: { name: 'NuxtLink' }`

**Cause:** A component uses `<NuxtLink>` but the test doesn’t stub it.

**Fix:** In the test’s `mount()` options, add:

```javascript
global: {
  stubs: {
    NuxtLink: { template: '<a :href="to"><slot /></a>', props: ['to'] }
    // or simply: NuxtLink: 'a'
  }
}
```

Or stub it globally in `tests/setup.js` (already done for some tests).

### `useCookieConsent is not defined`

**Cause:** A component uses the `useCookieConsent` composable, which isn’t auto-imported in Vitest.

**Fix:** In the test file, mock the composable before mounting:

```javascript
vi.mock('~/composables/useCookieConsent', () => ({
  useCookieConsent: () => ({
    consent: ref({ analytics: false }),
    acceptAll: vi.fn(),
    rejectAll: vi.fn(),
    showBanner: ref(true)
    // add other keys the component uses
  })
}))
```

### `document.createElement is not a function`

**Cause:** Something in the component or a dependency (e.g. a library) expects a real DOM and uses `document.createElement`; jsdom may not provide it in the way the code expects, or the test environment is missing a polyfill.

**Fix:**

1. Ensure Vitest is using `environment: 'jsdom'` in `vitest.config.js`.
2. If the failure is inside a specific library, stub that dependency or use a different test strategy (e.g. E2E for that flow).
3. In `tests/setup.js`, you can polyfill or replace `document.createElement` if needed for a known quirk.

### `Cannot read properties of undefined (reading 'content')` (e.g. in Storyblok components)

**Cause:** The component assumes a prop (e.g. `blok.text.content`) exists and doesn’t guard against missing CMS data.

**Fix:** In the component, use optional chaining and defaults (e.g. `blok.text?.content || []`, `v-if="blok.image"`) so missing or partial data doesn’t throw. Then the “error handling” integration tests can pass with minimal blok shapes.

### Running a single test file or test case

```bash
# Single file
npx vitest run tests/unit/composables/useMarkdown.test.js

# Single file, watch
npx vitest tests/integration/storyblok/StoryblokErrorHandling.test.js

# Single test by name (pattern)
npx vitest run -t "renders title text when text content"
```

### Coverage fails or thresholds not met

- Run `npm run test:coverage` and open `coverage/index.html` to see what’s uncovered.
- Thresholds are in `vitest.config.js` under `coverage.thresholds`. Adjust or add tests for critical paths; avoid chasing 100% on every file.

---

## Playwright (E2E)

### `http://localhost:3000 is already used`

**Cause:** Another process (e.g. `npm run dev`) is already using port 3000, and Playwright is trying to start its own dev server.

**Fix:** Either stop the other process, or rely on `reuseExistingServer: !process.env.CI` in `playwright.config.js` so Playwright reuses an existing server when not in CI. If you run with an existing dev server, ensure it’s on the same port as `webServer.url`.

### E2E test passes locally but fails in CI

**Cause:** Timing, network, or environment differences (slower CI, different viewport, no reuse of server).

**Fix:**

1. Prefer Playwright’s auto-waiting (`expect(locator).toBeVisible()`) instead of fixed `waitForTimeout`.
2. CI uses `retries: 2`; if a test is still flaky, make waits conditional or increase timeout for that test.
3. Ensure the test doesn’t depend on local-only state (e.g. leftover `localStorage`). Use `beforeEach` to clear storage or navigate to a known URL.

### Running a single E2E test or project

```bash
# One project (e.g. Chromium only)
npm run test:e2e:chromium

# One file
npx playwright test tests/e2e/ContactFormSubmissionFlow.test.js

# One project + one file
npx playwright test tests/e2e/CrossBrowserSmoke.test.js --project=chromium

# By test name
npx playwright test -g "allows user to submit contact form"
```

### Debugging E2E

- Run with UI: `npm run test:e2e:ui`.
- Run headed (see browser): `npx playwright test --headed`.
- Generate trace on failure: `trace: 'on-first-retry'` is already set; open the trace from the HTML report after a retry.
- Use `page.pause()` in the test to stop execution and inspect the page (only when not in CI).

---

## General

- **Vitest**: See [Vitest docs](https://vitest.dev/).
- **Playwright**: See [Playwright docs](https://playwright.dev/docs/intro).
- **Project testing plan**: See `.cursor/testing-implementation-plan.md` and `tests/README.md`.
