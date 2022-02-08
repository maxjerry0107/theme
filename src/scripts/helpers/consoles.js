/**
 * Console Helper
 * --------------
 * Allows for use of more recent methods added to the console object while providing a fallback to browsers that may not support all the methods yet.
 */

const stylesets = [
  'padding: 0.25rem; background: #e30079; color: #000000;',
  'padding: 0.25rem; background: #2c2c2c; color: #ffffff;',
  'padding: 0.25rem 1.5rem; font-family: Roboto; font-size: 1.2em; line-height: 1.4em; color: white; background-color: #4158D0; background-image: linear-gradient(43deg, #4158D0 0%, #C850C0 46%, #FFCC70 100%);',
];

/* eslint-disable no-console */
const consoleLog = (message = 'test', stylesindex = 0) => {
  return console.log('%c'.concat(message), stylesets[stylesindex]);
};
export const consoleInfo = console.info
  ? (message = {}, stylesindex = 1) => {
      return console.info('%c'.concat(message), stylesets[stylesindex]);
    }
  : consoleLog;
export const consoleDir = console.dir ? console.dir : consoleLog;
export const consoleError = console.error ? console.error : consoleLog;
export const consoleTable = console.table ? console.table : consoleLog;
export const consoleTime = console.time ? console.time : consoleLog;
export const consoleTrace = console.trace ? console.trace : consoleLog;
export const consoleWarn = console.warn ? console.warn : consoleLog;
/* eslint-enable no-console */
export default consoleLog;
