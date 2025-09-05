<template>
  <div class="hero-section relative min-h-[calc(100vh-3.25rem)] overflow-hidden" v-editable="blok">
    <img 
      class="hero-background absolute inset-0 w-full h-full object-cover object-top" 
      :src="blok.Image?.filename" 
      :alt="blok.Image?.alt || ''"
    >
    <div class="hero-content relative z-10 container mx-auto px-4 py-24">
      <div class="hero-text max-w-4xl">
        <h1 class="hero-title text-6xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-lg">
          {{ blok.headline || 'Default Title' }}
        </h1>
        <h2 class="hero-subtitle text-2xl md:text-3xl lg:text-4xl font-semibold mb-6 drop-shadow-md">
          {{ blok.subtitle || 'Default Subtitle' }}
        </h2>
        <p class="hero-body text-xl md:text-2xl mb-12 drop-shadow-md max-w-3xl">
          {{ blok.body }}
        </p>
        <div class="hero-actions">
          <BaseButton
            tag="NuxtLink"
            to="/contact"
            variant="tertiary"
            size="xl"
            class="hero-button bg-white text-primary-500 hover:bg-primary-500 hover:text-white transition-all duration-300 transform hover:scale-105"
          >
            Contact Me
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
  },
})

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