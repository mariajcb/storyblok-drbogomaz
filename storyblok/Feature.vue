<template>
  <FeatureCard
    v-editable="blok"
    :title="blok.name"
    :description="blok.description"
    action-text="Learn More"
    variant="filled"
    size="lg"
    padding="xl"
    rounded="xl"
    shadow="lg"
    class="w-full h-full"
    @action="isOpen = !isOpen"
  />

    <!-- Modal -->
    <div v-if="isOpen" class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <!-- Background overlay -->
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" @click="isOpen = false"></div>

      <!-- Modal panel -->
      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <BaseCard
          variant="elevated"
          size="lg"
          padding="none"
          rounded="lg"
          shadow="2xl"
          class="relative transform overflow-hidden text-left transition-all sm:my-8 sm:w-full sm:max-w-lg"
        >
          <!-- Header -->
          <div class="bg-[#E8EFF5] px-4 py-3 sm:px-6 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900" id="modal-title">{{ blok.name }}</h3>
            <BaseButton 
              variant="ghost"
              size="sm"
              class="text-gray-400 hover:text-gray-500 p-2" 
              @click="isOpen = false"
            >
              <span class="sr-only">Close</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </BaseButton>
          </div>

          <!-- Content -->
          <div class="px-4 py-5 sm:p-6">
            <div class="prose" v-html="renderedModalText"></div>
          </div>

          <!-- Footer -->
          <div class="bg-[#E8EFF5] px-4 py-3 sm:px-6 flex justify-end space-x-3">
            <BaseButton 
              variant="tertiary"
              size="md"
              @click="isOpen = false"
            >
              Cancel
            </BaseButton>
            <BaseButton
              tag="NuxtLink"
              to="/en/contact"
              variant="primary"
              size="md"
            >
              Book Session
            </BaseButton>
          </div>
        </BaseCard>
      </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useMarkdown } from '~/composables/useMarkdown'
import BaseButton from '~/components/ui/BaseButton.vue'
import BaseCard from '~/components/ui/BaseCard.vue'
import FeatureCard from '~/components/ui/FeatureCard.vue'

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