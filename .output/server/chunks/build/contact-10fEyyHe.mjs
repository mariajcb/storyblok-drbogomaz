import { ssrRenderAttrs, ssrRenderComponent, ssrRenderAttr, ssrRenderClass, ssrInterpolate, ssrIncludeBooleanAttr } from 'vue/server-renderer';
import { ref, computed, mergeProps, useSSRContext } from 'vue';
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

const _sfc_main$1 = {
  __name: "ContactForm",
  __ssrInlineRender: true,
  setup(__props) {
    const name = ref("");
    const phone = ref("");
    const email = ref("");
    const message = ref("");
    const nameTouched = ref(false);
    const phoneTouched = ref(false);
    const emailTouched = ref(false);
    const messageTouched = ref(false);
    const nameError = computed(() => {
      if (!name.value) return "Name is required";
      return "";
    });
    const phoneError = computed(() => {
      if (!phone.value) return "Phone is required";
      return "";
    });
    const emailError = computed(() => {
      if (!email.value) return "Email is required";
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email.value)) {
        return "Invalid email address";
      }
      return "";
    });
    const messageError = computed(() => {
      if (!message.value) return "Message is required";
      return "";
    });
    const status = ref(null);
    const isSubmitting = ref(false);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "max-w-2xl mx-auto px-4 py-10" }, _attrs))} data-v-4fe86cc4>`);
      if (!status.value) {
        _push(`<form class="space-y-6" data-v-4fe86cc4><h1 class="text-3xl font-bold text-[#718FCB] mb-4" data-v-4fe86cc4>Contact Me</h1><p class="text-gray-600 mb-8" data-v-4fe86cc4>Please use this form for general information purposes only. DO NOT send personal health information through this form. Specific client care will be addressed during your appointment. If this is an emergency, please call 911.</p><div class="space-y-2" data-v-4fe86cc4><label class="block text-sm font-medium text-gray-700" data-v-4fe86cc4>Name</label><div data-v-4fe86cc4><input${ssrRenderAttr("value", name.value)} name="name" type="text" placeholder="Type your name here" class="${ssrRenderClass([{ "border-red-500": nameError.value && nameTouched.value }, "mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"])}" data-v-4fe86cc4></div>`);
        if (nameError.value && nameTouched.value) {
          _push(`<p class="mt-1 text-sm text-red-600" data-v-4fe86cc4>${ssrInterpolate(nameError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-2" data-v-4fe86cc4><label class="block text-sm font-medium text-gray-700" data-v-4fe86cc4>Phone</label><div data-v-4fe86cc4><input${ssrRenderAttr("value", phone.value)} name="phone" type="text" placeholder="(xxx)xxx-xxxx" class="${ssrRenderClass([{ "border-red-500": phoneError.value && phoneTouched.value }, "mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"])}" data-v-4fe86cc4></div>`);
        if (phoneError.value && phoneTouched.value) {
          _push(`<p class="mt-1 text-sm text-red-600" data-v-4fe86cc4>${ssrInterpolate(phoneError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-2" data-v-4fe86cc4><label class="block text-sm font-medium text-gray-700" data-v-4fe86cc4>Email</label><div data-v-4fe86cc4><input${ssrRenderAttr("value", email.value)} name="email" type="email" class="${ssrRenderClass([{ "border-red-500": emailError.value && emailTouched.value }, "mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"])}" data-v-4fe86cc4></div>`);
        if (emailError.value && emailTouched.value) {
          _push(`<p class="mt-1 text-sm text-red-600" data-v-4fe86cc4>${ssrInterpolate(emailError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><div class="space-y-2" data-v-4fe86cc4><label class="block text-sm font-medium text-gray-700" data-v-4fe86cc4>Message</label><div data-v-4fe86cc4><textarea name="message" rows="4" class="${ssrRenderClass([{ "border-red-500": messageError.value && messageTouched.value }, "mt-1 block w-full rounded-md border px-3 py-2 focus:border-[#718FCB] focus:outline-none focus:ring-1 focus:ring-[#718FCB]"])}" data-v-4fe86cc4>${ssrInterpolate(message.value)}</textarea></div>`);
        if (messageError.value && messageTouched.value) {
          _push(`<p class="mt-1 text-sm text-red-600" data-v-4fe86cc4>${ssrInterpolate(messageError.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div><button type="submit" class="w-full bg-[#718FCB] text-white py-2 px-4 rounded-md hover:bg-[#50b0ae] transition-colors duration-200"${ssrIncludeBooleanAttr(isSubmitting.value) ? " disabled" : ""} data-v-4fe86cc4>${ssrInterpolate(isSubmitting.value ? "Sending..." : "Send Message")}</button></form>`);
      } else if (status.value === "success") {
        _push(`<div class="text-center py-8" data-v-4fe86cc4><h2 class="text-2xl font-bold text-green-600 mb-4" data-v-4fe86cc4>Thank you!</h2><p class="text-gray-600" data-v-4fe86cc4>Your message has been sent successfully.</p></div>`);
      } else if (status.value === "error") {
        _push(`<div class="text-center py-8" data-v-4fe86cc4><h2 class="text-2xl font-bold text-red-600 mb-4" data-v-4fe86cc4>Error</h2><p class="text-gray-600" data-v-4fe86cc4>There was an error sending your message. Please try again later.</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div>`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContactForm.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const ContactForm = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["__scopeId", "data-v-4fe86cc4"]]);
const _sfc_main = {
  __name: "contact",
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<section${ssrRenderAttrs(_attrs)}>`);
      _push(ssrRenderComponent(ContactForm, null, null, _parent));
      _push(`</section>`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("pages/contact.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};

export { _sfc_main as default };
//# sourceMappingURL=contact-10fEyyHe.mjs.map
