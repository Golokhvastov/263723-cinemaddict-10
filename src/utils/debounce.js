const DEBOUNCE_TIME = 200;

let lastTimeout = null;

export const debounce = (handler, evt) => {
  if (lastTimeout) {
    clearTimeout(lastTimeout);
  }

  lastTimeout = setTimeout(function () {
    handler(evt);
  }, DEBOUNCE_TIME);
};
