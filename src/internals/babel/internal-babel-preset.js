/*
 * Babel preset that can be only run on the framework files.
 */

import buildGlobalPreset from './global-babel-preset.js';
import PluginTypeScript from '@babel/plugin-transform-typescript';
import PresetReact from '@babel/preset-react';
import PluginDecorator from '@babel/plugin-proposal-decorators';

export default function buildPreset(api, opts = {}) {

  const { ...passDownOpts } = opts;

  const frameworkTargets = [
    'chrome >= 90', // april 2021
    'safari >= 14.5', // april 2021
    'iOS >= 14.5',
    'firefox >= 90', // april 2021
    'node >= 16',
  ];

  const preset = buildGlobalPreset(api, {
    ...passDownOpts,

    '@babel/preset-env': {
      targets: frameworkTargets,
    },
  });

  preset.overrides = [{
    include: /\.(ts|tsx|cts|mts)$/,
    plugins: [
      [PluginTypeScript.default, {
        isTSX: true,
        onlyRemoveTypeImports: true,
        allowDeclareFields: true,
      }],
    ],
  }];

  preset.presets.push(
    [PresetReact.default, {
      development: process.env.BABEL_ENV !== 'production',
      useBuiltIns: true,
      runtime: 'automatic',
      // fix: babel does not add the file extension to react/jsx-runtime
      //  and react does not include a package.exports declaration
      //  so node can't find it when using es modules
      //  was fixed: https://github.com/babel/babel/pull/12116
      //  then reverted: https://github.com/babel/babel/pull/12213
      importSource: '@reworkjs/core/_internal_/react',
      ...opts['@babel/preset-react'],
    }],
  );

  preset.plugins.push(
    [PluginDecorator.default, {
      // TODO: migrate to non-legacy decorators
      legacy: true,
      // decoratorsBeforeExport: true,
    }],
  );

  return preset;
}
