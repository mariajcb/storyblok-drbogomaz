<template>
  <header class="w-full h-24 bg-primary-500">
    <div class="container h-full mx-auto flex items-center justify-between px-4">
      <NuxtLink to="/">
        <h1 class="top-header__logo">Dr.Bogomaz</h1>
      </NuxtLink>
      
      <NavigationHamburgerButton 
        :is-open="isOpen"
        @toggle="isOpen = !isOpen"
      />

      <DesktopNavigation />
    </div>

    <MobileNavigationMenu 
      :is-open="isOpen"
      @close="isOpen = false"
    />
  </header>
</template>

<script>
import NavigationHamburgerButton from '~/components/navigation/NavigationHamburgerButton.vue'
import MobileNavigationMenu from '~/components/navigation/MobileNavigationMenu.vue'
import DesktopNavigation from '~/components/navigation/DesktopNavigation.vue'

export default {
  name: 'TopHeader',
  components: {
    NavigationHamburgerButton,
    MobileNavigationMenu,
    DesktopNavigation
  },
  data () {
    return {
      isOpen: false
    }
  }
}
</script>

<style scoped>
.top-header__logo {
  color: #fff;
  font-family: 'Mrs Saint Delafield', cursive;
  font-size: 2.75rem;
  font-weight: bold;
  max-height: 60px;
  margin-top: .5rem;
}

.nuxt-link-exact-active {
  color: #50b0ae !important;
}
</style> 