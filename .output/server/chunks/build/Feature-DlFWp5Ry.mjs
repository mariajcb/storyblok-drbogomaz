import { _ as __nuxt_component_0 } from './nuxt-link-AKjSJgbj.mjs';
import { ref, computed, resolveDirective, mergeProps, withCtx, createTextVNode, useSSRContext } from 'vue';
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
  __name: "Feature",
  __ssrInlineRender: true,
  props: {
    blok: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    const props = __props;
    const isOpen = ref(false);
    const { renderMarkdown } = useMarkdown();
    const renderedModalText = computed(() => {
      return props.blok.modal ? renderMarkdown(props.blok.modal) : "";
    });
    return (_ctx, _push, _parent, _attrs) => {
      var _a;
      const _component_NuxtLink = __nuxt_component_0;
      const _directive_editable = resolveDirective("editable");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "w-full bg-[#f7f6fd] rounded-[5px] text-center flex flex-col min-h-[450px] h-full p-12" }, _attrs, ssrGetDirectiveProps(_ctx, _directive_editable, __props.blok)))} data-v-bd8563f2><div class="flex-grow" data-v-bd8563f2><h3 class="text-2xl text-[#1d243d] font-bold mb-4" data-v-bd8563f2>${ssrInterpolate(__props.blok.name)}</h3><p class="mb-4" data-v-bd8563f2>${ssrInterpolate(__props.blok.description)}</p></div><div class="mt-4" data-v-bd8563f2><button class="w-full bg-[#718FCB] text-white px-6 py-2 rounded hover:bg-white hover:text-[#718FCB] transition-colors" data-v-bd8563f2> Learn More </button></div>`);
      if (isOpen.value) {
        _push(`<div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true" data-v-bd8563f2><div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" data-v-bd8563f2></div><div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0" data-v-bd8563f2><div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg" data-v-bd8563f2><div class="bg-[#E8EFF5] px-4 py-3 sm:px-6 flex justify-between items-center" data-v-bd8563f2><h3 class="text-lg font-medium text-gray-900" id="modal-title" data-v-bd8563f2>${ssrInterpolate(__props.blok.name)}</h3><button class="text-gray-400 hover:text-gray-500" data-v-bd8563f2><span class="sr-only" data-v-bd8563f2>Close</span><svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" data-v-bd8563f2><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" data-v-bd8563f2></path></svg></button></div><div class="px-4 py-5 sm:p-6" data-v-bd8563f2><div class="prose" data-v-bd8563f2>${(_a = renderedModalText.value) != null ? _a : ""}</div></div><div class="bg-[#E8EFF5] px-4 py-3 sm:px-6 flex justify-end space-x-3" data-v-bd8563f2><button class="bg-white text-[#718FCB] px-4 py-2 rounded hover:bg-[#718FCB] hover:text-white transition-colors" data-v-bd8563f2> Cancel </button>`);
        _push(ssrRenderComponent(_component_NuxtLink, {
          to: "/en/contact",
          class: "bg-[#718FCB] text-white px-4 py-2 rounded hover:bg-white hover:text-[#718FCB] transition-colors"
        }, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` Book Session `);
            } else {
              return [
                createTextVNode(" Book Session ")
              ];
            }
          }),
          _: 1
        }, _parent));
        _push(`</div></div></div></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("storyblok/Feature.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Feature = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-bd8563f2"]]);

export { Feature as default };
//# sourceMappingURL=Feature-DlFWp5Ry.mjs.map
