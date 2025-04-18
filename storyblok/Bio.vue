<template lang="html">
  <div v-editable="blok" class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="md:hidden">
        <img 
          class="w-full h-[255px] object-cover" 
          :src="blok.image_mobile.filename" 
          :alt="blok.image_mobile.description"
        >
      </div>
      <div class="p-6">
        <h2 class="text-4xl text-[#718FCB] font-['Mrs_Saint_Delafield'] text-center mb-4">{{blok.title}}</h2>
        <div class="flex flex-col md:flex-row gap-8">
          <div class="hidden md:block">
            <img 
              class="w-[400px] h-[600px] object-cover" 
              :src="blok.image.filename" 
              :alt="blok.image.description"
            >
          </div>
          <div class="flex-1">
            <div class="prose max-w-none" v-html="renderedText"></div>
          </div>
        </div>
        <div class="text-center mt-8">
          <NuxtLink 
            class="inline-block bg-[#718FCB] text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-[#718FCB] transition-colors" 
            to="/contact"
          >
            {{ blok.call_to_action_btn }}
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMarkdown } from '~/composables/useMarkdown'
import { computed } from 'vue'

const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
})

const { renderMarkdown } = useMarkdown()

const renderedText = computed(() => {
  return props.blok.text ? renderMarkdown(props.blok.text) : ''
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
