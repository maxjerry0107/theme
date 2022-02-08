// eslint-disable-next-line import/prefer-default-export
export const waitForFindify = () =>
  new Promise((resolve) => {
    (window.findifyCallbacks = window.findifyCallbacks || []).push((findify) => resolve(findify));
  });
