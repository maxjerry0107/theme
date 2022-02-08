/* eslint import/prefer-default-export: "off" */
import images from 'scripts/config/images.js';

/**
 * Resizes a Shopify image on the frontend.
 * Expects `size` to be formatted like the Liquid filter, e.g. '450x' or 300x200'.
 * @param {*} src
 * @param {*} size
 */
export const getSizedImageUrl = (src, size) => {
  const currentSizeRegEx = /_(pico|icon|thumb|small|compact|medium|large|grande|original|\d{1,4}x(\d{1,4})?|master)+\./g;
  const extensionRegEx = /\.jpg|\.png|\.gif|\.jpeg/g;

  // remove any current image size then add the new image size
  return src.replace(currentSizeRegEx, '.').replace(extensionRegEx, (match) => `_${size}${match}`);
};

/**
 * Creates a link to a swatch from a given color and a placeholder link
 * Expects `size` to be formatted like the Liquid filter, e.g. '450x' or 300x200'.
 * @param {*} color
 * @param {*} size
 */
export const getSwatchSrc = (color, size) => {
  const currentSizeRegEx = /color_(pico|icon|thumb|small|compact|medium|large|grande|original|\d{1,4}x(\d{1,4})?|master)+\./g;
  const extensionRegEx = /\.jpg|\.png|\.gif|\.jpeg/g;

  // remove any current image size then add the new image size
  return images.swatch.replace(currentSizeRegEx, '.').replace(extensionRegEx, (match) => `${color}_${size}${match}`);
};
