<template>
  <section class="section">
    <div v-editable="story.content" class="blog">
      <h2 class="title">{{ story.content.name }}</h2>
      <p class="subtitle">{{ story.content.intro }}</p>
      <div class="blog__body" v-html="$options.filters.markdown(story.content.body)">
      </div>
    </div>
  </section>
</template>

<script>
export default {
  data () {
    return {
      story: { content: { body: '' } }
    }
  },
  mounted () {
    // use the bridge to listen to events
    this.$storybridge.on(['input', 'published', 'change'], (event) => {
      if (event.action == 'input') {
        if (event.story.id === this.story.id) {
          this.story.content = event.story.content
        }
      } else {
        // window.location.reload()
        this.$nuxt.$router.go({
          path: this.$nuxt.$router.currentRoute,
          force: true,
        })
      }
    })
  },
  asyncData (context) {
    // Load the JSON from the API
    let version = context.query._storyblok || context.isDev ? 'draft' : 'published'

    return context.app.$storyapi.get(`cdn/stories/blog/${context.params.slug}`, {
      version: version,
      cv: context.store.state.cacheVersion
    }).then((res) => {
      return res.data
    }).catch((res) => {
      context.error({ statusCode: res.response.status, message: res.response.data })
    })
  }
}
</script>

<style lang="scss" scoped>
.blog {
  padding: 0 20px;
  max-width: 800px;
  margin: 40px auto 100px;

  img {
    width: 100%;
    height: auto;
  }
}

.blog__body {
  line-height: 1.6;
}
</style> 