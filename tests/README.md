# Testing Documentation

This project uses a testing strategy based on Kent C. Dodds' philosophy: "Write tests. Not too many. Mostly integration."

## Testing Philosophy

- **Integration Tests (60-70%)**: Test components working together
- **Unit Tests (20-30%)**: Test isolated logic and composables
- **E2E Tests (10-20%)**: Test critical user journeys
- **Target Coverage**: 70-80% (avoid 100% mandate)

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
npm run test:run      # Run tests once and exit
npm run test:coverage # Run tests with coverage report
```

### UI Mode
```bash
npm run test:ui       # Start Vitest UI (if @vitest/ui is installed)
```

## Test Commands

- `npm run test` - Start Vitest in watch mode
- `npm run test:run` - Run tests once
- `npm run test:coverage` - Run tests with coverage
- `npm run test:ui` - Start Vitest UI
- `npm run test:watch` - Start Vitest in watch mode

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

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Vue Test Utils](https://test-utils.vuejs.org/)
- [Testing Library Vue](https://testing-library.com/docs/vue-testing-library/intro/)
- [Nuxt Testing](https://nuxt.com/docs/guide/going-further/testing)
