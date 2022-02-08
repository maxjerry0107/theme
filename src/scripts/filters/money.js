export const money = (value) => {
  let str = String(parseFloat(value) / 100);
  str += str.indexOf('.') < 0 ? '.00' : '00';
  return `$${str.substring(0, str.indexOf('.') + 3)}`;
};

export const moneyWithoutDecimals = (value) => {
  return money(value).replace(/\.00/g, '');
};
