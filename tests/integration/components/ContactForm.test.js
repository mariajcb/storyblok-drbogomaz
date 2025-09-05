import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactForm from '../../../components/ContactForm.vue'

describe('ContactForm Integration', () => {
  let mockFetch

  beforeEach(() => {
    mockFetch = vi.fn()
    global.fetch = mockFetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('should integrate form validation with submission flow', async () => {
    const wrapper = mount(ContactForm)
    
    // Initially, no validation errors should be shown
    expect(wrapper.text()).not.toContain('Name is required')
    expect(wrapper.text()).not.toContain('Phone is required')
    expect(wrapper.text()).not.toContain('Email is required')
    expect(wrapper.text()).not.toContain('Message is required')
    
    // Try to submit empty form - should trigger validation
    await wrapper.find('form').trigger('submit')
    
    // Wait for Vue to update
    await wrapper.vm.$nextTick()
    
    // Validation errors should now be visible
    expect(wrapper.text()).toContain('Name is required')
    expect(wrapper.text()).toContain('Phone is required')
    expect(wrapper.text()).toContain('Email is required')
    expect(wrapper.text()).toContain('Message is required')
    
    // Form should still be visible (not submitted)
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('div[v-else-if="status === \'success\'"]').exists()).toBe(false)
  })

  it('should integrate form submission with API call and success state', async () => {
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ code: 200 })
    })

    const wrapper = mount(ContactForm)
    
    // Fill out the form
    await wrapper.find('input[name="name"]').setValue('John Doe')
    await wrapper.find('input[name="phone"]').setValue('(555) 123-4567')
    await wrapper.find('input[name="email"]').setValue('john@example.com')
    await wrapper.find('textarea[name="message"]').setValue('Test message')
    
    // Submit the form
    await wrapper.find('form').trigger('submit')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    
    // Verify API was called with correct data
    expect(mockFetch).toHaveBeenCalledWith(
      'https://formcarry.com/s/mskpCnP2jVxt',
      expect.objectContaining({
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: 'John Doe',
          phone: '(555) 123-4567',
          email: 'john@example.com',
          message: 'Test message'
        })
      })
    )
    
    // Wait for the API response to be processed
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Should show success state
    expect(wrapper.text()).toContain('Thank you!')
    expect(wrapper.text()).toContain('Your message has been sent successfully.')
    
    // Form should be hidden, success message should be visible
    expect(wrapper.find('form').exists()).toBe(false)
    expect(wrapper.text()).toContain('Thank you!')
  })

  it('should integrate form submission with API error handling', async () => {
    // Mock API error response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ code: 400 }) // Non-200 code
    })

    const wrapper = mount(ContactForm)
    
    // Fill out the form
    await wrapper.find('input[name="name"]').setValue('Jane Doe')
    await wrapper.find('input[name="phone"]').setValue('(555) 987-6543')
    await wrapper.find('input[name="email"]').setValue('jane@example.com')
    await wrapper.find('textarea[name="message"]').setValue('Another test message')
    
    // Submit the form
    await wrapper.find('form').trigger('submit')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    
    // Wait for the API response to be processed
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Should show error state
    expect(wrapper.text()).toContain('Error')
    expect(wrapper.text()).toContain('There was an error sending your message. Please try again later.')
    
    // Form should be hidden, error message should be visible
    expect(wrapper.find('form').exists()).toBe(false)
    expect(wrapper.text()).toContain('Error')
  })

  it('should integrate form submission with network error handling', async () => {
    // Mock network error
    mockFetch.mockRejectedValueOnce(new Error('Network error'))

    const wrapper = mount(ContactForm)
    
    // Fill out the form
    await wrapper.find('input[name="name"]').setValue('Bob Smith')
    await wrapper.find('input[name="phone"]').setValue('(555) 111-2222')
    await wrapper.find('input[name="email"]').setValue('bob@example.com')
    await wrapper.find('textarea[name="message"]').setValue('Network test message')
    
    // Submit the form
    await wrapper.find('form').trigger('submit')
    
    // Wait for async operations
    await wrapper.vm.$nextTick()
    
    // Wait for the error to be processed
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Should show error state
    expect(wrapper.text()).toContain('Error')
    expect(wrapper.text()).toContain('There was an error sending your message. Please try again later.')
  })

  it('should integrate loading state with form submission', async () => {
    // Mock a slow API response
    mockFetch.mockImplementationOnce(() => 
      new Promise(resolve => 
        setTimeout(() => resolve({
          ok: true,
          json: async () => ({ code: 200 })
        }), 100)
      )
    )

    const wrapper = mount(ContactForm)
    
    // Fill out the form
    await wrapper.find('input[name="name"]').setValue('Alice Johnson')
    await wrapper.find('input[name="phone"]').setValue('(555) 333-4444')
    await wrapper.find('input[name="email"]').setValue('alice@example.com')
    await wrapper.find('textarea[name="message"]').setValue('Loading test message')
    
    // Submit the form
    await wrapper.find('form').trigger('submit')
    
    // Wait for Vue to update
    await wrapper.vm.$nextTick()
    
    // Button should show loading state
    expect(wrapper.find('button').text()).toBe('Sending...')
    expect(wrapper.find('button').attributes('disabled')).toBeDefined()
    
    // Wait for the API response
    await new Promise(resolve => setTimeout(resolve, 150))
    await wrapper.vm.$nextTick()
    
    // Should show success state
    expect(wrapper.text()).toContain('Thank you!')
  })

  it('should integrate email validation with form submission', async () => {
    const wrapper = mount(ContactForm)
    
    // Fill out form with invalid email
    await wrapper.find('input[name="name"]').setValue('Test User')
    await wrapper.find('input[name="phone"]').setValue('(555) 555-5555')
    await wrapper.find('input[name="email"]').setValue('invalid-email')
    await wrapper.find('textarea[name="message"]').setValue('Test message')
    
    // Trigger email validation by blurring the email field
    await wrapper.find('input[name="email"]').trigger('blur')
    await wrapper.vm.$nextTick()
    
    // Should show email validation error
    expect(wrapper.text()).toContain('Invalid email address')
    
    // Try to submit - should not proceed
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    
    // Form should still be visible (not submitted)
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('div[v-else-if="status === \'success\'"]').exists()).toBe(false)
    
    // Fix email and submit again
    await wrapper.find('input[name="email"]').setValue('valid@email.com')
    
    // Mock successful API response
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ code: 200 })
    })
    
    await wrapper.find('form').trigger('submit')
    await wrapper.vm.$nextTick()
    
    // Wait for API response
    await new Promise(resolve => setTimeout(resolve, 0))
    await wrapper.vm.$nextTick()
    
    // Should now show success
    expect(wrapper.text()).toContain('Thank you!')
  })
})