/*
 * Babel preset that can only be ran on the files belonging to the project using this framework (not its dependencies)
 *
 * Same as global preset with a few more features or optimisations specific to how the framework is used.
 */

const buildGlobalPreset = require('./global-babel-preset.cjs');

module.exports = function buildPreset(api, opts = {}) {

  const preset = buildGlobalPreset(api, opts);

  const env = process.env.BABEL_ENV || process.env.NODE_ENV;

  preset.presets.push(
    [require('@babel/preset-react').default, {
      development: env !== 'production',
      useBuiltIns: true,
      runtime: 'automatic',
      ...opts['@babel/preset-react'],
    }],
  );

  preset.plugins.push(['babel-plugin-formatjs', {
    removeDefaultMessage: env === 'production',
    ...opts['babel-plugin-formatjs'],
  }]);

  // only remove prop-types locally. Removing on node_modules is known to cause issues
  // on libraries such as https://github.com/SaraVieira/react-social-sharing/blob/master/src/buttons/factory.js#L30
  if (env === 'production') {
    preset.plugins.push(
      [require('babel-plugin-transform-react-remove-prop-types').default, {
        mode: 'remove',
        removeImport: true,
        ...opts['babel-plugin-transform-react-remove-prop-types'],
      }],
    );
  }

  return preset;
};
