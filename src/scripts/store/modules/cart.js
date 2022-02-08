import CartService from '../../services/cart.service.js';

const cartService = new CartService();

/**
 * Mutation Consts
 */
const SET_DATA = 'SET_DATA';
const OPEN_SIDECART = 'OPEN_SIDECART';
const CLOSE_SIDECART = 'CLOSE_SIDECART';

// STATE
const baseState = {
  token: '',
  note: null,
  attributes: {},
  total_price: 0,
  total_weight: 0,
  item_count: 0,
  items: [],
  requires_shipping: false,
  currency: '',
  sidecartOpen: false,
};

const mutations = {
  /**
  Note this should be a one to one representation of the cart JSON for help see
  https://help.shopify.com/en/themes/development/getting-started/using-ajax-api#get-cart
  */
  SET_DATA(state, data) {
    state.token = data.token;
    state.note = data.note;
    state.attributes = data.attributes;
    state.total_price = data.total_price;
    state.total_weight = data.total_weight;
    state.item_count = data.item_count;
    state.items = data.items;
    state.requires_shipping = data.requires_shipping;
    state.currency = data.currency;
  },
  CLOSE_SIDECART(state) {
    state.sidecartOpen = false;
  },
  OPEN_SIDECART(state) {
    state.sidecartOpen = true;
  },
};

const actions = {
  init({ commit }) {
    cartService.getCartData().then((resp) => {
      commit(SET_DATA, resp);
    });
  },
  /** CHANGE ITEM IN CART
   * @param { number } qty
   * @param { number } variant_id
   * @param { properties object } properties
   */
  addItem({ state, commit, dispatch }, { quantity, id, properties = {} }) {
    cartService.addItem(quantity, id, properties).then((data) => {
      commit(SET_DATA, data);
    });
  },
  updateItem({ commit }, { key, quantity }) {
    cartService.updateItem(quantity, key).then((data) => {
      commit(SET_DATA, data);
    });
  },
  updateAttributes({ commit }, attributes) {
    cartService.updateAttributes(attributes).then((data) => {
      commit(SET_DATA, data);
    });
  },
  removeItem({ commit }, key) {
    const quantity = 0;
    cartService.updateItem(quantity, key).then((data) => commit(SET_DATA, data));
  },
  openSidecart({ commit }) {
    commit(OPEN_SIDECART);
  },
  closeSidecart({ commit }) {
    commit(CLOSE_SIDECART);
  },
};

export default { namespaced: true, state: baseState, mutations, actions };
