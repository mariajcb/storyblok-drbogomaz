# Testing Documentation

This project uses a testing strategy based on Kent C. Dodds' philosophy: "Write tests. Not too many. Mostly integration."

## Testing Philosophy

- **Integration Tests (60-70%)**: Test components working together
- **Unit Tests (20-30%)**: Test isolated logic and composables
- **E2E Tests (10-20%)**: Test critical user journeys
- **Target Coverage**: 70-80% (avoid 100% mandate)

## Guidelines for the team

- **Before pushing**: Run `npm run test:run` (Vitest) so unit and integration tests pass. Run `npm run test:e2e:chromium` before merging if you changed UI or critical flows.
- **When to add tests**: Add or update tests when you add user-facing behaviour, composables, or API integration. Prefer integration tests over unit tests for components.
- **What to test**: Behaviour and outcomes (e.g. "user sees success message after submit") rather than implementation (e.g. specific CSS classes or internal state).
- **Coverage**: Aim for 70–80% overall; don’t chase 100%. Focus on critical paths and business logic.
- **CI**: The full suite (Vitest + Playwright) runs in CI. Use `test:run:unit`, `test:run:integration`, or `test:e2e:smoke` locally for faster feedback.

## Test Structure

```
tests/
├── unit/                    # Unit tests (20-30%)
│   ├── composables/        # useCookieConsent, useMarkdown
│   ├── utils/              # Helper functions
│   └── components/         # Isolated component logic
├── integration/            # Integration tests (60-70%)
│   ├── components/         # Component interactions
│   ├── pages/              # Page-level functionality
│   ├── navigation/         # Routing and navigation
│   └── forms/              # Form submissions
├── e2e/                    # End-to-end tests (10-20%)
│   ├── critical-flows/     # User journeys
│   └── cross-browser/      # Browser compatibility
├── fixtures/               # Test data and mocks
├── utils/                  # Test utilities and helpers
└── setup.js               # Test environment setup
```

## Running Tests

### Development Mode
```bash
npm run test          # Start Vitest in watch mode
npm run test:watch    # Start Vitest in watch mode (explicit)
```

### CI/CD Mode
```bash
npm run test:run           # Run all Vitest tests once
npm run test:run:unit     # Run only unit tests (faster feedback)
npm run test:run:integration  # Run only integration tests
npm run test:coverage      # Run tests with coverage report
```

### E2E (Playwright)
```bash
npm run test:e2e          # Run E2E tests in all browsers (Chromium, Firefox, WebKit, Mobile)
npm run test:e2e:chromium # Run E2E in Chromium only (faster for local feedback)
npm run test:e2e:smoke    # Run only cross-browser smoke tests in Chromium
npm run test:e2e:ui       # Playwright UI mode
```

### UI Mode
```bash
npm run test:ui       # Start Vitest UI (if @vitest/ui is installed)
```

## Test Commands

### Vitest (unit + integration)
- `npm run test` - Start Vitest in watch mode
- `npm run test:run` - Run all tests once
- `npm run test:run:unit` - Run only unit tests
- `npm run test:run:integration` - Run only integration tests
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ui` - Start Vitest UI
- `npm run test:watch` - Start Vitest in watch mode

### Playwright (E2E)
- `npm run test:e2e` - Run E2E in all configured browsers
- `npm run test:e2e:chromium` - Run E2E in Chromium only (quicker)
- `npm run test:e2e:smoke` - Run smoke tests in Chromium only
- `npm run test:e2e:ui` - Playwright UI

## Writing Tests

### Test Naming Convention
```javascript
describe('ComponentName', () => {
  it('should do something specific when condition is met', () => {
    // Test implementation
  })
})
```

### Test Structure
```javascript
describe('ComponentName Integration', () => {
  beforeEach(() => {
    // Setup before each test
  })

  it('should render correctly', () => {
    // Test rendering
  })

  it('should handle user interactions', async () => {
    // Test user interactions
  })

  it('should handle errors gracefully', async () => {
    // Test error handling
  })
})
```

### Using Test Utilities
```javascript
import { mountComponent, createMockStoryblokData } from '~/tests/utils/test-helpers'

// Mount component with common options
const wrapper = mountComponent(ComponentName, {
  props: { title: 'Test Title' }
})

// Create mock data
const mockData = createMockStoryblokData('page', {
  content: { title: 'Custom Title' }
})
```

## Coverage Targets

- **Overall Project**: 70-80%
- **Components**: 75-85%
- **Composables**: 90-95%
- **Pages**: 60-70%

## Best Practices

1. **Test Behavior, Not Implementation**: Focus on what the component does, not how it does it
2. **Minimize Mocking**: Test real integrations when possible
3. **Use Descriptive Names**: Test names should explain the expected behavior
4. **Test User Interactions**: Focus on how users interact with components
5. **Avoid Over-Testing**: Don't test trivial code that ESLint/TypeScript can catch

## Parallelization and Speed

- **Vitest**: Tests run in parallel by default (thread pool). Use `test:run:unit` or `test:run:integration` for faster feedback when working on one layer.
- **Playwright**: E2E tests run in parallel across workers and browser projects. Use `test:e2e:chromium` or `test:e2e:smoke` for quicker local runs; full `test:e2e` runs all browsers.

## Reducing E2E Flakiness

1. **Rely on auto-waiting**: Use Playwright assertions (`expect(locator).toBeVisible()`) instead of fixed `page.waitForTimeout()` so tests proceed as soon as conditions are met.
2. **Stable selectors**: Prefer role, label, or test IDs over fragile CSS (e.g. `.cookie-banner` is acceptable for known structure; avoid deep or dynamic class chains).
3. **Retries in CI**: Playwright is configured with `retries: 2` in CI to absorb occasional network or timing variance.
4. **Isolate state**: Clear storage or navigate to a known state in `beforeEach` when tests depend on it (e.g. cookie consent).

## Test patterns (this project)

- **Storyblok components**: Use a `blok` prop object shaped like Storyblok content (e.g. `title`, `text.content`, `image.filename`). Stub `StoryblokComponent` when testing Page/Grid. See `tests/integration/storyblok/StoryblokErrorHandling.test.js`.
- **Nuxt in Vitest**: Stub `NuxtLink` as `<a>` (or a small wrapper). For components that call `useNuxtApp()` (e.g. Blog), either mock `#app` in the test with `vi.mock('#app', () => ({ useNuxtApp: () => ({ $gtag: mockGtag }) }))` or rely on the `#app` alias in `vitest.config.js` pointing at `tests/mocks/app.js`. Define mock values at module scope if the mock factory needs them (e.g. `const mockGtag = vi.fn()`).
- **Composables**: Mock at the test file with `vi.mock('~/composables/useMarkdown', () => ({ useMarkdown: () => ({ renderMarkdown: (c) => c ? `<p>${c}</p>` : '' }) }))` so components that use the composable still render.
- **Integration vs unit**: Put tests that mount multiple components or depend on router/storage in `tests/integration/`. Put tests that only test one composable or one component’s logic in `tests/unit/`.
- **E2E**: Prefer `expect(locator).toBeVisible()` and similar assertions over `page.waitForTimeout()`. Use `beforeEach` to clear `localStorage`/`sessionStorage` when testing cookie consent.

## Common Patterns

### Testing Form Submissions
```javascript
it('should submit form data successfully', async () => {
  const wrapper = mount(FormComponent)
  
  // Fill form
  await wrapper.find('input[name="email"]').setValue('test@example.com')
  
  // Submit
  await wrapper.find('form').trigger('submit')
  
  // Assert success
  expect(wrapper.text()).toContain('Success')
})
```

### Testing API Calls
```javascript
it('should fetch and display data', async () => {
  mockFetch({ data: 'test' })
  
  const wrapper = mount(DataComponent)
  
  // Wait for async operations
  await wrapper.vm.$nextTick()
  
  // Assert data is displayed
  expect(wrapper.text()).toContain('test')
})
```

### Testing Navigation
```javascript
it('should navigate to correct route', async () => {
  const mockRouter = { push: vi.fn() }
  const wrapper = mount(Component, {
    global: { mocks: { $router: mockRouter } }
  })
  
  await wrapper.find('a').trigger('click')
  
  expect(mockRouter.push).toHaveBeenCalledWith('/expected-route')
})
```

## Troubleshooting

See **[tests/TROUBLESHOOTING.md](./TROUBLESHOOTING.md)** for common failures (e.g. `useNuxtApp` / `#app`, NuxtLink stubs, `document.createElement`, E2E port and flakiness) and how to fix them.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library Vue](https://testing-library.com/docs/vue-testing-library/intro/)
- [Nuxt Testing](https://nuxt.com/docs/guide/going-further/testing)
- [Playwright Documentation](https://playwright.dev/docs/intro)
