/* eslint-disable */

// https://mathiasbynens.be/notes/globalthis
const globalObject = (function () {
  if (typeof globalThis === 'object') {
    return globalThis;
  }

  if (typeof window === 'object') {
    return window;
  }

  if (typeof self === 'object') {
    return self;
  }

  // Note: safari 11 doesn't actually support this. Hence the typeof window/self as a workaround
  Object.defineProperty(Object.prototype, '__magic__', {
    get() {
      return this;
    },
    configurable: true, // This makes it possible to `delete` the getter later.
  });
  const globalObject = __magic__; // get __magic__ from global object's prototype, which is Object.prototype
  delete Object.prototype.__magic__;

  return globalObject;
}());

export default globalObject;
