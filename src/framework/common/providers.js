/**
 * Exports the list of providers based on the setup config.
 *
 * Using webpack.
 */

export type Provider = {
  reducer: ?Function,
  sagas: ?Function[],
};

// This directory will be replaced by the one set by the configuration, by webpack
const externalProviders = require.context('@@directories.providers', true, /\.js$/);
const providers = externalProviders.keys().map(file => externalProviders(file));

const localProviders = require.context('../app/providers');
const finalProviders: Provider[] = providers.concat(localProviders.keys().map(file => localProviders(file)));

export default finalProviders;
