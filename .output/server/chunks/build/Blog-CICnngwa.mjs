import { computed, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate } from 'vue/server-renderer';
import { u as useMarkdown } from './useMarkdown-BD5pwKkY.mjs';
import { _ as _export_sfc, u as useNuxtApp } from './server.mjs';
import 'marked';
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
  __name: "Blog",
  __ssrInlineRender: true,
  props: {
    blok: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const { $gtag } = useNuxtApp();
    const { renderMarkdown } = useMarkdown();
    const renderedBody = computed(() => {
      return props.blok.body ? renderMarkdown(props.blok.body) : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "blog" }, _attrs))} data-v-a4d99b0b><h2 class="title" data-v-a4d99b0b>${ssrInterpolate(__props.blok.name)}</h2><p class="subtitle" data-v-a4d99b0b>${ssrInterpolate(__props.blok.intro)}</p><div class="blog__body" data-v-a4d99b0b>${(_a = renderedBody.value) != null ? _a : ""}</div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("storyblok/Blog.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-a4d99b0b"]]);

export { __nuxt_component_0 as default };
//# sourceMappingURL=Blog-CICnngwa.mjs.map
