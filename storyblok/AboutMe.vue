<template>
  <div v-editable="blok" class="bg-gradient-to-b from-white to-[#E8EFF5] pt-2 pb-8">
    <div class="max-w-3xl mx-auto px-4 mb-10">
      <div class="text-center">
        <h2 class="text-4xl text-[#718FCB] font-['Mrs_Saint_Delafield'] mb-4">{{blok.title}}</h2>
        <div class="prose max-w-none" v-html="renderedText"></div>
      </div>
    </div>
    <blockquote class="max-w-3xl mx-auto px-4 py-5 bg-white shadow-md relative min-h-[120px] mb-10">
      <p class="text-center text-2xl leading-relaxed max-w-[80%] mx-auto">{{blok.quote}}</p>
      <span class="absolute top-2 left-2 text-6xl text-[#718FCB] opacity-50 font-['Mrs_Saint_Delafield']">"</span>
      <span class="absolute bottom-[-250px] right-[-32px] text-[25em] text-[#718FCB] opacity-50 font-['Mrs_Saint_Delafield']">"</span>
    </blockquote>
    <div class="max-w-3xl mx-auto px-4">
      <div class="prose max-w-none" v-html="renderedText2"></div>
      <div class="text-center mt-6">
        <BaseButton
          tag="NuxtLink"
          to="/blog"
          variant="primary"
          size="lg"
        >
          {{ blok.call_to_action_btn }}
        </BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useMarkdown } from '~/composables/useMarkdown'
import { computed } from 'vue'
import BaseButton from '~/components/ui/BaseButton.vue'

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

const renderedText2 = computed(() => {
  return props.blok.text2 ? renderMarkdown(props.blok.text2) : ''
})
</script>

<style lang="scss" scoped>
.prose {
  :deep(p) {
    margin-bottom: 1em;
    line-height: 1.6;
  }
}

@media (max-width: 640px) {
  blockquote span:last-child {
    font-size: 22em;
    right: -25px;
  }
}
</style>
