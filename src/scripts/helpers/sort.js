/* eslint import/prefer-default-export: "off" */

const sortAlphabetically = (a, b) => {
  const titleA = a.title.toLowerCase();
  const titleB = b.title.toLowerCase();

  if (titleA < titleB) return -1;
  if (titleA > titleB) return 1;
  return 0;
};

const sortAlphabeticallyReverse = (a, b) => {
  const titleA = a.title.toLowerCase();
  const titleB = b.title.toLowerCase();

  if (titleA < titleB) return 1;
  if (titleA > titleB) return -1;
  return 0;
};

const sortPriceDesc = (a, b) => {
  return b.price - a.price;
};

const sortPriceAsc = (a, b) => {
  return a.price - b.price;
};

const sortOrder = (a, b) => {
  if (a.order < b.order) return -1;
  if (a.order > b.order) return 1;
  return 0;
};

/**
 * Simple helper function that determines which sorting function to use.
 *
 * @param {string} sortMethod
 * @returns {function}
 */
export const sortProductsBy = (sortMethod) => {
  switch (sortMethod) {
    case 'alphabetically':
      return sortAlphabetically;
    case 'alphabeticallyReverse':
      return sortAlphabeticallyReverse;
    case 'priceDesc':
      return sortPriceDesc;
    case 'priceAsc':
      return sortPriceAsc;
    default:
      return sortOrder;
  }
};
