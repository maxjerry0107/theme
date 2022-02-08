export const ucfirst = (value) => `${value.charAt(0).toUpperCase()}${value.substring(1)}`;

export const upcase = (value) =>
  value
    .split(' ')
    .map((word) => ucfirst(word))
    .join(' ');

export const unhandleize = (value) => upcase(value.replace(/-/g, ' '));

export const handleize = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/-$/, '')
    .replace(/^-/, '');
};
