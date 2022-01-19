/*
 * Babel preset that can be run on the whole project (node_modules included)
 *
 * Only transpiles content that would be able to be run on its own, eg.
 * - stable ES features
 * - optimisations
 */

export default function buildPreset(api, opts = {}) {

  const preset = {
    presets: [
      ['@babel/preset-env', {
        modules: false,
        loose: true,
        ...opts['@babel/preset-env'],
      }],
    ],

    plugins: [
      '@loadable/babel-plugin',
      ['@babel/plugin-transform-runtime', {
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
      'babel-plugin-lodash',
      '@babel/plugin-transform-react-constant-elements',
    );
  }

  return preset;
}
