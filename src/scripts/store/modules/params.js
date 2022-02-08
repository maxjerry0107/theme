const baseState = {};

const mutations = {
  ADD_PARAM(state, { key, value }) {
    state[key] = value;
  },
};

const actions = {
  init({ commit }) {
    const url = window.location.href;
    const start = url.indexOf('?');
    const stop = url.indexOf('#') > -1 ? url.indexOf('#') : url.length;
    const queryString = start > -1 ? url.substr(start + 1, stop - start - 1) : '';

    queryString
      .split('&')
      .map((param) => param.split('='))
      .forEach((param) => commit('ADD_PARAM', { key: param[0], value: param[1] }));
  },
};

export default {
  mutations,
  actions,
  state: baseState,
  namespaced: true,
};
