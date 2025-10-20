import { _ as __nuxt_component_0$2 } from './nuxt-link-AKjSJgbj.mjs';
import { resolveComponent, mergeProps, ref, computed, watch, withCtx, createTextVNode, createVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderComponent, ssrRenderSlot, ssrRenderClass } from 'vue/server-renderer';
import { u as useCookieConsent } from './useCookieConsent-D8LlrDps.mjs';
import { _ as _export_sfc, u as useNuxtApp, g as __nuxt_component_0$1 } from './server.mjs';
import '../nitro/nitro.mjs';
import 'node:http';
import 'node:https';
import 'node:events';
import 'node:buffer';
import 'node:fs';
import 'node:path';
import 'node:crypto';
import 'node:url';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main$6 = {
  __name: "BottomFooter",
  __ssrInlineRender: true,
  setup(__props) {
    useCookieConsent();
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0$2;
      _push(`<footer${ssrRenderAttrs(mergeProps({ class: "footer" }, _attrs))} data-v-0b0a00f7><div class="container mx-auto px-4 py-6" data-v-0b0a00f7><div class="flex flex-col md:flex-row justify-between items-center" data-v-0b0a00f7><div class="mb-4 md:mb-0" data-v-0b0a00f7><p class="text-sm text-gray-600" data-v-0b0a00f7>\xA9 2025 Dr. Misha Bogomaz. All rights reserved.</p></div><div class="flex flex-wrap gap-6 text-sm" data-v-0b0a00f7>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy",
        class: "text-[#718FCB] hover:text-[#50b0ae] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Privacy Policy `);
          } else {
            return [
              createTextVNode(" Privacy Policy ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<button class="text-[#718FCB] hover:text-[#50b0ae] transition-colors bg-transparent border-none cursor-pointer" data-v-0b0a00f7> Cookie Preferences </button>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/contact",
        class: "text-[#718FCB] hover:text-[#50b0ae] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Contact `);
          } else {
            return [
              createTextVNode(" Contact ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/blog",
        class: "text-[#718FCB] hover:text-[#50b0ae] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Blog `);
          } else {
            return [
              createTextVNode(" Blog ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></footer>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BottomFooter.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-0b0a00f7"]]);
const _sfc_main$5 = {
  __name: "CookieBanner",
  __ssrInlineRender: true,
  emits: ["consent-updated"],
  setup(__props, { emit: __emit }) {
    const { error: consentError } = useCookieConsent();
    const { $gtag } = useNuxtApp();
    ref(false);
    ref(false);
    const error = ref(null);
    ref(null);
    ref(null);
    ref(null);
    computed(() => {
      return false;
    });
    watch(consentError, (newError) => {
      if (newError) {
        error.value = `Consent system error: ${newError.message}`;
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_ClientOnly = __nuxt_component_0$1;
      _push(ssrRenderComponent(_component_ClientOnly, _attrs, {}, _parent));
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/CookieBanner.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const __nuxt_component_1$1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-1462f2fc"]]);
const _sfc_main$4 = {
  name: "NavigationHamburgerButton",
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ["toggle"]
};
function _sfc_ssrRender$4(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<button${ssrRenderAttrs(mergeProps({
    class: "lg:hidden p-2 text-white hover:bg-[#50b0ae] rounded-md focus:outline-none focus:ring-2 focus:ring-white",
    "aria-expanded": $props.isOpen,
    "aria-label": "Toggle navigation menu"
  }, _attrs))}><span class="sr-only">Open main menu</span><div class="w-6 h-5 flex flex-col justify-between"><span class="${ssrRenderClass([{ "rotate-45 translate-y-2": $props.isOpen }, "block w-full h-0.5 bg-white transition-transform duration-300"])}"></span><span class="${ssrRenderClass([{ "opacity-0": $props.isOpen }, "block w-full h-0.5 bg-white transition-opacity duration-300"])}"></span><span class="${ssrRenderClass([{ "-rotate-45 -translate-y-2": $props.isOpen }, "block w-full h-0.5 bg-white transition-transform duration-300"])}"></span></div></button>`);
}
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/NavigationHamburgerButton.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const __nuxt_component_1 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["ssrRender", _sfc_ssrRender$4]]);
const _sfc_main$3 = {
  name: "MobileNavigationMenu",
  props: {
    isOpen: {
      type: Boolean,
      required: true
    }
  },
  emits: ["close"]
};
function _sfc_ssrRender$3(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0$2;
  _push(`<div${ssrRenderAttrs(mergeProps({
    class: ["lg:hidden z-50 fixed inset-0", { "hidden": !$props.isOpen }],
    role: "dialog",
    "aria-modal": "true",
    "aria-label": "Mobile navigation menu"
  }, _attrs))}><button class="absolute top-4 right-4 text-white text-3xl focus:outline-none" aria-label="Close menu"> \xD7 </button><nav class="bg-[#718FCB] py-4"><ul class="container mx-auto px-4 space-y-4"><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "block text-white text-lg font-bold hover:text-[#50b0ae] py-2",
    onClick: ($event) => _ctx.$emit("close")
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Home `);
      } else {
        return [
          createTextVNode(" Home ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/blog",
    class: "block text-white text-lg font-bold hover:text-[#50b0ae] py-2",
    onClick: ($event) => _ctx.$emit("close")
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Blog `);
      } else {
        return [
          createTextVNode(" Blog ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/contact",
    class: "block text-white text-lg font-bold hover:text-[#50b0ae] py-2",
    onClick: ($event) => _ctx.$emit("close")
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` Contact `);
      } else {
        return [
          createTextVNode(" Contact ")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></nav></div>`);
}
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/MobileNavigationMenu.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const MobileNavigationMenu = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["ssrRender", _sfc_ssrRender$3]]);
const _sfc_main$2 = {
  name: "DesktopNavigation"
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0$2;
  _push(`<nav${ssrRenderAttrs(mergeProps({ class: "hidden lg:block" }, _attrs))} data-v-8c29c998><ul class="flex space-x-8 text-lg font-bold" data-v-8c29c998><li data-v-8c29c998>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/",
    class: "text-white hover:text-[#50b0ae]"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Home`);
      } else {
        return [
          createTextVNode("Home")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-8c29c998>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/blog",
    class: "text-white hover:text-[#50b0ae]"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Blog`);
      } else {
        return [
          createTextVNode("Blog")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li><li data-v-8c29c998>`);
  _push(ssrRenderComponent(_component_NuxtLink, {
    to: "/contact",
    class: "text-white hover:text-[#50b0ae]"
  }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`Contact`);
      } else {
        return [
          createTextVNode("Contact")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(`</li></ul></nav>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/DesktopNavigation.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const DesktopNavigation = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2], ["__scopeId", "data-v-8c29c998"]]);
const _sfc_main$1 = {
  name: "TopHeader",
  components: {
    NavigationHamburgerButton: __nuxt_component_1,
    MobileNavigationMenu,
    DesktopNavigation
  },
  data() {
    return {
      isOpen: false
    };
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_NuxtLink = __nuxt_component_0$2;
  const _component_NavigationHamburgerButton = __nuxt_component_1;
  const _component_DesktopNavigation = resolveComponent("DesktopNavigation");
  const _component_MobileNavigationMenu = resolveComponent("MobileNavigationMenu");
  _push(`<header${ssrRenderAttrs(mergeProps({ class: "w-full h-24 bg-[#718FCB]" }, _attrs))} data-v-d24c19c7><div class="container h-full mx-auto flex items-center justify-between px-4" data-v-d24c19c7>`);
  _push(ssrRenderComponent(_component_NuxtLink, { to: "/" }, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(`<h1 class="top-header__logo" data-v-d24c19c7${_scopeId}>Dr.Bogomaz</h1>`);
      } else {
        return [
          createVNode("h1", { class: "top-header__logo" }, "Dr.Bogomaz")
        ];
      }
    }),
    _: 1
  }, _parent));
  _push(ssrRenderComponent(_component_NavigationHamburgerButton, {
    "is-open": $data.isOpen,
    onToggle: ($event) => $data.isOpen = !$data.isOpen
  }, null, _parent));
  _push(ssrRenderComponent(_component_DesktopNavigation, null, null, _parent));
  _push(`</div>`);
  _push(ssrRenderComponent(_component_MobileNavigationMenu, {
    "is-open": $data.isOpen,
    onClose: ($event) => $data.isOpen = false
  }, null, _parent));
  _push(`</header>`);
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/navigation/TopHeader.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const TopHeader = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-d24c19c7"]]);
const _sfc_main = {
  components: {
    TopHeader,
    BottomFooter: __nuxt_component_0,
    CookieBanner: __nuxt_component_1$1
  },
  methods: {
    handleConsentUpdate(consent) {
      console.log("Cookie consent updated:", consent);
    }
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_TopHeader = resolveComponent("TopHeader");
  const _component_BottomFooter = __nuxt_component_0;
  const _component_CookieBanner = __nuxt_component_1$1;
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "site" }, _attrs))}><main class="site-content" role="main">`);
  _push(ssrRenderComponent(_component_TopHeader, null, null, _parent));
  ssrRenderSlot(_ctx.$slots, "default", {}, null, _push, _parent);
  _push(`</main>`);
  _push(ssrRenderComponent(_component_BottomFooter, null, null, _parent));
  _push(ssrRenderComponent(_component_CookieBanner, { onConsentUpdated: $options.handleConsentUpdate }, null, _parent));
  _push(`</div>`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("layouts/default.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _default = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender]]);

export { _default as default };
//# sourceMappingURL=default-CfmmPXKX.mjs.map
