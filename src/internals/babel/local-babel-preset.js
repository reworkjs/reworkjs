/* eslint-disable import/no-commonjs */

/*
 * Babel preset that can only be ran on the files belonging to the project using this framework (not its dependencies)
 *
 * Same as global preset with a few more features or optimisations specific to how the framework is used.
 */

const buildGlobalPreset = require('./global-babel-preset');

module.exports = function buildPreset(api, opts = {}) {

  const preset = buildGlobalPreset(api, opts);

  preset.presets.push(
    [require('@babel/preset-react').default, {
      development: process.env.BABEL_ENV !== 'production',
      useBuiltIns: true,
      ...opts['@babel/preset-react'],
    }],
  );

  preset.plugins.push(
    [require('babel-plugin-react-intl-auto').default, {
      ...opts['babel-plugin-react-intl-auto'],
    }],
    // TODO react-loadable-plugin
  );

  return preset;
};
