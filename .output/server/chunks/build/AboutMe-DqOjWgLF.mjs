import { _ as __nuxt_component_0 } from './nuxt-link-AKjSJgbj.mjs';
import { computed, resolveDirective, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrGetDirectiveProps, ssrRenderComponent } from 'vue/server-renderer';
import { u as useMarkdown } from './useMarkdown-BD5pwKkY.mjs';
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
import 'marked';
import '../routes/renderer.mjs';
import 'vue-bundle-renderer/runtime';
import 'unhead/server';
import 'devalue';
import 'unhead/utils';
import 'unhead/plugins';
import 'vue-router';

const _sfc_main = {
  __name: "AboutMe",
  __ssrInlineRender: true,
  props: {
    blok: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { renderMarkdown } = useMarkdown();
    const renderedText = computed(() => {
      return props.blok.text ? renderMarkdown(props.blok.text) : "";
    });
    const renderedText2 = computed(() => {
      return props.blok.text2 ? renderMarkdown(props.blok.text2) : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a, _b;
      const _component_NuxtLink = __nuxt_component_0;
      const _directive_editable = resolveDirective("editable");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "bg-gradient-to-b from-white to-[#E8EFF5] pt-2 pb-8" }, _attrs, ssrGetDirectiveProps(_ctx, _directive_editable, __props.blok)))} data-v-7b3b4a64><div class="max-w-3xl mx-auto px-4 mb-10" data-v-7b3b4a64><div class="text-center" data-v-7b3b4a64><h2 class="text-4xl text-[#718FCB] font-[&#39;Mrs_Saint_Delafield&#39;] mb-4" data-v-7b3b4a64>${ssrInterpolate(__props.blok.title)}</h2><div class="prose max-w-none" data-v-7b3b4a64>${(_a = renderedText.value) != null ? _a : ""}</div></div></div><blockquote class="max-w-3xl mx-auto px-4 py-5 bg-white shadow-md relative min-h-[120px] mb-10" data-v-7b3b4a64><p class="text-center text-2xl leading-relaxed max-w-[80%] mx-auto" data-v-7b3b4a64>${ssrInterpolate(__props.blok.quote)}</p><span class="absolute top-2 left-2 text-6xl text-[#718FCB] opacity-50 font-[&#39;Mrs_Saint_Delafield&#39;]" data-v-7b3b4a64>&quot;</span><span class="absolute bottom-[-250px] right-[-32px] text-[25em] text-[#718FCB] opacity-50 font-[&#39;Mrs_Saint_Delafield&#39;]" data-v-7b3b4a64>&quot;</span></blockquote><div class="max-w-3xl mx-auto px-4" data-v-7b3b4a64><div class="prose max-w-none" data-v-7b3b4a64>${(_b = renderedText2.value) != null ? _b : ""}</div><div class="text-center mt-6" data-v-7b3b4a64>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "inline-block bg-[#718FCB] text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-[#718FCB] transition-colors",
        to: "/blog"
      }, {
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`${ssrInterpolate(__props.blok.call_to_action_btn)}`);
          } else {
            return [
              createTextVNode(toDisplayString(__props.blok.call_to_action_btn), 1)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("storyblok/AboutMe.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const AboutMe = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-7b3b4a64"]]);

export { AboutMe as default };
//# sourceMappingURL=AboutMe-DqOjWgLF.mjs.map
