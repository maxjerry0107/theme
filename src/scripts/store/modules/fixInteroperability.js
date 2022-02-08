/**
 * Fix interoperability
 */
const baseState = {
  elems: [],
};
const mutations = {
  ADD_ELEM(state, elem) {
    state.elems.push(elem);
  },
};
const actions = {
  init({ commit }) {
    [...document.querySelector('#MainContent').querySelectorAll('style'), ...document.querySelector('#MainContent').querySelectorAll('script')].forEach((node) => {
      commit('ADD_ELEM', node);
      node.remove();
    });
  },
  restore({ state }) {
    state.elems.forEach((node) => {
      document.querySelector('body').appendChild(node);
    });
  },
};
export default {
  state: baseState,
  mutations,
  actions,
  namespaced: true,
};
