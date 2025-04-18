<template lang="html">
  <div class="max-w-2xl mx-auto px-4 py-10">
    <form v-if="!status" @submit="onSubmit" class="space-y-6">
      <h1 class="text-3xl font-bold text-[#718FCB] mb-4">Contact Me</h1>
      <p class="text-gray-600 mb-8">Please use this form for general information purposes only. DO NOT send personal health information through this form. Specific client care will be addressed during your appointment. If this is an emergency, please call 911.</p>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Name</label>
        <div>
          <input
            v-model="name"
            name="name"
            type="text"
            placeholder="Type your name here"
            class="mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"
            :class="{ 'border-red-500': nameError && nameTouched }"
            @blur="nameTouched = true"
          >
        </div>
        <p v-if="nameError && nameTouched" class="mt-1 text-sm text-red-600">{{ nameError }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Phone</label>
        <div>
          <input
            v-model="phone"
            name="phone"
            type="text"
            placeholder="(xxx)xxx-xxxx"
            class="mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"
            :class="{ 'border-red-500': phoneError && phoneTouched }"
            @blur="phoneTouched = true"
          >
        </div>
        <p v-if="phoneError && phoneTouched" class="mt-1 text-sm text-red-600">{{ phoneError }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Email</label>
        <div>
          <input
            v-model="email"
            name="email"
            type="email"
            class="mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"
            :class="{ 'border-red-500': emailError && emailTouched }"
            @blur="emailTouched = true"
          >
        </div>
        <p v-if="emailError && emailTouched" class="mt-1 text-sm text-red-600">{{ emailError }}</p>
      </div>

      <div class="space-y-2">
        <label class="block text-sm font-medium text-gray-700">Message</label>
        <div>
          <textarea
            v-model="message"
            name="message"
            rows="4"
            class="mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"
            :class="{ 'border-red-500': messageError && messageTouched }"
            @blur="messageTouched = true"
          ></textarea>
        </div>
        <p v-if="messageError && messageTouched" class="mt-1 text-sm text-red-600">{{ messageError }}</p>
      </div>

      <button
        type="submit"
        class="w-full bg-[#718FCB] text-white py-2 px-4 rounded-md hover:bg-[#50b0ae] transition-colors duration-200"
        :disabled="isSubmitting"
      >
        {{ isSubmitting ? 'Sending...' : 'Send Message' }}
      </button>
    </form>

    <div v-else-if="status === 'success'" class="text-center py-8">
      <h2 class="text-2xl font-bold text-green-600 mb-4">Thank you!</h2>
      <p class="text-gray-600">Your message has been sent successfully.</p>
    </div>

    <div v-else-if="status === 'error'" class="text-center py-8">
      <h2 class="text-2xl font-bold text-red-600 mb-4">Error</h2>
      <p class="text-gray-600">There was an error sending your message. Please try again later.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const name = ref('')
const phone = ref('')
const email = ref('')
const message = ref('')

const nameTouched = ref(false)
const phoneTouched = ref(false)
const emailTouched = ref(false)
const messageTouched = ref(false)

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

const status = ref(null)
const isSubmitting = ref(false)

const onSubmit = async (e) => {
  e.preventDefault()
  
  // Mark all fields as touched
  nameTouched.value = true
  phoneTouched.value = true
  emailTouched.value = true
  messageTouched.value = true
  
  // Check if there are any errors
  if (nameError.value || phoneError.value || emailError.value || messageError.value) {
    return
  }
  
  isSubmitting.value = true
  try {
    // Submit form to Storyblok
    const response = await fetch('https://api.storyblok.com/v2/spaces/YOUR_SPACE_ID/forms/YOUR_FORM_ID', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: name.value,
        phone: phone.value,
        email: email.value,
        message: message.value
      })
    })

    if (!response.ok) {
      throw new Error('Form submission failed')
    }

    status.value = 'success'
    // Reset form
    name.value = ''
    phone.value = ''
    email.value = ''
    message.value = ''
    nameTouched.value = false
    phoneTouched.value = false
    emailTouched.value = false
    messageTouched.value = false
  } catch (error) {
    console.error('Error submitting form:', error)
    status.value = 'error'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style lang="css" scoped>
.container {
  padding: 0 20px;
  max-width: 600px;
  margin: 40px auto 60px;
}

.button {
  background-color: #718FCB;
  margin-top: auto;
  color: #ffffff;
  font-weight: 500;
  &:hover {
    background-color: #ffffff;
    color: #718FCB;
  }
}
</style>
