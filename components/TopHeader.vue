<template>
  <nav class="navbar" role="navigation" aria-label="main navigation">
    <div class="navbar-brand">
        <span class="top-header__logo">Dr.Bogomaz</span>
        <a role="button" class="navbar-burger" aria-label="menu" aria-expanded="false" @click="isOpen = !isOpen" v-bind:class="{'is-active': isOpen}">
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
        </a>
    </div>
    <div class="navbar-menu" v-bind:class="{'is-active': isOpen}">
        <ul class="navbar-end">
            <li><nuxt-link to="/" class="navbar-item is-tab">Home</nuxt-link></li>
            <li><nuxt-link to="/en/blog" class="navbar-item is-tab">Blog</nuxt-link></li>
            <li><nuxt-link to="/contact" class="navbar-item is-tab">Contact</nuxt-link></li>
        </ul>
    </div>
  </nav>
</template>

<script>
export default {
  data () {
    return {
      isOpen: false
    }
  }
}
</script>

<style scoped>
  .navbar {
    padding: 1rem 4rem;
    background-color: #F4F7FA;
  }

  .top-header__logo {
    color: #718FCB;
    font-family: 'Mrs Saint Delafield', cursive;
    font-size: 2.75rem;
    font-weight: bold;
    max-height: 60px;
    margin-top: .5rem;
  }

  .navbar-item.is-tab {
    border-bottom: none;
  }

  a {
    color: black;
    font-weight: bold;
    letter-spacing: .5px;
    font-size: 24px;
    &:hover {
      color: #718FCB!important;
    }
  }

  .nuxt-link-exact-active {
    color: #718FCB!important;
  }
</style>
