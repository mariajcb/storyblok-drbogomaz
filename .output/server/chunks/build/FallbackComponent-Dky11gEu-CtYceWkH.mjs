import { defineComponent, createElementBlock, openBlock, createElementVNode, createTextVNode, toDisplayString } from 'vue';

const m = { class: "fallback-component" }, _ = { class: "component" }, f = /* @__PURE__ */ defineComponent({
  __name: "FallbackComponent",
  props: {
    blok: {}
  },
  setup(t) {
    return (e, o) => (openBlock(), createElementBlock("div", m, [
      createElementVNode("p", null, [
        o[0] || (o[0] = createTextVNode(" Component could not be found for blok ")),
        createElementVNode("span", _, toDisplayString(e.blok.component), 1),
        o[1] || (o[1] = createTextVNode("! Is it configured correctly? "))
      ])
    ]));
  }
}), i = (t, e) => {
  const o = t.__vccOpts || t;
  for (const [s, l] of e)
    o[s] = l;
  return o;
}, u = /* @__PURE__ */ i(f, [["__scopeId", "data-v-9abcd1f2"]]);

export { u as default };
//# sourceMappingURL=FallbackComponent-Dky11gEu-CtYceWkH.mjs.map
