/*
 * Babel preset that can be run on the whole project (node_modules included)
 *
 * Only transpiles content that would be able to be run on its own, eg.
 * - stable ES features
 * - optimisations
 */
import PresetEnv from '@babel/preset-env';
import PluginRuntime from '@babel/plugin-transform-runtime';
import PluginLodash from 'babel-plugin-lodash';
import PluginTransformReactConstantElements from '@babel/plugin-transform-react-constant-elements';

export default function buildPreset(api, opts = {}) {

  const preset = {
    presets: [
      [PresetEnv.default, {
        modules: false,
        loose: true,
        ...opts['@babel/preset-env'],
      }],
    ],

    plugins: [
      '@loadable/babel-plugin',
      [PluginRuntime.default, {
        corejs: false,
        helpers: true,
        regenerator: true,
        ...opts['@babel/plugin-transform-runtime'],
      }],
    ],
  };

  const env = process.env.BABEL_ENV || process.env.NODE_ENV;
  if (env === 'production') {
    preset.plugins.push(
      PluginLodash,
      PluginTransformReactConstantElements.default,
    );
  }

  return preset;
}
