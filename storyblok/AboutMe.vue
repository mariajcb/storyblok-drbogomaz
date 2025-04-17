<template lang="html">
  <div v-editable="blok" class="section about-me">
    <div class="container container-1">
      <div class="content">
        <h2 class="title has-text-centered">{{blok.title}}</h2>
        <div class="subtitle markdown-content" v-html="renderedText"></div>
      </div>
    </div>
    <blockquote class="quote-card">
      <p class="has-text-centered">{{blok.quote}}</p>
    </blockquote>
    <div class="container">
      <div class="content">
        <div class="subtitle markdown-content" v-html="renderedText2"></div>
      </div>
      <div class="button-box has-text-centered">
        <nuxt-link class="button is-medium" to="/en/blog">{{ blok.call_to_action_btn }}</nuxt-link>
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

const renderedText2 = computed(() => {
  return props.blok.text2 ? renderMarkdown(props.blok.text2) : ''
})
</script>

<style lang="scss" scoped>
  .section {
    background-color: #F4F7FA;
    background: linear-gradient(to bottom, #fff, #E8EFF5);
    padding: 0.5rem;
  }

  .container {
    padding: 0 20px;
    max-width: 750px;
    margin: 40px auto;
  }

  .container-1 {
    margin: 0 auto 40px;
  }

  .title {
    color: #718FCB;
    font-family: 'Mrs Saint Delafield', cursive;
    font-size: 3rem;
  }

  .markdown-content {
    :deep(p) {
      margin-bottom: 1em;
      line-height: 1.6;
    }
  }

  .quote-card {
    background: #fff;
    padding: 20px;
    padding-left: 50px;
    box-sizing: border-box;
    box-shadow: 0 2px 4px rgba(34, 34, 34, 0.12);
    position: relative;
    overflow: hidden;
    min-height: 120px;
    max-width: 800px;
    margin:10px auto;

    p {
      font-size: 22px;
      line-height: 1.5;
      margin: 0;
      max-width: 80%;
    }
  }

  .quote-card::before {
    font-family: Georgia, serif;
    content: '"';
    position: absolute;
    top: 10px;
    left: 10px;
    font-size: 5em;
    color: #718FCB;
    opacity: 0.5;
    font-weight: normal;
  }

  .quote-card::after {
    font-family: Georgia, serif;
    content: '"';
    position: absolute;
    bottom: -110px;
    line-height: 100px;
    right: -32px;
    font-size: 25em;
    color: #718FCB;
    opacity: 0.5;
    font-weight: normal;
  }

  @media (max-width: 640px) {
    .quote-card:after {
      font-size: 22em;
      right: -25px;
    }
  }

  .button {
    background-color: #718FCB;
    margin-top: 0.6rem;
    color: #ffffff;
    font-weight: 500;
    &:hover {
      background-color: #ffffff;
      color: #718FCB;
    }
  }
</style>
