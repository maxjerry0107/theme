import Vue from 'vue';
import Vuex from 'vuex';

// modules
import products from './modules/products.js';
import collections from './modules/collections.js';
import cart from './modules/cart.js';
import toast from './modules/toast.js';
import scroll from './modules/scroll.js';
import fixInteroperability from './modules/fixInteroperability.js';

Vue.use(Vuex);

const state = {};

export default new Vuex.Store({
  state,
  modules: {
    products,
    collections,
    cart,
    toast,
    scroll,
    fixInteroperability,
  },
});
