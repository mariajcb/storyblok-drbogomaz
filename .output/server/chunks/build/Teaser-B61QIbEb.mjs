import { _ as __nuxt_component_0 } from './nuxt-link-AKjSJgbj.mjs';
import { resolveDirective, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrGetDirectiveProps, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "Teaser",
  __ssrInlineRender: true,
  props: {
    blok: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      const _directive_editable = resolveDirective("editable");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative min-h-[calc(100vh-3.25rem)] overflow-hidden" }, _attrs, ssrGetDirectiveProps(_ctx, _directive_editable, __props.blok)))} data-v-60e76034><img class="absolute inset-0 w-full h-full object-cover object-top"${ssrRenderAttr("src", (_a = __props.blok.Image) == null ? void 0 : _a.filename)}${ssrRenderAttr("alt", ((_b = __props.blok.Image) == null ? void 0 : _b.alt) || "")} data-v-60e76034><div class="relative z-10 container mx-auto px-4 py-12" data-v-60e76034><h1 class="text-5xl font-bold mb-4 drop-shadow-lg" data-v-60e76034>${ssrInterpolate(__props.blok.headline || "Default Title")}</h1><h2 class="text-2xl font-bold mb-4 drop-shadow-md" data-v-60e76034><strong data-v-60e76034>${ssrInterpolate(__props.blok.subtitle || "Default Subtitle")}</strong></h2><p class="text-2xl mb-8 drop-shadow-md" data-v-60e76034>${ssrInterpolate(__props.blok.body)}</p>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "inline-block bg-white text-[#718FCB] px-6 py-3 rounded font-medium hover:bg-[#718FCB] hover:text-white transition-colors",
        to: "/contact"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(` Contact Me `);
          } else {
            return [
              createTextVNode(" Contact Me ")
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("storyblok/Teaser.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Teaser = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-60e76034"]]);

export { Teaser as default };
//# sourceMappingURL=Teaser-B61QIbEb.mjs.map
