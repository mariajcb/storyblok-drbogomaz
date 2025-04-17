<template>
  <footer class="footer">
    <div class="content has-text-centered">
      <nuxt-link class="bottom-footer__link" to="/en/sitemap">Sitemap</nuxt-link>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: #E8EFF5;
}

.bottom-footer__link {
  color: #363636;
  font-weight: bold;
  letter-spacing: .5px;
  font-size: 24px;
  &:hover {
    color: #718FCB!important;
  }
}

</style>
