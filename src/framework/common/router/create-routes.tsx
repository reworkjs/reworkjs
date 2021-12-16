import logger from '@reworkjs/core/logger';
import { Route } from 'react-router-dom';
import routeModules from 'val-loader!./_find-routes.codegen.cjs';
import { getDefault } from '../../../shared/util/module-util.js';

const SourceFileName = Symbol('sourceFileName');

export default function createRoutes() {

  const fileNames = routeModules.__debugFileNames || [];

  if (routeModules.length === 0) {
    logger.warn('Your framework does not contain any route. Create a file matching your "route" glob as defined in your configuration file.');
  }

  const routes = routeModules
    .map((routeModule, i) => {
      let route = getDefault(routeModule);

      if (route == null || typeof route !== 'object') {
        return null;
      }

      if (typeof route.toJSON === 'function') {
        route = route.toJSON() || route;
      }

      route = Object.assign({}, route);
      route[SourceFileName] = fileNames[i];

      if (route.status === 404) {
        route.priority = route.priority || Number.MIN_SAFE_INTEGER + 2;
        route.path = route.path || '*';
      }

      if (route.status && Math.floor(route.status / 100) !== 2) {
        route.priority = route.priority || Number.MIN_SAFE_INTEGER + 1;
        route.path = route.path || '*';
      }

      return route;
    });

  if (process.env.NODE_ENV === 'development') {
    // dev 404 route
    routes.push({
      path: '*',
      priority: Number.MIN_SAFE_INTEGER,
      status: 404,
      component: require('./dev-404.js').default,
    });
  }

  return routes
    .filter(route => route !== null)
    .sort((a, b) => (b.priority || 0) - (a.priority || 0))
    .map(route => sanitizeRoute(route, route[SourceFileName]));
}

function sanitizeRoute(routeData /* , fileName */) {

  delete routeData.priority;

  // TODO: add support for status & getComponent in EnhancedRoute component & use EnhancedRoute
  // by default here.

  // const { getComponent, status, ...passDownRoute } = routeData;
  // let routeElement = <Route {...passDownRoute} />;

  return <Route {...routeData} key={routeData.path} />;
}
