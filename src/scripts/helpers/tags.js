/* eslint import/prefer-default-export: "off" */

const tagDefs = {
  productBadge: 'badge',
  subscribeMessage: 'subscribe-msg',
  freeShipping: 'free-shipping',
  discountPercent: 'discount-percent-',
  filter: 'filter-',
};

const getValueByPrefix = (tags, param) => {
  const prefix = `__${param}:`;
  const matchingTag = tags.find((tag) => tag.indexOf(prefix) === 0);

  return matchingTag ? matchingTag.slice(prefix.length) : matchingTag;
};

const getTagsByPrefix = (tags, param) => {
  const prefix = `__${param}:`;
  const matchingTags = tags.filter((tag) => tag.indexOf(prefix) === 0).map((tag) => tag.slice(prefix.length));

  return matchingTags;
};

export function getProductBadges(tags) {
  return getTagsByPrefix(tags, tagDefs.productBadge);
}

const getValue = (tags, param) => {
  const matchingTags = tags.filter((tag) => tag.indexOf(param) === 0).map((tag) => tag.slice(tag.indexOf('|') + 1).trim());
  return matchingTags;
};

export const getFilter = (tags, filterType) => {
  return getValue(tags, `${filterType}`);
};
