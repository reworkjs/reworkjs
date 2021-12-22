const loadable = require('@loadable/component');

module.exports = {
  path: '/manual-route-cjs',
  component: loadable.default(() => import('./home.page.js'))
}
