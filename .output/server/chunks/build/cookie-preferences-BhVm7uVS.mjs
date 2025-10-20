import { _ as __nuxt_component_0 } from './nuxt-link-AKjSJgbj.mjs';
import { computed, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { u as useCookieConsent } from './useCookieConsent-D8LlrDps.mjs';
import { u as useHead } from './v3-BEAsrijS.mjs';
import { _ as _export_sfc } from './server.mjs';
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

const _sfc_main = {
  __name: "cookie-preferences",
  __ssrInlineRender: true,
  setup(__props) {
    const { hasConsent, hasResponded } = useCookieConsent();
    const currentStatus = computed(() => {
      if (!hasResponded()) {
        return "No preference set";
      }
      return hasConsent() ? "Analytics cookies are enabled" : "Analytics cookies are disabled";
    });
    const updateButtonText = computed(() => {
      if (!hasResponded()) {
        return "Set Preferences";
      }
      return hasConsent() ? "Disable Analytics" : "Enable Analytics";
    });
    useHead({
      title: "Cookie Preferences - Dr. Misha Bogomaz",
      meta: [
        {
          name: "description",
          content: "Manage your cookie preferences and privacy settings for Dr. Misha Bogomaz therapy website."
        }
      ]
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "cookie-preferences" }, _attrs))} data-v-0d418232><div class="container mx-auto px-4 py-8 max-w-4xl" data-v-0d418232><h1 class="text-4xl font-bold text-[#718FCB] mb-8" data-v-0d418232>Cookie Preferences</h1><div class="prose max-w-none" data-v-0d418232><section class="mb-8" data-v-0d418232><h2 class="text-2xl font-bold text-[#1d243d] mb-4" data-v-0d418232>Manage Your Cookie Settings</h2><p class="mb-4" data-v-0d418232> You can control how we use cookies on this website. Your choices will be remembered for future visits. </p></section><section class="mb-8" data-v-0d418232><div class="bg-white border border-gray-200 rounded-lg p-6" data-v-0d418232><h3 class="text-xl font-semibold text-[#1d243d] mb-4" data-v-0d418232>Analytics Cookies</h3><p class="mb-4 text-gray-600" data-v-0d418232> These cookies help us understand how visitors use our website so we can improve your experience. We use Google Analytics to collect anonymous information about page views, reading patterns, and website performance. No personal information is collected. </p><div class="flex items-center justify-between" data-v-0d418232><div data-v-0d418232><p class="font-medium text-gray-900" data-v-0d418232>Current Status:</p><p class="text-sm text-gray-600" data-v-0d418232>${ssrInterpolate(currentStatus.value)}</p></div><button class="bg-[#718FCB] text-white px-6 py-2 rounded hover:bg-white hover:text-[#718FCB] transition-colors" data-v-0d418232>${ssrInterpolate(updateButtonText.value)}</button></div></div></section><section class="mb-8" data-v-0d418232><h2 class="text-2xl font-bold text-[#1d243d] mb-4" data-v-0d418232>About Our Cookies</h2><div class="space-y-4" data-v-0d418232><div class="bg-gray-50 p-4 rounded-lg" data-v-0d418232><h3 class="font-semibold text-[#1d243d] mb-2" data-v-0d418232>Essential Cookies</h3><p class="text-sm text-gray-600" data-v-0d418232> These cookies are necessary for the website to function properly. They cannot be disabled. </p></div><div class="bg-gray-50 p-4 rounded-lg" data-v-0d418232><h3 class="font-semibold text-[#1d243d] mb-2" data-v-0d418232>Analytics Cookies</h3><p class="text-sm text-gray-600" data-v-0d418232> These cookies help us understand website usage and improve your experience. They are optional and only used with your consent. </p></div></div></section><section class="mb-8" data-v-0d418232><h2 class="text-2xl font-bold text-[#1d243d] mb-4" data-v-0d418232>Your Privacy Rights</h2><p class="mb-4" data-v-0d418232> You have the right to: </p><ul class="list-disc pl-6 mb-4 space-y-2" data-v-0d418232><li data-v-0d418232>Accept or reject analytics cookies</li><li data-v-0d418232>Change your preferences at any time</li><li data-v-0d418232>Request deletion of your data</li><li data-v-0d418232>Opt-out of analytics tracking</li></ul></section><section class="mb-8" data-v-0d418232><h2 class="text-2xl font-bold text-[#1d243d] mb-4" data-v-0d418232>Need Help?</h2><p class="mb-4" data-v-0d418232> If you have questions about our cookie practices or privacy policy, please contact us: </p><div class="bg-gray-50 p-4 rounded-lg" data-v-0d418232><p class="mb-2" data-v-0d418232><strong data-v-0d418232>Dr. Misha Bogomaz</strong></p><p class="mb-2" data-v-0d418232>Email: [Contact email]</p><p class="mb-2" data-v-0d418232>Phone: [Contact phone]</p></div></section><div class="mt-12 pt-8 border-t border-gray-200" data-v-0d418232>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        to: "/privacy",
        class: "text-[#718FCB] hover:text-[#50b0ae] transition-colors"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` \u2190 Back to Privacy Policy `);
          } else {
            return [
              createTextVNode(" \u2190 Back to Privacy Policy ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/cookie-preferences.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const cookiePreferences = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-0d418232"]]);

export { cookiePreferences as default };
//# sourceMappingURL=cookie-preferences-BhVm7uVS.mjs.map
