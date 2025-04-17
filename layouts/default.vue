<template>
  <div class="site">
    <main class="site-content" role="main">
      <TopHeader />
      <slot />
    </main>
    <BottomFooter />
  </div>
</template>

<script>
import TopHeader from '~/components/navigation/TopHeader.vue'
import BottomFooter from '~/components/BottomFooter.vue'

export default {
  components: {
    TopHeader,
    BottomFooter
  }
}
</script>

<style>
.site {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
}

.site-content {
  flex: 1;
}
</style>
