import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContactForm from '../../../components/ContactForm.vue'

describe('ContactForm Integration', () => {
  it('should render the contact form with all required fields', () => {
    const wrapper = mount(ContactForm)
    
    expect(wrapper.find('form').exists()).toBe(true)
    expect(wrapper.find('input[name="name"]').exists()).toBe(true)
    expect(wrapper.find('input[name="email"]').exists()).toBe(true)
    expect(wrapper.find('textarea[name="message"]').exists()).toBe(true)
    expect(wrapper.find('button[type="submit"]').exists()).toBe(true)
  })

  it('should display the form title and description', () => {
    const wrapper = mount(ContactForm)
    
    expect(wrapper.text()).toContain('Contact Me')
    expect(wrapper.text()).toContain('Please use this form for general information purposes only')
  })

  it('should have proper form structure', () => {
    const wrapper = mount(ContactForm)
    
    const form = wrapper.find('form')
    expect(form.exists()).toBe(true)
    
    // Check that form exists and is properly rendered
    expect(form.element.tagName).toBe('FORM')
  })

  it('should render all form inputs with proper attributes', () => {
    const wrapper = mount(ContactForm)
    
    const nameInput = wrapper.find('input[name="name"]')
    const emailInput = wrapper.find('input[name="email"]')
    const messageTextarea = wrapper.find('textarea[name="message"]')
    
    expect(nameInput.exists()).toBe(true)
    expect(emailInput.exists()).toBe(true)
    expect(messageTextarea.exists()).toBe(true)
    
    // Check that inputs have proper types
    expect(emailInput.attributes('type')).toBe('email')
  })
})
