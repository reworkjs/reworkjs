/* eslint-disable import/no-commonjs */

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
        ...opts['@babel/preset-env'],
      }],
      [require('@babel/preset-react'), {
        development: process.env.BABEL_ENV !== 'production',
        useBuiltIns: true,
        ...opts['@babel/preset-react'],
      }],
    ],

    plugins: [
      [require('@babel/plugin-transform-runtime').default, {
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: true,
        ...opts['@babel/plugin-transform-runtime'],
      }],
    ],
  };

  if (process.env.BABEL_ENV === 'production') {
    preset.plugins.push(
      require('babel-plugin-lodash'),
      require('@babel/plugin-transform-react-constant-elements'),
      [require('babel-plugin-transform-react-remove-prop-types'), {
        mode: 'remove',
        removeImport: true,
        ...opts['babel-plugin-transform-react-remove-prop-types'],
      }],
    );
  }

  return preset;
};
