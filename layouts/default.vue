<template>
  <div class="site-layout">
    <main class="site-content" role="main">
      <TopHeader />
      <div class="main-content">
        <slot />
      </div>
    </main>
    <BottomFooter />
    <CookieBanner @consent-updated="handleConsentUpdate" />
  </div>
</template>

<script>
import TopHeader from '~/components/navigation/TopHeader.vue'
import BottomFooter from '~/components/BottomFooter.vue'
import CookieBanner from '~/components/CookieBanner.vue'

export default {
  components: {
    TopHeader,
    BottomFooter,
    CookieBanner
  },
  methods: {
    handleConsentUpdate(consent) {
      // Handle consent updates from the cookie banner
      console.log('Cookie consent updated:', consent)
      
      // You can add additional logic here if needed
      // For example, reload the page to apply new consent settings
      if (process.client) {
        // Optionally reload the page to ensure all components respect the new consent
        // window.location.reload()
      }
    }
  }
}
</script>

<style>
.site-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: #ffffff;
}

.site-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  width: 100%;
}

/* Ensure proper spacing and layout */
.site-layout * {
  box-sizing: border-box;
}

/* Smooth scrolling for better UX */
html {
  scroll-behavior: smooth;
}

/* Ensure consistent spacing */
body {
  margin: 0;
  padding: 0;
}
</style>
