# PLUGINS

This directory contains Javascript plugins that you want to run before mounting the root Vue.js application. It can be used both for external packages (vee-validate) or functions/filters/mixins that need to be injected into the global context (markdown filter).

## Notes
- Axios should be in this directory, but it's in the nuxt config for some reason. It is a good idea to move it.
- Filters are deprecated in Vue 3, so don't make any more of them and move the existing ones into helper methods.


More information about the usage of this directory in [the documentation](https://nuxtjs.org/guide/plugins).
