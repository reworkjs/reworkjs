/* eslint-disable @typescript-eslint/no-require-imports,import/no-commonjs */

function getResolver() {
  // eslint-disable-next-line import/no-extraneous-dependencies
  return require('jest-resolve/build/defaultResolver').default;
}

const JAVASCRIPT_EXTENSION = /\.js$/i;

function resolverTSAndTSX(path, options) {
  const resolver = options.defaultResolver || getResolver();

  try {
    return resolver(path, options);
  } catch (error) {
    if (!JAVASCRIPT_EXTENSION.test(path)) {
      throw error;
    }

    try {
      return resolver(path.replace(JAVASCRIPT_EXTENSION, '.ts'), options);
    } catch (_) {
      return resolver(path.replace(JAVASCRIPT_EXTENSION, '.tsx'), options);
    }
  }
}

module.exports = resolverTSAndTSX;
