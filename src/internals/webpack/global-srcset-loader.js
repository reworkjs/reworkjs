/* eslint-disable import/no-commonjs */

const loaderUtils = require('loader-utils');
const srcSetLoader = require('srcset-loader');

module.exports = function safeSrcSetLoader(content) {
  return srcSetLoader.call(this, content);
};

module.exports.pitch = function picth(remainingRequest) {
  const query = loaderUtils.parseQuery(this.query);
  const resourceQuery = loaderUtils.parseQuery(this.resourceQuery);

  const placeholder = query.placeholder || resourceQuery.placeholder;
  const sizes = query.sizes || resourceQuery.sizes;

  if (sizes || placeholder) {
    return srcSetLoader.pitch.call(this, remainingRequest);
  }
};
