/**
 * @param {Object} [collection]
 * @param {String|Number} [page]
 * @returns {String}
 */
export const getCollectionUrl = (collection, page = 1) => {
  return `/collections/${collection.handle}?page=${page}`;
};

// remove this when a true default helper is created
export default getCollectionUrl;
