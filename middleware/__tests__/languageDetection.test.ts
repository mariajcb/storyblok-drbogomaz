// I do not want to set up Jest until looking into # 33 Investigate Updating Major Dependencies
// No point in setting up an outdated version of Jest if it is possible to update or if rewrite is needed

// Test:
// contentVersion
// - test contentVersion is draft if set to 'draft' if the route query indicates so and if isDev is true
// - test that contentVersion is 'published' according to route query and if isDev is false

// currentLanguage
// - test that currentLanguage is correctly pulled from route params
// - test that currentLanguage defaults to english

// server-side caching
// - test that setCacheVersion is called if isServer is true
// - test that it is not called if isServer is false

// updating language settings
// check that shouldUpdateLanguage returns true if Storyblok uid changed
// check that shouldUpdateLanguage returns true if route params changed
// check that associated mutations and actions are called if shouldUpdateLanguage is true
// check that the shouldUpdateLanguage returns false by default, if no changes are made
// check that nothing is committed or dispatched if it's false