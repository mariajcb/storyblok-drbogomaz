<template>
  <div class="cookie-preferences">
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <h1 class="text-4xl font-bold text-[#718FCB] mb-8">Cookie Preferences</h1>
      
      <div class="prose max-w-none">
        <section class="mb-8">
          <h2 class="text-2xl font-bold text-[#1d243d] mb-4">Manage Your Cookie Settings</h2>
          <p class="mb-4">
            You can control how we use cookies on this website. Your choices will be remembered for future visits.
          </p>
        </section>

        <section class="mb-8">
          <div class="bg-white border border-gray-200 rounded-lg p-6">
            <h3 class="text-xl font-semibold text-[#1d243d] mb-4">Analytics Cookies</h3>
            <p class="mb-4 text-gray-600">
              These cookies help us understand how visitors use our website so we can improve your experience. 
              We use Google Analytics to collect anonymous information about page views, reading patterns, and 
              website performance. No personal information is collected.
            </p>
            
            <div class="flex items-center justify-between">
              <div>
                <p class="font-medium text-gray-900">Current Status:</p>
                <p class="text-sm text-gray-600">
                  {{ currentStatus }}
                </p>
              </div>
              <BaseButton
                variant="primary"
                size="md"
                @click="updatePreferences"
              >
                {{ updateButtonText }}
              </BaseButton>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-bold text-[#1d243d] mb-4">About Our Cookies</h2>
          
          <div class="space-y-4">
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold text-[#1d243d] mb-2">Essential Cookies</h3>
              <p class="text-sm text-gray-600">
                These cookies are necessary for the website to function properly. They cannot be disabled.
              </p>
            </div>
            
            <div class="bg-gray-50 p-4 rounded-lg">
              <h3 class="font-semibold text-[#1d243d] mb-2">Analytics Cookies</h3>
              <p class="text-sm text-gray-600">
                These cookies help us understand website usage and improve your experience. They are optional 
                and only used with your consent.
              </p>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-bold text-[#1d243d] mb-4">Your Privacy Rights</h2>
          <p class="mb-4">
            You have the right to:
          </p>
          <ul class="list-disc pl-6 mb-4 space-y-2">
            <li>Accept or reject analytics cookies</li>
            <li>Change your preferences at any time</li>
            <li>Request deletion of your data</li>
            <li>Opt-out of analytics tracking</li>
          </ul>
        </section>

        <section class="mb-8">
          <h2 class="text-2xl font-bold text-[#1d243d] mb-4">Need Help?</h2>
          <p class="mb-4">
            If you have questions about our cookie practices or privacy policy, please contact us:
          </p>
          <div class="bg-gray-50 p-4 rounded-lg">
            <p class="mb-2"><strong>Dr. Misha Bogomaz</strong></p>
            <p class="mb-2">Email: [Contact email]</p>
            <p class="mb-2">Phone: [Contact phone]</p>
          </div>
        </section>

        <div class="mt-12 pt-8 border-t border-gray-200">
          <NuxtLink 
            to="/privacy" 
            class="text-[#718FCB] hover:text-[#50b0ae] transition-colors"
          >
            ← Back to Privacy Policy
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'

// Get cookie consent composable
const { hasConsent, hasResponded, clearConsent } = useCookieConsent()

// Computed properties
const currentStatus = computed(() => {
  if (!hasResponded()) {
    return 'No preference set'
  }
  return hasConsent() ? 'Analytics cookies are enabled' : 'Analytics cookies are disabled'
})

const updateButtonText = computed(() => {
  if (!hasResponded()) {
    return 'Set Preferences'
  }
  return hasConsent() ? 'Disable Analytics' : 'Enable Analytics'
})

// Update preferences
const updatePreferences = () => {
  if (process.client) {
    // Clear existing consent to show banner again
    clearConsent()
    // Reload page to show cookie banner
    window.location.reload()
  }
}

// Set page title and meta description
useHead({
  title: 'Cookie Preferences - Dr. Misha Bogomaz',
  meta: [
    {
      name: 'description',
      content: 'Manage your cookie preferences and privacy settings for Dr. Misha Bogomaz therapy website.'
    }
  ]
})
</script>

<style lang="scss" scoped>
.cookie-preferences {
  min-height: 100vh;
  background-color: #f9fafb;
}

.prose {
  :deep(h2) {
    color: #1d243d;
    margin-top: 2rem;
    margin-bottom: 1rem;
  }

  :deep(h3) {
    color: #1d243d;
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  :deep(p) {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  :deep(ul) {
    margin-bottom: 1rem;
  }

  :deep(li) {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }
}
</style> 