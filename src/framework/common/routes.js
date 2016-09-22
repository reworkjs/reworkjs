/**
 * Exports the list of routes based on the setup config.
 *
 * Using webpack.
 */

// This directory will be replaced by the one set by the configuration, by webpack
const externalProviders = require.context('@@directories.routes', true, /\.js$/);
const routes = externalProviders.keys().map(file => externalProviders(file));

export default routes;
