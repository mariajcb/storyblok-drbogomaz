import process from 'node:process';globalThis._importMeta_=globalThis._importMeta_||{url:"file:///_entry.js",env:process.env};import { defineComponent, hasInjectionContext, inject, shallowRef, getCurrentInstance, provide, cloneVNode, h, createElementBlock, defineAsyncComponent, computed, unref, shallowReactive, ref, Suspense, Fragment, createApp, toRef, onErrorCaptured, onServerPrefetch, createVNode, resolveDynamicComponent, reactive, effectScope, isReadonly, isRef, isShallow, isReactive, toRaw, mergeProps, getCurrentScope, withCtx, createBlock, openBlock, watch, nextTick, createTextVNode, useSSRContext } from 'vue';
import { c as createError$1, i as hasProtocol, k as isScriptProtocol, f as joinURL, w as withQuery, s as sanitizeStatusCode, l as getContext, $ as $fetch, m as createHooks, n as executeAsync, t as toRouteMatcher, o as createRouter$1, p as defu } from '../nitro/nitro.mjs';
import { b as baseURL } from '../routes/renderer.mjs';
import { useRoute as useRoute$1, RouterView, createMemoryHistory, createRouter, START_LOCATION } from 'vue-router';
import { ssrRenderSuspense, ssrRenderComponent, ssrRenderVNode } from 'vue/server-renderer';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';

if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const appLayoutTransition = false;
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const asyncDataDefaults = { "value": null, "errorValue": null, "deep": true };
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.19.3";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin2) {
  if (plugin2.hooks) {
    nuxtApp.hooks.addHooks(plugin2.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin2) {
  if (typeof plugin2 === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin2(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin2) {
    const unresolvedPluginsForThisPlugin = plugin2.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin2]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin2).then(async () => {
        if (plugin2._name) {
          resolvedPlugins.add(plugin2._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin2._name)) {
              dependsOn.delete(plugin2._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin2.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin2.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin2);
  }
  for (const plugin2 of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin2.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin2);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin2) {
  if (typeof plugin2 === "function") {
    return plugin2;
  }
  const _name = plugin2._name || plugin2.name;
  delete plugin2.name;
  return Object.assign(plugin2.setup || (() => {
  }), plugin2, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const LayoutMetaSymbol = Symbol("layout-meta");
const PageRouteSymbol = Symbol("route");
globalThis._importMeta_.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
function toArray(value) {
  return Array.isArray(value) ? value : [value];
}
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter$1({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const _routes = [
  {
    name: "contact",
    path: "/contact",
    component: () => import('./contact-10fEyyHe.mjs')
  },
  {
    name: "privacy",
    path: "/privacy",
    component: () => import('./privacy-CO3fyYGb.mjs')
  },
  {
    name: "slug",
    path: "/:slug(.*)*",
    component: () => import('./_...slug_-DG0p3KZW.mjs')
  },
  {
    name: "blog-_slug",
    path: "/blog/_slug",
    component: () => import('./_slug-DHWnDCa_.mjs')
  },
  {
    name: "blog",
    path: "/blog",
    component: () => import('./index-krMEK519.mjs')
  },
  {
    name: "cookie-preferences",
    path: "/cookie-preferences",
    component: () => import('./cookie-preferences-BhVm7uVS.mjs')
  }
];
const _wrapInTransition = (props, children) => {
  return { default: () => children.default?.() };
};
const ROUTE_KEY_PARENTHESES_RE = /(:\w+)\([^)]+\)/g;
const ROUTE_KEY_SYMBOLS_RE = /(:\w+)[?+*]/g;
const ROUTE_KEY_NORMAL_RE = /:\w+/g;
function generateRouteKey(route) {
  const source = route?.meta.key ?? route.path.replace(ROUTE_KEY_PARENTHESES_RE, "$1").replace(ROUTE_KEY_SYMBOLS_RE, "$1").replace(ROUTE_KEY_NORMAL_RE, (r) => route.params[r.slice(1)]?.toString() || "");
  return typeof source === "function" ? source(route) : source;
}
function isChangingPage(to, from) {
  if (to === from || from === START_LOCATION) {
    return false;
  }
  if (generateRouteKey(to) !== generateRouteKey(from)) {
    return true;
  }
  const areComponentsSame = to.matched.every(
    (comp, index) => comp.components && comp.components.default === from.matched[index]?.components?.default
  );
  if (areComponentsSame) {
    return false;
  }
  return true;
}
const routerOptions0 = {
  scrollBehavior(to, from, savedPosition) {
    const nuxtApp = useNuxtApp();
    const hashScrollBehaviour = useRouter().options?.scrollBehaviorType ?? "auto";
    if (to.path.replace(/\/$/, "") === from.path.replace(/\/$/, "")) {
      if (from.hash && !to.hash) {
        return { left: 0, top: 0 };
      }
      if (to.hash) {
        return { el: to.hash, top: _getHashElementScrollMarginTop(to.hash), behavior: hashScrollBehaviour };
      }
      return false;
    }
    const routeAllowsScrollToTop = typeof to.meta.scrollToTop === "function" ? to.meta.scrollToTop(to, from) : to.meta.scrollToTop;
    if (routeAllowsScrollToTop === false) {
      return false;
    }
    const hookToWait = nuxtApp._runningTransition ? "page:transition:finish" : "page:loading:end";
    return new Promise((resolve) => {
      if (from === START_LOCATION) {
        resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour));
        return;
      }
      nuxtApp.hooks.hookOnce(hookToWait, () => {
        requestAnimationFrame(() => resolve(_calculatePosition(to, from, savedPosition, hashScrollBehaviour)));
      });
    });
  }
};
function _getHashElementScrollMarginTop(selector) {
  try {
    const elem = (void 0).querySelector(selector);
    if (elem) {
      return (Number.parseFloat(getComputedStyle(elem).scrollMarginTop) || 0) + (Number.parseFloat(getComputedStyle((void 0).documentElement).scrollPaddingTop) || 0);
    }
  } catch {
  }
  return 0;
}
function _calculatePosition(to, from, savedPosition, defaultHashScrollBehaviour) {
  if (savedPosition) {
    return savedPosition;
  }
  const isPageNavigation = isChangingPage(to, from);
  if (to.hash) {
    return {
      el: to.hash,
      top: _getHashElementScrollMarginTop(to.hash),
      behavior: isPageNavigation ? defaultHashScrollBehaviour : "instant"
    };
  }
  return {
    left: 0,
    top: 0
  };
}
const configRouterOptions = {
  hashMode: false,
  scrollBehaviorType: "auto"
};
const routerOptions = {
  ...configRouterOptions,
  ...routerOptions0
};
const validate = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to, from) => {
  let __temp, __restore;
  if (!to.meta?.validate) {
    return;
  }
  const result = ([__temp, __restore] = executeAsync(() => Promise.resolve(to.meta.validate(to))), __temp = await __temp, __restore(), __temp);
  if (result === true) {
    return;
  }
  const error = createError({
    fatal: false,
    statusCode: result && result.statusCode || 404,
    statusMessage: result && result.statusMessage || `Page Not Found: ${to.fullPath}`,
    data: {
      path: to.fullPath
    }
  });
  return error;
});
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  validate,
  manifest_45route_45rule
];
const namedMiddleware = {};
const plugin = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  async setup(nuxtApp) {
    let __temp, __restore;
    let routerBase = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const history = routerOptions.history?.(routerBase) ?? createMemoryHistory(routerBase);
    const routes = routerOptions.routes ? ([__temp, __restore] = executeAsync(() => routerOptions.routes(_routes)), __temp = await __temp, __restore(), __temp) ?? _routes : _routes;
    let startPosition;
    const router = createRouter({
      ...routerOptions,
      scrollBehavior: (to, from, savedPosition) => {
        if (from === START_LOCATION) {
          startPosition = savedPosition;
          return;
        }
        if (routerOptions.scrollBehavior) {
          router.options.scrollBehavior = routerOptions.scrollBehavior;
          if ("scrollRestoration" in (void 0).history) {
            const unsub = router.beforeEach(() => {
              unsub();
              (void 0).history.scrollRestoration = "manual";
            });
          }
          return routerOptions.scrollBehavior(to, START_LOCATION, startPosition || savedPosition);
        }
      },
      history,
      routes
    });
    nuxtApp.vueApp.use(router);
    const previousRoute = shallowRef(router.currentRoute.value);
    router.afterEach((_to, from) => {
      previousRoute.value = from;
    });
    Object.defineProperty(nuxtApp.vueApp.config.globalProperties, "previousRoute", {
      get: () => previousRoute.value
    });
    const initialURL = nuxtApp.ssrContext.url;
    const _route = shallowRef(router.currentRoute.value);
    const syncCurrentRoute = () => {
      _route.value = router.currentRoute.value;
    };
    nuxtApp.hook("page:finish", syncCurrentRoute);
    router.afterEach((to, from) => {
      if (to.matched[to.matched.length - 1]?.components?.default === from.matched[from.matched.length - 1]?.components?.default) {
        syncCurrentRoute();
      }
    });
    const route = {};
    for (const key in _route.value) {
      Object.defineProperty(route, key, {
        get: () => _route.value[key],
        enumerable: true
      });
    }
    nuxtApp._route = shallowReactive(route);
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    if (!nuxtApp.ssrContext?.islandContext) {
      router.afterEach(async (to, _from, failure) => {
        delete nuxtApp._processingMiddleware;
        if (failure) {
          await nuxtApp.callHook("page:loading:end");
        }
        if (failure?.type === 4) {
          return;
        }
        if (to.redirectedFrom && to.fullPath !== initialURL) {
          await nuxtApp.runWithContext(() => navigateTo(to.fullPath || "/"));
        }
      });
    }
    try {
      if (true) {
        ;
        [__temp, __restore] = executeAsync(() => router.push(initialURL)), await __temp, __restore();
        ;
      }
      ;
      [__temp, __restore] = executeAsync(() => router.isReady()), await __temp, __restore();
      ;
    } catch (error2) {
      [__temp, __restore] = executeAsync(() => nuxtApp.runWithContext(() => showError(error2))), await __temp, __restore();
    }
    const resolvedInitialRoute = router.currentRoute.value;
    syncCurrentRoute();
    if (nuxtApp.ssrContext?.islandContext) {
      return { provide: { router } };
    }
    const initialLayout = nuxtApp.payload.state._layout;
    router.beforeEach(async (to, from) => {
      await nuxtApp.callHook("page:loading:start");
      to.meta = reactive(to.meta);
      if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
        to.meta.layout = initialLayout;
      }
      nuxtApp._processingMiddleware = true;
      if (!nuxtApp.ssrContext?.islandContext) {
        const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
        for (const component of to.matched) {
          const componentMiddleware = component.meta.middleware;
          if (!componentMiddleware) {
            continue;
          }
          for (const entry2 of toArray(componentMiddleware)) {
            middlewareEntries.add(entry2);
          }
        }
        {
          const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
          if (routeRules.appMiddleware) {
            for (const key in routeRules.appMiddleware) {
              if (routeRules.appMiddleware[key]) {
                middlewareEntries.add(key);
              } else {
                middlewareEntries.delete(key);
              }
            }
          }
        }
        for (const entry2 of middlewareEntries) {
          const middleware = typeof entry2 === "string" ? nuxtApp._middleware.named[entry2] || await namedMiddleware[entry2]?.().then((r) => r.default || r) : entry2;
          if (!middleware) {
            throw new Error(`Unknown route middleware: '${entry2}'.`);
          }
          try {
            if (false) ;
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            if (true) {
              if (result === false || result instanceof Error) {
                const error2 = result || createError({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`
                });
                await nuxtApp.runWithContext(() => showError(error2));
                return false;
              }
            }
            if (result === true) {
              continue;
            }
            if (result === false) {
              return result;
            }
            if (result) {
              if (isNuxtError(result) && result.fatal) {
                await nuxtApp.runWithContext(() => showError(result));
              }
              return result;
            }
          } catch (err) {
            const error2 = createError(err);
            if (error2.fatal) {
              await nuxtApp.runWithContext(() => showError(error2));
            }
            return error2;
          }
        }
      }
    });
    router.onError(async () => {
      delete nuxtApp._processingMiddleware;
      await nuxtApp.callHook("page:loading:end");
    });
    router.afterEach((to) => {
      if (to.matched.length === 0) {
        return nuxtApp.runWithContext(() => showError(createError({
          statusCode: 404,
          fatal: false,
          statusMessage: `Page not found: ${to.fullPath}`,
          data: {
            path: to.fullPath
          }
        })));
      }
    });
    nuxtApp.hooks.hookOnce("app:created", async () => {
      try {
        if ("name" in resolvedInitialRoute) {
          resolvedInitialRoute.name = void 0;
        }
        await router.replace({
          ...resolvedInitialRoute,
          force: true
        });
        router.options.scrollBehavior = routerOptions.scrollBehavior;
      } catch (error2) {
        await nuxtApp.runWithContext(() => showError(error2));
      }
    });
    return { provide: { router } };
  }
});
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const LazyAboutMe = defineAsyncComponent(() => import('./AboutMe-DqOjWgLF.mjs').then((r) => r["default"] || r.default || r));
const LazyBio = defineAsyncComponent(() => import('./Bio-BxU_W5GD.mjs').then((r) => r["default"] || r.default || r));
const LazyBlog = defineAsyncComponent(() => import('./Blog-CICnngwa.mjs').then((r) => r["default"] || r.default || r));
const LazyFeature = defineAsyncComponent(() => import('./Feature-DlFWp5Ry.mjs').then((r) => r["default"] || r.default || r));
const LazyGrid = defineAsyncComponent(() => import('./Grid-BfP1yYiX.mjs').then((r) => r["default"] || r.default || r));
const LazyPage = defineAsyncComponent(() => import('./Page-Bty_3pFI.mjs').then((r) => r["default"] || r.default || r));
const LazyTeaser = defineAsyncComponent(() => import('./Teaser-B61QIbEb.mjs').then((r) => r["default"] || r.default || r));
const lazyGlobalComponents = [
  ["AboutMe", LazyAboutMe],
  ["Bio", LazyBio],
  ["Blog", LazyBlog],
  ["Feature", LazyFeature],
  ["Grid", LazyGrid],
  ["Page", LazyPage],
  ["Teaser", LazyTeaser]
];
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components",
  setup(nuxtApp) {
    for (const [name, component] of lazyGlobalComponents) {
      nuxtApp.vueApp.component(name, component);
      nuxtApp.vueApp.component("Lazy" + name, component);
    }
  }
});
var ke = Object.defineProperty, ve = (s, e, t) => e in s ? ke(s, e, { enumerable: true, configurable: true, writable: true, value: t }) : s[e] = t, m = (s, e, t) => ve(s, typeof e != "symbol" ? e + "" : e, t);
class $e extends Error {
  constructor(e) {
    super(e), this.name = "AbortError";
  }
}
function Te(s, e, t) {
  if (!Number.isFinite(e))
    throw new TypeError("Expected `limit` to be a finite number");
  if (!Number.isFinite(t))
    throw new TypeError("Expected `interval` to be a finite number");
  const r = [];
  let o = [], n = 0, a = false;
  const i = async () => {
    n++;
    const h2 = r.shift();
    if (h2)
      try {
        const p = await s(...h2.args);
        h2.resolve(p);
      } catch (p) {
        h2.reject(p);
      }
    const d = setTimeout(() => {
      n--, r.length > 0 && i(), o = o.filter((p) => p !== d);
    }, t);
    o.includes(d) || o.push(d);
  }, l = (...h2) => a ? Promise.reject(
    new Error(
      "Throttled function is already aborted and not accepting new promises"
    )
  ) : new Promise((d, p) => {
    r.push({
      resolve: d,
      reject: p,
      args: h2
    }), n < e && i();
  });
  return l.abort = () => {
    a = true, o.forEach(clearTimeout), o = [], r.forEach(
      (h2) => h2.reject(() => new $e("Throttle function aborted"))
    ), r.length = 0;
  }, l;
}
class N {
  constructor() {
    m(this, "isCDNUrl", (e = "") => e.includes("/cdn/")), m(this, "getOptionsPage", (e, t = 25, r = 1) => ({
      ...e,
      per_page: t,
      page: r
    })), m(this, "delay", (e) => new Promise((t) => setTimeout(t, e))), m(this, "arrayFrom", (e = 0, t) => Array.from({ length: e }, t)), m(this, "range", (e = 0, t = e) => {
      const r = Math.abs(t - e) || 0, o = e < t ? 1 : -1;
      return this.arrayFrom(r, (n, a) => a * o + e);
    }), m(this, "asyncMap", async (e, t) => Promise.all(e.map(t))), m(this, "flatMap", (e = [], t) => e.map(t).reduce((r, o) => [...r, ...o], [])), m(this, "escapeHTML", function(e) {
      const t = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
      }, r = /[&<>"']/g, o = new RegExp(r.source);
      return e && o.test(e) ? e.replace(r, (n) => t[n]) : e;
    });
  }
  /**
   * @method stringify
   * @param  {object} params
   * @param  {string} prefix
   * @param  {boolean} isArray
   * @return {string} Stringified object
   */
  stringify(e, t, r) {
    const o = [];
    for (const n in e) {
      if (!Object.prototype.hasOwnProperty.call(e, n))
        continue;
      const a = e[n];
      if (a == null)
        continue;
      const i = r ? "" : encodeURIComponent(n);
      let l;
      typeof a == "object" ? l = this.stringify(
        a,
        t ? t + encodeURIComponent(`[${i}]`) : i,
        Array.isArray(a)
      ) : l = `${t ? t + encodeURIComponent(`[${i}]`) : i}=${encodeURIComponent(a)}`, o.push(l);
    }
    return o.join("&");
  }
  /**
   * @method getRegionURL
   * @param  {string} regionCode region code, could be eu, us, cn, ap or ca
   * @return {string} The base URL of the region
   */
  getRegionURL(e) {
    const t = "api.storyblok.com", r = "api-us.storyblok.com", o = "app.storyblokchina.cn", n = "api-ap.storyblok.com", a = "api-ca.storyblok.com";
    switch (e) {
      case "us":
        return r;
      case "cn":
        return o;
      case "ap":
        return n;
      case "ca":
        return a;
      default:
        return t;
    }
  }
}
const we = function(s, e) {
  const t = {};
  for (const r in s) {
    const o = s[r];
    e.includes(r) && o !== null && (t[r] = o);
  }
  return t;
}, Re = (s) => s === "email", _e = () => ({
  singleTag: "hr"
}), Se = () => ({
  tag: "blockquote"
}), Ee = () => ({
  tag: "ul"
}), xe = (s) => ({
  tag: [
    "pre",
    {
      tag: "code",
      attrs: s.attrs
    }
  ]
}), je = () => ({
  singleTag: "br"
}), Ae = (s) => ({
  tag: `h${s.attrs.level}`
}), Ie = (s) => ({
  singleTag: [
    {
      tag: "img",
      attrs: we(s.attrs, ["src", "alt", "title"])
    }
  ]
}), Ce = () => ({
  tag: "li"
}), Le = () => ({
  tag: "ol"
}), Oe = () => ({
  tag: "p"
}), Pe = (s) => ({
  tag: [
    {
      tag: "span",
      attrs: {
        "data-type": "emoji",
        "data-name": s.attrs.name,
        emoji: s.attrs.emoji
      }
    }
  ]
}), Ne = () => ({
  tag: "b"
}), Me = () => ({
  tag: "s"
}), He = () => ({
  tag: "u"
}), De = () => ({
  tag: "strong"
}), Ue = () => ({
  tag: "code"
}), Be = () => ({
  tag: "i"
}), ze = (s) => {
  if (!s.attrs)
    return {
      tag: ""
    };
  const e = new N().escapeHTML, t = { ...s.attrs }, { linktype: r = "url" } = s.attrs;
  if (delete t.linktype, t.href && (t.href = e(s.attrs.href || "")), Re(r) && (t.href = `mailto:${t.href}`), t.anchor && (t.href = `${t.href}#${t.anchor}`, delete t.anchor), t.custom) {
    for (const o in t.custom)
      t[o] = t.custom[o];
    delete t.custom;
  }
  return {
    tag: [
      {
        tag: "a",
        attrs: t
      }
    ]
  };
}, Fe = (s) => ({
  tag: [
    {
      tag: "span",
      attrs: s.attrs
    }
  ]
}), qe = () => ({
  tag: "sub"
}), Ve = () => ({
  tag: "sup"
}), Ge = (s) => ({
  tag: [
    {
      tag: "span",
      attrs: s.attrs
    }
  ]
}), Ke = (s) => {
  var e;
  return (e = s.attrs) != null && e.color ? {
    tag: [
      {
        tag: "span",
        attrs: {
          style: `background-color:${s.attrs.color};`
        }
      }
    ]
  } : {
    tag: ""
  };
}, Je = (s) => {
  var e;
  return (e = s.attrs) != null && e.color ? {
    tag: [
      {
        tag: "span",
        attrs: {
          style: `color:${s.attrs.color}`
        }
      }
    ]
  } : {
    tag: ""
  };
}, Ye = {
  nodes: {
    horizontal_rule: _e,
    blockquote: Se,
    bullet_list: Ee,
    code_block: xe,
    hard_break: je,
    heading: Ae,
    image: Ie,
    list_item: Ce,
    ordered_list: Le,
    paragraph: Oe,
    emoji: Pe
  },
  marks: {
    bold: Ne,
    strike: Me,
    underline: He,
    strong: De,
    code: Ue,
    italic: Be,
    link: ze,
    styled: Fe,
    subscript: qe,
    superscript: Ve,
    anchor: Ge,
    highlight: Ke,
    textStyle: Je
  }
}, We = function(s) {
  const e = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }, t = /[&<>"']/g, r = new RegExp(t.source);
  return s && r.test(s) ? s.replace(t, (o) => e[o]) : s;
};
let V = false;
class M {
  constructor(e) {
    m(this, "marks"), m(this, "nodes"), e || (e = Ye), this.marks = e.marks || [], this.nodes = e.nodes || [];
  }
  addNode(e, t) {
    this.nodes[e] = t;
  }
  addMark(e, t) {
    this.marks[e] = t;
  }
  render(e, t = { optimizeImages: false }, r = true) {
    if (!V && r && (console.warn(
      "Warning ⚠️: The RichTextResolver class is deprecated and will be removed in the next major release. Please use the `@storyblok/richtext` package instead. https://github.com/storyblok/richtext/"
    ), V = true), e && e.content && Array.isArray(e.content)) {
      let o = "";
      return e.content.forEach((n) => {
        o += this.renderNode(n);
      }), t.optimizeImages ? this.optimizeImages(o, t.optimizeImages) : o;
    }
    return console.warn(
      `The render method must receive an Object with a "content" field.
      The "content" field must be an array of nodes as the type ISbRichtext.
      ISbRichtext:
        content?: ISbRichtext[]
        marks?: ISbRichtext[]
        attrs?: any
        text?: string
        type: string
        
        Example:
        {
          content: [
            {
              content: [
                {
                  text: 'Hello World',
                  type: 'text'
                }
              ],
              type: 'paragraph'
            }
          ],
          type: 'doc'
        }`
    ), "";
  }
  optimizeImages(e, t) {
    let r = 0, o = 0, n = "", a = "";
    typeof t != "boolean" && (typeof t.width == "number" && t.width > 0 && (n += `width="${t.width}" `, r = t.width), typeof t.height == "number" && t.height > 0 && (n += `height="${t.height}" `, o = t.height), (t.loading === "lazy" || t.loading === "eager") && (n += `loading="${t.loading}" `), typeof t.class == "string" && t.class.length > 0 && (n += `class="${t.class}" `), t.filters && (typeof t.filters.blur == "number" && t.filters.blur >= 0 && t.filters.blur <= 100 && (a += `:blur(${t.filters.blur})`), typeof t.filters.brightness == "number" && t.filters.brightness >= -100 && t.filters.brightness <= 100 && (a += `:brightness(${t.filters.brightness})`), t.filters.fill && (t.filters.fill.match(/[0-9A-F]{6}/gi) || t.filters.fill === "transparent") && (a += `:fill(${t.filters.fill})`), t.filters.format && ["webp", "png", "jpeg"].includes(t.filters.format) && (a += `:format(${t.filters.format})`), typeof t.filters.grayscale == "boolean" && t.filters.grayscale && (a += ":grayscale()"), typeof t.filters.quality == "number" && t.filters.quality >= 0 && t.filters.quality <= 100 && (a += `:quality(${t.filters.quality})`), t.filters.rotate && [90, 180, 270].includes(t.filters.rotate) && (a += `:rotate(${t.filters.rotate})`), a.length > 0 && (a = `/filters${a}`))), n.length > 0 && (e = e.replace(/<img/g, `<img ${n.trim()}`));
    const i = r > 0 || o > 0 || a.length > 0 ? `${r}x${o}${a}` : "";
    return e = e.replace(
      /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|bmp)/g,
      `a.storyblok.com/f/$1/$2.$3/m/${i}`
    ), typeof t != "boolean" && (t.sizes || t.srcset) && (e = e.replace(/<img.*?src=["|'](.*?)["|']/g, (l) => {
      var h2, d;
      const p = l.match(
        /a.storyblok.com\/f\/(\d+)\/([^.]+)\.(gif|jpg|jpeg|png|tif|bmp)/g
      );
      if (p && p.length > 0) {
        const b = {
          srcset: (h2 = t.srcset) == null ? void 0 : h2.map((y) => {
            if (typeof y == "number")
              return `//${p}/m/${y}x0${a} ${y}w`;
            if (typeof y == "object" && y.length === 2) {
              let E = 0, I = 0;
              return typeof y[0] == "number" && (E = y[0]), typeof y[1] == "number" && (I = y[1]), `//${p}/m/${E}x${I}${a} ${E}w`;
            }
            return "";
          }).join(", "),
          sizes: (d = t.sizes) == null ? void 0 : d.map((y) => y).join(", ")
        };
        let S = "";
        return b.srcset && (S += `srcset="${b.srcset}" `), b.sizes && (S += `sizes="${b.sizes}" `), l.replace(/<img/g, `<img ${S.trim()}`);
      }
      return l;
    })), e;
  }
  renderNode(e) {
    const t = [];
    e.marks && e.marks.forEach((o) => {
      const n = this.getMatchingMark(o);
      n && n.tag !== "" && t.push(this.renderOpeningTag(n.tag));
    });
    const r = this.getMatchingNode(e);
    return r && r.tag && t.push(this.renderOpeningTag(r.tag)), e.content ? e.content.forEach((o) => {
      t.push(this.renderNode(o));
    }) : e.text ? t.push(We(e.text)) : r && r.singleTag ? t.push(this.renderTag(r.singleTag, " /")) : r && r.html ? t.push(r.html) : e.type === "emoji" && t.push(this.renderEmoji(e)), r && r.tag && t.push(this.renderClosingTag(r.tag)), e.marks && e.marks.slice(0).reverse().forEach((o) => {
      const n = this.getMatchingMark(o);
      n && n.tag !== "" && t.push(this.renderClosingTag(n.tag));
    }), t.join("");
  }
  renderTag(e, t) {
    return e.constructor === String ? `<${e}${t}>` : e.map((r) => {
      if (r.constructor === String)
        return `<${r}${t}>`;
      {
        let o = `<${r.tag}`;
        if (r.attrs) {
          for (const n in r.attrs)
            if (Object.prototype.hasOwnProperty.call(r.attrs, n)) {
              const a = r.attrs[n];
              a !== null && (o += ` ${n}="${a}"`);
            }
        }
        return `${o}${t}>`;
      }
    }).join("");
  }
  renderOpeningTag(e) {
    return this.renderTag(e, "");
  }
  renderClosingTag(e) {
    return e.constructor === String ? `</${e}>` : e.slice(0).reverse().map((t) => t.constructor === String ? `</${t}>` : `</${t.tag}>`).join("");
  }
  getMatchingNode(e) {
    const t = this.nodes[e.type];
    if (typeof t == "function")
      return t(e);
  }
  getMatchingMark(e) {
    const t = this.marks[e.type];
    if (typeof t == "function")
      return t(e);
  }
  renderEmoji(e) {
    if (e.attrs.emoji)
      return e.attrs.emoji;
    const t = [
      {
        tag: "img",
        attrs: {
          src: e.attrs.fallbackImage,
          draggable: "false",
          loading: "lazy",
          align: "absmiddle"
        }
      }
    ];
    return this.renderTag(t, " /");
  }
}
class Xe {
  constructor(e) {
    m(this, "baseURL"), m(this, "timeout"), m(this, "headers"), m(this, "responseInterceptor"), m(this, "fetch"), m(this, "ejectInterceptor"), m(this, "url"), m(this, "parameters"), m(this, "fetchOptions"), this.baseURL = e.baseURL, this.headers = e.headers || new Headers(), this.timeout = e != null && e.timeout ? e.timeout * 1e3 : 0, this.responseInterceptor = e.responseInterceptor, this.fetch = (...t) => e.fetch ? e.fetch(...t) : fetch(...t), this.ejectInterceptor = false, this.url = "", this.parameters = {}, this.fetchOptions = {};
  }
  /**
   *
   * @param url string
   * @param params ISbStoriesParams
   * @returns Promise<ISbResponse | Error>
   */
  get(e, t) {
    return this.url = e, this.parameters = t, this._methodHandler("get");
  }
  post(e, t) {
    return this.url = e, this.parameters = t, this._methodHandler("post");
  }
  put(e, t) {
    return this.url = e, this.parameters = t, this._methodHandler("put");
  }
  delete(e, t) {
    return this.url = e, this.parameters = t ?? {}, this._methodHandler("delete");
  }
  async _responseHandler(e) {
    const t = [], r = {
      data: {},
      headers: {},
      status: 0,
      statusText: ""
    };
    e.status !== 204 && await e.json().then((o) => {
      r.data = o;
    });
    for (const o of e.headers.entries())
      t[o[0]] = o[1];
    return r.headers = { ...t }, r.status = e.status, r.statusText = e.statusText, r;
  }
  async _methodHandler(e) {
    let t = `${this.baseURL}${this.url}`, r = null;
    if (e === "get") {
      const l = new N();
      t = `${this.baseURL}${this.url}?${l.stringify(
        this.parameters
      )}`;
    } else
      r = JSON.stringify(this.parameters);
    const o = new URL(t), n = new AbortController(), { signal: a } = n;
    let i;
    this.timeout && (i = setTimeout(() => n.abort(), this.timeout));
    try {
      const l = await this.fetch(`${o}`, {
        method: e,
        headers: this.headers,
        body: r,
        signal: a,
        ...this.fetchOptions
      });
      this.timeout && clearTimeout(i);
      const h2 = await this._responseHandler(
        l
      );
      return this.responseInterceptor && !this.ejectInterceptor ? this._statusHandler(this.responseInterceptor(h2)) : this._statusHandler(h2);
    } catch (l) {
      return {
        message: l
      };
    }
  }
  setFetchOptions(e = {}) {
    Object.keys(e).length > 0 && "method" in e && delete e.method, this.fetchOptions = { ...e };
  }
  eject() {
    this.ejectInterceptor = true;
  }
  _statusHandler(e) {
    const t = /20[0-6]/g;
    return new Promise((r, o) => {
      if (t.test(`${e.status}`))
        return r(e);
      const n = {
        message: e.statusText,
        status: e.status,
        response: Array.isArray(e.data) ? e.data[0] : e.data.error || e.data.slug
      };
      o(n);
    });
  }
}
const G = "SB-Agent", U = {
  defaultAgentName: "SB-JS-CLIENT",
  defaultAgentVersion: "SB-Agent-Version",
  packageVersion: "6.0.0"
};
let L = {};
const x = {};
class Qe {
  /**
   *
   * @param config ISbConfig interface
   * @param pEndpoint string, optional
   */
  constructor(e, t) {
    m(this, "client"), m(this, "maxRetries"), m(this, "retriesDelay"), m(this, "throttle"), m(this, "accessToken"), m(this, "cache"), m(this, "helpers"), m(this, "resolveCounter"), m(this, "relations"), m(this, "links"), m(this, "richTextResolver"), m(this, "resolveNestedRelations"), m(this, "stringifiedStoriesCache");
    let r = e.endpoint || t;
    if (!r) {
      const a = new N().getRegionURL, i = e.https === false ? "http" : "https";
      e.oauthToken ? r = `${i}://${a(e.region)}/v1` : r = `${i}://${a(e.region)}/v2`;
    }
    const o = new Headers();
    o.set("Content-Type", "application/json"), o.set("Accept", "application/json"), e.headers && (e.headers.constructor.name === "Headers" ? e.headers.entries().toArray() : Object.entries(e.headers)).forEach(([a, i]) => {
      o.set(a, i);
    }), o.has(G) || (o.set(G, U.defaultAgentName), o.set(
      U.defaultAgentVersion,
      U.packageVersion
    ));
    let n = 5;
    e.oauthToken && (o.set("Authorization", e.oauthToken), n = 3), e.rateLimit && (n = e.rateLimit), e.richTextSchema ? this.richTextResolver = new M(e.richTextSchema) : this.richTextResolver = new M(), e.componentResolver && this.setComponentResolver(e.componentResolver), this.maxRetries = e.maxRetries || 10, this.retriesDelay = 300, this.throttle = Te(
      this.throttledRequest.bind(this),
      n,
      1e3
    ), this.accessToken = e.accessToken || "", this.relations = {}, this.links = {}, this.cache = e.cache || { clear: "manual" }, this.helpers = new N(), this.resolveCounter = 0, this.resolveNestedRelations = e.resolveNestedRelations || true, this.stringifiedStoriesCache = {}, this.client = new Xe({
      baseURL: r,
      timeout: e.timeout || 0,
      headers: o,
      responseInterceptor: e.responseInterceptor,
      fetch: e.fetch
    });
  }
  setComponentResolver(e) {
    this.richTextResolver.addNode("blok", (t) => {
      let r = "";
      return t.attrs.body && t.attrs.body.forEach((o) => {
        r += e(o.component, o);
      }), {
        html: r
      };
    });
  }
  parseParams(e) {
    return e.token || (e.token = this.getToken()), e.cv || (e.cv = x[e.token]), Array.isArray(e.resolve_relations) && (e.resolve_relations = e.resolve_relations.join(",")), typeof e.resolve_relations < "u" && (e.resolve_level = 2), e;
  }
  factoryParamOptions(e, t) {
    return this.helpers.isCDNUrl(e) ? this.parseParams(t) : t;
  }
  makeRequest(e, t, r, o, n) {
    const a = this.factoryParamOptions(
      e,
      this.helpers.getOptionsPage(t, r, o)
    );
    return this.cacheResponse(e, a, void 0, n);
  }
  get(e, t, r) {
    t || (t = {});
    const o = `/${e}`, n = this.factoryParamOptions(o, t);
    return this.cacheResponse(o, n, void 0, r);
  }
  async getAll(e, t, r, o) {
    const n = (t == null ? void 0 : t.per_page) || 25, a = `/${e}`.replace(/\/$/, ""), i = r ?? a.substring(a.lastIndexOf("/") + 1), l = 1, h2 = await this.makeRequest(
      a,
      t,
      n,
      l,
      o
    ), d = h2.total ? Math.ceil(h2.total / n) : 1, p = await this.helpers.asyncMap(
      this.helpers.range(l, d),
      (b) => this.makeRequest(a, t, n, b + 1, o)
    );
    return this.helpers.flatMap([h2, ...p], (b) => Object.values(b.data[i]));
  }
  post(e, t, r) {
    const o = `/${e}`;
    return Promise.resolve(
      this.throttle("post", o, t, r)
    );
  }
  put(e, t, r) {
    const o = `/${e}`;
    return Promise.resolve(
      this.throttle("put", o, t, r)
    );
  }
  delete(e, t, r) {
    t || (t = {});
    const o = `/${e}`;
    return Promise.resolve(
      this.throttle("delete", o, t, r)
    );
  }
  getStories(e, t) {
    return this._addResolveLevel(e), this.get("cdn/stories", e, t);
  }
  getStory(e, t, r) {
    return this._addResolveLevel(t), this.get(`cdn/stories/${e}`, t, r);
  }
  getToken() {
    return this.accessToken;
  }
  ejectInterceptor() {
    this.client.eject();
  }
  _addResolveLevel(e) {
    typeof e.resolve_relations < "u" && (e.resolve_level = 2);
  }
  _cleanCopy(e) {
    return JSON.parse(JSON.stringify(e));
  }
  _insertLinks(e, t, r) {
    const o = e[t];
    o && o.fieldtype === "multilink" && o.linktype === "story" && typeof o.id == "string" && this.links[r][o.id] ? o.story = this._cleanCopy(this.links[r][o.id]) : o && o.linktype === "story" && typeof o.uuid == "string" && this.links[r][o.uuid] && (o.story = this._cleanCopy(this.links[r][o.uuid]));
  }
  /**
   *
   * @param resolveId A counter number as a string
   * @param uuid The uuid of the story
   * @returns string | object
   */
  getStoryReference(e, t) {
    return this.relations[e][t] ? JSON.parse(this.stringifiedStoriesCache[t] || JSON.stringify(this.relations[e][t])) : t;
  }
  /**
   * Resolves a field's value by replacing UUIDs with their corresponding story references
   * @param jtree - The JSON tree object containing the field to resolve
   * @param treeItem - The key of the field to resolve
   * @param resolveId - The unique identifier for the current resolution context
   *
   * This method handles both single string UUIDs and arrays of UUIDs:
   * - For single strings: directly replaces the UUID with the story reference
   * - For arrays: maps through each UUID and replaces with corresponding story references
   */
  _resolveField(e, t, r) {
    const o = e[t];
    typeof o == "string" ? e[t] = this.getStoryReference(r, o) : Array.isArray(o) && (e[t] = o.map(
      (n) => this.getStoryReference(r, n)
    ).filter(Boolean));
  }
  /**
   * Inserts relations into the JSON tree by resolving references
   * @param jtree - The JSON tree object to process
   * @param treeItem - The current field being processed
   * @param fields - The relation patterns to resolve (string or array of strings)
   * @param resolveId - The unique identifier for the current resolution context
   *
   * This method handles two types of relation patterns:
   * 1. Nested relations: matches fields that end with the current field name
   *    Example: If treeItem is "event_type", it matches patterns like "*.event_type"
   *
   * 2. Direct component relations: matches exact component.field patterns
   *    Example: "event.event_type" for component "event" and field "event_type"
   *
   * The method supports both string and array formats for the fields parameter,
   * allowing flexible specification of relation patterns.
   */
  _insertRelations(e, t, r, o) {
    if (Array.isArray(r) ? r.find((a) => a.endsWith(`.${t}`)) : r.endsWith(`.${t}`)) {
      this._resolveField(e, t, o);
      return;
    }
    const n = e.component ? `${e.component}.${t}` : t;
    (Array.isArray(r) ? r.includes(n) : r === n) && this._resolveField(e, t, o);
  }
  /**
   * Recursively traverses and resolves relations in the story content tree
   * @param story - The story object containing the content to process
   * @param fields - The relation patterns to resolve
   * @param resolveId - The unique identifier for the current resolution context
   */
  iterateTree(e, t, r) {
    const o = (n, a = "") => {
      if (!(!n || n._stopResolving)) {
        if (Array.isArray(n))
          n.forEach((i, l) => o(i, `${a}[${l}]`));
        else if (typeof n == "object")
          for (const i in n) {
            const l = a ? `${a}.${i}` : i;
            (n.component && n._uid || n.type === "link") && (this._insertRelations(n, i, t, r), this._insertLinks(n, i, r)), o(n[i], l);
          }
      }
    };
    o(e.content);
  }
  async resolveLinks(e, t, r) {
    let o = [];
    if (e.link_uuids) {
      const n = e.link_uuids.length, a = [], i = 50;
      for (let l = 0; l < n; l += i) {
        const h2 = Math.min(n, l + i);
        a.push(e.link_uuids.slice(l, h2));
      }
      for (let l = 0; l < a.length; l++)
        (await this.getStories({
          per_page: i,
          language: t.language,
          version: t.version,
          starts_with: t.starts_with,
          by_uuids: a[l].join(",")
        })).data.stories.forEach(
          (h2) => {
            o.push(h2);
          }
        );
    } else
      o = e.links;
    o.forEach((n) => {
      this.links[r][n.uuid] = {
        ...n,
        _stopResolving: true
      };
    });
  }
  async resolveRelations(e, t, r) {
    let o = [];
    if (e.rel_uuids) {
      const n = e.rel_uuids.length, a = [], i = 50;
      for (let l = 0; l < n; l += i) {
        const h2 = Math.min(n, l + i);
        a.push(e.rel_uuids.slice(l, h2));
      }
      for (let l = 0; l < a.length; l++)
        (await this.getStories({
          per_page: i,
          language: t.language,
          version: t.version,
          starts_with: t.starts_with,
          by_uuids: a[l].join(","),
          excluding_fields: t.excluding_fields
        })).data.stories.forEach((h2) => {
          o.push(h2);
        });
      o.length > 0 && (e.rels = o, delete e.rel_uuids);
    } else
      o = e.rels;
    o && o.length > 0 && o.forEach((n) => {
      this.relations[r][n.uuid] = {
        ...n,
        _stopResolving: true
      };
    });
  }
  /**
   *
   * @param responseData
   * @param params
   * @param resolveId
   * @description Resolves the relations and links of the stories
   * @returns Promise<void>
   *
   */
  async resolveStories(e, t, r) {
    var o, n;
    let a = [];
    if (this.links[r] = {}, this.relations[r] = {}, typeof t.resolve_relations < "u" && t.resolve_relations.length > 0 && (typeof t.resolve_relations == "string" && (a = t.resolve_relations.split(",")), await this.resolveRelations(e, t, r)), t.resolve_links && ["1", "story", "url", "link"].includes(t.resolve_links) && ((o = e.links) != null && o.length || (n = e.link_uuids) != null && n.length) && await this.resolveLinks(e, t, r), this.resolveNestedRelations)
      for (const i in this.relations[r])
        this.iterateTree(
          this.relations[r][i],
          a,
          r
        );
    e.story ? this.iterateTree(e.story, a, r) : e.stories.forEach((i) => {
      this.iterateTree(i, a, r);
    }), this.stringifiedStoriesCache = {}, delete this.links[r], delete this.relations[r];
  }
  async cacheResponse(e, t, r, o) {
    const n = this.helpers.stringify({ url: e, params: t }), a = this.cacheProvider();
    if (t.version === "published" && e !== "/cdn/spaces/me") {
      const i = await a.get(n);
      if (i)
        return Promise.resolve(i);
    }
    return new Promise(async (i, l) => {
      var h2;
      try {
        const d = await this.throttle(
          "get",
          e,
          t,
          o
        );
        if (d.status !== 200)
          return l(d);
        let p = { data: d.data, headers: d.headers };
        if ((h2 = d.headers) != null && h2["per-page"] && (p = Object.assign({}, p, {
          perPage: d.headers["per-page"] ? Number.parseInt(d.headers["per-page"]) : 0,
          total: d.headers["per-page"] ? Number.parseInt(d.headers.total) : 0
        })), p.data.story || p.data.stories) {
          const S = this.resolveCounter = ++this.resolveCounter % 1e3;
          await this.resolveStories(p.data, t, `${S}`);
        }
        t.version === "published" && e !== "/cdn/spaces/me" && await a.set(n, p);
        const b = this.cache.clear === "onpreview" && t.version === "draft" || this.cache.clear === "auto";
        return t.token && p.data.cv && (b && x[t.token] && x[t.token] !== p.data.cv && await this.flushCache(), x[t.token] = p.data.cv), i(p);
      } catch (d) {
        if (d.response && d.status === 429 && (r = typeof r > "u" ? 0 : r + 1, r < this.maxRetries))
          return console.log(
            `Hit rate limit. Retrying in ${this.retriesDelay / 1e3} seconds.`
          ), await this.helpers.delay(this.retriesDelay), this.cacheResponse(e, t, r).then(i).catch(l);
        l(d);
      }
    });
  }
  throttledRequest(e, t, r, o) {
    return this.client.setFetchOptions(o), this.client[e](t, r);
  }
  cacheVersions() {
    return x;
  }
  cacheVersion() {
    return x[this.accessToken];
  }
  setCacheVersion(e) {
    this.accessToken && (x[this.accessToken] = e);
  }
  clearCacheVersion() {
    this.accessToken && (x[this.accessToken] = 0);
  }
  cacheProvider() {
    switch (this.cache.type) {
      case "memory":
        return {
          get(e) {
            return Promise.resolve(L[e]);
          },
          getAll() {
            return Promise.resolve(L);
          },
          set(e, t) {
            return L[e] = t, Promise.resolve(void 0);
          },
          flush() {
            return L = {}, Promise.resolve(void 0);
          }
        };
      case "custom":
        if (this.cache.custom)
          return this.cache.custom;
      default:
        return {
          get() {
            return Promise.resolve();
          },
          getAll() {
            return Promise.resolve(void 0);
          },
          set() {
            return Promise.resolve(void 0);
          },
          flush() {
            return Promise.resolve(void 0);
          }
        };
    }
  }
  async flushCache() {
    return await this.cacheProvider().flush(), this.clearCacheVersion(), this;
  }
}
const gt = (s = {}) => {
  const { apiOptions: e } = s;
  if (!e || !e.accessToken) {
    console.error(
      "You need to provide an access token to interact with Storyblok API. Read https://www.storyblok.com/docs/api/content-delivery#topics/authentication"
    );
    return;
  }
  return { storyblokApi: new Qe(e) };
}, Ze = (s) => {
  if (typeof s != "object" || typeof s._editable > "u")
    return {};
  try {
    const e = JSON.parse(
      s._editable.replace(/^<!--#storyblok#/, "").replace(/-->$/, "")
    );
    return e ? {
      "data-blok-c": JSON.stringify(e),
      "data-blok-uid": `${e.id}-${e.uid}`
    } : {};
  } catch {
    return {};
  }
};
function et(s, e) {
  if (!e)
    return { src: s, attrs: {} };
  let t = 0, r = 0;
  const o = {}, n = [];
  function a(l, h2, d, p, b) {
    typeof l != "number" || l <= h2 || l >= d ? console.warn(`[StoryblokRichText] - ${p.charAt(0).toUpperCase() + p.slice(1)} value must be a number between ${h2} and ${d} (inclusive)`) : b.push(`${p}(${l})`);
  }
  if (typeof e == "object") {
    if (typeof e.width == "number" && e.width > 0 ? (o.width = e.width, t = e.width) : console.warn("[StoryblokRichText] - Width value must be a number greater than 0"), e.height && typeof e.height == "number" && e.height > 0 ? (o.height = e.height, r = e.height) : console.warn("[StoryblokRichText] - Height value must be a number greater than 0"), e.loading && ["lazy", "eager"].includes(e.loading) && (o.loading = e.loading), e.class && (o.class = e.class), e.filters) {
      const { filters: l } = e || {}, { blur: h2, brightness: d, fill: p, format: b, grayscale: S, quality: y, rotate: E } = l || {};
      h2 && a(h2, 0, 100, "blur", n), y && a(y, 0, 100, "quality", n), d && a(d, 0, 100, "brightness", n), p && n.push(`fill(${p})`), S && n.push("grayscale()"), E && [0, 90, 180, 270].includes(e.filters.rotate || 0) && n.push(`rotate(${E})`), b && ["webp", "png", "jpeg"].includes(b) && n.push(`format(${b})`);
    }
    e.srcset && (o.srcset = e.srcset.map((l) => {
      if (typeof l == "number")
        return `${s}/m/${l}x0/${n.length > 0 ? `filters:${n.join(":")}` : ""} ${l}w`;
      if (Array.isArray(l) && l.length === 2) {
        const [h2, d] = l;
        return `${s}/m/${h2}x${d}/${n.length > 0 ? `filters:${n.join(":")}` : ""} ${h2}w`;
      } else {
        console.warn("[StoryblokRichText] - srcset entry must be a number or a tuple of two numbers");
        return;
      }
    }).join(", ")), e.sizes && (o.sizes = e.sizes.join(", "));
  }
  let i = `${s}/m/`;
  return t > 0 && r > 0 && (i = `${i}${t}x${r}/`), n.length > 0 && (i = `${i}filters:${n.join(":")}`), {
    src: i,
    attrs: o
  };
}
var v = /* @__PURE__ */ ((s) => (s.DOCUMENT = "doc", s.HEADING = "heading", s.PARAGRAPH = "paragraph", s.QUOTE = "blockquote", s.OL_LIST = "ordered_list", s.UL_LIST = "bullet_list", s.LIST_ITEM = "list_item", s.CODE_BLOCK = "code_block", s.HR = "horizontal_rule", s.BR = "hard_break", s.IMAGE = "image", s.EMOJI = "emoji", s.COMPONENT = "blok", s.TABLE = "table", s.TABLE_ROW = "tableRow", s.TABLE_CELL = "tableCell", s.TABLE_HEADER = "tableHeader", s))(v || {}), _ = /* @__PURE__ */ ((s) => (s.BOLD = "bold", s.STRONG = "strong", s.STRIKE = "strike", s.UNDERLINE = "underline", s.ITALIC = "italic", s.CODE = "code", s.LINK = "link", s.ANCHOR = "anchor", s.STYLED = "styled", s.SUPERSCRIPT = "superscript", s.SUBSCRIPT = "subscript", s.TEXT_STYLE = "textStyle", s.HIGHLIGHT = "highlight", s))(_ || {}), Z = /* @__PURE__ */ ((s) => (s.TEXT = "text", s))(Z || {}), j = /* @__PURE__ */ ((s) => (s.URL = "url", s.STORY = "story", s.ASSET = "asset", s.EMAIL = "email", s))(j || {});
const tt = [
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
], rt = (s = {}) => Object.keys(s).map((e) => `${e}="${s[e]}"`).join(" "), st = (s = {}) => Object.keys(s).map((e) => `${e}: ${s[e]}`).join("; ");
function ot(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
const O = (s) => Object.fromEntries(Object.entries(s).filter(([e, t]) => t !== void 0));
function K(s, e = {}, t) {
  const r = rt(e), o = r ? `${s} ${r}` : s, n = Array.isArray(t) ? t.join("") : t || "";
  if (s) {
    if (tt.includes(s))
      return `<${o}>`;
  } else return n;
  return `<${o}>${n}</${s}>`;
}
function nt(s = {}) {
  const e = /* @__PURE__ */ new Map(), {
    renderFn: t = K,
    textFn: r = ot,
    resolvers: o = {},
    optimizeImages: n = false,
    keyedResolvers: a = false
  } = s, i = t !== K, l = () => ({ render: (c, u = {}, g) => {
    if (a && c) {
      const f = e.get(c) || 0;
      e.set(c, f + 1), u.key = `${c}-${f}`;
    }
    return t(c, u, g);
  } }), h2 = (c) => (u, g) => {
    const f = u.attrs || {};
    return g.render(c, f, u.children || null);
  }, d = (c, u) => {
    const { src: g, alt: f, title: k, srcset: w, sizes: $ } = c.attrs || {};
    let T = g, R = {};
    if (n) {
      const { src: he, attrs: ue } = et(g, n);
      T = he, R = ue;
    }
    const ce = {
      src: T,
      alt: f,
      title: k,
      srcset: w,
      sizes: $,
      ...R
    };
    return u.render("img", O(ce));
  }, p = (c, u) => {
    const { level: g, ...f } = c.attrs || {};
    return u.render(`h${g}`, f, c.children);
  }, b = (c, u) => {
    var g, f, k, w;
    const $ = u.render("img", {
      src: (g = c.attrs) == null ? void 0 : g.fallbackImage,
      alt: (f = c.attrs) == null ? void 0 : f.alt,
      style: "width: 1.25em; height: 1.25em; vertical-align: text-top",
      draggable: "false",
      loading: "lazy"
    });
    return u.render("span", {
      "data-type": "emoji",
      "data-name": (k = c.attrs) == null ? void 0 : k.name,
      "data-emoji": (w = c.attrs) == null ? void 0 : w.emoji
    }, $);
  }, S = (c, u) => u.render(
    "pre",
    c.attrs || {},
    u.render("code", {}, c.children || "")
  ), y = (c, u = false) => ({ text: g, attrs: f }, k) => {
    const { class: w, id: $, ...T } = f || {}, R = u ? {
      class: w,
      id: $,
      style: st(T) || void 0
    } : f || {};
    return k.render(c, O(R), g);
  }, E = (c) => H(c), I = (c) => {
    const { marks: u, ...g } = c;
    if ("text" in c) {
      if (u)
        return u.reduce(
          (k, w) => E({ ...w, text: k }),
          E({ ...g, children: g.children })
        );
      const f = c.attrs || {};
      if (a) {
        const k = e.get("txt") || 0;
        e.set("txt", k + 1), f.key = `txt-${k}`;
      }
      return r(g.text, f);
    }
    return "";
  }, z = (c, u) => {
    const { linktype: g, href: f, anchor: k, ...w } = c.attrs || {};
    let $ = "";
    switch (g) {
      case j.ASSET:
      case j.URL:
        $ = f;
        break;
      case j.EMAIL:
        $ = `mailto:${f}`;
        break;
      case j.STORY:
        $ = f, k && ($ = `${$}#${k}`);
        break;
      default:
        $ = f;
        break;
    }
    const T = { ...w };
    return $ && (T.href = $), u.render("a", T, c.text);
  }, se = (c, u) => {
    var g, f;
    return console.warn("[StoryblokRichtText] - BLOK resolver is not available for vanilla usage"), u.render("span", {
      blok: (g = c == null ? void 0 : c.attrs) == null ? void 0 : g.body[0],
      id: (f = c.attrs) == null ? void 0 : f.id,
      style: "display: none"
    });
  }, oe = (c, u) => {
    const g = {}, f = u.render("tbody", {}, c.children);
    return u.render("table", g, f);
  }, ne = (c, u) => {
    const g = {};
    return u.render("tr", g, c.children);
  }, ae = (c, u) => {
    const { colspan: g, rowspan: f, colwidth: k, backgroundColor: w, ...$ } = c.attrs || {}, T = {
      ...$
    };
    g > 1 && (T.colspan = g), f > 1 && (T.rowspan = f);
    const R = [];
    return k && R.push(`width: ${k}px;`), w && R.push(`background-color: ${w};`), R.length > 0 && (T.style = R.join(" ")), u.render("td", O(T), c.children);
  }, ie = (c, u) => {
    const { colspan: g, rowspan: f, colwidth: k, backgroundColor: w, ...$ } = c.attrs || {}, T = {
      ...$
    };
    g > 1 && (T.colspan = g), f > 1 && (T.rowspan = f);
    const R = [];
    return k && R.push(`width: ${k}px;`), w && R.push(`background-color: ${w};`), R.length > 0 && (T.style = R.join(" ")), u.render("th", O(T), c.children);
  }, le = new Map([
    [v.DOCUMENT, h2("")],
    [v.HEADING, p],
    [v.PARAGRAPH, h2("p")],
    [v.UL_LIST, h2("ul")],
    [v.OL_LIST, h2("ol")],
    [v.LIST_ITEM, h2("li")],
    [v.IMAGE, d],
    [v.EMOJI, b],
    [v.CODE_BLOCK, S],
    [v.HR, h2("hr")],
    [v.BR, h2("br")],
    [v.QUOTE, h2("blockquote")],
    [v.COMPONENT, se],
    [Z.TEXT, I],
    [_.LINK, z],
    [_.ANCHOR, z],
    [_.STYLED, y("span", true)],
    [_.BOLD, y("strong")],
    [_.TEXT_STYLE, y("span", true)],
    [_.ITALIC, y("em")],
    [_.UNDERLINE, y("u")],
    [_.STRIKE, y("s")],
    [_.CODE, y("code")],
    [_.SUPERSCRIPT, y("sup")],
    [_.SUBSCRIPT, y("sub")],
    [_.HIGHLIGHT, y("mark")],
    [v.TABLE, oe],
    [v.TABLE_ROW, ne],
    [v.TABLE_CELL, ae],
    [v.TABLE_HEADER, ie],
    ...Object.entries(o).map(([c, u]) => [c, u])
  ]);
  function C(c) {
    const u = le.get(c.type);
    if (!u)
      return console.error("<Storyblok>", `No resolver found for node type ${c.type}`), "";
    const g = l();
    if (c.type === "text")
      return u(c, g);
    const f = c.content ? c.content.map(H) : void 0;
    return u({
      ...c,
      children: f
    }, g);
  }
  function H(c) {
    return c.type === "doc" ? i ? c.content.map(C) : c.content.map(C).join("") : Array.isArray(c) ? c.map(C) : C(c);
  }
  return {
    render: H
  };
}
let B;
const ee = (s, e) => {
  s.addNode("blok", (t) => {
    let r = "";
    return t.attrs.body.forEach((o) => {
      r += e(o.component, o);
    }), {
      html: r
    };
  });
}, it = (s = {}) => {
  const {
    bridge: r,
    accessToken: o,
    use: n = [],
    apiOptions: a = {},
    richText: i = {},
    bridgeUrl: l
  } = s;
  a.accessToken = a.accessToken || o;
  const h2 = { bridge: r, apiOptions: a };
  let d = {};
  n.forEach((b) => {
    d = { ...d, ...b(h2) };
  });
  return B = new M(i.schema), i.resolver && ee(B, i.resolver), d;
}, te = /* @__PURE__ */ defineComponent({
  __name: "StoryblokComponent",
  props: {
    blok: {}
  },
  setup(s, { expose: e }) {
    const t = s, r = ref();
    e({
      value: r
    });
    const o = typeof resolveDynamicComponent(t.blok.component) != "string", n = inject("VueSDKOptions"), a = ref(t.blok.component);
    return !o && n && (n.enableFallbackComponent ? (a.value = n.customFallbackComponent ?? "FallbackComponent", typeof resolveDynamicComponent(a.value) == "string" && console.error(
      `Is the Fallback component "${a.value}" registered properly?`
    )) : console.error(
      `Component could not be found for blok "${t.blok.component}"! Is it defined in main.ts as "app.component("${t.blok.component}", ${t.blok.component});"?`
    )), (i, l) => (openBlock(), createBlock(resolveDynamicComponent(a.value), mergeProps({
      ref_key: "blokRef",
      ref: r
    }, { ...i.$props, ...i.$attrs }), null, 16));
  }
}), ct = (s) => {
  var e, t;
  return h(
    te,
    {
      blok: (e = s == null ? void 0 : s.attrs) == null ? void 0 : e.body[0],
      id: (t = s.attrs) == null ? void 0 : t.id
    },
    s.children
  );
};
function ht(s) {
  const e = {
    renderFn: h,
    textFn: createTextVNode,
    keyedResolvers: true,
    resolvers: {
      [v.COMPONENT]: ct,
      ...s.resolvers
    }
  };
  return nt(e);
}
const ut = /* @__PURE__ */ defineComponent({
  __name: "StoryblokRichText",
  props: {
    doc: {},
    resolvers: {}
  },
  setup(s) {
    const e = s, t = ref(), r = () => t.value;
    return watch([() => e.doc, () => e.resolvers], ([o, n]) => {
      const { render: a } = ht({
        resolvers: n ?? {}
      });
      t.value = a(o);
    }, {
      immediate: true,
      deep: true
    }), (o, n) => (openBlock(), createBlock(r));
  }
}), dt = {
  beforeMount(s, e) {
    if (e.value) {
      const t = Ze(e.value);
      Object.keys(t).length > 0 && (s.setAttribute("data-blok-c", t["data-blok-c"]), s.setAttribute("data-blok-uid", t["data-blok-uid"]), s.classList.add("storyblok__outline"));
    }
  }
}, re = (s) => {
  console.error(`You can't use ${s} if you're not loading apiPlugin. Please provide it on StoryblokVue initialization.
    `);
};
let A = null;
const mt = () => (A || re("useStoryblokApi"), A), bt = {
  install(s, e = {}) {
    s.directive("editable", dt), s.component("StoryblokComponent", te), s.component("StoryblokRichText", ut), e.enableFallbackComponent && !e.customFallbackComponent && s.component(
      "FallbackComponent",
      defineAsyncComponent(() => import('./FallbackComponent-Dky11gEu-CtYceWkH.mjs'))
    );
    const { storyblokApi: t } = it(e);
    A = t || null, s.provide("VueSDKOptions", e);
  }
};
const __nuxt_component_1 = defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
const __nuxt_component_0$1 = defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const plugin_YOxzu2Rgn246XMgfphZEXZjtzJTMGWdPuDf_KLI_O_0 = /* @__PURE__ */ defineNuxtPlugin(({ vueApp }) => {
  let { storyblok } = (/* @__PURE__ */ useRuntimeConfig()).public;
  storyblok = JSON.parse(JSON.stringify(storyblok));
  vueApp.use(bt, { ...storyblok, use: [gt] });
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  plugin,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4,
  plugin_YOxzu2Rgn246XMgfphZEXZjtzJTMGWdPuDf_KLI_O_0
];
const layouts = {
  default: defineAsyncComponent(() => import('./default-CfmmPXKX.mjs').then((m2) => m2.default || m2))
};
const LayoutLoader = defineComponent({
  name: "LayoutLoader",
  inheritAttrs: false,
  props: {
    name: String,
    layoutProps: Object
  },
  setup(props, context) {
    return () => h(layouts[props.name], props.layoutProps, context.slots);
  }
});
const nuxtLayoutProps = {
  name: {
    type: [String, Boolean, Object],
    default: null
  },
  fallback: {
    type: [String, Object],
    default: null
  }
};
const __nuxt_component_0 = defineComponent({
  name: "NuxtLayout",
  inheritAttrs: false,
  props: nuxtLayoutProps,
  setup(props, context) {
    const nuxtApp = useNuxtApp();
    const injectedRoute = inject(PageRouteSymbol);
    const shouldUseEagerRoute = !injectedRoute || injectedRoute === useRoute();
    const route = shouldUseEagerRoute ? useRoute$1() : injectedRoute;
    const layout = computed(() => {
      let layout2 = unref(props.name) ?? route?.meta.layout ?? "default";
      if (layout2 && !(layout2 in layouts)) {
        if (props.fallback) {
          layout2 = unref(props.fallback);
        }
      }
      return layout2;
    });
    const layoutRef = shallowRef();
    context.expose({ layoutRef });
    const done = nuxtApp.deferHydration();
    let lastLayout;
    return () => {
      const hasLayout = layout.value && layout.value in layouts;
      const transitionProps = route?.meta.layoutTransition ?? appLayoutTransition;
      const previouslyRenderedLayout = lastLayout;
      lastLayout = layout.value;
      return _wrapInTransition(hasLayout && transitionProps, {
        default: () => h(Suspense, { suspensible: true, onResolve: () => {
          nextTick(done);
        } }, {
          default: () => h(
            LayoutProvider,
            {
              layoutProps: mergeProps(context.attrs, { ref: layoutRef }),
              key: layout.value || void 0,
              name: layout.value,
              shouldProvide: !props.name,
              isRenderingNewLayout: (name) => {
                return name !== previouslyRenderedLayout && name === layout.value;
              },
              hasTransition: !!transitionProps
            },
            context.slots
          )
        })
      }).default();
    };
  }
});
const LayoutProvider = defineComponent({
  name: "NuxtLayoutProvider",
  inheritAttrs: false,
  props: {
    name: {
      type: [String, Boolean]
    },
    layoutProps: {
      type: Object
    },
    hasTransition: {
      type: Boolean
    },
    shouldProvide: {
      type: Boolean
    },
    isRenderingNewLayout: {
      type: Function,
      required: true
    }
  },
  setup(props, context) {
    const name = props.name;
    if (props.shouldProvide) {
      provide(LayoutMetaSymbol, {
        isCurrent: (route) => name === (route.meta.layout ?? "default")
      });
    }
    const injectedRoute = inject(PageRouteSymbol);
    const isNotWithinNuxtPage = injectedRoute && injectedRoute === useRoute();
    if (isNotWithinNuxtPage) {
      const vueRouterRoute = useRoute$1();
      const reactiveChildRoute = {};
      for (const _key in vueRouterRoute) {
        const key = _key;
        Object.defineProperty(reactiveChildRoute, key, {
          enumerable: true,
          get: () => {
            return props.isRenderingNewLayout(props.name) ? vueRouterRoute[key] : injectedRoute[key];
          }
        });
      }
      provide(PageRouteSymbol, shallowReactive(reactiveChildRoute));
    }
    return () => {
      if (!name || typeof name === "string" && !(name in layouts)) {
        return context.slots.default?.();
      }
      return h(
        LayoutLoader,
        { key: name, layoutProps: props.layoutProps, name },
        context.slots
      );
    };
  }
});
const defineRouteProvider = (name = "RouteProvider") => defineComponent({
  name,
  props: {
    route: {
      type: Object,
      required: true
    },
    vnode: Object,
    vnodeRef: Object,
    renderKey: String,
    trackRootNodes: Boolean
  },
  setup(props) {
    const previousKey = props.renderKey;
    const previousRoute = props.route;
    const route = {};
    for (const key in props.route) {
      Object.defineProperty(route, key, {
        get: () => previousKey === props.renderKey ? props.route[key] : previousRoute[key],
        enumerable: true
      });
    }
    provide(PageRouteSymbol, shallowReactive(route));
    return () => {
      if (!props.vnode) {
        return props.vnode;
      }
      return h(props.vnode, { ref: props.vnodeRef });
    };
  }
});
const RouteProvider = defineRouteProvider();
const __nuxt_component_2 = defineComponent({
  name: "NuxtPage",
  inheritAttrs: false,
  props: {
    name: {
      type: String
    },
    transition: {
      type: [Boolean, Object],
      default: void 0
    },
    keepalive: {
      type: [Boolean, Object],
      default: void 0
    },
    route: {
      type: Object
    },
    pageKey: {
      type: [Function, String],
      default: null
    }
  },
  setup(props, { attrs, slots, expose }) {
    const nuxtApp = useNuxtApp();
    const pageRef = ref();
    inject(PageRouteSymbol, null);
    expose({ pageRef });
    inject(LayoutMetaSymbol, null);
    nuxtApp.deferHydration();
    return () => {
      return h(RouterView, { name: props.name, route: props.route, ...attrs }, {
        default: (routeProps) => {
          return h(Suspense, { suspensible: true }, {
            default() {
              return h(RouteProvider, {
                vnode: slots.default ? normalizeSlot(slots.default, routeProps) : routeProps.Component,
                route: routeProps.route,
                vnodeRef: pageRef
              });
            }
          });
        }
      });
    };
  }
});
function normalizeSlot(slot, data) {
  const slotContent = slot(data);
  return slotContent.length === 1 ? h(slotContent[0]) : h(Fragment, void 0, slotContent);
}
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = {};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs) {
  const _component_NuxtLayout = __nuxt_component_0;
  const _component_NuxtRouteAnnouncer = __nuxt_component_1;
  const _component_NuxtPage = __nuxt_component_2;
  _push(ssrRenderComponent(_component_NuxtLayout, _attrs, {
    default: withCtx((_2, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(ssrRenderComponent(_component_NuxtRouteAnnouncer, null, null, _parent2, _scopeId));
        _push2(ssrRenderComponent(_component_NuxtPage, null, null, _parent2, _scopeId));
      } else {
        return [
          createVNode(_component_NuxtRouteAnnouncer),
          createVNode(_component_NuxtPage)
        ];
      }
    }),
    _: 1
  }, _parent));
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/pages/runtime/app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    _error.stack ? _error.stack.split("\n").splice(1).map((line) => {
      const text = line.replace("webpack:/", "").replace(".vue", ".js").trim();
      return {
        text,
        internal: line.includes("node_modules") && !line.includes(".cache") || line.includes("internal") || line.includes("new Promise")
      };
    }).map((i) => `<span class="stack${i.internal ? " internal" : ""}">${i.text}</span>`).join("\n") : "";
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import('./error-404-Dk1dOG7b.mjs'));
    const _Error = defineAsyncComponent(() => import('./error-500-BzZxdRdX.mjs'));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry$1 = (ssrContext) => entry(ssrContext);

export { _export_sfc as _, asyncDataDefaults as a, useRoute as b, createError as c, useRuntimeConfig as d, entry$1 as default, useRouter as e, nuxtLinkDefaults as f, __nuxt_component_0$1 as g, mt as m, navigateTo as n, resolveRouteObject as r, tryUseNuxtApp as t, useNuxtApp as u };
//# sourceMappingURL=server.mjs.map
