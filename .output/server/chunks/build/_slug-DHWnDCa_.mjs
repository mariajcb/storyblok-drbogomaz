import __nuxt_component_0 from './Blog-CICnngwa.mjs';
import { ref, withAsyncContext, watch, mergeProps, useSSRContext } from 'vue';
import { ssrRenderAttrs, ssrInterpolate, ssrRenderComponent } from 'vue/server-renderer';
import { _ as _export_sfc, u as useNuxtApp, b as useRoute, d as useRuntimeConfig } from './server.mjs';
import './useMarkdown-BD5pwKkY.mjs';
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

const version = "published";
const _sfc_main = {
  __name: "_slug",
  __ssrInlineRender: true,
  async setup(__props) {
    let __temp, __restore;
    const story = ref(null);
    const error = ref(null);
    const loading = ref(true);
    const { $gtag } = useNuxtApp();
    const { slug } = useRoute().params;
    try {
      const config = useRuntimeConfig();
      const response = ([__temp, __restore] = withAsyncContext(() => fetch(
        `https://api.storyblok.com/v2/cdn/stories/blog/${slug}?version=${version}&token=${config.public.storyblokApiToken}`,
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
      if (data.story) {
        story.value = data.story;
      } else {
        error.value = "Blog post not found";
      }
    } catch (e) {
      error.value = `Failed to load blog post: ${e.message}`;
    } finally {
      loading.value = false;
    }
    watch(story, (newStory) => {
      if (newStory && newStory.content && $gtag) {
        $gtag("event", "blog_view", {
          blog_title: newStory.content.name,
          blog_slug: slug,
          blog_intro: newStory.content.intro,
          blog_created_at: newStory.created_at,
          blog_updated_at: newStory.updated_at,
          content_type: "therapy_blog"
        });
      }
    }, { immediate: true });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_Blog = __nuxt_component_0;
      _push(`<section${ssrRenderAttrs(mergeProps({ class: "section" }, _attrs))} data-v-2900ab05>`);
      if (error.value) {
        _push(`<div class="container mx-auto px-4 py-8" data-v-2900ab05><div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" data-v-2900ab05>${ssrInterpolate(error.value)}</div></div>`);
      } else if (loading.value) {
        _push(`<div class="container mx-auto px-4 py-8" data-v-2900ab05><div class="text-center" data-v-2900ab05>Loading blog post...</div></div>`);
      } else if (story.value) {
        _push(ssrRenderComponent(_component_Blog, {
          blok: story.value.content
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/blog/_slug.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const _slug = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-2900ab05"]]);

export { _slug as default };
//# sourceMappingURL=_slug-DHWnDCa_.mjs.map
