/* eslint-disable class-methods-use-this */
const axios = require('axios');

const changeCartUrl = '/cart/change.js';
const addToCartUrl = '/cart/add.js';
const updateCartUrl = '/cart/update.js';
const clearCartUrl = '/cart/clear.js';
const getCartUrl = '/cart.js';

export default class CartService {
  constructor() {}

  /** CHANGE ITEM IN CART
   * @param { number } qty
   * @param { string } key
   */
  changeItem(qty, key) {
    return axios
      .post(changeCartUrl, {
        quantity: qty,
        id: key,
      })
      .then((resp) => resp.data)
      .catch((error) => console.error(error));
  }

  /** CHANGE ITEM IN CART
   * @param { number } qty
   * @param { number } variant_id
   * @param { properties object } properties
   */
  addItem(qty, variant_id, properties) {
    return axios
      .post(addToCartUrl, {
        quantity: qty,
        id: variant_id,
        properties,
      })
      .then((productData) => {
        /** this resp is the product data - must update store cart data with additional call */
        return this.getCartData().catch((error) => console.error(error));
      })
      .catch((error) => console.error(error));
  }

  // GET CART DATA
  getCartData() {
    const timeStamp = new Date().getTime();
    const url = `${getCartUrl}?q=${timeStamp}`;
    return axios
      .get(url)
      .then((resp) => resp.data)
      .catch((error) => console.error(error));
  }

  /** UPDATE ITEM IN CART
   * @param { number } qty
   * @param { string } key
   */
  updateItem(qty, key) {
    const url = `updates[${key}]=${qty}`;
    return axios
      .post(updateCartUrl, url)
      .then((resp) => resp.data)
      .catch((error) => console.error(error));
  }

  /** UPDATE CART ATTRUBUTE
   * @param { array } attributes
   */
   updateAttributes(attributes) {
    let url = '';
    attributes.forEach((attribute, index) => {
      url += index > 0 ? '&' : '';
      url += `attributes[${attribute.key}]=${attribute.value}`
    });
    console.log(url);
    return axios
      .post(updateCartUrl, url)
      .then((resp) => resp.data)
      .catch((error) => console.error(error));
  }

  /** CLEAR ALL ITEMS IN CART */
  clearCart() {
    return axios
      .post(clearCartUrl)
      .then((resp) => resp.data)
      .catch((error) => console.error(error));
  }
}
