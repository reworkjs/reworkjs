import loadable from '@loadable/component';

export default {
  path: '/manual-route-esm',
  component: loadable(() => import('./home.page.js'))
}
