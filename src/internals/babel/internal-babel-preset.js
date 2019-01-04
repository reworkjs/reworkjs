/* eslint-disable import/no-commonjs */

/*
 * Babel preset that can be only run on the framework files.
 */

const buildGlobalPreset = require('./global-babel-preset');

module.exports = function buildPreset(api, opts = {}) {

  const { buildEsModules, ...passDownOpts } = opts;

  const preset = buildGlobalPreset(api, {
    ...passDownOpts,

    '@babel/preset-env': buildEsModules ? {
      ...passDownOpts['@babel/preset-env'],
      targets: 'maintained node versions',
    } : {},
  });

  preset.presets.push(
    [require('@babel/preset-react'), {
      development: process.env.BABEL_ENV !== 'production',
      useBuiltIns: true,
      ...opts['@babel/preset-react'],
    }],
  );

  preset.plugins.push(
    require('@babel/plugin-transform-flow-strip-types').default,
    require('@babel/plugin-syntax-dynamic-import').default,
    require('@babel/plugin-proposal-class-properties').default,
    [require('@babel/plugin-proposal-decorators').default, {
      // TODO: migrate to non-legacy decorators
      legacy: true,
      // decoratorsBeforeExport: true,
    }],
  );

  if (buildEsModules) {
    preset.plugins.push(require('babel-plugin-dynamic-import-node'));
  }

  return preset;
};
