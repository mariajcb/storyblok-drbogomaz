<template>
  <div 
    class="lg:hidden z-50 fixed inset-0"
    :class="{ 'hidden': !isOpen }"
    role="dialog"
    aria-modal="true"
    aria-label="Mobile navigation menu"
  >
    <button
      class="absolute top-4 right-4 text-white text-3xl focus:outline-none"
      @click="$emit('close')"
      aria-label="Close menu"
    >
      &times;
    </button>
    <nav class="bg-[#718FCB] py-4">
      <ul class="container mx-auto px-4 space-y-4">
        <li>
          <NuxtLink 
            to="/" 
            class="block text-white text-lg font-bold hover:text-[#50b0ae] py-2"
            @click="$emit('close')"
          >
            Home
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/blog" 
            class="block text-white text-lg font-bold hover:text-[#50b0ae] py-2"
            @click="$emit('close')"
          >
            Blog
          </NuxtLink>
        </li>
        <li>
          <NuxtLink 
            to="/contact" 
            class="block text-white text-lg font-bold hover:text-[#50b0ae] py-2"
            @click="$emit('close')"
          >
            Contact
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'MobileNavigationMenu',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['close']
}
</script> 