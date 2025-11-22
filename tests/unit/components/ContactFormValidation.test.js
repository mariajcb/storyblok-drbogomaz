import { describe, it, expect } from 'vitest'
import { computed, ref } from 'vue'

// Extract validation logic for testing
const createValidationLogic = () => {
  const name = ref('')
  const phone = ref('')
  const email = ref('')
  const message = ref('')

  const nameError = computed(() => {
    if (!name.value) return 'Name is required'
    return ''
  })

  const phoneError = computed(() => {
    if (!phone.value) return 'Phone is required'
    return ''
  })

  const emailError = computed(() => {
    if (!email.value) return 'Email is required'
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.value)) {
      return 'Invalid email address'
    }
    return ''
  })

  const messageError = computed(() => {
    if (!message.value) return 'Message is required'
    return ''
  })

  return {
    name,
    phone,
    email,
    message,
    nameError,
    phoneError,
    emailError,
    messageError
  }
}

describe('ContactForm Validation Logic', () => {
  describe('Name Validation', () => {
    it('returns empty string when name is provided', () => {
      const { name, nameError } = createValidationLogic()
      name.value = 'John Doe'

      expect(nameError.value).toBe('')
    })

    it('returns error message when name is empty', () => {
      const { name, nameError } = createValidationLogic()
      name.value = ''

      expect(nameError.value).toBe('Name is required')
    })

    it('returns empty string when name contains only whitespace', () => {
      const { name, nameError } = createValidationLogic()
      name.value = '   '

      expect(nameError.value).toBe('')
    })
  })

  describe('Phone Validation', () => {
    it('returns empty string when phone is provided', () => {
      const { phone, phoneError } = createValidationLogic()
      phone.value = '(555) 123-4567'

      expect(phoneError.value).toBe('')
    })

    it('returns error message when phone is empty', () => {
      const { phone, phoneError } = createValidationLogic()
      phone.value = ''

      expect(phoneError.value).toBe('Phone is required')
    })
  })

  describe('Email Validation', () => {
    it('returns empty string when email is valid', () => {
      const { email, emailError } = createValidationLogic()
      email.value = 'test@example.com'

      expect(emailError.value).toBe('')
    })

    it('returns error message when email is empty', () => {
      const { email, emailError } = createValidationLogic()
      email.value = ''

      expect(emailError.value).toBe('Email is required')
    })

    it('returns error message when email format is invalid', () => {
      const { email, emailError } = createValidationLogic()
      email.value = 'invalid-email'

      expect(emailError.value).toBe('Invalid email address')
    })

    it('returns error message when email is missing domain', () => {
      const { email, emailError } = createValidationLogic()
      email.value = 'test@'

      expect(emailError.value).toBe('Invalid email address')
    })

    it('returns error message when email is missing @ symbol', () => {
      const { email, emailError } = createValidationLogic()
      email.value = 'testexample.com'

      expect(emailError.value).toBe('Invalid email address')
    })

    it('accepts valid email with subdomain', () => {
      const { email, emailError } = createValidationLogic()
      email.value = 'test@mail.example.com'

      expect(emailError.value).toBe('')
    })

    it('accepts valid email with plus sign', () => {
      const { email, emailError } = createValidationLogic()
      email.value = 'test+tag@example.com'

      expect(emailError.value).toBe('')
    })
  })

  describe('Message Validation', () => {
    it('returns empty string when message is provided', () => {
      const { message, messageError } = createValidationLogic()
      message.value = 'This is a test message'

      expect(messageError.value).toBe('')
    })

    it('returns error message when message is empty', () => {
      const { message, messageError } = createValidationLogic()
      message.value = ''

      expect(messageError.value).toBe('Message is required')
    })

    it('returns empty string when message contains only whitespace', () => {
      const { message, messageError } = createValidationLogic()
      message.value = '   '

      expect(messageError.value).toBe('')
    })
  })

  describe('Multiple Field Validation', () => {
    it('validates all fields independently', () => {
      const { name, phone, email, message, nameError, phoneError, emailError, messageError } = createValidationLogic()
      
      name.value = 'John Doe'
      phone.value = ''
      email.value = 'invalid'
      message.value = 'Test message'

      expect(nameError.value).toBe('')
      expect(phoneError.value).toBe('Phone is required')
      expect(emailError.value).toBe('Invalid email address')
      expect(messageError.value).toBe('')
    })

    it('returns no errors when all fields are valid', () => {
      const { name, phone, email, message, nameError, phoneError, emailError, messageError } = createValidationLogic()
      
      name.value = 'John Doe'
      phone.value = '(555) 123-4567'
      email.value = 'test@example.com'
      message.value = 'This is a test message'

      expect(nameError.value).toBe('')
      expect(phoneError.value).toBe('')
      expect(emailError.value).toBe('')
      expect(messageError.value).toBe('')
    })
  })
})

