<template>
  <div class="site">
    <main class="site-content" role="main">
      <TopHeader />
      <slot />
    </main>
    <BottomFooter />
    <CookieBanner @consent-updated="handleConsentUpdate" />
  </div>
</template>

<script setup>
import TopHeader from '~/components/navigation/TopHeader.vue'
import BottomFooter from '~/components/BottomFooter.vue'
import CookieBanner from '~/components/CookieBanner.vue'

function handleConsentUpdate(consent) {
  // Handle consent updates from the cookie banner
  console.log('Cookie consent updated:', consent)

  // if (process.client) {
    // Optionally reload the page to ensure all components respect the new consent
    // window.location.reload()
  // }
}
</script>

<style>
.site {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.site-content {
  flex: 1;
}
</style>
