<template>
  <div v-editable="blok" class="w-full p-12 bg-[#f7f6fd] rounded-[5px] text-center flex flex-col h-[380px]">
    <div class="flex-grow">
      <h3 class="text-2xl text-[#1d243d] font-bold mb-4">{{ blok.name }}</h3>
      <p class="mb-4">
        {{ blok.description }}
      </p>
    </div>
    <div class="mt-auto">
      <button 
        class="bg-[#718FCB] text-white px-6 py-2 rounded hover:bg-white hover:text-[#718FCB] transition-colors" 
        @click="isOpen = !isOpen"
      >
        Learn More
      </button>
    </div>

    <!-- Modal -->
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="isOpen = false"></div>

      <!-- Modal panel -->
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
          <!-- Header -->
          <div class="bg-[#E8EFF5] px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900" id="modal-title">{{ blok.name }}</h3>
            <button 
              class="text-gray-400 hover:text-gray-500" 
              @click="isOpen = false"
            >
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Content -->
          <div class="px-4 py-5 sm:p-6">
            <div class="prose" v-html="renderedModalText"></div>
          </div>

          <!-- Footer -->
          <div class="bg-[#E8EFF5] px-4 py-3 sm:px-6 flex justify-end space-x-3">
            <button 
              class="bg-white text-[#718FCB] px-4 py-2 rounded hover:bg-[#718FCB] hover:text-white transition-colors"
              @click="isOpen = false"
            >
              Cancel
            </button>
            <NuxtLink 
              to="/contact"
              class="bg-[#718FCB] text-white px-4 py-2 rounded hover:bg-white hover:text-[#718FCB] transition-colors"
            >
              Book Session
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMarkdown } from '~/composables/useMarkdown'

const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})

const isOpen = ref(false)
const { renderMarkdown } = useMarkdown()

const renderedModalText = computed(() => {
  return props.blok.modal ? renderMarkdown(props.blok.modal) : ''
})
</script>

<style lang="scss" scoped>
.prose {
  :deep(p) {
    margin-bottom: 1em;
    line-height: 1.6;
  }
}
</style>