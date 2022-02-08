const timeout = 5000;

const baseState = {
  messages: [],
};

const mutations = {
  ADD_MESSAGE(state, message) {
    const id = new Date().getTime();

    state.messages.push({ id, ...message });
    setTimeout(() => state.messages.splice(0, 1), timeout);
  },
};

const actions = {
  send({ commit }, message) {
    commit('ADD_MESSAGE', message);
  },
};

export default { namespaced: true, state: baseState, mutations, actions };
