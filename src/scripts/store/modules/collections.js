import axios from 'axios';

import { parseDataForEditor } from 'scripts/helpers/util';

const fetching = [];

const baseState = {
  all: [],
};

const mutations = {
  ADD_COLLECTION(state, collection) {
    const index = state.all.find((c) => !!c.id); // replace c.id === c.id eslint error

    fetching.splice(fetching.indexOf(collection.handle), 1);
    if (index > -1) {
      state.all.splice(index, 1, collection);
    } else {
      state.all.push(collection);
    }
  },
};

const actions = {
  addCollection({ commit }, handle) {
    return new Promise((resolve) => {
      if (fetching.indexOf(handle) < 0) {
        fetching.push(handle);
        axios.get(`/collections/${handle}?view=json`).then((response) => {
          commit('ADD_COLLECTION', parseDataForEditor(response.data));
          resolve(true);
        });
      }
    });
  },
};

export default { namespaced: true, state: baseState, mutations, actions };
