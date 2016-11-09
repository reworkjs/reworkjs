/**
 * Exports the list of routes based on the setup config.
 *
 * Using webpack.
 */

// This directory will be replaced by the one set by the configuration, by webpack
const routeLoader = require.context('@@directories.routes', true, /\.js$/);
const routes = routeLoader.keys().map(file => routeLoader(file));

export default routes;
