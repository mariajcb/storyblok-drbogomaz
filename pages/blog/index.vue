<template>
  <div class="section">
    <div :key="blogPost.content._uid" v-for="blogPost in data.stories" class="container blog__overview">
      <h2>
        <nuxt-link class="blog__detail-link" :to="'/' + blogPost.full_slug">
          {{ blogPost.content.name }}
        </nuxt-link>
      </h2>
      <small>
        {{ timestamp(blogPost.created_at) }}
      </small>
      <p>
        {{ blogPost.content.intro }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return { total: 0, data: { stories: [] } }
  },
  asyncData (context) {
    let version = context.query._storyblok || context.isDev ? 'draft' : 'published'

    return context.app.$storyapi.get('cdn/stories', {
      version: version,
      starts_with: 'blog',
      cv: context.store.state.cacheVersion
    }).then((res) => {
      return res
    }).catch((res) => {
      context.error({ statusCode: res.response.status, message: res.response.data })
    })
  },
  methods: {
    timestamp (date) {
      const timeStamp = date.slice(0, -5).replace(/T/g, ' ')
      return timeStamp
    }
  }
}
</script>

<style lang="scss" scoped>
.blog__overview {
  padding: 0 20px;
  max-width: 600px;
  margin: 40px auto;

  p {
    line-height: 1.6;
  }
}

.blog__detail-link {
  color: #718FCB;
  font-size: 24px;
  font-weight: 500;
  &:hover {
    color: #363636!important;
  }
}
</style> 