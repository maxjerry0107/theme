/**
 * Explode a list of products with variants into a list of products
 * where each of the original variants from every product is its
 * own product object.
 * @param {Array} products The array of products with included variants
 * @returns {Array} An array of products where each of the original variants is its own product
 */
export const explodeProducts = (products) => {
  const explodedProducts = [];

  products.forEach((product) => {
    // separate variant and data
    const { variants, ...data } = product;

    variants.forEach((variant) => {
      // create new single variant product object
      const newProduct = {
        ...data,
        variants: [variant],
      };

      // ovverride variant-specific data
      if (variants.length > 1) {
        newProduct.title = `${data.title} ${variant.title}`;
        newProduct.url = `${data.url}?variant=${variant.id}`;
        newProduct.price = variant.price;

        if (variant.image) {
          newProduct.images.unshift(variant.image);
        }
      }

      explodedProducts.push(newProduct);
    });
  });

  return explodedProducts;
};

/**
 * Get a variant object from a product object
 * @param {Object} product The product object from the data store
 * @param {Number} variantId The ID of the variant to return
 * @returns {Mixed} The matching variant object; null if not found
 */
export const getVariantFromProduct = (product, variantId) => {
  return product.variants.find((variant) => variant.id === parseInt(variantId, 10));
};

/**
 * Get the discount percentage
 * @param {Number} price The current price
 * @param {Number} comparePrice The compate at price
 * @returns {Number} The discount percentage
 */
export const getDiscountPercentage = (price, comparePrice) => {
  return Math.round(((comparePrice - price) / comparePrice) * 100);
};

/**
 * Get the final price of a product accounting for a discount percentage
 * @param {Number} price The current price, in shopify price format i.e. 1100 for $11
 * @param {Number} discountPercentage The discount percentage as a whole number i.e. 20 for 20%
 */
export const getDiscountedPrice = (price, discountPercentage) => {
  const discountMultiplier = discountPercentage / 100;
  const discount = Math.round(price * discountMultiplier);

  return price - discount;
};

/**
 * @param {Object} [collection]
 * @param {Object} product
 * @param {Object} [variant]
 * @returns {String}
 */
export const getProductUrl = (collection, product, variant) => {
  return `${collection ? `/collections/${collection.handle}` : ''}/products/${product.handle}?variant=${(variant || product.variants[0]).id}`;
};
