import { _ as __nuxt_component_0 } from './nuxt-link-AKjSJgbj.mjs';
import { resolveDirective, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrRenderAttr, ssrInterpolate, ssrGetDirectiveProps, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
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
  __name: "Bio",
  __ssrInlineRender: true,
  props: {
    blok: {
      type: Object,
      required: true
    }
  },
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      const _directive_editable = resolveDirective("editable");
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-4xl mx-auto" }, _attrs, ssrGetDirectiveProps(_ctx, _directive_editable, __props.blok)))} data-v-908c458e><div class="bg-white rounded-lg shadow-lg overflow-hidden" data-v-908c458e><div class="md:hidden" data-v-908c458e><img class="w-full h-[255px] object-cover"${ssrRenderAttr("src", __props.blok.image_mobile.filename)}${ssrRenderAttr("alt", __props.blok.image_mobile.description)} data-v-908c458e></div><div class="p-6" data-v-908c458e><h2 class="text-4xl text-[#718FCB] font-[&#39;Mrs_Saint_Delafield&#39;] text-center mb-4" data-v-908c458e>${ssrInterpolate(__props.blok.title)}</h2><div class="flex flex-col md:flex-row gap-8" data-v-908c458e><div class="hidden md:block" data-v-908c458e><img class="w-[400px] h-[600px] object-cover"${ssrRenderAttr("src", __props.blok.image.filename)}${ssrRenderAttr("alt", __props.blok.image.description)} data-v-908c458e></div><div class="flex-1" data-v-908c458e><div class="prose max-w-none" data-v-908c458e><!--[-->`);
      ssrRenderList(__props.blok.text.content, (paragraph, index) => {
        _push(`<div class="mb-4" data-v-908c458e>`);
        if (paragraph.type === "paragraph") {
          _push(`<p data-v-908c458e><!--[-->`);
          ssrRenderList(paragraph.content, (item, itemIndex) => {
            _push(`<span data-v-908c458e>`);
            if (item.type === "strong") {
              _push(`<strong data-v-908c458e>${ssrInterpolate(item.text)}</strong>`);
            } else if (item.type === "em") {
              _push(`<em data-v-908c458e>${ssrInterpolate(item.text)}</em>`);
            } else if (item.type === "link") {
              _push(`<a${ssrRenderAttr("href", item.url)} target="_blank" data-v-908c458e>${ssrInterpolate(item.text)}</a>`);
            } else {
              _push(`<span data-v-908c458e>${ssrInterpolate(item.text)}</span>`);
            }
            _push(`</span>`);
          });
          _push(`<!--]--></p>`);
        } else if (paragraph.type === "heading") {
          _push(`<h3 class="text-xl font-bold mb-2" data-v-908c458e>${ssrInterpolate(paragraph.content[0].text)}</h3>`);
        } else if (paragraph.type === "bullet_list") {
          _push(`<ul class="list-disc pl-5 mb-4" data-v-908c458e><!--[-->`);
          ssrRenderList(paragraph.content, (listItem, listIndex) => {
            _push(`<li data-v-908c458e>${ssrInterpolate(listItem.content[0].text)}</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--></div></div></div><div class="text-center mt-8" data-v-908c458e>`);
      _push(ssrRenderComponent(_component_NuxtLink, {
        class: "inline-block bg-[#718FCB] text-white px-6 py-3 rounded font-medium hover:bg-white hover:text-[#718FCB] transition-colors",
        to: "/en/contact"
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
      _push(`</div></div></div></div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("storyblok/Bio.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const Bio = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-908c458e"]]);

export { Bio as default };
//# sourceMappingURL=Bio-BxU_W5GD.mjs.map
