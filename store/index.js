export const state = () => ({
  cacheVersion: '',
  settings: {
    main_nav: []
  }
})

// #34 TODO: Refactor store for Clarity and Error Handling

export const mutations = {
  setCacheVersion(state, version) {
    state.cacheVersion = version
  },
  setSettings(state, settings) {
    state.settings = settings
  }
}

export const actions = {
  loadSettings({ commit }, context) {
    return this.$storyapi.get(`cdn/stories/settings`, {
      version: context.version
    }).then((res) => {
      commit('setSettings', res.data.story.content)
    })
  }
}
