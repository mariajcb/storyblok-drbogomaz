<template>
  <footer class="footer">
    <div class="container mx-auto px-4 py-6">
      <div class="flex flex-col md:flex-row justify-between items-center">
        <div class="mb-4 md:mb-0">
          <p class="text-sm text-gray-600">© 2025 Dr. Misha Bogomaz. All rights reserved.</p>
        </div>
        <div class="flex flex-wrap gap-6 text-sm">
          <BaseButton 
            variant="ghost"
            size="sm"
            @click="showCookiePreferences"
            class="text-primary-500 hover:text-secondary-500 p-0 -mt-2 h-auto"
          >
            Cookie Preferences
          </BaseButton>
          <NuxtLink 
            to="/privacy" 
            class="text-[#718FCB] hover:text-[#50b0ae] transition-colors"
          >
            Privacy Policy
          </NuxtLink>
          <NuxtLink 
            to="/contact" 
            class="text-[#718FCB] hover:text-[#50b0ae] transition-colors"
          >
            Contact
          </NuxtLink>
          <NuxtLink 
            to="/blog" 
            class="text-[#718FCB] hover:text-[#50b0ae] transition-colors"
          >
            Blog
          </NuxtLink>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import BaseButton from '~/components/ui/BaseButton.vue'

// Get cookie consent composable
const { hasResponded } = useCookieConsent()

// Show cookie preferences
const showCookiePreferences = () => {
  if (process.client) {
    // Clear existing consent to show banner again
    localStorage.removeItem('cookie-consent')
    // Reload page to show cookie banner
    window.location.reload()
  }
}
</script>

<style scoped>
.footer {
  background-color: #E8EFF5;
  border-top: 1px solid #d1d5db;
}
</style>
