<template>
  <div 
    v-if="showBanner"
    class="cookie-banner"
    role="dialog"
    aria-labelledby="cookie-banner-title"
    aria-describedby="cookie-banner-description"
    aria-modal="true"
    :aria-busy="isProcessing"
  >
    <!-- Focus trap for accessibility -->
    <div class="cookie-banner__focus-trap" tabindex="-1" ref="focusTrap"></div>
    
    <div class="cookie-banner__container">
      <div class="cookie-banner__content">
        <div class="cookie-banner__text">
          <h2 id="cookie-banner-title" class="cookie-banner__title">
            We Value Your Privacy
          </h2>
          <p id="cookie-banner-description" class="cookie-banner__description">
            This therapy website uses cookies to help us understand how visitors use our site and improve your experience. 
            We only use analytics cookies that help us make our website better - we don't collect personal health information 
            or use cookies for advertising. Your privacy and confidentiality are important to us.
          </p>
          
          <!-- Error message for accessibility -->
          <div v-if="error" class="cookie-banner__error" role="alert" aria-live="polite">
            <p class="cookie-banner__error-text">
              {{ error }}
            </p>
          </div>
          
          <div class="cookie-banner__links">
            <NuxtLink 
              to="/privacy" 
              class="cookie-banner__link"
              @click="handlePrivacyClick"
              aria-describedby="privacy-link-description"
            >
              Learn more about our privacy practices
            </NuxtLink>
            <span id="privacy-link-description" class="sr-only">
              Opens our privacy policy page in a new section
            </span>
          </div>
        </div>
        
        <div class="cookie-banner__actions">
          <button
            type="button"
            class="cookie-banner__btn cookie-banner__btn--reject"
            @click="handleReject"
            :disabled="isProcessing"
            :aria-describedby="isProcessing ? 'processing-description' : 'reject-description'"
            ref="rejectButton"
          >
            <span v-if="isProcessing" aria-hidden="true">Processing...</span>
            <span v-else>Reject All</span>
          </button>
          
          <button
            type="button"
            class="cookie-banner__btn cookie-banner__btn--accept"
            @click="handleAccept"
            :disabled="isProcessing"
            :aria-describedby="isProcessing ? 'processing-description' : 'accept-description'"
            ref="acceptButton"
          >
            <span v-if="isProcessing" aria-hidden="true">Processing...</span>
            <span v-else>Accept All</span>
          </button>
          
          <!-- Screen reader descriptions -->
          <div class="sr-only">
            <span id="processing-description">Please wait while we process your cookie preferences</span>
            <span id="reject-description">Reject all analytics cookies and continue with essential cookies only</span>
            <span id="accept-description">Accept all cookies including analytics for improved website experience</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'

// Get cookie consent composable with error handling
const { hasResponded, acceptAll, rejectAll, error: consentError } = useCookieConsent()

// Get gtag for tracking consent decisions
const { $gtag } = useNuxtApp()

// Component state
const isProcessing = ref(false)
const hasInteracted = ref(false)
const error = ref(null)

// Template refs for accessibility
const focusTrap = ref(null)
const rejectButton = ref(null)
const acceptButton = ref(null)

// Computed properties
const showBanner = computed(() => {
  return process.client && !hasResponded() && !hasInteracted.value
})

// Error handling utility
const handleError = (operation, err) => {
  const errorMessage = `Cookie banner ${operation} failed: ${err.message}`
  console.error(errorMessage, err)
  error.value = errorMessage
  
      // Track error for monitoring
    if ($gtag) {
      $gtag('event', 'cookie_banner_error', {
        error_operation: operation,
        error_message: err.message,
        page_location: window.location.pathname,
        content_type: 'therapy_website'
      })
    }
}

// Focus management for accessibility
const manageFocus = () => {
  nextTick(() => {
    if (acceptButton.value) {
      acceptButton.value.focus()
    }
  })
}

// Handle accept all cookies with enhanced error handling
const handleAccept = async () => {
  if (isProcessing.value) return
  
  isProcessing.value = true
  hasInteracted.value = true
  error.value = null
  
  try {
    // Save consent
    await acceptAll()
    
    // Track consent decision
    if ($gtag) {
      $gtag('event', 'cookie_consent', {
        consent_given: true,
        consent_type: 'accept_all',
        privacy_level: 'enhanced',
        page_location: window.location.pathname,
        content_type: 'therapy_website'
      })
    }
    
    // Emit event for parent components
    emit('consent-updated', { analytics: true })
    
  } catch (err) {
    handleError('accepting consent', err)
    // Don't hide banner on error, let user try again
    hasInteracted.value = false
  } finally {
    isProcessing.value = false
  }
}

// Handle reject all cookies with enhanced error handling
const handleReject = async () => {
  if (isProcessing.value) return
  
  isProcessing.value = true
  hasInteracted.value = true
  error.value = null
  
  try {
    // Save consent
    await rejectAll()
    
    // Track consent decision
    if ($gtag) {
      $gtag('event', 'cookie_consent', {
        consent_given: false,
        consent_type: 'reject_all',
        privacy_level: 'enhanced',
        page_location: window.location.pathname,
        content_type: 'therapy_website'
      })
    }
    
    // Emit event for parent components
    emit('consent-updated', { analytics: false })
    
  } catch (err) {
    handleError('rejecting consent', err)
    // Don't hide banner on error, let user try again
    hasInteracted.value = false
  } finally {
    isProcessing.value = false
  }
}

// Handle privacy policy click
const handlePrivacyClick = () => {
  if ($gtag) {
    $gtag('event', 'cookie_banner_click', {
      link_text: 'privacy_policy',
      privacy_level: 'enhanced',
      page_location: window.location.pathname,
      content_type: 'therapy_website'
    })
  }
}

// Keyboard navigation for accessibility
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    // Don't allow escape to close banner - user must make a choice
    event.preventDefault()
    return
  }
  
  if (event.key === 'Tab') {
    // Trap focus within the banner
    const focusableElements = [acceptButton.value, rejectButton.value, focusTrap.value]
    const firstElement = focusableElements[0]
    const lastElement = focusableElements[focusableElements.length - 1]
    
    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault()
      lastElement.focus()
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault()
      firstElement.focus()
    }
  }
}

// Emit events
const emit = defineEmits(['consent-updated'])

// Initialize on mount with accessibility
onMounted(() => {
  // Track banner view
  if ($gtag && showBanner.value) {
    $gtag('event', 'cookie_banner_view', {
      privacy_level: 'enhanced',
      page_location: window.location.pathname,
      content_type: 'therapy_website'
    })
  }
  
  // Set up focus management
  manageFocus()
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeydown)
  
  // Clean up on unmount
  onUnmounted(() => {
    document.removeEventListener('keydown', handleKeydown)
  })
})

// Watch for consent errors
watch(consentError, (newError) => {
  if (newError) {
    error.value = `Consent system error: ${newError.message}`
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
  
  // Error styling
  &__error {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 6px;
    padding: 0.75rem;
    margin: 1rem 0;
  }
  
  &__error-text {
    color: #dc2626;
    font-size: 0.9rem;
    margin: 0;
    font-weight: 500;
  }
  
  // Focus trap styling
  &__focus-trap {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
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

// Screen reader only content
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
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
    
    &__error {
      border: 2px solid #dc2626;
      background-color: #fef2f2;
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

// Focus visible support for better accessibility
.cookie-banner__btn:focus-visible {
  outline: 3px solid #718FCB;
  outline-offset: 2px;
  border-radius: 4px;
}

.cookie-banner__link:focus-visible {
  outline: 2px solid #718FCB;
  outline-offset: 2px;
  border-radius: 4px;
}

// Print styles
@media print {
  .cookie-banner {
    display: none !important;
  }
}
</style> 