import { _ as __nuxt_component_0 } from './nuxt-link-AKjSJgbj.mjs';
import { ref, withAsyncContext, mergeProps, withCtx, createTextVNode, toDisplayString, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderList, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, u as useNuxtApp, d as useRuntimeConfig } from './server.mjs';
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

const version = "published";
const _sfc_main = {
  __name: "index",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const blogPosts = ref([]);
    const error = ref(null);
    const loading = ref(true);
    const { $gtag } = useNuxtApp();
    const timestamp = (date) => {
      const timeStamp = date.slice(0, -5).replace(/T/g, " ");
      return timeStamp;
    };
    const trackBlogPostClick = (blogPost) => {
      if ($gtag) {
        $gtag("event", "blog_click", {
          blog_title: blogPost.content.name,
          blog_slug: blogPost.slug,
          blog_intro: blogPost.content.intro,
          blog_created_at: blogPost.created_at,
          content_type: "therapy_blog",
          page_location: "blog_index"
        });
      }
    };
    const config = useRuntimeConfig();
    try {
      const response = ([__temp, __restore] = withAsyncContext(() => fetch(
        `https://api.storyblok.com/v2/cdn/stories?version=${version}&starts_with=blog/&sort_by=published_at:desc&token=${config.public.storyblokApiToken}`,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )), __temp = await __temp, __restore(), __temp);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = ([__temp, __restore] = withAsyncContext(() => response.json()), __temp = await __temp, __restore(), __temp);
      if (data.stories && data.stories.length > 0) {
        blogPosts.value = data.stories;
      } else {
        error.value = "No blog posts found";
      }
    } catch (e) {
      error.value = "Failed to load blog posts. Please try again later.";
    } finally {
      loading.value = false;
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_NuxtLink = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-8fef50a1>`);
      if (error.value) {
        _push(`<div class="container mx-auto px-4 py-8" data-v-8fef50a1><div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" data-v-8fef50a1>${ssrInterpolate(error.value)}</div></div>`);
      } else if (loading.value) {
        _push(`<div class="container mx-auto px-4 py-8" data-v-8fef50a1><div class="text-center" data-v-8fef50a1>Loading blog posts...</div></div>`);
      } else {
        _push(`<div data-v-8fef50a1><!--[-->`);
        ssrRenderList(blogPosts.value, (blogPost) => {
          _push(`<div class="container blog__overview" data-v-8fef50a1><h2 data-v-8fef50a1>`);
          _push(ssrRenderComponent(_component_NuxtLink, {
            class: "blog__detail-link",
            to: `/blog/${blogPost.slug}`,
            onClick: ($event) => trackBlogPostClick(blogPost)
          }, {
            default: withCtx((_, _push2, _parent2, _scopeId) => {
              if (_push2) {
                _push2(`${ssrInterpolate(blogPost.content.name)}`);
              } else {
                return [
                  createTextVNode(toDisplayString(blogPost.content.name), 1)
                ];
              }
            }),
            _: 2
          }, _parent));
          _push(`</h2><small data-v-8fef50a1>${ssrInterpolate(timestamp(blogPost.created_at))}</small><p data-v-8fef50a1>${ssrInterpolate(blogPost.content.intro)}</p></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const index = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-8fef50a1"]]);

export { index as default };
//# sourceMappingURL=index-krMEK519.mjs.map
