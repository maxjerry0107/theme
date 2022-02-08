import axios from 'axios';
import { parseDataForEditor } from 'scripts/helpers/util.js';

const queue = [];

let fetching = false;
let cartInitialized = false;

const fetchProduct = () => {
  const handle = queue.shift();

  return new Promise((resolve, reject) => {
    axios
      .get(`/products/${handle}?view=json`)
      .then((response) => resolve(response.data))
      .catch((err) => reject(err));
  });
};

const fetchNextProduct = (commit) => {
  fetching = true;

  if (queue.length > 0) {
    fetchProduct(commit).then((product) => {
      commit('ADD_PRODUCT', product);
      fetchNextProduct(commit);
    });
  } else {
    fetching = false;
  }
};

const queueFetch = (handle, commit) => {
  queue.push(handle);
  if (!fetching && cartInitialized) fetchNextProduct(commit);
};

const baseState = {
  all: [],
};

const mutations = {
  ADD_PRODUCT(state, product) {
    const productData = parseDataForEditor(product);

    if (productData) {
      state.all.push(productData);
    } else {
      throw new Error(`Invalid product data for ${product.title}`);
    }
  },
};

const actions = {
  init({ commit }) {
    axios.get('/cart?view=json').then((response) => {
      const cartData = parseDataForEditor(response.data);

      cartData.forEach((product) => {
        const existingProductIndex = queue.findIndex((handle) => product.handle === handle);

        // remove queued products included in the cart payload
        if (existingProductIndex > -1) {
          queue.splice(existingProductIndex, 1);
        }

        commit('ADD_PRODUCT', product);
      });

      cartInitialized = true;
      fetchNextProduct(commit);
    });
  },
  addProduct({ state, commit }, handle) {
    if (queue.indexOf(handle) < 0 && !state.all.find((product) => product.handle === handle)) {
      queueFetch(handle, commit);
    }
  },
};

export default {
  mutations,
  actions,
  state: baseState,
  namespaced: true,
};
