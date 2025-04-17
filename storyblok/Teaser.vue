<template>
  <div class="teaser hero is-fullheight-with-navbar has-background" v-editable="blok">
    <img class="hero-background" 
    :src="blok.Image?.filename" 
    :alt=" blok.Image?.alt || ''"
    >
    <div class=" hero-body">
    <div class="container">
      <h1 class="title">{{ blok.title }}</h1>
      <h2 class="subtitle"><strong>{{ blok.subtitle }}</strong></h2>
      <p class="subtitle">{{ blok.text }}</p>
      <nuxt-link class="button is-medium" to="/contact">Contact Me</nuxt-link>
    </div>
  </div>
  </div>
</template>

<script setup>
const props = defineProps({
  blok: {
    type: Object,
    required: true
  },
})

console.log('Full blok data:', props.blok)
console.log('Image data:', props.blok.Image)
console.log('Image filename:', props.blok.Image?.filename)
</script>

<style lang="scss" scoped>
.hero.has-background {
  position: relative;
  overflow: hidden;
}

.hero-background {
  position: absolute;
  object-fit: cover;
  object-position: center center;
  width: 100%;
  height: 100%;
}

.hero.is-fullheight-with-navbar {
  min-height: 0;
  @media (min-width: 1036px) {
    min-height: calc(100vh - 3.25rem);
  }
}

.title {
  color: #ffffff;
  font-size: 3.5rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
  color: #ffffff;
  font-size: 1.5rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.button {
  background-color: #ffffff;
  color: #718FCB;
  font-weight: 500;
  margin-top: 1rem;
  &:hover {
    background-color: #718FCB;
    color: #ffffff;
  }
}

.container {
  padding-top: 70%;
  position: relative;
  z-index: 1;
}

@media (min-width: 1000px) {
  .container {
    padding-top: 23%;
  }

  .subtitle {
    max-width: 50%;
  }
}
</style>