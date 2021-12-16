const loadable = require('@loadable/component');

// loadable breaks when in ESM context.
const Dev404Loadable = loadable.default(async () => import('./dev-404.js'));

module.exports = Dev404Loadable;
