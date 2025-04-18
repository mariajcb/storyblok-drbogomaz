<template lang="html">
  <div class="max-w-2xl mx-auto px-4 py-10">
    <form v-if="!status" @submit="sendForm" class="space-y-6">
      <h1 class="text-3xl font-bold text-[#718FCB] mb-4">Contact Me</h1>
      <p class="text-gray-600 mb-8">Please use this form for general information purposes only. DO NOT send personal health information through this form. Specific client care will be addressed during your appointment. If this is an emergency, please call 911.</p>

      <div class="space-y-2">
        <ValidationProvider rules="required" v-slot="{ errors }">
          <label class="block text-sm font-medium text-gray-700">Name</label>
          <div>
            <input
              required
              :class="errors[0] ? 'border-red-500' : 'border-gray-300'"
              class="mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"
              v-model="name"
              name="name"
              type="text"
              placeholder="Type your name here"
            >
          </div>
          <p class="mt-1 text-sm text-red-600">{{ errors[0] }}</p>
        </ValidationProvider>
      </div>

      <div class="space-y-2">
        <ValidationProvider rules="required" v-slot="{ errors }">
          <label class="block text-sm font-medium text-gray-700">Phone</label>
          <div>
            <input
              required
              :class="errors[0] ? 'border-red-500' : 'border-gray-300'"
              class="mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"
              v-model="phone"
              name="phone"
              type="text"
              placeholder="(xxx)xxx-xxxx"
            >
          </div>
          <p class="mt-1 text-sm text-red-600">{{ errors[0] }}</p>
        </ValidationProvider>
      </div>

      <div class="space-y-2">
        <ValidationProvider rules="required|email" v-slot="{ errors }">
          <label class="block text-sm font-medium text-gray-700">Email</label>
          <div>
            <input
              required
              :class="errors[0] ? 'border-red-500' : 'border-gray-300'"
              class="mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"
              v-model="email"
              name="email"
              type="email"
              placeholder="youremail@domain.com"
            >
          </div>
          <p class="mt-1 text-sm text-red-600">{{ errors[0] }}</p>
        </ValidationProvider>
      </div>

      <div class="space-y-2">
        <ValidationProvider rules="required" v-slot="{ errors }">
          <label class="block text-sm font-medium text-gray-700">Message</label>
          <div>
            <textarea
              required
              :class="errors[0] ? 'border-red-500' : 'border-gray-300'"
              class="mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"
              v-model="message"
              name="message"
              rows="4"
              placeholder="Leave a message..."
            ></textarea>
          </div>
          <p class="mt-1 text-sm text-red-600">{{ errors[0] }}</p>
        </ValidationProvider>
      </div>

      <button 
        type="submit" 
        class="w-full bg-[#718FCB] text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-[#718FCB] transition-colors"
      >
        Submit
      </button>
    </form>

    <div v-if="status === 'success'" class="text-center py-8">
      <h2 class="text-2xl font-bold text-[#718FCB]">Thank you, we got your submission!</h2>
    </div>

    <div v-if="status === 'error'" class="text-center py-8">
      <h2 class="text-2xl font-bold text-red-600">
        Oops, something went wrong. Please try again.
      </h2>
    </div>
  </div>
</template>

<script>
import { ValidationProvider } from 'vee-validate'

export default {
  name: 'ContactForm',
  data: function() {
    return {
      status: null,
      name: null,
      phone: null,
      email: null,
      message: null
    }
  },
  components: {
    ValidationProvider
  },
  methods: {
    sendForm: function(event) {
      event.preventDefault()
      fetch('https://formcarry.com/s/mskpCnP2jVxt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          name: this.name,
          phone: this.phone,
          email: this.email,
          message: this.message })
      })
        .then(response => response.json())
        .then(response => {
          if (response.code === 200) {
            this.status = 'success'
          } else {
            // Formcarry error
            this.status = 'error'
          }
        })
        // network error
        .catch(() => (this.status = 'error'))
    }
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
