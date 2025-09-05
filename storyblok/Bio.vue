<template>
  <div v-editable="blok" class="max-w-4xl mx-auto">
    <div class="bg-white rounded-lg shadow-lg overflow-hidden">
      <div class="md:hidden">
        <img class="w-full h-[255px] object-cover" :src="blok.image_mobile.filename"
          :alt="blok.image_mobile.description">
      </div>
      <div class="p-6">
        <h2 class="text-4xl text-[#718FCB] font-['Mrs_Saint_Delafield'] text-center mb-4">{{ blok.title }}</h2>
        <div class="flex flex-col md:flex-row gap-8">
          <div class="hidden md:block">
            <img class="w-[400px] h-[600px] object-cover" :src="blok.image.filename" :alt="blok.image.description">
          </div>
          <div class="flex-1">
            <div class="prose max-w-none">
              <div v-for="(paragraph, index) in blok.text.content" :key="index" class="mb-4">
                <p v-if="paragraph.type === 'paragraph'">
                  <span v-for="(item, itemIndex) in paragraph.content" :key="itemIndex">
                    <strong v-if="item.type === 'strong'">{{ item.text }}</strong>
                    <em v-else-if="item.type === 'em'">{{ item.text }}</em>
                    <a v-else-if="item.type === 'link'" :href="item.url" target="_blank">{{ item.text }}</a>
                    <span v-else>{{ item.text }}</span>
                  </span>
                </p>
                <h3 v-else-if="paragraph.type === 'heading'" class="text-xl font-bold mb-2">{{ paragraph.content[0].text
                  }}</h3>
                <ul v-else-if="paragraph.type === 'bullet_list'" class="list-disc pl-5 mb-4">
                  <li v-for="(listItem, listIndex) in paragraph.content" :key="listIndex">
                    {{ listItem.content[0].text }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="text-center mt-8">
          <BaseButton
            tag="NuxtLink"
            to="/en/contact"
            variant="primary"
            size="lg"
          >
            {{ blok.call_to_action_btn }}
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import BaseButton from '~/components/ui/BaseButton.vue'

const props = defineProps({
  blok: {
    type: Object,
    required: true
  }
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