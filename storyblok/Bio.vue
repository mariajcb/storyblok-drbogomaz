<template lang="html">
  <div v-editable="blok" class="bio">
    <div class="card">
      <div class="card-image is-hidden-tablet">
        <figure class="image is-225X255">
          <img :src="blok.image_mobile.filename" :alt="blok.image_mobile.description">
        </figure>
      </div>
      <div class="card-content">
        <h2 class="title has-text-centered">{{blok.title}}</h2>
        <div class="media">
          <div class="media-left is-hidden-touch">
            <figure class="image is-400X600">
              <img :src="blok.image.filename" :alt="blok.image.description">
            </figure>
          </div>
          <div class="media-content">
            <div class="content markdown-content" v-html="renderedText"></div>
          </div>
        </div>
        <div class="button-box has-text-centered">
          <nuxt-link class="button is-medium" to="/contact">{{ blok.call_to_action_btn }}</nuxt-link>
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
.title {
  color: #718FCB;
  font-family: 'Mrs Saint Delafield', cursive;
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

.markdown-content {
  :deep(p) {
    margin-bottom: 1em;
    line-height: 1.6;
  }
}

.button {
  background-color: #718FCB;
  margin-top: auto;
  color: #ffffff;
  font-weight: 500;
  &:hover {
    background-color: #ffffff;
    color: #718FCB;
  }
}
</style>
