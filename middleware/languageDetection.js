// TODO: #35 Refactor languageDetection.js for Clarity

export default function ({ app, isServer, route, store, isDev }) {
  // Determine content version ('draft' or 'published')
  const contentVersion = getContentVersion(route, isDev);

  // Determine language (default to 'en')
  const currentLanguage = getLanguage(route);

  // Set the cache version serverside
  if (isServer) {
    setCacheVersion(store, app);
  }

  // Check if settings need to be loaded or reloaded based on language or missing data
  if (shouldUpdateLanguage(store, currentLanguage)) {
    store.commit('setLanguage', currentLanguage);
    return store.dispatch('loadSettings', { version: contentVersion, language: currentLanguage });
  }
}

// Helper function to determine the content version based on query and environment
function getContentVersion(route, isDev) {
  const isDraftMode = route.query._storyblok || isDev;
  return isDraftMode ? 'draft' : 'published';
}

// Helper function to retrieve the current language or default to english
function getLanguage(route) {
  return route.params.language || 'en';
}

// Helper function to set the cache version to match Storyblok
function setCacheVersion(store, app) {
  const cacheVersion = app.$storyapi.cacheVersion;
  store.commit('setCacheVersion', cacheVersion);
}

// Helper function to check if settings need to be loaded or reloaded
function shouldUpdateLanguage(store, currentLanguage) {
  // Check if user specified a different language setting from main nav 
  // (this is not currently set up )
  const settingsNotLoaded = !store.state.settings._uid;
  // Check if route params changed
  const languageHasChanged = currentLanguage !== store.state.language;
  return settingsNotLoaded || languageHasChanged;
}