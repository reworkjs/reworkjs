/*
 * Babel preset that can be run on the whole project (node_modules included)
 *
 * Only transpiles content that would be able to be run on its own, eg.
 * - stable ES features
 * - optimisations
 */
module.exports = function buildPreset(api, opts = {}) {

  const preset = {
    presets: [
      [require('@babel/preset-env').default, {
        modules: false,
        loose: true,
        ...opts['@babel/preset-env'],
      }],
    ],

    plugins: [
      require('@babel/plugin-syntax-dynamic-import').default,
      [require('@babel/plugin-transform-runtime').default, {
        corejs: false,
        helpers: true,
        regenerator: true,

        // https://github.com/webpack/webpack/issues/4039#issuecomment-273804003
        // we can't have both `import` and `module.exports` in the same file.
        // we can't
        useESModules: false,
        ...opts['@babel/plugin-transform-runtime'],
      }],
    ],
  };

  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env === 'production') {
    preset.plugins.push(
      require('babel-plugin-lodash'),
      require('@babel/plugin-transform-react-constant-elements').default,
    );
  }

  return preset;
};
