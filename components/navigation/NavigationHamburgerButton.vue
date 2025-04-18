<template>
  <button 
    class="lg:hidden p-2 text-white hover:bg-[#50b0ae] rounded-md focus:outline-none focus:ring-2 focus:ring-white"
    @click="$emit('toggle')"
    :aria-expanded="isOpen"
    aria-label="Toggle navigation menu"
  >
    <span class="sr-only">Open main menu</span>
    <div class="w-6 h-5 flex flex-col justify-between">
      <span 
        class="block w-full h-0.5 bg-white transition-transform duration-300"
        :class="{ 'rotate-45 translate-y-2': isOpen }"
      ></span>
      <span 
        class="block w-full h-0.5 bg-white transition-opacity duration-300"
        :class="{ 'opacity-0': isOpen }"
      ></span>
      <span 
        class="block w-full h-0.5 bg-white transition-transform duration-300"
        :class="{ '-rotate-45 -translate-y-2': isOpen }"
      ></span>
    </div>
  </button>
</template>

<script>
export default {
  name: 'NavigationHamburgerButton',
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ['toggle']
}
</script> 