/* eslint-disable import/no-commonjs */

/*
 * Babel preset that can be only run on the framework files.
 */

// @flow

const buildGlobalPreset = require('./global-babel-preset');

module.exports = function buildPreset(api, opts = {}) {

  const { buildEsModules, ...passDownOpts } = opts;

  const frameworkTargets = [
    'chrome >= 72', // january 2019
    'safari >= 11', // sept. 2018
    'iOS >= 11',
    'firefox >= 64', // january 2019
    'maintained node versions',
  ];

  const preset = buildGlobalPreset(api, {
    ...passDownOpts,

    '@babel/preset-env': buildEsModules ? {
      ...passDownOpts['@babel/preset-env'],
      targets: frameworkTargets,
      modules: 'commonjs',
    } : {
      targets: frameworkTargets,
    },

    '@babel/plugin-transform-runtime': {
      useESModules: !buildEsModules,
    },
  });

  preset.presets.push(
    [require('@babel/preset-react').default, {
      development: process.env.BABEL_ENV !== 'production',
      useBuiltIns: true,
      runtime: 'automatic',
      ...opts['@babel/preset-react'],
    }],
  );

  preset.plugins.push(
    require('@babel/plugin-transform-flow-strip-types').default,
    [require('@babel/plugin-proposal-decorators').default, {
      // TODO: migrate to non-legacy decorators
      legacy: true,
      // decoratorsBeforeExport: true,
    }],
    [require('@babel/plugin-proposal-private-methods').default, {
      loose: true,
    }],
    [require('@babel/plugin-proposal-class-properties').default, {
      loose: true,
    }],
  );

  if (buildEsModules) {
    preset.plugins.push(require('babel-plugin-dynamic-import-node'));
  }

  return preset;
};
