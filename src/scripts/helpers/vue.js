import { uniqueId } from 'scripts/helpers/util';

function extractData(vnode, index) {
  const cOpts = vnode.componentOptions;
  const data = {
    class: vnode.data.class,
    staticClass: vnode.data.staticClass,
    style: vnode.data.style,
    attrs: vnode.data.attrs,
    props: {
      ...cOpts.propsData,
      isClone: true,
      index,
    },
    on: cOpts.listeners,
    nativeOn: vnode.data.nativeOn,
    directives: vnode.data.directives,
    scopesSlots: vnode.data.scopesSlots,
    slot: vnode.data.slot,
    ref: vnode.data.ref,
    key: vnode.data.key ? `${index}-clone` : undefined,
  };

  return data;
}

export function cloneSlide(vnode, index) {
  // use the context that the original vnode was created in.
  const h = vnode.context && vnode.context.$createElement;
  const { children } = vnode.componentOptions;

  const data = extractData(vnode, index);

  const tag = vnode.componentOptions.Ctor;

  return h(tag, data, children);
}

export function deepClone(vnodes, createElement) {
  function cloneVNode(vnode) {
    const keySuffix = uniqueId();
    const clonedChildren = vnode.children && vnode.children.map((child) => cloneVNode(child));
    const cloned = createElement(vnode.tag, vnode.data, clonedChildren);
    cloned.text = vnode.text;
    cloned.isComment = vnode.isComment;
    cloned.componentOptions = vnode.componentOptions;
    cloned.elm = vnode.elm;
    cloned.context = vnode.context;
    cloned.ns = vnode.ns;
    cloned.isStatic = vnode.isStatic;
    cloned.key = vnode.key + keySuffix;
    return cloned;
  }
  const clonedVNodes = vnodes.map((vnode) => cloneVNode(vnode));
  return clonedVNodes;
}
