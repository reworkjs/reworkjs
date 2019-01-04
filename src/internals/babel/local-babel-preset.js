/* eslint-disable import/no-commonjs */

/*
 * Babel preset that can only be ran on the files belonging to the project using this framework (not its dependencies)
 *
 * Same as global preset with a few more features or optimisations specific to how the framework is used.
 */

const buildGlobalPreset = require('./global-babel-preset');

module.exports = function buildPreset() {

  const preset = buildGlobalPreset();

  preset.plugins.push(
    require('@babel/plugin-react-intl-auto'),
    require('@babel/plugin-syntax-dynamic-import'),
    // TODO react-loadable-plugin
  );

  return preset;
};
