const baseState = {
  scrollTop: 0,
};

const mutations = {
  UPDATE_TOP(state, top) {
    state.scrollTop = top;
  },
};

const actions = {
  init({ commit }) {
    window.addEventListener('scroll', () => commit('UPDATE_TOP', window.scrollY), {
      passive: true,
    });
  },
};

export default { namespaced: true, state: baseState, mutations, actions };
