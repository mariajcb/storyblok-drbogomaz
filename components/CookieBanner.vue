<template>
  <div 
    v-if="showBanner"
    class="cookie-banner"
    role="dialog"
    aria-labelledby="cookie-banner-title"
    aria-describedby="cookie-banner-description"
  >
    <div class="cookie-banner__container">
      <div class="cookie-banner__content">
        <div class="cookie-banner__text">
          <h2 id="cookie-banner-title" class="cookie-banner__title">
            We Value Your Privacy
          </h2>
          <p id="cookie-banner-description" class="cookie-banner__description">
            This website uses cookies to help us understand how visitors use our site and improve your experience. 
            We only use analytics cookies that help us make our website better - we don't collect personal information 
            or use cookies for advertising. Your privacy is important to us.
          </p>
          <div class="cookie-banner__links">
            <NuxtLink 
              to="/privacy" 
              class="cookie-banner__link"
              @click="handlePrivacyClick"
            >
              Learn more about our privacy practices
            </NuxtLink>
          </div>
        </div>
        
        <div class="cookie-banner__actions">
          <button
            type="button"
            class="cookie-banner__btn cookie-banner__btn--reject"
            @click="handleReject"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing">Processing...</span>
            <span v-else>Reject All</span>
          </button>
          
          <button
            type="button"
            class="cookie-banner__btn cookie-banner__btn--accept"
            @click="handleAccept"
            :disabled="isProcessing"
          >
            <span v-if="isProcessing">Processing...</span>
            <span v-else>Accept All</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Get cookie consent composable
const { hasResponded, acceptAll, rejectAll } = useCookieConsent()

// Get gtag for tracking consent decisions
const { $gtag } = useNuxtApp()

// Component state
const isProcessing = ref(false)
const hasInteracted = ref(false)

// Computed properties
const showBanner = computed(() => {
  return process.client && !hasResponded() && !hasInteracted.value
})

// Handle accept all cookies
const handleAccept = async () => {
  if (isProcessing.value) return
  
  isProcessing.value = true
  hasInteracted.value = true
  
  try {
    // Save consent
    acceptAll()
    
    // Track consent decision
    if ($gtag) {
      $gtag('event', 'cookie_consent', {
        consent_given: true,
        consent_type: 'accept_all',
        page_location: window.location.pathname,
        content_type: 'therapy_website'
      })
    }
    
    // Emit event for parent components
    emit('consent-updated', { analytics: true })
    
  } catch (error) {
    console.error('Error saving cookie consent:', error)
  } finally {
    isProcessing.value = false
  }
}

// Handle reject all cookies
const handleReject = async () => {
  if (isProcessing.value) return
  
  isProcessing.value = true
  hasInteracted.value = true
  
  try {
    // Save consent
    rejectAll()
    
    // Track consent decision
    if ($gtag) {
      $gtag('event', 'cookie_consent', {
        consent_given: false,
        consent_type: 'reject_all',
        page_location: window.location.pathname,
        content_type: 'therapy_website'
      })
    }
    
    // Emit event for parent components
    emit('consent-updated', { analytics: false })
    
  } catch (error) {
    console.error('Error saving cookie consent:', error)
  } finally {
    isProcessing.value = false
  }
}

// Handle privacy policy click
const handlePrivacyClick = () => {
  if ($gtag) {
    $gtag('event', 'cookie_banner_click', {
      link_text: 'privacy_policy',
      page_location: window.location.pathname,
      content_type: 'therapy_website'
    })
  }
}

// Emit events
const emit = defineEmits(['consent-updated'])

// Initialize on mount
onMounted(() => {
  // Track banner view
  if ($gtag && showBanner.value) {
    $gtag('event', 'cookie_banner_view', {
      page_location: window.location.pathname,
      content_type: 'therapy_website'
    })
  }
})
</script>

<style lang="scss" scoped>
.cookie-banner {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  border-top: 1px solid #e5e7eb;
  
  &__container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem;
  }
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    background: white;
    border-radius: 12px;
    padding: 1.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    
    @media (min-width: 768px) {
      flex-direction: row;
      align-items: flex-start;
      gap: 2rem;
    }
  }
  
  &__text {
    flex: 1;
  }
  
  &__title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #1d243d;
    margin: 0 0 0.5rem 0;
    line-height: 1.4;
  }
  
  &__description {
    color: #6b7280;
    line-height: 1.6;
    margin: 0 0 1rem 0;
    font-size: 0.95rem;
  }
  
  &__links {
    margin-top: 0.5rem;
  }
  
  &__link {
    color: #718FCB;
    text-decoration: none;
    font-size: 0.9rem;
    font-weight: 500;
    
    &:hover {
      color: #50b0ae;
      text-decoration: underline;
    }
    
    &:focus {
      outline: 2px solid #718FCB;
      outline-offset: 2px;
      border-radius: 4px;
    }
  }
  
  &__actions {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    min-width: 140px;
    
    @media (min-width: 768px) {
      flex-direction: row;
      gap: 0.75rem;
    }
  }
  
  &__btn {
    padding: 0.5rem 1.5rem;
    border-radius: 4px;
    font-weight: 500;
    font-size: 0.95rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s ease;
    min-height: 44px;
    
    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
    
    &:focus {
      outline: 2px solid #718FCB;
      outline-offset: 2px;
    }
    
    &--accept {
      background-color: #718FCB;
      color: white;
      
      &:hover:not(:disabled) {
        background-color: white;
        color: #718FCB;
      }
      
      &:active:not(:disabled) {
        transform: translateY(0);
      }
    }
    
    &--reject {
      background-color: transparent;
      color: #6b7280;
      border: 1px solid #d1d5db;
      
      &:hover:not(:disabled) {
        background-color: #f9fafb;
        border-color: #9ca3af;
        color: #374151;
      }
      
      &:active:not(:disabled) {
        background-color: #f3f4f6;
      }
    }
  }
}

// Animation for banner appearance
.cookie-banner {
  animation: slideUp 0.3s ease-out;
}

@keyframes slideUp {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}

// High contrast mode support
@media (prefers-contrast: high) {
  .cookie-banner {
    border-top: 2px solid #000;
    
    &__content {
      border: 2px solid #000;
    }
    
    &__btn {
      border: 2px solid currentColor;
    }
  }
}

// Reduced motion support
@media (prefers-reduced-motion: reduce) {
  .cookie-banner {
    animation: none;
  }
  
  .cookie-banner__btn {
    transition: none;
  }
}
</style> 