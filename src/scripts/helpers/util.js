export const debounce = (...args) => {
  const [func, wait, immediate] = args;
  let timeout;

  return function exec() {
    const context = this;
    function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }

    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(context, args);
  };
};

export const clone = (obj) => {
  return JSON.parse(JSON.stringify(obj));
};

/**
  This handles a weird edge case caused by the theme editor.
  When customizing a theme, for some reason HTML comments are injected
  into templates, breaking the response data. This means we need to
  remove the comments and parse it back into JSON format, allowing for
  the data to load properly when the theme editor is open.

  @param data The response to check.
*/
export const parseDataForEditor = (data) => {
  if (typeof data === 'string') {
    const parsed = data.replace(/<!--[\s\S]*?-->/g, '');

    try {
      return JSON.parse(parsed);
    } catch (error) {
      return false;
    }
  }

  return data;
};

/**
  Converts a string to kebab-case.

  @param stringToAlter The string that should be turned into a handle.
*/
export const toKebabCase = (stringToAlter) => {
  return stringToAlter
    .match(/[A-Z]{2,}(?=[A-Z][a-z]+[0-9]*|\b)|[A-Z]?[a-z]+[0-9]*|[A-Z]|[0-9]+/g)
    .map((x) => x.toLowerCase())
    .join('-');
};

export const remap = (value, low1, high1, low2, high2) => {
  return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
};

/**
 *
 * @param {type} src is a url with query string parameters
 * @return {object} Return value is an object with url as a string and param as an object.
 */

export const URLToObject = (src) => {
  const splitSrc = src.split('?');
  const url = splitSrc[0];
  const params = {};

  if (splitSrc.length > 1) {
    const paramPairs = splitSrc[1].split('&');
    paramPairs.forEach((pair) => {
      const [key, value] = pair.split('=');
      params[key] = value;
    });
  }

  return {
    url,
    params,
  };
};
